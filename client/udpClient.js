const dgram = require('dgram');

const client = dgram.createSocket('udp4');

const serverIP = '0.0.0.0'; 
const serverPort = 8000; 
const clientPort = 8080; // Port for receiving messages from the server

function sendMessage(message) {
    const buffer = Buffer.from(message)
    client.send(buffer, serverPort, serverIP, (err) => {
        if (err) {
            console.error(`Error sending message: ${err.message}`);
        } 
        else {
            console.log(`Message sent to ${serverIP}:${serverPort}: ${message}`);
        }
    });
}

client.on('message', (message, remote) => {
    console.log(`Received message from the server ${message}`);
    if (message.toString() === 'Requesting Data') {
        // Start sending messages at regular intervals
        sendMessage('Z16377Y0X26.05W3686V65535U18T100S96R0Q263P721422352O1191186768N4094M4093L4095K4095J0I0H5911G3686');
    }
});

// setInterval(() => {
//     sendMessage('A35B65C47D58E99');
// }, 1000); // Adjust the interval as needed


// Binding to a port to listen for messages from the server
client.bind(clientPort , console.log(`udpClient listening at ${clientPort}`)); // You can use any available port here