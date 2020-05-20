function loadImage(url) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.addEventListener('load', e => resolve(img));
      img.addEventListener('error', () => {
        reject(new Error(`Failed to load image's URL: ${url}`));
      });
      img.src = url;
    });
}

async function loadRepositoryImage(){
    const labels = await fetch('http://localhost:4000/getUser')
                    .then(res=>res.json())
                    .then(res=>{
                        return res.map(user=>`${user.nik}!${user.name}!${user.picture}`)
                    })
    return Promise.all(
        labels.map(async label=>{
            const descriptions =[];
            let arr = label.split('!');
            let nik = arr[0];
            let name = arr[1];
            let images = arr[2].split(',');
            
            images.forEach(async (image)=>{
                const img = await loadImage(`http://localhost:4000/images/${nik}/${image}`);
                const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                descriptions.push(detection.descriptor);
            })
            return new faceapi.LabeledFaceDescriptors(nik, descriptions)
        })
    )
}

module.exports = loadRepositoryImage;