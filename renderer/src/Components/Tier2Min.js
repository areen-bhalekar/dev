import React from 'react'
import './Tier2.css';
// import DisplayArray from './DisplayArray';

function Tier2Min({ compData }) {
    // Parse CSV data (ignore first value, start from second)
    const parseCSVData = (csvString) => {
        const values = csvString.split(',');
        if (values.length < 24) return {};
        
        return {
            safety: values[9], // R: Safety Status
        };
    };

    const data = parseCSVData(compData);
    
    // Array of field names for safety status
    const fieldNames = ["RSVD", "RSVD", "OCDL", "COVL", "UTD", "UTC", "PCHGC", "CHGV", "CHGC", "OC", "RSVD", "CTO", "RSVD", "PTO", "RSVD", "OTF", "RSVD", "CUVC", "OTD", "OTC", "ASCDL", "ASCD", "ASCCL", "ASCC", "AOLDL", "AOLD", "OCD2", "OCD1", "OCC2", "OCC1", "COV", "CUV"];
    // Convert decimal to binary and pad with zeros
    function decimalToBinary(N) {
        return (N >>> 0).toString(2).padStart(32, '0');
    }
    // Extract and convert safety status from CSV data
    const decimalPart = parseInt(data.safety || 0)
    const binaryPart = decimalToBinary(decimalPart)
    const activeFields = fieldNames.map((fieldName, index) => {
        return binaryPart[index] === '1' ? <p key={index}>{fieldName}</p> : null;
      }).filter(Boolean);
    return (
        <div className='tier2Min'>
            <div className='tier2MinMain'>
                <p className='sideText2'>Active Fields in Safety Status: </p>
                <div className='activeFields'>{activeFields.length > 0 ? <p>{activeFields}</p> : <p>None</p>}</div>
            </div>
        </div>
    )
}

export default Tier2Min