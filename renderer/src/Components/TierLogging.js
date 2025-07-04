import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';

const { fs, path, showSaveDialog } = window.electron;

function TierLogging({ compData }) {
    // State variables
    const [csvFile, setCsvFile] = useState('');
    const [loggingEnabled, setLoggingEnabled] = useState(false);
    const [logFrequency, setLogFrequency] = useState(1000);
    const [capturedDataPath, setCapturedDataPath] = useState('');
    const intervalRef = useRef(null);
    const compDataRef = useRef(compData);

    // Update compData ref when it changes
    useEffect(() => {
        compDataRef.current = compData;
    }, [compData]);

    // Load saved captured data path on component mount
    useEffect(() => {
        const savedPath = localStorage.getItem('capturedDataPath');
        if (savedPath) {
            setCapturedDataPath(savedPath);
        }
    }, []);

    // Handle logging state changes
    useEffect(() => {
        if (loggingEnabled && csvFile) {
            startLogging();
        } else {
            stopLogging();
        }

        return () => stopLogging();
    }, [loggingEnabled, logFrequency, csvFile]);

    const startLogging = () => {
        stopLogging();
        intervalRef.current = setInterval(() => {
            logData(compDataRef.current);
        }, logFrequency);
    };

    // Stop logging
    const stopLogging = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // Convert decimal to hexadecimal
    const convertToHexadecimal = (value) => {
        // Handle CSV string values - convert to number first, then to hex
        const numValue = parseInt(value) || 0;
        return numValue.toString(16).padStart(2, '0');
    };

    // Toggle logging on/off
    const toggleLogging = async () => {
        // Start logging
        if (!loggingEnabled) {
            window.logging.status("ON")
            const timestamp = moment().format('YYYYMMDD-HHmmss');
            const suggestedFileName = `battery_${timestamp}.csv`;
            
            console.log('Suggested filename:', suggestedFileName); // Debug log
            
            const filePath = await showSaveDialog({
                title: 'Save CSV File',
                defaultPath: suggestedFileName,
                filters: [{ name: 'CSV Files', extensions: ['csv'] }]
            });

            if (filePath) {
                try {
                    // Create and initialize CSV file
                    fs.writeFileSync(filePath, ''); // Empty file created
                    // Writing header row
                    const headerRow = 'Timestamp,Battery Number,Voltage(mV),Current(mA),Temp(C),Battery Percentage,Full Capacity(mAh),Remaining Capacity(mAh),Cell1Volatage,Cell2Voltage,Cell3Voltage,Cell4Voltage,Cell5Voltage,Cell6Voltage,Cell7Voltage,Discharge Time/Charging Time(min),Cycle Count,Battery Health,Safety Status,Operation Status,Charging Status,Guaging Status\n';
                    fs.appendFileSync(filePath, headerRow);

                    console.log(`CSV file created successfully: ${filePath}`);
                    setCsvFile(filePath);
                    setLoggingEnabled(true);
                } catch (err) {
                    console.error('Error creating CSV file:', err);
                }
            }
        } else {
            window.logging.status("OFF")
            setLoggingEnabled(false);
            setCsvFile('');
        }
    };

    const logData = (data) => {
        if (!fs || !csvFile) {
            return;
        }

        const values = extractDataFromUdp(data);
        const csvData = `${moment().format('DD-MM-YYYY/HH:mm:ss:SSS')},${values.join(',')}\n`;

        try {
            fs.appendFileSync(csvFile, csvData);
        } catch (err) {
            console.error('Error appending to CSV file:', err);
        }
    };

    const extractDataFromUdp = (data) => {
        const csvValues = data.split(',');
        
        // Skip the first value (index 0) and take the rest according to the README sequence
        if (csvValues.length < 24) { // Need at least 24 values (1 to ignore + 23 data values)
            console.warn('Insufficient CSV data received:', csvValues.length);
            return new Array(24).fill(''); // Return empty array with correct length
        }
        
        const current = parseFloat(csvValues[2] || 0);
        const isCharging = current > 0;
        const timeValue = isCharging ? csvValues[23] : csvValues[5];
        
        return [
            `${csvValues[22].slice(0, 5)}/${csvValues[19]}`, // Battery Number (first 5 chars of Device Name + Serial Number)
            csvValues[1],  // Z: Voltage
            csvValues[2],  // Y: Current
            csvValues[3],  // X: Temperature
            csvValues[7],  // T: Battery Percentage (RSOC)
            csvValues[20], // G: Full Capacity
            csvValues[4],  // W: Remaining Capacity
            csvValues[13], // N: Cell 1 Voltage
            csvValues[14], // M: Cell 2 Voltage
            csvValues[15], // L: Cell 3 Voltage
            csvValues[16], // K: Cell 4 Voltage
            csvValues[17], // J: Cell 5 Voltage
            csvValues[18], // I: Cell 6 Voltage
            csvValues[21], // F: Cell 7 Voltage
            timeValue,     // V: Discharge Time (when current <= 0) or Charging Time (when current > 0)
            csvValues[6],  // U: Cycle Count
            csvValues[8],  // S: Battery Health (SOH)
            convertToHexadecimal(csvValues[9]),  // R: Safety Status
            convertToHexadecimal(csvValues[10]), // Q: Operation Status
            convertToHexadecimal(csvValues[11]), // P: Charging Status
            convertToHexadecimal(csvValues[12]), // O: Gauging Status
        ];
    };
    
    const changeLoggingFrequency = (event) => {
        setLogFrequency(parseInt(event.target.value));
    };

    const captureCurrentData = async () => {
        if (!compDataRef.current) {
            alert('No data available to capture. Please ensure the device is connected.');
            return;
        }

        try {
            let finalFilePath = capturedDataPath;
            
            // If no path is set yet, set it up for the first time
            if (!finalFilePath) {
                const setupPath = await showSaveDialog({
                    title: 'First Time Setup - Choose location for captured_data folder',
                    defaultPath: 'captured_data/captured_battery_data.csv',
                    filters: [{ name: 'CSV Files', extensions: ['csv'] }]
                });

                if (!setupPath) {
                    return; // User cancelled
                }

                // Ensure it ends with our standard file structure
                const basePath = path.dirname(setupPath);
                const capturedDataFolder = path.join(basePath, 'captured_data');
                finalFilePath = path.join(capturedDataFolder, 'captured_battery_data.csv');

                // Save this path for future use
                setCapturedDataPath(finalFilePath);
                localStorage.setItem('capturedDataPath', finalFilePath);
            }
            
            const capturedDataFolder = path.dirname(finalFilePath);
            if (!fs.existsSync(capturedDataFolder)) {
                fs.mkdirSync(capturedDataFolder, { recursive: true });
                console.log('Created captured_data folder:', capturedDataFolder);
            }

            const fileExists = fs.existsSync(finalFilePath);
            
            const values = extractDataFromUdp(compDataRef.current);
            const csvData = `${moment().format('DD-MM-YYYY/HH:mm:ss:SSS')},${values.join(',')}\n`;
            
            if (!fileExists) {
                const headerRow = 'Timestamp,Battery Number,Voltage(mV),Current(mA),Temp(C),Battery Percentage,Full Capacity(mAh),Remaining Capacity(mAh),Cell1Volatage,Cell2Voltage,Cell3Voltage,Cell4Voltage,Cell5Voltage,Cell6Voltage,Cell7Voltage,Discharge Time/Charging Time(min),Cycle Count,Battery Health,Safety Status,Operation Status,Charging Status,Guaging Status\n';
                fs.writeFileSync(finalFilePath, headerRow);
            }
            
            fs.appendFileSync(finalFilePath, csvData);
            
            alert(`Data captured successfully!\nAppended to: ${path.basename(path.dirname(finalFilePath))}/${path.basename(finalFilePath)}`);
            
        } catch (err) {
            console.error('Error capturing data:', err);
            console.error('Error details:', err.message);
            alert(`Error capturing data: ${err.message}\nPlease check the console for more details.`);
        }
    };
  

    return (
        <div className="loggingControls">
            <div className='logging'>
                <button onClick={captureCurrentData} style={{backgroundColor: "rgba(223, 233, 234, 255)", marginRight: "10px"}}>
                    Capture Current Data
                </button>
                <button onClick={toggleLogging} style={loggingEnabled? {backgroundColor: "rgba(37,168,165,255)"} : {backgroundColor: "rgba(223, 233, 234, 255)"}}>
                    {loggingEnabled ? 'Stop Logging' : 'Start Logging'}
                </button>
                <select value={logFrequency} onChange={changeLoggingFrequency}>
                    <option value={1000}>1 second</option>
                    <option value={5000}>5 seconds</option>
                    <option value={10000}>10 seconds</option>
                    <option value={30000}>30 seconds</option>
                    <option value={60000}>1 minute</option>
                </select>
            </div>
        </div>
    );
}

export default TierLogging;