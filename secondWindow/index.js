let dataPoints = [];
const MAX_DATA_POINTS = 4000;
const MAX_DISPLAYED_POINTS = 10

const ctx = document.getElementById('dataChart');
const timeFrameSelect = document.getElementById('timeframeSelect');

function updateAxisMin(axisID, value) {
    chart.options.scales[axisID].min = parseFloat(value)
    chart.update()
}
function updateAxisMax(axisID, value) {
    chart.options.scales[axisID].max = parseFloat(value)
    chart.update()
}

const graphColors = [
    { color: 'rgba(223, 233, 234, 255)', position: 'left' },
    { color: 'rgba(223, 99, 234, 255)', position: 'right' },
    { color: 'rgba(223, 150, 22, 255)', position: 'left' },
    { color: 'rgba(22, 150, 22, 255)', position: 'right' },
    { color: 'rgba(223, 50, 22, 255)', position: 'left' },
    { color: 'rgba(230, 150, 222, 255)', position: 'right' },
    { color: 'rgb(44, 232, 172, 255)', position: 'left' }
];

let visibleGraphs = 0;
const maxVisibleGraphs = 7;
let usedColors = new Array(graphColors.length).fill(false);

function getNextAvailableColor() {
    for (let i = 0; i < graphColors.length; i++) {
        if (!usedColors[i]) {
            usedColors[i] = true;
            return graphColors[i];
        }
    }

    usedColors.fill(false);
    usedColors[0] = true;
    return graphColors[0];
}

function releaseColor(colorString) {
    const index = graphColors.findIndex(c => c.color === colorString);
    if (index !== -1) {
        usedColors[index] = false;
    }
}

function resetColors() {
    usedColors.fill(false);
}

function toggleDataset(datasetIndex, axisID, isActive) {
    const dataset = chart.data.datasets[datasetIndex];
    
    if (isActive) {
        if (visibleGraphs >= maxVisibleGraphs) {
            return false;
        }
        
        dataset.hidden = false;
        chart.options.scales[axisID].display = true;
        const colorInfo = getNextAvailableColor();
        chart.data.datasets[datasetIndex].borderColor = colorInfo.color;
        chart.data.datasets[datasetIndex].backgroundColor = colorInfo.color;
        chart.options.scales[axisID].ticks.color = colorInfo.color;
        chart.options.scales[axisID].title.color = colorInfo.color;
        chart.options.scales[axisID].position = colorInfo.position;
        visibleGraphs++;
    } else {
        releaseColor(dataset.borderColor);
        dataset.hidden = true;
        chart.options.scales[axisID].display = false;
        visibleGraphs--;

        if (visibleGraphs === 0) {
            resetColors();
        }
    }
    
    chart.update();
}

function initChart() {
    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: "Current(mA)",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-current',
                hidden: true
            },
            {
                label: "Voltage(mV)",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-voltage',
                hidden: true
            },
            {
                label: "Temperature(C)",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-temperature',
                hidden: true
            },
            {
                label: "Capacity(mAh)",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-capacity',
                hidden: true
            },
            {
                label: "Discharge Time(min)",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-dischargeTime',
                hidden: true
            },
            {
                label: "Charging Time(min)",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-chargingTime',
                hidden: true
            },
            {
                label: "Cycle Count",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-cycleCount',
                hidden: true
            },
            {
                label: "Battery Percentage",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-percentage',
                hidden: true
            },
            {
                label: "Battery Health",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-health',
                hidden: true
            },
            {
                label: "Safety Status",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-safety',
                hidden: true
            },
            {
                label: "Operation Status",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-operation',
                hidden: true
            },
            {
                label: "Charging Status",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-charging',
                hidden: true
            },
            {
                label: "Guaging Status",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-guaging',
                hidden: true
            },
            {
                label: "Cell One Voltage(mV)",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-cellOne',
                hidden: true
            },
            {
                label: "Cell Two Voltage(mV)",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-cellTwo',
                hidden: true
            },
            {
                label: "Cell Three Voltage(mV)",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-cellThree',
                hidden: true
            },
            {
                label: "Cell Four Voltage(mV)",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-cellFour',
                hidden: true
            },
            {
                label: "Cell Five Voltage(mV)",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-cellFive',
                hidden: true
            },
            {
                label: "Cell Six Voltage(mV)",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-cellSix',
                hidden: true
            },
            {
                label: "Cell Seven Voltage(mV)",
                data: [],
                borderWidth: 1,
                yAxisID: 'y-cellSeven',
                hidden: true
            }],
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'second',
                        displayFormats: {
                            second: 'HH:mm:ss'
                        }
                    },
                    ticks: {
                        color: 'rgba(223, 233, 234, 255)',
                        autoSkip: true,
                        maxTicksLimit: 10
                    },
                    grid: {
                        color: 'rgba(223, 233, 234, 0.2)'
                    }
                },
                'y-current': {
                    type: 'linear',
                    // position: 'left',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgba(223, 233, 234, 255)'
                    },
                    grid: {
                        color: 'rgba(223, 233, 234, 0.2)'
                    },
                    title: {
                        display: true,
                        text: 'Current (mA)',
                        // color: 'rgba(223, 233, 234, 255)'
                    }
                },
                'y-voltage': {
                    type: 'linear',
                    // position: 'left',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgba(223, 99, 234, 255)'
                    },
                    title: {
                        display: true,
                        text: 'Voltage(mV)',
                        // color: 'rgba(223, 99, 234, 255)'
                    }
                },
                'y-temperature': {
                    type: 'linear',
                    // position: 'left',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgba(223, 150, 22, 255)'
                    },
                    title: {
                        display: true,
                        text: 'Temperature(C)',
                        // color: 'rgba(223, 150, 22, 255)'
                    }
                },
                'y-capacity': {
                    type: 'linear',
                    // position: 'right',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgba(22, 150, 22, 255)'
                    },
                    title: {
                        display: true,
                        text: 'Capacity(mAh)',
                        // color: 'rgba(22, 150, 22, 255)'
                    }
                },
                'y-dischargeTime': {
                    type: 'linear',
                    // position: 'right',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgba(223, 50, 22, 255)'
                    },
                    title: {
                        display: true,
                        text: 'Discharge Time(min)',
                        // color: 'rgba(223, 50, 22, 255)'
                    }
                },
                'y-chargingTime': {
                    type: 'linear',
                    // position: 'right',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgba(223, 50, 22, 255)'
                    },
                    title: {
                        display: true,
                        text: 'Charging Time(min)',
                        // color: 'rgba(135, 65, 70, 255)'
                    }
                },
                'y-cycleCount': {
                    type: 'linear',
                    // position: 'right',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgba(230, 150, 222, 255)'
                    },
                    title: {
                        display: true,
                        text: 'Cycle Count',
                        // color: 'rgba(230, 150, 222, 255)'
                    }
                },
                'y-percentage': {
                    type: 'linear',
                    // position: 'left',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgb(38, 60, 155)'
                    },
                    title: {
                        display: true,
                        text: 'Battery Percentage',
                        // color: 'rgb(38, 60, 155)'
                    }
                },
                'y-health': {
                    type: 'linear',
                    // position: 'right',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgb(35, 27, 34)'
                    },
                    title: {
                        display: true,
                        text: 'Battery Health',
                        // color: 'rgb(35, 27, 34)'
                    }
                },
                'y-safety': {
                    type: 'linear',
                    // position: 'left',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgb(137, 118, 96)'
                    },
                    title: {
                        display: true,
                        text: 'Safety Status',
                        // color: 'rgb(137, 118, 96)'
                    }
                },
                'y-operation': {
                    type: 'linear',
                    // position: 'right',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgb(112, 23, 88)'
                    },
                    title: {
                        display: true,
                        text: 'Operation Status',
                        // color: 'rgb(112, 23, 88)'
                    }
                },
                'y-charging': {
                    type: 'linear',
                    // position: 'left',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgb(114, 234, 124)'
                    },
                    title: {
                        display: true,
                        text: 'Charging Status',
                        // color: 'rgb(114, 234, 124)'
                    }
                },
                'y-guaging': {
                    type: 'linear',
                    // position: 'right',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgb(229, 225, 201)'
                    },
                    title: {
                        display: true,
                        text: 'Guaging Status',
                        // color: 'rgb(229, 225, 201)'
                    }
                },
                'y-cellOne': {
                    type: 'linear',
                    // position: 'left',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgb(47, 168, 59)'
                    },
                    title: {
                        display: true,
                        text: 'Cell One Voltage(mV)',
                        // color: 'rgb(47, 168, 59)'
                    }
                },
                'y-cellTwo': {
                    type: 'linear',
                    // position: 'right',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgb(177, 114, 255)'
                    },
                    title: {
                        display: true,
                        text: 'Cell Two Voltage(mV)',
                        // color: 'rgb(177, 114, 255)'
                    }
                },
                'y-cellThree': {
                    type: 'linear',
                    // position: 'left',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgb(130, 9, 81)'
                    },
                    title: {
                        display: true,
                        text: 'Cell Three Voltage(mV)',
                        // color: 'rgb(130, 9, 81)'
                    }
                },
                'y-cellFour': {
                    type: 'linear',
                    // position: 'right',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgb(137, 150, 21)'
                    },
                    title: {
                        display: true,
                        text: 'Cell Four Voltage(mV)',
                        // color: 'rgb(137, 150, 21)'
                    }
                },
                'y-cellFive': {
                    type: 'linear',
                    // position: 'left',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgb(163, 163, 102)'
                    },
                    title: {
                        display: true,
                        text: 'Cell Five Voltage(mV)',
                        // color: 'rgb(163, 163, 102)'
                    }
                },
                'y-cellSix': {
                    type: 'linear',
                    // position: 'right',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgb(239, 101, 59)'
                    },
                    title: {
                        display: true,
                        text: 'Cell Six Voltage(mV)',
                        // color: 'rgb(239, 101, 59)'
                    }
                },
                'y-cellSeven': {
                    type: 'linear',
                    // position: 'right',
                    beginAtZero: true,
                    display: false,
                    ticks: {
                        // color: 'rgb(239, 101, 59)'
                    },
                    title: {
                        display: true,
                        text: 'Cell Seven Voltage(mV)',
                        // color: 'rgb(239, 101, 59)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(223, 233, 234, 255)',
                        filter: function(item, chart) {
                            return !item.hidden;
                        }
                    }
                }
            }
        }
    })
}

function updateChart() {
    const selectedSeconds = parseInt(timeFrameSelect.value);
    const currentTime = Date.now();
    const filteredData = dataPoints.filter(point => (currentTime - point.timestamp) <= selectedSeconds * 1000);

    const interval = Math.ceil(filteredData.length / MAX_DISPLAYED_POINTS);

    const displayedData = filteredData.filter((point, index) => index % interval === 0);

    chart.data.labels = displayedData.map(point => new Date(point.timestamp));
    chart.data.datasets[0].data = displayedData.map(point => point.current);
    chart.data.datasets[1].data = displayedData.map(point => point.voltage);
    chart.data.datasets[2].data = displayedData.map(point => point.temperature);
    chart.data.datasets[3].data = displayedData.map(point => point.capacity);
    chart.data.datasets[4].data = displayedData.map(point => point.dischargeTime);
    chart.data.datasets[5].data = displayedData.map(point => point.chargingTime);
    chart.data.datasets[6].data = displayedData.map(point => point.cycleCount);
    chart.data.datasets[7].data = displayedData.map(point => point.percentage);
    chart.data.datasets[8].data = displayedData.map(point => point.health);
    chart.data.datasets[9].data = displayedData.map(point => point.safety);
    chart.data.datasets[10].data = displayedData.map(point => point.operation);
    chart.data.datasets[11].data = displayedData.map(point => point.charging);
    chart.data.datasets[12].data = displayedData.map(point => point.gauging);
    chart.data.datasets[13].data = displayedData.map(point => point.cellOne);
    chart.data.datasets[14].data = displayedData.map(point => point.cellTwo);
    chart.data.datasets[15].data = displayedData.map(point => point.cellThree);
    chart.data.datasets[16].data = displayedData.map(point => point.cellFour);
    chart.data.datasets[17].data = displayedData.map(point => point.cellFive);
    chart.data.datasets[18].data = displayedData.map(point => point.cellSix);
    chart.data.datasets[19].data = displayedData.map(point => point.cellSeven);
    chart.update();
}

function addDataPoint(current, voltage, temperature, capacity, dischargeTime, chargingTime, cycleCount, percentage, health, safety, operation, charging, gauging, cellOne, cellTwo, cellThree, cellFour, cellFive, cellSix, cellSeven) {
    dataPoints.push({ timestamp: Date.now(), current: current, voltage: voltage, temperature: temperature, capacity: capacity, dischargeTime: dischargeTime, chargingTime: chargingTime, cycleCount: cycleCount, percentage: percentage, health: health, safety: safety, operation: operation, charging: charging, gauging: gauging, cellOne: cellOne, cellTwo: cellTwo, cellThree: cellThree, cellFour: cellFour, cellFive: cellFive, cellSix: cellSix, cellSeven: cellSeven });
    if (dataPoints.length > MAX_DATA_POINTS) {
        dataPoints.shift(); // Remove the oldest data point
    }
    updateChart();
}

function handleGraphSettingsUpdate(data) {
    if (data.type === 'toggleDataset') {
        toggleDataset(data.datasetIndex, data.axisID, data.isActive);
    }
    else if(data.type === 'updateAxisMin') {
        updateAxisMin(data.axisID, data.value)
    }
    else if(data.type === 'updateAxisMax') {
        updateAxisMax(data.axisID, data.value)
    }
}

// Set up IPC listener for graph settings updates
window.electronAPI.receive('updateGraphSettings', handleGraphSettingsUpdate);

window.messRe.udpA((data) => {
    const csvValues = data.split(',');
    
    if (csvValues.length < 24) {
        return;
    }
    
    const voltageData = csvValues[1];
    const currentData = csvValues[2];
    const temperatureData = csvValues[3];
    const capacityData = csvValues[4];
    
    const dischargeTimeData = csvValues[5];
    const chargingTimeData = csvValues[23];   // Charging Time (always from values[23])
    
    const cycleCountData = csvValues[6];   // U: Cycle Count
    const percentageData = csvValues[7];   // T: Battery Percentage (RSOC)
    const healthData = csvValues[8];       // S: Battery Health (SOH)
    const safetyData = csvValues[9];       // R: Safety Status
    const operationData = csvValues[10];   // Q: Operation Status
    const chargingData = csvValues[11];    // P: Charging Status
    const gaugingData = csvValues[12];     // O: Gauging Status
    const cellOneData = csvValues[13];     // N: Cell 1 Voltage
    const cellTwoData = csvValues[14];     // M: Cell 2 Voltage
    const cellThreeData = csvValues[15];   // L: Cell 3 Voltage
    const cellFourData = csvValues[16];    // K: Cell 4 Voltage
    const cellFiveData = csvValues[17];     // cell 5 voltage
    const cellSixData = csvValues[18];   // cell 6 voltage
    const cellSevenData = csvValues[21];  // Cell 7 Voltage
    
    if (!isNaN(currentData)) {
        addDataPoint(currentData, voltageData, temperatureData, capacityData, dischargeTimeData, chargingTimeData, cycleCountData, percentageData, healthData, safetyData, operationData, chargingData, gaugingData, cellOneData, cellTwoData, cellThreeData, cellFourData, cellFiveData, cellSixData, cellSevenData);
    }
});

initChart();

document.getElementById('btn').addEventListener('click', function() {
    window.show.aboutWindow2("Hi")
})

timeFrameSelect.addEventListener('change', updateChart);