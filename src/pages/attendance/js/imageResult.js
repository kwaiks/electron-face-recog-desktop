const faceapi = require('face-api.js')

const myImage = document.getElementById("myImg");

const {showResult} = require('./showResult');


async function imageResult(faceMatcher){
    console.log('clicked')
    var canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0,0, video.width,video.height)
    let dataURI = canvas.toDataURL('image/jpg');
    myImage.src = dataURI;

    var imageCanvas;

    myImage.onload = async () => {
        console.log(myImage.src)
        let person = []
        let canvasId = document.getElementById('imageBox');
        if(canvasId){
            canvasId.parentNode.removeChild(canvasId)
        }
        imageCanvas = faceapi.createCanvasFromMedia(myImage);
        imageCanvas.id = "imageBox";
        document.getElementById('result').append(imageCanvas)
        const displaySize = {width: myImage.width, height:myImage.height};
        faceapi.matchDimensions(imageCanvas, displaySize);
        const detections = await faceapi.detectAllFaces(myImage).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const results = resizedDetections.map(item=> faceMatcher.findBestMatch(item.descriptor));
        results.forEach((result,i)=>{
            const box = resizedDetections[i].detection.box;
            const drawBox = new faceapi.draw.DrawBox(box,{
                label:result._label
            });
            person.push(result._label);
            drawBox.draw(imageCanvas)
        })
        if(person.length != 0){
            showResult(persons)
        }
    }
    
}

module.exports = {
    imageResult
}