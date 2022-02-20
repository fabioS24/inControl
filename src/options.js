let allSessions = [];
let allData = [];
let userNumber = 0;

chrome.storage.sync.get('userid', function(items) {
  var userid = items.userid;
  if (userid) {
    chrome.runtime.sendMessage({command: "fetch", data: {userId: userid}}, (response) => {
      if(response) {
        allSessions = response.data;
        updateCharts();
      }
    });
    
    chrome.runtime.sendMessage({command: "fetchAll", data: {userId: undefined}}, (response) => {
      if(response) {
        allData = response.data;
        let tmp = new Array();
        for(let x of allData) {
          userNumber++;
          for(let y in x.sessions) {
            tmp.push(x.sessions[y]);
          }
        }
        allData = tmp;
        updateTotalCharts();
      }
    });
    
  } else {
      userid = getRandomToken();
      chrome.storage.sync.set({userid: userid}, function() {
          chrome.runtime.sendMessage({command: "fetch", data: {userId: userid}}, (response) => {
            allSessions = response.data;
            updateCharts();
          });
      });
  }
});

let groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

let updateCharts = () => {
  let facebookSessions = [];
  let youtubeSessions = [];
  facebookSessions = allSessions.filter((session) => session.site == "facebook");
  youtubeSessions = allSessions.filter((session) => session.site == "youtube");
  facebookSessions.map((x) => {
    x.day = dayjs(x.timestampStart).format("YYYY/MM/DD");
    x.calendarWeek = moment(x.timestampStart).format("YYYY") + "-" + moment(x.timestampStart).format("W");
  });
  youtubeSessions.map((x) => {
    x.day = dayjs(x.timestampStart).format("YYYY/MM/DD");
    x.calendarWeek = moment(x.timestampStart).format("YYYY") + "-" + moment(x.timestampStart).format("W");
  });

  let FBDay = groupBy(facebookSessions, "day");
  let YTDay = groupBy(youtubeSessions, "day");
  let FBWeek = groupBy(facebookSessions, "calendarWeek");
  let YTWeek = groupBy(youtubeSessions, "calendarWeek");
  
  produceChart(FBDay, YTDay, "clicks", "day");
  produceChart(FBDay, YTDay, "scrolls", "day");
  produceChart(FBDay, YTDay, "duration", "day");
  produceChart(FBWeek, YTWeek, "clicks", "calendarWeek");
  produceChart(FBWeek, YTWeek, "scrolls", "calendarWeek");
  produceChart(FBWeek, YTWeek, "duration", "calendarWeek");
  
}

let produceChart = (arrayFB, arrayYT, prop, time) => {
  let title = prop[0].toUpperCase() + prop.slice(1,prop.length) + " per ";
  
  if(time == "calendarWeek") {
    title += "week"
  } else {
    title += time;
  }

  if(prop == "duration") {
    title += " (minutes)";
  }

  let options = {
    chart: {
      type: 'line'
    },
    series: [{
      name: 'Facebook',
      data: []
    },{
      name: "Youtube",
      data: []
    }],
    xaxis: {
      categories: []
    },
    title: {
      text: title,
      align: 'left'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      }
    },
    colors: ['#77B6EA', '#ff1a1a']
  }

  options.xaxis.categories = createXaxis(arrayFB,arrayYT);

  //Initialize data to 0
  for(let i = 0; i < options.xaxis.categories.length; i++) {
    options.series[0].data[i] = 0;
    options.series[1].data[i] = 0;
  }

  for(let d in arrayFB) {
    if(d != undefined) {
      if(prop == "duration") {
        let totalSeconds = arrayFB[d].reduce((x,y) => {return x+y[prop];}, 0);
        let minutes = Math.ceil(totalSeconds / 60);
        options.series[0].data[options.xaxis.categories.indexOf(d)] = minutes;
      } else {
        options.series[0].data[options.xaxis.categories.indexOf(d)] = arrayFB[d].reduce((x,y) => {return x+y[prop];}, 0);
      }
    }
  }
  for(let d in arrayYT) {
    if(d != undefined) {
      if(prop == "duration") {
        let totalSeconds = arrayYT[d].reduce((x,y) => {return x+y[prop];}, 0);
        let minutes = Math.ceil(totalSeconds / 60);
        options.series[1].data[options.xaxis.categories.indexOf(d)] = minutes;
      } else {
        options.series[1].data[options.xaxis.categories.indexOf(d)] = arrayYT[d].reduce((x,y) => {return x+y[prop];}, 0);
      }
    }    
  }

  options.xaxis.categories.sort((x,y) => {
    if(x>y) return 1;
    else if(x<y) return -1;
    else return 0;
  });
  
  document.querySelector("#chart" + prop + "Per" + time).innerHTML = "";
  let chart = new ApexCharts(document.querySelector("#chart" + prop + "Per" + time), options);
  chart.render();
}

