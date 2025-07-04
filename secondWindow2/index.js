let activeGraphs = new Set();
let graphCount = 0;

// Maximum number of graphs that can be displayed simultaneously
const maxGraphs = 7;

function toggleButton(buttonId, isActive) {
    const button = document.getElementById(buttonId);
    if (button) {
        if (isActive && graphCount >= maxGraphs) {
            alert("You can only display up to 7 graphs at a time.");
            return false;
        }

        button.style.backgroundColor = isActive ? 'rgba(37,168,165,255)' : '';
        if (isActive) {
            activeGraphs.add(buttonId);
            graphCount++;
        } else {
            activeGraphs.delete(buttonId);
            graphCount--;
        }
        return true;
    }
    return false
}

function saveButtonState() {
    localStorage.setItem('activeGraphButtons', JSON.stringify(Array.from(activeGraphs)));
    localStorage.setItem('graphCount', graphCount.toString());
}

function loadButtonState() {
    const savedState = localStorage.getItem('activeGraphButtons');
    const savedCount = localStorage.getItem('graphCount');
    if (savedState) {
        activeGraphs = new Set(JSON.parse(savedState));
        graphCount = parseInt(savedCount) || 0;
        activeGraphs.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.style.backgroundColor = 'rgba(37,168,165,255)';
            }
        });
    }
}

// Save button state before unloading the page
window.addEventListener('beforeunload', saveButtonState);

// Load button state when the page loads
window.onload = function() {
    loadButtonState();
};

// Event listeners for various graph toggle buttons
// Each listener toggles the visibility of a specific graph and sends a message to update the graph settings
document.getElementById('toggleCurrent').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleCurrent');
    toggleButton('toggleCurrent', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 0, axisID: 'y-current', isActive: isActive});
});
document.getElementById('toggleVoltage').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleVoltage');
    toggleButton('toggleVoltage', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 1, axisID: 'y-voltage', isActive: isActive});
});
document.getElementById('toggleTemperature').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleTemperature');
    toggleButton('toggleTemperature', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 2, axisID: 'y-temperature', isActive: isActive});
});
document.getElementById('toggleCapacity').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleCapacity');
    toggleButton('toggleCapacity', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 3, axisID: 'y-capacity', isActive: isActive});
});
document.getElementById('toggledischargeTime').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggledischargeTime');
    toggleButton('toggledischargeTime', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 4, axisID: 'y-dischargeTime', isActive: isActive});
});
document.getElementById('togglechargingTime').addEventListener('click', () => {
    const isActive = !activeGraphs.has('togglechargingTime');
    toggleButton('togglechargingTime', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 5, axisID: 'y-chargingTime', isActive: isActive});
});
document.getElementById('toggleCycleCount').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleCycleCount');
    toggleButton('toggleCycleCount', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 6, axisID: 'y-cycleCount', isActive: isActive});
});
document.getElementById('toggleBatteryPercentage').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleBatteryPercentage');
    toggleButton('toggleBatteryPercentage', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 7, axisID: 'y-percentage', isActive: isActive});
});
document.getElementById('toggleBatteryHealth').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleBatteryHealth');
    toggleButton('toggleBatteryHealth', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 8, axisID: 'y-health', isActive: isActive});
});
document.getElementById('toggleSafetyStatus').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleSafetyStatus');
    toggleButton('toggleSafetyStatus', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 9, axisID: 'y-safety', isActive: isActive});
});
document.getElementById('toggleOperationStatus').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleOperationStatus');
    toggleButton('toggleOperationStatus', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 10, axisID: 'y-operation', isActive: isActive});
});
document.getElementById('toggleChargingStatus').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleChargingStatus');
    toggleButton('toggleChargingStatus', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 11, axisID: 'y-charging', isActive: isActive});
});
document.getElementById('toggleGuagingStatus').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleGuagingStatus');
    toggleButton('toggleGuagingStatus', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 12, axisID: 'y-guaging', isActive: isActive});
});
document.getElementById('toggleCellOne').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleCellOne');
    toggleButton('toggleCellOne', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 13, axisID: 'y-cellOne', isActive: isActive});
});
document.getElementById('toggleCellTwo').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleCellTwo');
    toggleButton('toggleCellTwo', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 14, axisID: 'y-cellTwo',isActive: isActive});
});
document.getElementById('toggleCellThree').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleCellThree');
    toggleButton('toggleCellThree', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 15, axisID: 'y-cellThree',isActive: isActive});
});
document.getElementById('toggleCellFour').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleCellFour');
    toggleButton('toggleCellFour', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 16, axisID: 'y-cellFour',isActive: isActive});
});
document.getElementById('toggleCellFive').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleCellFive');
    toggleButton('toggleCellFive', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 17, axisID: 'y-cellFive',isActive: isActive});
});
document.getElementById('toggleCellSix').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleCellSix');
    toggleButton('toggleCellSix', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 18, axisID: 'y-cellSix',isActive: isActive});
});
document.getElementById('toggleCellSeven').addEventListener('click', () => {
    const isActive = !activeGraphs.has('toggleCellSeven');
    toggleButton('toggleCellSeven', isActive);
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'toggleDataset', datasetIndex: 19, axisID: 'y-cellSeven',isActive: isActive});
});

