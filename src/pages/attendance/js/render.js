require('@tensorflow/tfjs-node') //di windows harus di comment agar bisa bekerja

const faceapi = require('face-api.js');
const loadImage = require('./js/loadImage');

const video = document.getElementById('video');
const myImage = document.getElementById('myImg');
const mainContainer = document.getElementById('main');

var faceMatcher;
var person;
var results;

const init = () => {
    //mengambil semua model pada library
    return Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('../../../assets/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('../../../assets/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('../../../assets/models'),
        faceapi.nets.mtcnn.loadFromUri('../../../assets/models'),
        faceapi.nets.tinyFaceDetector.loadFromUri('../../../assets/models')
    ])
}

const run = async () => {
    startWebcam(); //menyiapkan webcam
    console.log('started');
    const labeledFaceDescriptor = await loadImage(); //mengumpulkan semua image untuk face detection
    faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptor,.6); //membuat keakurasian 0.6
}

const startWebcam = () => {
    faceapi.env.monkeyPatch({
        Canvas: HTMLCanvasElement,
        Image: HTMLImageElement,
        ImageData: ImageData,
        Video: HTMLVideoElement,
        createCanvasElement: () => document.createElement('canvas'),
        createImageElement: () => document.createElement('img'),
    });

    navigator.getUserMedia(
        {
            video:{}
        },
        stream => video.srcObject = stream,
        err => console.error(err)
    )

}

//function untuk deteksi
const startVideo = () => {
    video.addEventListener('play', async()=>{
        const canvas = faceapi.createCanvasFromMedia(video);
        mainContainer.append(canvas);
        const displaySize = 
        {
            width: video.width,
            height: video.height
        }
        faceapi.matchDimensions(canvas, displaySize);
        //melakukan pengecekan setiap 1detik
        setInterval(async()=>{
            person = [];

            //fungsi mendeteksi semua muka yang ada pada webcam, dengan kotak dan nik
            const detections = await faceapi.detectAllFaces(
                video,
                new faceapi.SsdMobilenetv1Options()
            ).withFaceLandmarks().withFaceDescriptors();
            //mengubah ukuran kotak
            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            //mapping setiap muka yang dideteksi dengan kumpulan image yang sudah disiapkan
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
            //membuat kotak
            canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
            //melakukan looping untuk setiap muka yang dideteksi
            results.forEach((result,i)=>{
                const box = resizedDetections[i].detection.box;
                const drawBox = new faceapi.draw.DrawBox(box, {
                    label: result._label
                });
                //jika muka yang dideteksi labelnya nik, maka disimpan didalam array
                if(result._label != "unknown"){
                    person.push(result._label);
                }
                drawBox.draw(canvas);
            });
            },1000);// -> pengubahan durasi interval
        });
}

init()
.then(run)
.catch(err=>console.log(err));
startVideo();


//function untuk mengambil data user yang dideteksi setelah menekan tombol
async function snapshot(){
    document.getElementById('myImg').style.visibility = "visible";
    let canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(video,0,0,video.width, video.height);
    let dataURI = canvas.toDataURL('image/jpg');
    myImage.src = dataURI;
    showResult(person);
}

//menampilkan data user dari fungsi snapshot
function showResult(results){
    var resultList;
    const divItem = "resultList";
    const resultDiv = document.getElementById('resultWrapper');
    const ul = document.getElementById(divItem);
    if(ul){
        ul.parentNode.removeChild(ul)
    }
    let data = filterUser(results);
    resultList = document.createElement('div');
    resultList.id = divItem;
    resultDiv.append(resultList)
    data.forEach(d=>{
        createList(d,resultList);
    })
}

//memfilter user yang dideteksi dengan data guru yang akan mengajar, jika gurunya terdeteksi tetapi tidak ada jadwalnya. maka tidak akan masuk
function filterUser(code){
    results = []
    code.forEach(d=>{
      let x = currJadwal.find(e=>e['nik'] == d)
      if(x) results.push(x)
    })
    return results
}

//membuat list dari setiap guru yang difilter
function createList(data,listDiv){
    let list = document.createElement('div');
    let nik = document.createElement('span');
    let code = document.createElement('span');
    let subj = document.createElement('span');
    let kelas = document.createElement('span')
    list.className = "resultItem"
    listDiv.appendChild(list);
    nik.innerHTML = `${data.name} (${data.nik})`;
    code.innerHTML = `${data.code}`;
    subj.innerHTML = data.subject;
    kelas.innerHTML = data.class;
    list.appendChild(nik);
    list.appendChild(code);
    list.appendChild(subj);
    list.appendChild(kelas);
}