import React, { useState, useEffect } from 'react';
import './ConnectionSettingsDialog.css';

const ConnectionSettingsDialog = ({ isOpen, onClose, onSave, initialSettings }) => {
  const [settings, setSettings] = useState({
    mode: 'wired',
    comPort: '',
    ipAddress: '',
    wifiName: '',
    wifiPassword: ''
  });
  const [comPorts, setComPorts] = useState([]);

  // Poll for COM ports every 2 seconds when dialog is open and in wired mode
  useEffect(() => {
    let interval;
    const fetchComPorts = async () => {
      if (window.serialPort && window.serialPort.list) {
        const ports = await window.serialPort.list();
        setComPorts(ports);
        // If no port selected, select the first available
        if (ports.length > 0 && !settings.comPort) {
          setSettings(prev => ({ ...prev, comPort: ports[0] }));
        }
      }
    };
    if (isOpen && settings.mode === 'wired') {
      fetchComPorts();
      interval = setInterval(fetchComPorts, 2000);
    }
    return () => clearInterval(interval);
  }, [isOpen, settings.mode]);

  useEffect(() => {
    if (initialSettings) {
      setSettings(prev => ({
        ...prev,
        ...initialSettings
      }));
    }
  }, [initialSettings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModeChange = (mode) => {
    setSettings(prev => ({
      ...prev,
      mode,
      comPort: '' // Reset COM port when switching modes
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2>Connection Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="mode-selector">
            <button
              type="button"
              className={`mode-button ${settings.mode === 'wired' ? 'active' : ''}`}
              onClick={() => handleModeChange('wired')}
            >
              Wired (Serial)
            </button>
            <button
              type="button"
              className={`mode-button ${settings.mode === 'wireless' ? 'active' : ''}`}
              onClick={() => handleModeChange('wireless')}
            >
              Wireless (UDP)
            </button>
          </div>

          {settings.mode === 'wired' ? (
            <div className="settings-group">
              <div className="input-group">
                <label htmlFor="comPort">COM Port:</label>
                <select
                  id="comPort"
                  name="comPort"
                  value={settings.comPort}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select COM Port</option>
                  {comPorts.map(port => (
                    <option key={port} value={port}>{port}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="settings-group">
              <div className="input-group">
                <label htmlFor="ipAddress">IP Address:</label>
                <input
                  type="text"
                  id="ipAddress"
                  name="ipAddress"
                  value={settings.ipAddress}
                  onChange={handleInputChange}
                  placeholder="Enter IP Address"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="wifiName">WiFi Name:</label>
                <input
                  type="text"
                  id="wifiName"
                  name="wifiName"
                  value={settings.wifiName}
                  onChange={handleInputChange}
                  placeholder="Enter WiFi Name"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="wifiPassword">WiFi Password:</label>
                <input
                  type="password"
                  id="wifiPassword"
                  name="wifiPassword"
                  value={settings.wifiPassword}
                  onChange={handleInputChange}
                  placeholder="Enter WiFi Password"
                  required
                />
              </div>
            </div>
          )}

          <div className="dialog-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectionSettingsDialog;