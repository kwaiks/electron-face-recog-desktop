const {app, BrowserWindow, Menu} = require('electron');
const storage = require('electron-json-storage');

require('electron-reload')(__dirname);

function createWindow(){
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            disableHtmlFullscreenWindowResize: true,
        }
    });

    win.loadFile('src/index.html');

    win.maximize();

    //win.webContents.openDevTools();

    // var Menu = Menu.buildFromTemplate([
    //     {
    //         label: 'Menu',
    //         submenu: [
    //             {
    //                 label:'Exit',
    //                 click(){
    //                     app.quit();
    //                 }
    //             }
    //         ]
    //     }
    // ]);
    // Menu.setApplicationMenu(menu);
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