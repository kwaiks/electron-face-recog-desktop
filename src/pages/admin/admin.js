const storage = require('electron-json-storage')

var logout = document.getElementById('logout');

logout.addEventListener('click',()=>{
    storage.remove('user');
    window.location.assign('../../index.html')
})