// Event listeners for min/max input fields of various graph axes
// Each listener sends a message to update the axis range
document.getElementById('currentMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-current', value: this.value});
});
document.getElementById('currentMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-current', value: this.value});
});

document.getElementById('voltageMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-voltage', value: this.value});
});
document.getElementById('voltageMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-voltage', value: this.value});
});

document.getElementById('temperatureMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-temperature', value: this.value});
});
document.getElementById('temperatureMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-temperature', value: this.value});
});

document.getElementById('capacityMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-capacity', value: this.value});
});
document.getElementById('capacityMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-capacity', value: this.value});
});

document.getElementById('dischargeTimeMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-dischargeTime', value: this.value});
});
document.getElementById('dischargeTimeMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-dischargeTime', value: this.value});
});

document.getElementById('chargingTimeMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-chargingTime', value: this.value});
});
document.getElementById('chargingTimeMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-chargingTime', value: this.value});
});

document.getElementById('cycleCountMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-cycleCount', value: this.value});
});
document.getElementById('cycleCountMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-cycleCount', value: this.value});
});

document.getElementById('batteryPercentageMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-percentage', value: this.value});
});
document.getElementById('batteryPercentageMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-percentage', value: this.value});
});

document.getElementById('batteryHealthMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-health', value: this.value});
});
document.getElementById('batteryHealthMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-health', value: this.value});
});

document.getElementById('safetyStatusMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-safety', value: this.value});
});
document.getElementById('safetyStatusMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-safety', value: this.value});
});

document.getElementById('operationStatusMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-operation', value: this.value});
});
document.getElementById('operationStatusMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-operation', value: this.value});
});

document.getElementById('chargingStatusMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-charging', value: this.value});
});
document.getElementById('chargingStatusMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-charging', value: this.value});
});

document.getElementById('guagingStatusMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-guaging', value: this.value});
});
document.getElementById('guagingStatusMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-guaging', value: this.value});
});

document.getElementById('cellOneMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-cellOne', value: this.value});
});
document.getElementById('cellOneMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-cellOne', value: this.value});
});

document.getElementById('cellTwoMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-cellTwo', value: this.value});
});
document.getElementById('cellTwoMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-cellTwo', value: this.value});
});

document.getElementById('cellThreeMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-cellThree', value: this.value});
});
document.getElementById('cellThreeMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-cellThree', value: this.value});
});

document.getElementById('cellFourMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-cellFour', value: this.value});
});
document.getElementById('cellFourMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-cellFour', value: this.value});
});

document.getElementById('cellFiveMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-cellFive', value: this.value});
});
document.getElementById('cellFiveMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-cellFive', value: this.value});
});

document.getElementById('cellSixMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-cellSix', value: this.value});
});
document.getElementById('cellSixMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-cellSix', value: this.value});
});
document.getElementById('cellSevenMin').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMin', axisID: 'y-cellSeven', value: this.value});
});
document.getElementById('cellSevenMax').addEventListener('change', function() {
    window.electronAPI.sendMessage('graphSettingsChanged', {type: 'updateAxisMax', axisID: 'y-cellSeven', value: this.value});
});