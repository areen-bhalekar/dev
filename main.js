const { app, BrowserWindow, ipcMain, Menu, shell, dialog } = require('electron');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const path = require('path');
const fs = require('fs');
const { initializeUdpSocket, sendMessagePeriodically, sendWifi, closeSocket } = require('./main2');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let mainWindow;
let aboutWindow;
let aboutWindow2;
let port;
let parser;
let isUsingUDP = false;
let isLogging = "OFF"
let udpPort = 4210
let baudRate = 115200

const writeConfig = (config) => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  let existingConfig = {};
  if (fs.existsSync(configPath)) {
    existingConfig = JSON.parse(fs.readFileSync(configPath));
  }
  const updatedConfig = { ...existingConfig, ...config };
  fs.writeFileSync(configPath, JSON.stringify(updatedConfig));
};

const readConfig = () => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath));
  }
  return {
  };
};

ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(options);
  return result.filePath;
});

// Handle requests to list available COM ports
ipcMain.handle('list-com-ports', async () => {
  try {
    const ports = await SerialPort.list();
    return ports.map(port => port.path);
  } catch (error) {
    console.error('Error listing COM ports:', error);
    return [];
  }
});

// Function to create the main application window
const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    height: 1440,
    width: 1280,
    title: 'Battery Health Hub',
    icon: path.join(__dirname, 'assets/logo_9th.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load the main window content
  mainWindow.loadURL(`file://${path.join(__dirname, './renderer/build/index.html')}`);

  // Clear localStorage on window load
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(`
        localStorage.removeItem('activeGraphButtons');
    `);
  });

   // Create and set the application menu
  const template = [
  {
    label: 'Menu',
    submenu: [
      { role: 'reload' },
      {
        label: 'Connection Settings',
        accelerator: 'CmdOrCtrl+S',
        click: () => {
          mainWindow.webContents.send('openConnectionSettings');
        }
      },
      {
        label: 'Data Visualization',
        accelerator: 'CmdOrCtrl+G',
        click: createAboutWindow
      },
      {
        label: 'Edit Data Visualization Parameters',
        accelerator: 'CmdOrCtrl+H',
        click: createAboutWindow2
      },
      {
        label: 'Learn More',
        click: () => {
          shell.openExternal("https://revogreen.in");
        }
      },
    ],
  },
];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Handle various IPC events
  ipcMain.on('graphSettingsChanged', (event, data) => {
    if (aboutWindow && aboutWindow.webContents) {
      aboutWindow.webContents.send('updateGraphSettings', data);
    }
  });

  ipcMain.on('COMPort', (selectedComPort) => {
    if (!isUsingUDP) {
      const baudRate = port ? port.baudRate : 115200;
      initializePort(selectedComPort, baudRate);
      writeConfig({ selectedComPort });
    }
  });

  ipcMain.on('wifiDetails', ({ wifi, password }) => {
    if (isUsingUDP) {
      const config = readConfig();
      sendWifi(wifi, password, config.udpAddress, udpPort);
    }
  })

  ipcMain.on('udpSettings', ({ address }) => {
    if (isUsingUDP) {
      sendMessagePeriodically(address, udpPort);
      writeConfig({ udpAddress: address });
    }
  });

  ipcMain.on('requestDetails', () => {
    const config = readConfig();
    mainWindow.webContents.send('comBaudDetails', config);
  });

  ipcMain.on('toggleComm', (useUDP) => {
    isUsingUDP = useUDP;
    if (isUsingUDP) {
      const config = readConfig();
      initializeUdpSocket(mainWindow, aboutWindow);
      sendMessagePeriodically(config.udpAddress, udpPort)
      if (port && port.isOpen) {
        port.close();
      }
    } else {
      const config = readConfig();
      initializePort(config.selectedComPort, baudRate);
      closeSocket();
    }
    notifyModeChange();
  });

  ipcMain.on('loggingStatus', (message) => {
    isLogging = message
    console.log(isLogging);
  })

  ipcMain.handle('get-connection-mode', () => {
    return isUsingUDP ? 'wireless' : 'wired';
  });

  function notifyModeChange() {
    if (mainWindow) {
      mainWindow.webContents.send('connection-mode-changed', isUsingUDP ? 'wireless' : 'wired');
    }
  }

  ipcMain.on('set-connection-mode', (mode) => {
    if (mode === 'wired') {
      isUsingUDP = false;
      if (port && port.isOpen) {
        port.close();
      }
      console.log('Switched to Wired (Serial) mode');
    } else if (mode === 'wireless') {
      isUsingUDP = true;
      const config = readConfig();
      initializeUdpSocket(mainWindow, aboutWindow);
      sendMessagePeriodically(config.udpAddress, udpPort);
      if (port && port.isOpen) {
        port.close();
      }
      console.log('Switched to Wireless (UDP) mode');
    }
    notifyModeChange();
  });

  // Initialize communication based on current settings
  const config = readConfig();
  if (isUsingUDP) {
    initializeUdpSocket(mainWindow, aboutWindow);
  } else {
    initializePort(config.selectedComPort, baudRate);
  }

  // Handle window close event
  mainWindow.on('closed', (event) => {
    if (isLogging === "ON") {
      dialog.showMessageBoxSync({
        type: 'warning',
        title: 'Logging Status',
        message: 'Logging is still ON',
        buttons: ['OK']
      });
      event.preventDefault();
    }
    else {
      app.quit();
    }
  });
};

