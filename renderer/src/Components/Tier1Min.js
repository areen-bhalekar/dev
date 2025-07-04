import React from 'react'
import './Tier1.css'

function Tier1Min({ compData, currentFactor }) {
    // Parse CSV data (ignore first value, start from second)
    const parseCSVData = (csvString) => {
        const values = csvString.split(',');
        if (values.length < 24) return {};
        
        return {
            voltage: values[1],     // Z: Voltage
            current: values[2],     // Y: Current
            temperature: values[3], // X: Temperature
        };
    };

    const data = parseCSVData(compData);
    
    // Convert millivolts to volts and round to 2 decimal places
    const convertTo1000 = (data) => {
        const convertedData = data / 1000;
        const nearestTwo = Math.round(convertedData * 100) / 100;
        return nearestTwo;
    }

    return (
        <div className='tier1Min'>
            <div className='tier1MinMain'>
                <span className='text1Min'><p className='textInSpan'>Voltage: {convertTo1000(data.voltage || 0)} V</p></span>
                <span className='text1Min'><p className='textInSpan'>Current: {convertTo1000(data.current || 0)} A</p></span>
                <span className='text1Min'><p className='textInSpan'>Temperature: {data.temperature || 0} C</p></span>
            </div>
        </div>
    )
}

export default Tier1Min