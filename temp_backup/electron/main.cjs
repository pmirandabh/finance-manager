const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) {
//   app.quit();
// }

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // For simple local app, this is easier. For production, use contextBridge.
    },
    autoHideMenuBar: false, // Show menu bar for Reload option
  });

  // Create custom menu
  const menu = Menu.buildFromTemplate([
    {
      label: 'Opções',
      submenu: [
        { label: 'Recarregar', role: 'reload' },
        { label: 'Forçar Recarregamento', role: 'forceReload' },
        { type: 'separator' },
        { label: 'Ferramentas de Desenvolvedor', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Sair', role: 'quit' }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);

  // Load the index.html of the app.
  if (process.env.NODE_ENV === 'development') {
    // Add a small delay to ensure Vite is ready
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:5173');
      mainWindow.webContents.openDevTools();
    }, 1000);
  } else {
    // In production, the files are in the same directory as main.cjs after packaging
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('Loading from:', indexPath);
    console.log('__dirname:', __dirname);
    console.log('File exists:', fs.existsSync(indexPath));

    mainWindow.loadFile(indexPath).catch(err => {
      console.error('Failed to load:', err);
    });
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers for Data Persistence
const USERS_FILE = path.join(app.getPath('userData'), 'users.json');
const getTransactionsFile = (userId) => path.join(app.getPath('userData'), `transactions_${userId}.json`);
const getCategoriesFile = (userId) => path.join(app.getPath('userData'), `categories_${userId}.json`);

// User management
ipcMain.handle('get-users', async () => {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
});

ipcMain.handle('save-users', async (event, users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving users:', error);
    return { success: false, error: error.message };
  }
});

// Transaction management (per user)
ipcMain.handle('get-transactions', async (event, userId) => {
  try {
    const dataFile = getTransactionsFile(userId);
    if (!fs.existsSync(dataFile)) {
      return [];
    }
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading transactions:', error);
    return [];
  }
});

ipcMain.handle('save-transactions', async (event, userId, transactions) => {
  try {
    const dataFile = getTransactionsFile(userId);
    fs.writeFileSync(dataFile, JSON.stringify(transactions, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving transactions:', error);
    return { success: false, error: error.message };
  }
});

// Category management (per user)
ipcMain.handle('get-categories', async (event, userId) => {
  try {
    const dataFile = getCategoriesFile(userId);
    if (!fs.existsSync(dataFile)) {
      return [];
    }
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
});

ipcMain.handle('save-categories', async (event, userId, categories) => {
  try {
    const dataFile = getCategoriesFile(userId);
    fs.writeFileSync(dataFile, JSON.stringify(categories, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving categories:', error);
    return { success: false, error: error.message };
  }
});