// Function to create the about window
const createAboutWindow = () => {
  if (aboutWindow) {
    if (aboutWindow.isMinimized()) {
      aboutWindow.restore();
    }
    aboutWindow.focus();
    return;
  }

  aboutWindow = new BrowserWindow({
    width: 900,
    height: 900,
    title: 'Data visualization',
    icon: path.join(__dirname, 'assets/logo_9th.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  aboutWindow.loadFile(path.join(__dirname, './secondWindow/index.html'));

  if (isUsingUDP) {
    initializeUdpSocket(mainWindow, aboutWindow);
  }

  aboutWindow.on('closed', () => {
    aboutWindow = null;
    if (isUsingUDP) {
      initializeUdpSocket(mainWindow, null);
    }
  });
}

// Function to create the second about window
const createAboutWindow2 = () => {
  if (aboutWindow2) {
    if (aboutWindow2.isMinimized()) {
      aboutWindow2.restore();
    }
    aboutWindow2.focus();
    return;
  }

  aboutWindow2 = new BrowserWindow({
    width: 675,
    height: 500,
    title: 'Graphing Window Details',
    icon: path.join(__dirname, 'assets/logo_9th.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  aboutWindow2.loadFile(path.join(__dirname, './secondWindow2/index.html'));

  aboutWindow2.on('closed', () => {
    aboutWindow2 = null;
  });
}

// Move the IPC event listener outside of createAboutWindow
ipcMain.on('aboutWindowTwo', () => {
  createAboutWindow2();
});

// Function to initialize the serial port
const initializePort = (comPort, baudRate) => {
  if (!comPort) {
    console.log('COM port or baud rate not specified.');
    return;
  }

  if (port && port.isOpen) {
    port.close((err) => {
      if (err) {
        console.error('Error closing port:', err);
      } else {
        console.log('Port closed successfully');
        openPort(comPort, baudRate);
      }
    });
  } else {
    openPort(comPort, baudRate);
  }
};

// Function to open and configure the serial port
const openPort = (comPort, baudRate) => {
  port = new SerialPort({
    path: comPort,
    baudRate: baudRate,
  });

  parser = port.pipe(new ReadlineParser());

  port.on('open', () => {
    console.log(`Port opened at ${comPort}`);
  });

  parser.on('data', (data) => {
    console.log(`Data received:`, data);
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('allData', data);
    }
    if (aboutWindow && aboutWindow.webContents) {
      aboutWindow.webContents.send('allData', data);
    }
  });

  port.on('error', (err) => {
    console.error('Error: ', err.message);
    mainWindow.webContents.send('serialError', err.message);
  });

  parser.on('error', (err) => {
    console.error('Parser error: ', err.message);
    mainWindow.webContents.send('parserError', err.message);
  });
};

// Create the main window when the app is ready
app.whenReady().then(createMainWindow);

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
  app.quit();
});

// Handle app quit event and show warning if logging is still enabled
app.on('before-quit', (event) => {
  if (isLogging === "ON") {
    event.preventDefault()
    dialog.showMessageBoxSync({
      type: 'warning',
      title: 'Logging Status',
      message: 'Logging is still ON',
      buttons: ['OK']
    });
  }
  if (port && port.isOpen) {
    port.close();
  }
  closeSocket();
});