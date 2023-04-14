Chart.defaults.global.defaultFontFamily = 'Roboto';
Chart.defaults.global.defaultFontColor = '#333';

function makeChart(players) {
  // players is an array of objects where each object is something like:
  // {
  //   "Name": "Steffi Graf",
  //   "Weeks": "377",
  //   "Gender": "Female"
  // }

  var playerLabels = players.map(function(d) {return d.Name});
  var weeksData = players.map(function(d) {return +d.Weeks});
  var playerColors = players.map(function(d) {return d.Gender === 'Female' ? '#F15F36' : '#19A0AA';});

  var chart = new Chart('chart', {
    type: 'horizontalBar',
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Weeks at No.1',
              fontSize: 16
            }
          }
        ]
      }
    },
    data: {
      labels: playerLabels,
      datasets: [
        {
          data: weeksData,
          backgroundColor: playerColors
        }
      ]
    }
  })
}

// Request data using D3
d3.csv('https://s3-us-west-2.amazonaws.com/s.cdpn.io/2814973/atp_wta.csv')
  .then(makeChart);