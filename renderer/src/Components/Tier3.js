import React from 'react'
import './Tier3.css'
import DisplayArray from './DisplayArray'

function Tier3({ compData }) {
    // Parse CSV data (ignore first value, start from second)
    const parseCSVData = (csvString) => {
        const values = csvString.split(',');
        if (values.length < 24) return {};
        
        return {
            operation: values[10],  // Q: Operation Status
            charging: values[11],   // P: Charging Status
            gauging: values[12],    // O: Gauging Status
        };
    };

    const data = parseCSVData(compData);
    
    // Define field names for different status arrays
    const fieldNamesArray2 = ["IATA_CTER_M", "RSVD", "EM_SHUT", "CB", "SLP_CC", "SLP_AD", "SMBL_CAL", "INIT", "SLEEPM", "XL", "CAL_O_FFSET", "CAL", "AUTO_CALM", "AUTH", "LED", "SDM", "SLEEP", "XCHG", "XDSG", "PF", "SS", "SDV", "SEC1", "SEC0", "BTP_INT", "RSVD", "FUSE", "PDSG", "PCHG", "CHG", "DSG", "PRES"];
    const fieldNamesArray3 = ["RSVD", "RSVD", "RSVD", "RSVD", "RSVD", "RSVD", "RSVD", "RSVD", "RSVD", "RSVD", "RSVD", "RSVD", "NCT", "CCC", "CVR", "CCR", "VCT", "MCHG", "SU", "IN", "HV", "MV", "LV", "PV", "RSVD", "OT", "HT", "STH", "RT", "STL", "LT", "UT"]
    const fieldNamesArray4 = ["RSVD", "RSVD", "RSVD", "RSVD", "RSVD", "RSVD", "RSVD", "RSVD", "RSVD", "RSVD", "RSVD", "OCVFR", "LDMD", "RX", "QMax", "VDQ", "NSFM", "RSVD", "SLPQMax", "QEN", "VOK", "R_DIS", "RSVD", "REST", "CF", "DSG", "EDV", "BAL_EN", "TC", "TD", "FC", "FD"]
    
    // Convert decimal to binary
    function decimalToBinary(N) {
        return (N >>> 0).toString(2);
    }
    
    return (
        <div className='tier3'>
            <div className='tier3Main'>
                <p className='sideText3'>Operation Status:</p>
                <DisplayArray binaryNumber={decimalToBinary(parseInt(data.operation || 0))} fieldNames={fieldNamesArray2} />
                <p className='sideText3'>Charging Status:</p>
                <DisplayArray binaryNumber={decimalToBinary(parseInt(data.charging || 0))} fieldNames={fieldNamesArray3} />
                <p className='sideText3'>Gauging Status:</p>
                <DisplayArray binaryNumber={decimalToBinary(parseInt(data.gauging || 0))} fieldNames={fieldNamesArray4} />
            </div>
        </div>
    )
}

export default Tier3