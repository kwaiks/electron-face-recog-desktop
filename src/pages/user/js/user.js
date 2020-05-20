const storage = require('electron-json-storage');  

var header = document.getElementById('user');
var logout = document.getElementById('logout');

document.addEventListener('DOMContentLoaded',()=>{
    storage.get('user',(error,data)=>{
        if(error) throw error;
        header.innerHTML = 'Hello, ' + data.name;
    })
})

logout.addEventListener('click',()=>{
    storage.remove('user');
    window.location.assign('../../index.html')
})