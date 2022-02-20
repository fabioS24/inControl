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