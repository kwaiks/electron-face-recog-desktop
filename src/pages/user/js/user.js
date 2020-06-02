const storage = require('electron-json-storage');  

var header = document.getElementById('user');
var logout = document.getElementById('logout');

document.addEventListener('DOMContentLoaded', ()=>{
    //mengambil data dari local storage kemudian menampilkan nama user setelah data tersedia
    var c = storage.get('user').then(res=>header.innerHTML = "Hello, " + res.name + " ("+res.nik+")")    
})

logout.addEventListener('click',()=>{
    //menghapus data user
    storage.remove('user');

    //kembali ke halaman awal
    window.location.assign('../../index.html')
})