let createXaxis = (arrayFB,arrayYT) => {
  let k = 0;

  //Production of the xaxis arrays as merge of two sorted arrays
  let a = [],b = [],c = [];
  for(let x in arrayFB) {
    a.push(x);
  }
  for(let x in arrayYT) {
    if(!a.includes(x)) {
      a.push(x);
    }
  }

  return a.sort((x,y) => {
    if(x>y) return 1;
    else if(x<y) return -1;
    else return 0;
  });
}

/**********************DASHBOARD*********************/

let updateTotalCharts = () => {
  let facebookSessions = [];
  let youtubeSessions = [];
  facebookSessions = allData.filter((session) => session.site == "facebook");
  youtubeSessions = allData.filter((session) => session.site == "youtube");
  facebookSessions.map((x) => {
    x.day = dayjs(x.timestampStart).format("YYYY/MM/DD");
    x.calendarWeek = moment(x.timestampStart).format("YYYY") + "-" + moment(x.timestampStart).format("W");
    if(x.week == 1 || x.week == 2) {
      if((x.testVersion == 1 && x.week == 1) || (x.testVersion == 2 && x.week == 2)) {
        x.testWeek = 1;
      } else {
        x.testWeek = 2;
      }
    } else {
      x.testWeek = x.week;
    }
  });
  youtubeSessions.map((x) => {
    x.day = dayjs(x.timestampStart).format("YYYY/MM/DD");
    x.calendarWeek = moment(x.timestampStart).format("YYYY") + "-" + moment(x.timestampStart).format("W");
    if(x.week == 1 || x.week == 2) {
      if((x.testVersion == 1 && x.week == 1) || (x.testVersion == 2 && x.week == 2)) {
        x.testWeek = 1;
      } else {
        x.testWeek = 2;
      }
    } else {
      x.testWeek = x.week;
    }
    
  });

  let FBDay = groupBy(facebookSessions, "day");
  let YTDay = groupBy(youtubeSessions, "day");
  let FBWeek = groupBy(facebookSessions, "testWeek");
  let YTWeek = groupBy(youtubeSessions, "testWeek");
  console.log("FBDay:");
  console.log(FBDay);
  produceTotalChart(FBDay, YTDay, "clicks", "day");
  produceTotalChart(FBDay, YTDay, "scrolls", "day");
  produceTotalChart(FBDay, YTDay, "duration", "day");
  produceTotalChart(FBWeek, YTWeek, "clicks", "testWeek");
  produceTotalChart(FBWeek, YTWeek, "scrolls", "testWeek");
  produceTotalChart(FBWeek, YTWeek, "duration", "testWeek");
  produceTotalChart(FBWeek, YTWeek, "scrollsduration", "testWeek");
  produceTotalChart(FBWeek, YTWeek, "clicksduration", "testWeek");
  produceBoxPlotFB("scroll")
  produceBoxPlotFB("click")
  produceBoxPlotYT("scroll")
  produceBoxPlotYT("click")
  produceBoxPlotDuration("YT")
  produceBoxPlotDuration("FB")
  
}

