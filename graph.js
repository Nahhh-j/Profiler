// 지금안씀

//var { taskMaxData, taskMinData, taskAvgData } = require('./showWithTaskId');
Highcharts.chart('container', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Task1의 core별 수행능력'
    },
    subtitle: {
        text: '야, 노드 할 수 있어'
    },
    xAxis: {
        categories: ['Core1', 'Core2', 'Core3', 'Core4', 'Core5']
    },
    yAxis: {
        title: {
            text: 'Values'
        }
    },
    plotOptions: {
        series: {
            lineWidth: 1,
        }
    },
    series: [{
        name: 'max',
        data: [280, 300, 320, 490, 390] // taskMaxData
    }, {
        name: 'min',
        data: [280, 300, 320, 490, 390] // taskMinData
    }, {
          name: 'avg',
        data: [250, 250, 300, 470, 380] // taskAvgData
    }]
});