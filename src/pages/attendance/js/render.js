require('@tensorflow/tfjs-node')

const faceapi = require('face-api.js');
const loadImage = require('./js/loadImage');

const video = document.getElementById('video');
const myImage = document.getElementById('myImg');
const mainContainer = document.getElementById('main');

var faceMatcher;
var person;
var results;

const init = () => {
    return Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('../../../assets/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('../../../assets/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('../../../assets/models'),
        faceapi.nets.mtcnn.loadFromUri('../../../assets/models'),
        faceapi.nets.tinyFaceDetector.loadFromUri('../../../assets/models')
    ])
}

const run = async () => {
    startWebcam();
    console.log('started');
    const labeledFaceDescriptor = await loadImage();
    faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptor,.6);
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
        setInterval(async()=>{
            person = [];
            const detections = await faceapi.detectAllFaces(
                video,
                new faceapi.SsdMobilenetv1Options()
            ).withFaceLandmarks().withFaceDescriptors();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
            canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
            results.forEach((result,i)=>{
                const box = resizedDetections[i].detection.box;
                const drawBox = new faceapi.draw.DrawBox(box, {
                    label: result._label
                });
                if(result._label != "unknown"){
                    person.push(result._label);
                }
                drawBox.draw(canvas);
            });
            },1000);
        });
}

init()
.then(run)
.catch(err=>console.log(err));
startVideo();

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

function filterUser(code){
    results = []
    code.forEach(d=>{
      let x = currJadwal.find(e=>e['nik'] == d)
      if(x) results.push(x)
    })
    return results
}

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