let produceTotalChart = (arrayFB, arrayYT, prop, time) => {
  let title = prop[0].toUpperCase() + prop.slice(1,prop.length) + " per ";
  
  if(time == "calendarWeek") {
    title += "week"
  } else {
    title += time;
  }

  if(prop == "duration") {
    title += " (minutes)";
  }

  let options = {
    chart: {
      type: 'line' /*'area'*/
    },
    series: [{
      name: 'Facebook',
      data: []
    },{
      name: "Youtube",
      data: []
    }],
    xaxis: {
      categories: []
    },
    theme: {
      palette: 'palette5'
    },
    title: {
      text: title,
      align: 'left'
    },
    dataLabels: {
      enabled: true
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      }
    },
    colors: ['#77B6EA', '#ff1a1a']
  }

  options.xaxis.categories = createXaxis(arrayFB,arrayYT);

  console.log("Options after createXaxis:");
  console.log(options);
  //Initialize data to 0
  for(let i = 0; i < options.xaxis.categories.length; i++) {
    options.series[0].data[i] = 0;
    options.series[1].data[i] = 0;
  }

  if(prop == "scrollsduration") {
    options.chart.type = "area";
    for(let d in arrayFB) {
      if(d != undefined) {
        let totalSeconds = arrayFB[d].reduce((x,y) => {return x+y["duration"];}, 0);
        let minutes = Math.ceil(totalSeconds / 60);
        let totalScrolls = arrayFB[d].reduce((x,y) => {return x+y["scrolls"];}, 0)
        options.series[0].data[options.xaxis.categories.indexOf(d)] = (totalScrolls/minutes).toFixed(2);
        }
      }

    for(let d in arrayYT) {
      if(d != undefined) {
        let totalSeconds = arrayYT[d].reduce((x,y) => {return x+y["duration"];}, 0);
        let minutes = Math.ceil(totalSeconds / 60);
        let totalScrolls = arrayYT[d].reduce((x,y) => {return x+y["scrolls"];}, 0);
        options.series[1].data[options.xaxis.categories.indexOf(d)] = (totalScrolls/minutes).toFixed(2);
      }    
    }
  
  } else if(prop == "clicksduration") {
    options.chart.type = "area";
    for(let d in arrayFB) {
      if(d != undefined) {
        let totalSeconds = arrayFB[d].reduce((x,y) => {return x+y["duration"];}, 0);
        let minutes = Math.ceil(totalSeconds / 60);
        let totalClicks = arrayFB[d].reduce((x,y) => {return x+y["clicks"];}, 0)
        options.series[0].data[options.xaxis.categories.indexOf(d)] = (totalClicks/minutes).toFixed(2);
        }
      }

    for(let d in arrayYT) {
      if(d != undefined) {
        let totalSeconds = arrayYT[d].reduce((x,y) => {return x+y["duration"];}, 0);
        let minutes = Math.ceil(totalSeconds / 60);
        let totalClicks = arrayYT[d].reduce((x,y) => {return x+y["clicks"];}, 0);
        options.series[1].data[options.xaxis.categories.indexOf(d)] = (totalClicks/minutes).toFixed(2);
      }    
    }
  } else {
    for(let d in arrayFB) {
      if(d != undefined) {
        if(prop == "duration") {
          let totalSeconds = arrayFB[d].reduce((x,y) => {return x+y[prop];}, 0);
          let minutes = Math.ceil(totalSeconds / 60);
          options.series[0].data[options.xaxis.categories.indexOf(d)] = minutes*8;
        } else {
          options.series[0].data[options.xaxis.categories.indexOf(d)] = arrayFB[d].reduce((x,y) => {return x+y[prop];}, 0)*1;
        }
      }
    }
    for(let d in arrayYT) {
      if(d != undefined) {
        if(prop == "duration") {
          let totalSeconds = arrayYT[d].reduce((x,y) => {return x+y[prop];}, 0);
          let minutes = Math.ceil(totalSeconds / 60);
          options.series[1].data[options.xaxis.categories.indexOf(d)] = minutes;
        } else {
          options.series[1].data[options.xaxis.categories.indexOf(d)] = arrayYT[d].reduce((x,y) => {return x+y[prop];}, 0);
        }
      }    
    }
  }

  console.log("Options end:");
  console.log(options);

  console.log("Chiesto grafico per prop=" + prop + " e time=" + time);
  document.querySelector("#charttotal" + prop + "Per" + time).innerHTML = "";
  let chart = new ApexCharts(document.querySelector("#charttotal" + prop + "Per" + time), options);
  chart.render();
}

const produceBoxPlotFB = (type) => {
  let options = {
    series: [
    {
      type: 'boxPlot',
      data: [
        {
          x: 'Control',
          y: [0, 0, 2, 5.25, 9] //minimo, q1, mediana, q3, massimo
        },
        {
          x: 'Home Redesign',
          y: [0, 3, 5, 6.5, 8]
        },
        {
          x: 'Infinite scrolling',
          y: [0, 2, 3, 5, 11]
        }
      ]
    }
  ],
    chart: {
    type: 'boxPlot',
    height: 350
  },
  title: {
    text: 'FB clicks per minute',
    align: 'left'
  },
  plotOptions: {
    boxPlot: {
      colors: {
        upper: '#00E396',
        lower: '#008FFB'
      }
    }
  }
  };
  
  if(type === "scroll")  {
    options.series[0].data = [
      {
        x: 'Control',
        y: [0, 0, 2, 5.25, 9] //minimo, q1, mediana, q3, massimo
      },
      {
        x: 'Home Redesign',
        y: [0, 3, 5, 6.5, 8]
      },
      {
        x: 'Infinite scrolling',
        y: [0, 2, 3, 5, 11]
      }
    ]
    options.title.text = "Facebook: scroll al minuto"
  } else if (type === "click") {
    options.series[0].data = [
      {
        x: 'Control',
        y: [0, 117.5, 300, 350, 700] //minimo, q1, mediana, q3, massimo
      },
      {
        x: 'Home Redesign',
        y: [0, 69.25, 90, 120, 320]
      },
      {
        x: 'Infinite scrolling',
        y: [39, 139, 200, 250, 400]
      }
    ]
    options.title.text = "Facebook: click al minuto"
  }
  
  document.querySelector("#boxPlotFB" + type).innerHTML = "";
  let chart = new ApexCharts(document.querySelector("#boxPlotFB" + type), options);
  chart.render();
}

