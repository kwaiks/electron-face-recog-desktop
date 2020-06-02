const {app, BrowserWindow, Menu} = require('electron');
const storage = require('electron-json-storage');

require('electron-reload')(__dirname);

//membuat screen desktop
function createWindow(){
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            disableHtmlFullscreenWindowResize: true,
        }
    });

    //menload file index
    win.loadFile('src/index.html');

    //agar screen langsung maximize
    win.maximize();
}

app.whenReady().then(createWindow);

app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin'){
        app.quite();
    }
});

app.on('activate', ()=>{
    if(BrowserWindow.getAllWindows().length === 0){
        createWindow();
    }
});