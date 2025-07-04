const { contextBridge, ipcRenderer } = require('electron')
const path = require('path')
const fs = require('fs')
const { removeAllListeners, channel } = require('process')

contextBridge.exposeInMainWorld('electron', {
    fs: fs,
    path: path,
    showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options)
})

contextBridge.exposeInMainWorld('messRe', {
    udpA: (callback) => ipcRenderer.on('allData', (_event, data) => {
        callback(data)
    }),
    removeList: (channel) => ipcRenderer.removeAllListeners(channel)
})

contextBridge.exposeInMainWorld('baudRate', {
    is: (args) => {
        ipcRenderer.send('baud', args)
    }
})

contextBridge.exposeInMainWorld('comPort', {
    is: (args) => {
        ipcRenderer.send('COMPort', args)
    }
})

contextBridge.exposeInMainWorld('logging', {
    status: (args) => {
        ipcRenderer.send('loggingStatus', args)
    }
})

contextBridge.exposeInMainWorld('receivedDetails', {
    are: (callback) => ipcRenderer.on('comBaudDetails', (_event, data) => {
        callback(data)
    }),
    removeList: (channel) => ipcRenderer.removeAllListeners(channel)
})

contextBridge.exposeInMainWorld('requestDetails', {
    send: (channel) => {
        ipcRenderer.send(channel);
    }
});

contextBridge.exposeInMainWorld('udpSettings', {
    set: (args) => {
        ipcRenderer.send('udpSettings', args)
    }
})

contextBridge.exposeInMainWorld('wifiDetails', {
    set: (args) => {
        ipcRenderer.send('wifiDetails', args)
    }
})

contextBridge.exposeInMainWorld('toggleComm', {
    set: (useUDP) => {
        ipcRenderer.send('toggleComm', useUDP)
    }
})

contextBridge.exposeInMainWorld('udpFrequency', {
    received: (callback) => ipcRenderer.on('recFreq', (_event, data) => {
        callback(data)
    }),
    sent: (callback) => ipcRenderer.on('sentFreq', (_event, data) => {
        callback(data)
    }),
    removeList: (channel) => ipcRenderer.removeAllListeners(channel)
})

contextBridge.exposeInMainWorld('show', {
    aboutWindow2: (args) => {
        ipcRenderer.send('aboutWindowTwo', args)
    }
})

// New contextBridge to handle COM ports
contextBridge.exposeInMainWorld('serialPort', {
    list: () => ipcRenderer.invoke('list-com-ports')
});

//Second Window Two scripts
contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (channel, data) => ipcRenderer.send(channel, data),
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
    // ... other methods you might have
});