const produceBoxPlotYT = (type) => {
  let options = {
    series: [
    {
      type: 'boxPlot',
      data: [
        {
          x: 'Control',
          y: [0, 0, 2, 5.25, 9] //minimo, q1, mediana, q3, massimo
        },
        {
          x: 'Home Redesign',
          y: [0, 3, 5, 6.5, 8]
        },
        {
          x: 'Infinite scrolling',
          y: [0, 2, 3, 5, 11]
        }
      ]
    }
  ],
    chart: {
    type: 'boxPlot',
    height: 350
  },
  title: {
    text: 'YouTube: click al minuto',
    align: 'left'
  },
  plotOptions: {
    boxPlot: {
      colors: {
        upper: '#00E396',
        lower: '#008FFB'
      }
    }
  }
  };
  
  if(type === "scroll")  {
    options.series[0].data = [
      {
        x: 'Control',
        y: [0, 1, 2, 2, 120] //minimo, q1, mediana, q3, massimo
      },
      {
        x: 'Home Redesign',
        y: [0, 1, 2, 2, 70]
      },
      {
        x: 'Infinite scrolling',
        y: [0, 1, 2, 2, 150]
      }
    ]
    options.title.text = "YouTube: scroll al minuto"
  } else if (type === "click") {
    options.series[0].data = [
      {
        x: 'Control',
        y: [0, 0, 1, 1, 8] //minimo, q1, mediana, q3, massimo
      },
      {
        x: 'Home Redesign',
        y: [0, 0, 1, 1, 5]
      },
      {
        x: 'Infinite scrolling',
        y: [0, 0, 1, 1, 8]
      }
    ]
    options.title.text = "YouTube: click al minuto"
  }
  
  document.querySelector("#boxPlotYT" + type).innerHTML = "";
  let chart = new ApexCharts(document.querySelector("#boxPlotYT" + type), options);
  chart.render();
}

const produceBoxPlotDuration = (type) => {
  let options = {
    series: [
    {
      type: 'boxPlot',
      data: [
        {
          x: 'Control',
          y: [0, 0, 2, 5.25, 9] //minimo, q1, mediana, q3, massimo
        },
        {
          x: 'Home Redesign',
          y: [0, 3, 5, 6.5, 8]
        },
        {
          x: 'Infinite scrolling',
          y: [0, 2, 3, 5, 11]
        }
      ]
    }
  ],
    chart: {
    type: 'boxPlot',
    height: 350
  },
  title: {
    text: 'YouTube click al minuto',
    align: 'left'
  },
  plotOptions: {
    boxPlot: {
      colors: {
        upper: '#00E396',
        lower: '#008FFB'
      }
    }
  }
  };
  
  if(type === "YT")  {
    options.series[0].data = [
      {
        x: 'Control',
        y: [112, 123, 350, 422, 448] //minimo, q1, mediana, q3, massimo
      },
      {
        x: 'Home Redesign',
        y: [126, 189, 307, 382, 458]
      },
      {
        x: 'Infinite scrolling',
        y: [41, 68, 236, 313, 338]
      }
    ]
    options.title.text = "YouTube: tempo impiegato al giorno"
  } else if (type === "FB") {
    options.series[0].data = [
      {
        x: 'Control',
        y: [58, 80, 190, 368, 440] //minimo, q1, mediana, q3, massimo
      },
      {
        x: 'Home Redesign',
        y: [16, 16, 48, 114, 136]
      },
      {
        x: 'Infinite scrolling',
        y: [24, 56, 70, 120, 150]
      }
    ]
    options.title.text = "Facebook: tempo impiegato al giorno"
  }
  
  document.querySelector("#boxPlot" + type + "Duration").innerHTML = "";
  let chart = new ApexCharts(document.querySelector("#boxPlot" + type + "Duration"), options);
  chart.render();
}