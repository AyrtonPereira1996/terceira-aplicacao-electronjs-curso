if (require('electron-squirrel-startup')) return;

// IMPORTAÇÃO DA BIBLIOTECA ELECTRON
const electron = require('electron');

// CARREGANDO A NOVA CLASSE
const ChronoTray = require('./app/chronotray');

const ws = require('windows-shortcuts');

const { app, BrowserWindow, ipcMain, Notification } = electron;


var mainWindow;
let tray;

// // handling squirrel events
// if (require('electron-squirrel-startup')) return;

// // this should be placed at top of main.js to handle setup events quickly
// if (handleSquirrelEvent()) {
//    // squirrel event handled and app will exit in 1000ms, so don't do anything else
//    return;
// }
// function handleSquirrelEvent() {
//    if (process.argv.length === 1) {
//      return false;
//    }
//    const ChildProcess = require('child_process');
//    const path = require('path');
//    const appFolder = path.resolve(process.execPath, '..');
//    const rootAtomFolder = path.resolve(appFolder, '..');
//    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
//    const exeName = path.basename(process.execPath);
//    const spawn = function(command, args) {
//       let spawnedProcess, error;
//       try {
//         spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
//       } catch (error) {}
//         return spawnedProcess;
//       };
//    const spawnUpdate = function(args) {
//      return spawn(updateDotExe, args);
//    };
//    const squirrelEvent = process.argv[1];
//    switch (squirrelEvent) {
//      case '--squirrel-install':
//      case '--squirrel-updated':
//        // Optionally do things such as:
//        // - Add your .exe to the PATH
//        // - Write to the registry for things like file associations and
//        //   explorer context menus
//         // Install desktop and start menu shortcuts
//        spawnUpdate(['--createShortcut', exeName]);
//         setTimeout(app.quit, 1000);
//        return true;
//       case '--squirrel-uninstall':
//        // Undo anything you did in the --squirrel-install and
//        // --squirrel-updated handlers
//         // Remove desktop and start menu shortcuts
//        spawnUpdate(['--removeShortcut', exeName]);
//         setTimeout(app.quit, 1000);
//        return true;
//       case '--squirrel-obsolete':
//        // This is called on the outgoing version of your app before
//        // we update to the new version - it's the opposite of
//        // --squirrel-updated
//         app.quit();
//        return true;
//    }
// };


// handling squirrel events
if (require('electron-squirrel-startup')) return;

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
   // squirrel event handled and app will exit in 1000ms, so don't do anything else
   return;
}
function handleSquirrelEvent() {
   if (process.argv.length === 1) {
     return false;
   }
   const ChildProcess = require('child_process');
   const path = require('path');
   const appFolder = path.resolve(process.execPath, '..');
   const rootAtomFolder = path.resolve(appFolder, '..');
   const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
   const exeName = path.basename(process.execPath);
   const spawn = function(command, args) {
      let spawnedProcess, error;
      try {
        spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
      } catch (error) {}
        return spawnedProcess;
      };
   const spawnUpdate = function(args) {
     return spawn(updateDotExe, args);
   };
   const squirrelEvent = process.argv[1];
   switch (squirrelEvent) {
     case '--squirrel-install':
     case '--squirrel-updated':
       // Optionally do things such as:
       // - Add your .exe to the PATH
       // - Write to the registry for things like file associations and
       //   explorer context menus
        // Install desktop and start menu shortcuts
       spawnUpdate(['--createShortcut', exeName]);
        setTimeout(app.quit, 1000);
       return true;
      case '--squirrel-uninstall':
       // Undo anything you did in the --squirrel-install and
       // --squirrel-updated handlers
        // Remove desktop and start menu shortcuts
       spawnUpdate(['--removeShortcut', exeName]);
        setTimeout(app.quit, 1000);
       return true;
      case '--squirrel-obsolete':
       // This is called on the outgoing version of your app before
       // we update to the new version - it's the opposite of
       // --squirrel-updated
        app.quit();
       return true;
   }
};


app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            nodeIntegrationInWorker: true

        },
        height: 165,
        width: 350,
        frame: false,
        resizable: false,
        show: false,
        //PARA QUE NÃO APAREÇA O ICONE NA BARRA DE TAREFAS
        skipTaskbar: true

    });

    tray = new ChronoTray(`${__dirname}/robot.png`, mainWindow);

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.on('blur', () => {

        setTimeout(() => mainWindow.hide(), 200);

    });

    if (process.env.NODE_ENV !== 'production' && process.platform === 'win32') {
        ws.create("%APPDATA%/Microsoft/Windows/Start Menu/Programs/Electron.Ink", process.execPath);
        app.setAppUserModelId(process.execPath);
    }

 });

ipcMain.on('timeUpdate', (event, timeUpdate) => {
    
    tray.setToolTip(timeUpdate); 

});
