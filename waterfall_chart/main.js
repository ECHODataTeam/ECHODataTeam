Chart.defaults.defaultFontFamily = 'Roboto';
Chart.defaults.defaultFontColor = '#333';

//load attendance data
d3.csv("../waterfall_chart.csv").then((data) => {
  const parsedData = data.map((d) => ({
    year: d.year,
    value: +d.total,
  }));
  // Calculate the grand total of attendance 
  const grandTotal = parsedData.reduce((acc, curr) => acc + curr.value, 0);

  createWaterfallChart(parsedData);
});

//number formatter
function formatNumber(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  }
  return number.toLocaleString();
}
//download chart as png
document.getElementById('download-chart').addEventListener('click', () => {
  const canvas = document.getElementById('waterfall-chart');
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'echo_waterfall_chart.png';
  link.click();
});

function createWaterfallChart(parsedData) {
  Chart.register(ChartDataLabels);

  const labels = parsedData.map((d) => d.year);
  labels.push("Total Attendances");

  const data = parsedData.map((d) => d.value);

  const runningTotalData = data.reduce((acc, curr, index) => {
    acc.push((index > 0 ? acc[index - 1] : 0) + curr);
    return acc;
  }, []);

  const grandTotal = runningTotalData[runningTotalData.length - 1];

  const stackedData = data.map((value, index) => {
    return index > 0 ? [runningTotalData[index - 1], value] : [0, value];
  });

  stackedData.push([0, grandTotal]);

  const ctx = document.getElementById('waterfall-chart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Previous Total',
          data: stackedData.map(value => value[0]),
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: 'rgba(0, 0, 0, 0)',
        },
        {
          label: 'Attendances',
          data: stackedData.map(value => value[1]),
          backgroundColor: (context) => {
            const index = context.dataIndex;
            if (index === data.length) {
              return 'rgba(0, 122, 134, 1)'; // Grand total
            }
            return '#d6a461';
          },
          borderColor: (context) => {
            const index = context.dataIndex;
            if (index === data.length) {
              return 'black'; // Grand Total
            }
            return 'black';
          },
          borderWidth: 1,
        },
      ],
    },
    options: {
      response: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          stacked: true,
          grid: {
            drawOnChartArea: false 
          }
        },
        x: {
          stacked: true,
          grid: {
            drawOnChartArea: false 
          }
        },
      },
      plugins: {
        datalabels: {
          color: 'black',
          formatter: (value, context) => {
            const index = context.dataIndex;
            const datasetIndex = context.datasetIndex;
            if (datasetIndex === 0) {
              return ''; 
            }
            if (index === data.length) {
              return formatNumber(grandTotal);
            }
            return formatNumber(value);
          },
          
          align: 'end',
          anchor: 'end',
        },
        zoom: {
          pan: {
            enabled: false,
            mode: 'x',
          },
          zoom: {
            wheel: {
            enabled: false,
            }
         
          },
        },
        legend: {
          display: false,
        },
      },
    },
  });
};


