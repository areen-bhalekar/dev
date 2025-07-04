const dgram = require('dgram');

// Global variables
let udpSocket;
let mainWindow;
let aboutWindow;
let sentCount = 0;
let receivedCount = 0;
const serverPort = 8000;
let messageIntervals;

// Function to initialize the UDP socket
const initializeUdpSocket = (mainWin, aboutWin) => {
    if (udpSocket) {
        udpSocket.close();
    }

    // Set window references
    mainWindow = mainWin;
    aboutWindow = aboutWin;

    // Create and configure UDP socket
    udpSocket = dgram.createSocket('udp4');

    // Bind the socket to the server port
    udpSocket.bind(serverPort, () => {
        console.log(`UDP server listening on port ${serverPort}`);
    });

    udpSocket.on('message', (message, remote) => {
        console.log(`Received message from ${remote.address}:${remote.port}: ${message}`);
        receivedCount++;
        if (mainWindow && mainWindow.webContents) {
            mainWindow.webContents.send('allData', message.toString());
            mainWindow.webContents.send('recFreq', receivedCount)
        }
        if (aboutWindow && aboutWindow.webContents) {
            aboutWindow.webContents.send('allData', message.toString());
        }
    });

};

const sendMessage = (message, address, port) => {
    if (udpSocket) {
        udpSocket.send(message, port, address, (err) => {
            if (err) {
                console.error(`Error sending message: ${err}`);
            } else {
                console.log(`Message sent to ${address}:${port}`);
                sentCount++
                mainWindow.webContents.send('sentFreq', sentCount)
            }
        });
    }
};

const sendWifi = (wifi, password, address, port) => {
    message = `WIFI:${wifi},${password}`;
    sendMessage(message, address, port);
    console.log(`Wifi sent to ${address}:${port}`);
}

// Function to send periodic messages
const sendMessagePeriodically = (address, port) => {
    if (messageIntervals) {
        clearInterval(messageIntervals)
    }

    // Set up new interval for periodic messages
    messageIntervals = setInterval(() => {
        sendMessage("Requesting Data", address, port);
    }, 1000);
};

// Function to close the UDP socket
const closeSocket = () => {
    if (udpSocket) {
        udpSocket.close(() => {
            console.log('UDP socket closed');
            udpSocket = null;  // Set socket to null after closing
        });
    } else {
        console.log('UDP socket is not running');
    }
};

// Export functions for use in other modules
module.exports = {
    initializeUdpSocket,
    sendMessage,
    sendWifi,
    sendMessagePeriodically,
    closeSocket
};
