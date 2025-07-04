import React, { useState, useEffect } from 'react';
import './App.css';
import Down from './minus-3108.svg';
import Up from './plus-3107.svg';
import Logo from './Revogreen.png';
import Tier1 from './Components/Tier1';
import Tier2 from './Components/Tier2';
import Tier3 from './Components/Tier3';
import Tier1Min from './Components/Tier1Min';
import Tier2Min from './Components/Tier2Min';
import Tier3Min from './Components/Tier3Min';
import TierLogging from './Components/TierLogging';
import ConnectionSettingsDialog from './Components/ConnectionSettingsDialog';

function App() {
  const [udpData, setUdpData] = useState('');
  const [comPort, setComPort] = useState('');
  const [address, setAddress] = useState('');
  const [wifi, setWifi] = useState('');
  const [password, setPassword] = useState('');
  const [tier1Status, setTier1Status] = useState(true);
  const [tier2Status, setTier2Status] = useState(false);
  const [tier3Status, setTier3Status] = useState(false);
  const [isUsingUDP, setIsUsingUDP] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [lastDataTimestamp, setLastDataTimestamp] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const handleUdpData = (data) => {
      const csvValues = data.split(',');
      if (csvValues.length >= 24) {
        setUdpData(data);
        setConnectionStatus('Connected');
        setLastDataTimestamp(Date.now());
      }
    };

    window.messRe.udpA(handleUdpData);
    return () => window.messRe.removeList('allData');
  }, []);

  useEffect(() => {
    const handleToggleComm = (useUDP) => {
      setIsUsingUDP(useUDP);
      setConnectionStatus('Disconnected');
      setLastDataTimestamp(null);
    };

    const handleOpenConnectionSettings = () => setIsDialogOpen(true);

    window.electronAPI.receive('toggleComm', handleToggleComm);
    window.electronAPI.receive('openConnectionSettings', handleOpenConnectionSettings);
  }, []);

  useEffect(() => {
    window.requestDetails.send('requestDetails');
    window.receivedDetails.are((data) => {
      setComPort(data.selectedComPort);
      setAddress(data.udpAddress);
    });
    return () => window.receivedDetails.removeList('comBaudDetails');
  }, []);

  useEffect(() => {
    const checkConnectionStatus = () => {
      const now = Date.now();
      if (lastDataTimestamp && now - lastDataTimestamp > 3000) {
        setConnectionStatus('Disconnected');
      }
    };

    const intervalId = setInterval(checkConnectionStatus, 1000);
    return () => clearInterval(intervalId);
  }, [lastDataTimestamp]);

  const changeTier1Status = () => setTier1Status(!tier1Status);
  const changeTier2Status = () => setTier2Status(!tier2Status);
  const changeTier3Status = () => setTier3Status(!tier3Status);

  const handleSaveSettings = (settings) => {
    if (settings.mode === 'wired') {
      setComPort(settings.comPort);
      setIsUsingUDP(false);
      window.comPort.is(settings.comPort);
      if (window.electron && window.electron.ipcRenderer) {
        window.electron.ipcRenderer.send('set-connection-mode', 'wired');
      }
    } else {
      setAddress(settings.ipAddress);
      setWifi(settings.wifiName);
      setPassword(settings.wifiPassword);
      setIsUsingUDP(true);
      window.udpSettings.set({ address: settings.ipAddress });
      window.wifiDetails.set({ wifi: settings.wifiName, password: settings.wifiPassword });
      if (window.electron && window.electron.ipcRenderer) {
        window.electron.ipcRenderer.send('set-connection-mode', 'wireless');
      }
    }
  };

  return (
    <>
      <div className="tier0App">
        <div className="title">
          <img src={Logo} alt="Logo" />
          <p>Battery Health Hub</p>
        </div>
      </div>
      <div className="loggingControls">
        <TierLogging compData={udpData} />
        <span>{connectionStatus} <span className={`status-indicator ${connectionStatus === 'Connected' ? 'status-connected' : 'status-disconnected'}`}></span> </span>
      </div>
      <ConnectionSettingsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveSettings}
        initialSettings={{
          mode: isUsingUDP ? 'wireless' : 'wired',
          comPort: comPort,
          ipAddress: address,
          wifiName: wifi,
          wifiPassword: password
        }}
      />
      <div className={`tier1App ${tier1Status ? 'tier1Big' : 'tier1Small'}`}>
        <div className='tier1Control'>
          <button onClick={changeTier1Status} className='controlButtons'>{tier1Status ? <img src={Down} alt="Down" /> : <img src={Up} alt="Up" />}</button>
          <div className='batteryStatusHeader'>
            <div className='statusIndicatorHeader'>
              {udpData ? (() => {
                const csvValues = udpData.split(',');
                if (csvValues.length < 3) {
                  return <span className='statusTextHeader idle'>No Data</span>;
                }
                const current = parseFloat(csvValues[2] || 0);
                if (current > 0) return <span className='statusTextHeader charging'>Charging</span>;
                if (current < 0) return <span className='statusTextHeader discharging'>Discharging</span>;
                return <span className='statusTextHeader idle'>Idle</span>;
              })() : null}
            </div>
          </div>
          <div className='serialNumber'>
            <p><span>Battery Number: {udpData ? (() => {
              const csvValues = udpData.split(',');
              if (csvValues.length >= 24 && csvValues[22] && csvValues[19]) {
                return `${csvValues[22].slice(0, 5)}/${csvValues[19]}`;
              }
              return '';
            })() : ''}</span></p>
          </div>
        </div>
        {tier1Status ? <Tier1 compData={udpData} /> : <Tier1Min compData={udpData} />}
      </div>
      <div className={`tier2App ${tier2Status ? 'tier2Big' : 'tier2Small'}`}>
        <div className='tier2Control'>
          <button onClick={changeTier2Status} className='controlButtons'>{tier2Status ? <img src={Down} alt="Down" /> : <img src={Up} alt="Up" />}</button>
          <div className="legend">
            <div className="legend-item">
              <span className="color-box green"></span> Inactive
            </div>
            <div className="legend-item">
              <span className="color-box red"></span> Active
            </div>
            <div className="legend-item">
              <span className="color-box white"></span> Unused
            </div>
          </div>
        </div>
        {tier2Status ? <Tier2 compData={udpData} /> : <Tier2Min compData={udpData} />}
      </div>
      <div className={`tier3App ${tier3Status ? 'tier3Big' : 'tier3Small'}`}>
        <div className='tier3Control'>
          <button onClick={changeTier3Status} className='controlButtons'>{tier3Status ? <img src={Down} alt="Down" /> : <img src={Up} alt="Up" />}</button>
          <div className="legend">
            <div className="legend-item">
              <span className="color-box green"></span> Inactive
            </div>
            <div className="legend-item">
              <span className="color-box red"></span> Active
            </div>
            <div className="legend-item">
              <span className="color-box white"></span> Unused
            </div>
          </div>
        </div>
        {tier3Status ? <Tier3 compData={udpData} /> : <Tier3Min compData={udpData} />}
      </div>
      <div className="footer">
        <p>Version : 1.6</p>
        <div className='companyInfo'>
          <p className='textInFooter'>© 2025 Revogreen. All rights reserved.</p>
        </div>
      </div>
    </>
  );
}
export default App;