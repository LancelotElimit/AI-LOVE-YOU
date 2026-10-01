const {app, BrowserWindow, Menu, screen} = require('electron');
const path = require('node:path');

app.setName('AI Love You Desktop');
// Independent profile: never replace browser saves.
app.setPath('userData', path.join(app.getPath('appData'), 'AI-Love-You-Desktop'));
let window;
function createWindow() {
  const area = screen.getPrimaryDisplay().workAreaSize;
  window = new BrowserWindow({
    width: Math.min(1440, area.width), height: Math.min(850, area.height),
    minWidth: 960, minHeight: 600, backgroundColor: '#111c2c',
    title: 'AI Love You', show: false, autoHideMenuBar: true,
    webPreferences: {nodeIntegration: false, contextIsolation: true, sandbox: true}
  });
  Menu.setApplicationMenu(null);
  window.webContents.setWindowOpenHandler(() => ({action: 'deny'}));
  window.webContents.on('will-navigate', event => event.preventDefault());
  window.webContents.session.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  window.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11' || (input.alt && input.key === 'Enter')) {
      event.preventDefault(); window.setFullScreen(!window.isFullScreen());
    }
    if (input.key === 'Escape' && window.isFullScreen()) window.setFullScreen(false);
  });
  window.once('ready-to-show', () => window.show());
  window.loadFile(path.join(__dirname, 'game', 'index.html'));
}
if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', () => {if (window) {if (window.isMinimized()) window.restore(); window.focus();}});
  app.whenReady().then(createWindow);
  app.on('window-all-closed', () => app.quit());
}
