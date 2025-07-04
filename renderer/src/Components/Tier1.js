import React from 'react'
import './Tier1.css'
import Disharging from './images/Picture2.svg'
import Charging from './images/electric.svg'

function Tier1({ compData }) {
    const parseCSVData = (csvString) => {
        const values = csvString.split(',');
        if (values.length < 24) return {};
        
        return {
            voltage: values[1],     // Z: Voltage
            current: values[2],     // Y: Current
            temperature: values[3], // X: Temperature
            remCapacity: values[4], // W: Remaining Capacity
            dischargeTime: values[5],     // Discharge Time
            cycleCount: values[6],  // U: Cycle Count
            rsoc: values[7],        // T: Battery Percentage (RSOC)
            soh: values[8],         // S: Battery Health (SOH)
            safety: values[9],      // R: Safety Status
            operation: values[10],  // Q: Operation Status
            charging: values[11],   // P: Charging Status
            gauging: values[12],    // O: Gauging Status
            cell1: values[13],      // N: Cell 1 Voltage
            cell2: values[14],      // M: Cell 2 Voltage
            cell3: values[15],      // L: Cell 3 Voltage
            cell4: values[16],      // K: Cell 4 Voltage
            cell5: values[17],      // J: Cell 5 Voltage
            cell6: values[18],      // I: Cell 6 Voltage
            serialNumber: values[19], // H: Serial Number
            fullCapacity: values[20], // G: Full Capacity
            cell7: values[21],       // F: Cell 7 Voltage
            chargingTime: values[23] // Charging Time
        };
    };

    const data = parseCSVData(compData);
    
    const convertTo1000 = (data) => {
        const convertedData = data / 1000;
        const nearestTwo = Math.round(convertedData * 100) / 100;
        return nearestTwo;
    }

    const dataTypeIs = (data) => {
        if (Number.isInteger(data)) {
            const newData = data / 100;
            return newData;
        }
        else {
            return data;
        }
    }

    const cellHeight = (data) => {
        let height = ((data - 2500) / 1700) * 100;
        return height;
    }

    const current = convertTo1000(data.current || 0);
    
    const renderCell = (cellValue) => {
        if (!cellValue) return null;
        const height = cellHeight(cellValue);
        if (height > 0) {
            return (
                <div className="battery-container">
                    <div className="battery-cap"></div>
                    <div className="battery">
                        <div className="battery-level" style={{ height: `${height}%` }}>
                            <span className="battery-percentage" id="battery-percentage">{convertTo1000(cellValue)} V</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };
    
    return (
        <div className='tier1'>
            <div className='tier1Main'>
                <div className='detailsComponent'>
                    <p className='text1'><span className='textInPara'>Voltage: {convertTo1000(data.voltage || 0)} V</span></p>
                    <p className='text1'><span className='textInPara'>Current: {convertTo1000(data.current || 0)} A</span></p>
                    <p className='text1'><span className='textInPara'>Temperature: {dataTypeIs(Number(data.temperature || 0))} C</span></p>
                </div>
                <div className='chargingIndicator'>
                    {current > 0 && <img src={Charging} alt="Charging" className='charging' />}
                    {current < 0 && <img src={Disharging} alt="Disharging" className='discharging' />}
                </div>
                <div className="battery-container">
                    <div className="battery-cap"></div>
                    <div className="battery">
                        <div className="battery-level" style={{ height: `${data.rsoc || 0}%` }}>
                            <span className="battery-percentage" id="battery-percentage">{data.rsoc || 0} %</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='tier1Cell'>
                {renderCell(data.cell1)}
                {renderCell(data.cell2)}
                {renderCell(data.cell3)}
                {renderCell(data.cell4)}
                {renderCell(data.cell5)}
                {renderCell(data.cell6)}
                {renderCell(data.cell7)}
            </div>
        </div>
    )
}

export default Tier1