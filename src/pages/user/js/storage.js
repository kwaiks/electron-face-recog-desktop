const storage = require("electron-json-storage");


document.addEventListener('DOMContentLoaded', async ()=>{
    var user;
    //mengambil data local user
    const a = await getDetails().then((data)=>user=data);
    //setelah selesai menginisialisasi tabel fungsi init
    init(user);
})

// mengambil data local user
async function getDetails() {
  const data = await storage.get('user');
  return data;
}

//inisialisasi hari
var weekday=new Array(7);
weekday[0]="Senin";
weekday[1]="Selasa";
weekday[2]="Rabu";
weekday[3]="Kamis";
weekday[4]="Jumat";
weekday[5]="Sabtu";
weekday[6]="Minggu";

// mengubah data angka hari pada database menjadi string hari
function getHari(day){
    return weekday[day-1];
}