Chart.defaults.defaultFontFamily = 'Roboto';
Chart.defaults.defaultFontColor = '#333';

//load waterfall_chart data
d3.csv("waterfall_chart.csv").then((data) => {
  const parsedData = data.map((d) => ({
    year: d.year,
    value: +d.total,
  }));

  createWaterfallChart(parsedData);
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
              return grandTotal; 
            }
            return value; 
          },
          align: 'end',
          anchor: 'end',
        },
        legend: {
          display: false,
        },
      },
    },
  });
};
