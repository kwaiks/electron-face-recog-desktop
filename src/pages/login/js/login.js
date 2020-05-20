const storage = require('electron-json-storage');

const nik = document.getElementById('nik');
const pass = document.getElementById('password');
const reminder = document.getElementById('reminder');

//aktifin fungsi enter
document.addEventListener('keyup', function(e){
    if(e.keyCode === 13){
        login();
    }
    e.preventDefault();
});

//post ke api server
async function login(){
    const c = await fetch("http://localhost:4000/login",{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(
            {
                username:nik.value,
                password:pass.value
            }
        )
    })
    .then(res=>res.json())
    .then(res=>{
        if(res.statusCode === 200){
            reminder.hidden = true;
            //nyimpen data user yg login, harus user
            storage.set('user',res.data);
            if(res.data.type == 'admin'){
                window.location.assign('../admin/index.html');
            }else{
                window.location.assign('../user/index.html');
            }
        }
        reminder.hidden = false;
    })
    .catch(err=>console.log(err))
}