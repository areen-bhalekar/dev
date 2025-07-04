import React from 'react'
import './Tier2.css'
import DisplayArray from './DisplayArray';

function Tier2({ compData, currentFactor }) {
  // Parse CSV data (ignore first value, start from second)
  const parseCSVData = (csvString) => {
    const values = csvString.split(',');
    if (values.length < 24) return {};
    
    return {
      current: values[2],        // Y: Current
      remCapacity: values[4],    // W: Remaining Capacity
      cycleCount: values[6],     // U: Cycle Count
      soh: values[8],            // S: Battery Health (SOH)
      safety: values[9],         // R: Safety Status
      fullCapacity: values[20],  // G: Full Capacity
      dischargeTime: values[5], // Discharge Time
      chargingTime: values[23]   // Charging Time
    };
  };

  const data = parseCSVData(compData);
  
  // Array of field names for safety status
  const fieldNamesArray1 = ["RSVD", "RSVD", "OCDL", "COVL", "UTD", "UTC", "PCHGC", "CHGV", "CHGC", "OC", "RSVD", "CTO", "RSVD", "PTO", "RSVD", "OTF", "RSVD", "CUVC", "OTD", "OTC", "ASCDL", "ASCD", "ASCCL", "ASCC", "AOLDL", "AOLD", "OCD2", "OCD1", "OCC2", "OCC1", "COV", "CUV"];
  
  // Convert decimal to binary
  function decimalToBinary(N) {
    return (N >>> 0).toString(2);
  }
  
  // Convert minutes to formatted time (e.g., "1hr 30min" or "30min")
  const formatTime = (minutes) => {
    const totalMinutes = parseInt(minutes) || 0;
    
    if (totalMinutes < 60) {
      return `${totalMinutes}min`;
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}hr`;
    }
    
    return `${hours}hr ${remainingMinutes}min`;
  };

  // Determine which time field to display based on current value
  const current = parseFloat(data.current || 0);
  const isCharging = current > 0;
  const timeValue = isCharging ? (data.chargingTime || 0) : (data.dischargeTime || 0);
  const timeLabel = isCharging ? "Charging Time" : "Discharge Time";
  
  return (
    <div className='tier2'>
      <div className='tier2Test'>
        <div className='tier2Main'>
          <p className='text2'><span className='textInPara2'>Capacity: {data.remCapacity || 0} / {data.fullCapacity || 0} mAh</span></p>
          <p className='text2'><span className='textInPara2'>{timeLabel}: {formatTime(timeValue)}</span></p>
          <p className='text2'><span className='textInPara2'>Cycle Count: {data.cycleCount || 0}</span></p>
          <p className='text2'><span className='textInPara2'>Battery Health: {data.soh || 0}%</span></p>
        </div>
        <div className='tier2Side'>
          <p className='sideText2'>Safety Status: </p>
          <DisplayArray binaryNumber={decimalToBinary(parseInt(data.safety || 0))} fieldNames={fieldNamesArray1} />
        </div>
      </div>
    </div>
  )
}

export default Tier2