import React from 'react'

function DisplayArray({ binaryNumber, fieldNames }) {

  // Convert binary number to an array of bits
  const data = binaryNumber.split('');

  // Pad the array with leading zeros if necessary to ensure 32 bits
  while (data.length < 32) {
    data.unshift('0');
  }

  return (
    <div className="binary-array">
      {/* Display first 16 bits */}
      {/* {data.map((bit, index) => (
          <div key={index} className={`bit ${bit === '1' ? 'active' : 'inactive'} ${fieldNames[index] === 'RSVD' ? 'alwaysInactive' : ''}`}>{fieldNames[index]}</div>
      ))} */}
      <div className='row'>
        {data.slice(0,16).map((bit, index) => (
          <div key={index} className={`bit ${bit === '1' ? 'active' : 'inactive'} ${fieldNames[index] === 'RSVD' ? 'alwaysInactive' : ''} ${fieldNames[index] === '' ? 'alwaysInactive' : ''}`}>{fieldNames[index]}</div>
        ))}
      </div>
      {/* Display last 16 bits */}
      <div className='row'>
        {data.slice(16,32).map((bit, index) => (
          <div key={index + 16} className={`bit ${bit === '1' ? 'active' : 'inactive'} ${fieldNames[index + 16] === 'RSVD' ? 'alwaysInactive' : ''} ${fieldNames[index + 16] === '' ? 'alwaysInactive' : ''}`}>{fieldNames[index + 16]}</div>
        ))}
      </div>
    </div>
  )
}

export default DisplayArray