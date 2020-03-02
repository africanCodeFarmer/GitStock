import * as echarts from '../../ec-canvas/echarts';
var util = require('../../../pages/public/public')

var pie_chart = null;
var column_chart = null;

//柱状图初始化
function initChart_column(canvas, width, height) {
  column_chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(column_chart);

  var option = {
    title:{
      text:"本月每日任务完成情况"
    },
    grid: {
      left: 0,
      right: 0,
      bottom: 15,
      top: 80,
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15',16,'17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisTick: { show: false },
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    legend: {
      data: ['今日任务', '每日任务','限时任务'],
      right: 0,
      top:40
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}日\n{a0}: {c0}\n{a1}: {c1}\n{a2}: {c2}',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    series: [
      {
        name: '今日任务',
        type: 'bar',
        stack:'情况',
        label: {
          normal: {
            show: false,
            position: 'inside'
          }
        },
        data: [],
      },
      {
        name: '每日任务',
        type: 'bar',
        stack:'情况',
        label: {
          normal: {
            show: false,
            position: 'inside'
          }
        },
        data: [],
      },
      {
        name: '限时任务',
        type: 'bar',
        stack:'情况',
        label: {
          normal: {
            show: false,
            position: 'inside'
          }
        },
        data: [],
      }
    ]
  };

  column_chart.setOption(option);
  return column_chart;
}

//饼图初始化
function initChart_pie(canvas, width, height) {
  pie_chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(pie_chart);

  var option = {
    title: {
        text: '本月完成任务类型情况',
        left: 'left',
    },
    tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}\n{d}%'
    },
    visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
            colorLightness: [0, 1]
        }
    },
    series: [
      {
        top:50,
        name: '访问来源',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data:[].sort(function (a, b) { return a.value - b.value; }),
        roseType: 'radius',
        label: {
          show: true,
          formatter: "{b}\n{d}%"
        },
        labelLine: {
            smooth: 0.2,
            length: 10,
            length2: 20
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
            return Math.random() * 200;
        }
      }
    ]
  };

  pie_chart.setOption(option);
  return pie_chart;
}

//更新柱状图
function updateChart_column(data_today_completed_count,data_everyday_completed_count,data_limitTime_completed_count){
  if(column_chart==null)
    return;

  var option = column_chart.getOption()
  //0今日任务 1每日任务 2限时任务
  option.series[0].data = data_today_completed_count
  option.series[1].data = data_everyday_completed_count
  option.series[2].data = data_limitTime_completed_count
  column_chart.setOption(option)
}

//更新饼图
function updateChart_pie(datas){
  if(pie_chart==null)
    return;
    
  var option = pie_chart.getOption()
  option.series[0].data = datas
  pie_chart.setOption(option)
}

Page({
  data: {
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),

    ec_column_chart: {
      onInit: initChart_column
    },
    ec_pie_chart: {
      onInit: initChart_pie
    },

    custom_data:{"backText":"任务日志","content":"统计"},

    show_timeChoose_popup:false,
    canvas_height:400,

    month_today_completed_count:0,
    month_everyday_completed_count:0,
    month_limitTime_completed_count:0,
    month_title:0,
  },
  onClick_loadChart:function(){
    this.onShow()

    wx.showToast({
      icon:'none',
      title: '本月图表加载完毕',
    })
  },
  getTaskLogs_useTime(time){
    var result = []
    var tasks = wx.getStorageSync('tasks') || []
    for(var i in tasks){
      if(tasks[i].time.indexOf(time)>=0)
        result.push(tasks[i])
    }
    return result;
  },
  fill_month_completed_count(month_taskLogs){
    var month_today_completed_count = 0
    var month_everyday_completed_count = 0
    var month_limitTime_completed_count = 0
    for(var i in month_taskLogs){
      month_today_completed_count += parseInt(month_taskLogs[i].types.today_completed_count)
      month_everyday_completed_count += parseInt(month_taskLogs[i].types.everyday_completed_count)
      month_limitTime_completed_count += parseInt(month_taskLogs[i].types.limitTime_completed_count)
    }

    this.setData({
      month_today_completed_count:month_today_completed_count,
      month_everyday_completed_count:month_everyday_completed_count,
      month_limitTime_completed_count:month_limitTime_completed_count
    })
  },
  fill_month_title:function(time){
    this.setData({month_title:time})
  },
  update_column_chart:function(month_taskLogs){
    var data_today_completed_count=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    var data_everyday_completed_count=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    var data_limitTime_completed_count=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    for(var i in month_taskLogs){
      var time = parseInt(month_taskLogs[i].time.substr(8,2))-1 //数组基0
      data_today_completed_count[time]=parseInt(month_taskLogs[i].types.today_completed_count)
      data_everyday_completed_count[time]=parseInt(month_taskLogs[i].types.everyday_completed_count)
      data_limitTime_completed_count[time]=parseInt(month_taskLogs[i].types.limitTime_completed_count)
    }

    //调用页面更新柱状图函数
    updateChart_column(data_today_completed_count,data_everyday_completed_count,data_limitTime_completed_count)
  },
  update_pie_chart:function(month_taskLogs){
    //获取所有类型{默认消费类:0,饮食:0}
    var month_task_types = []
    var task_types = wx.getStorageSync('task_types') || []
    for(var i in task_types){
      month_task_types[task_types[i].text]=0
    }

    //统计每种类型 month_task_types[类型名]++
    for(var i in month_taskLogs){
      for(var j in month_taskLogs[i].types){
        if(j.indexOf('_')>=0) //跳过完成
          continue;
        for(var k in month_taskLogs[i].types[j]){
          var taskLogsData = month_taskLogs[i].types[j][k] //具体的任务
          if(taskLogsData!=null && taskLogsData.completed)
            month_task_types[taskLogsData.type]++
        }
      }
    }

    //拼装datas
    var datas = []
    for(var i in month_task_types){
      datas.push({
        name:i,
        value: month_task_types[i]
      })
    }

    //调用页面更新饼图函数
    updateChart_pie(datas)
  },
  onShow:function(){
    var time = util.formatTime(new Date()).split(' ')[0]
    var yearAndMonth = time.substr(0,7) //2020/02

    //填充时间
    this.fill_month_title(time)
    //获取本月taskLogs
    var month_taskLogs = this.getTaskLogs_useTime(yearAndMonth)
    //填充月完成量
    this.fill_month_completed_count(month_taskLogs)
    //更新柱状图
    this.update_column_chart(month_taskLogs)
    //更新饼图
    this.update_pie_chart(month_taskLogs)
  },
  timeChoose:function(e){
    var time = util.formatTime(new Date(e.detail)).split(' ')[0]
    var yearAndMonth = time.substr(0,7)

    //填充时间
    this.fill_month_title(yearAndMonth)
    //获取本月spendLogs
    var month_taskLogs = this.getTaskLogs_useTime(yearAndMonth)
    //填充月收入和月支出
    this.fill_month_completed_count(month_taskLogs)
    //更新柱状图
    this.update_column_chart(month_taskLogs)
    //更新饼图
    this.update_pie_chart(month_taskLogs)

    this.onClose_timeChoose_popup()

    wx.showToast({
      icon:'none',
      title: '本月图表加载完毕',
    })
  },
  onInput_timeChoose:function(event) {
    this.setData({
      currentDate: event.detail
    });
  },
  onClick_timeChoose:function(){
    this.setData({show_timeChoose_popup:true,canvas_height:0})
  },
  onClose_timeChoose_popup:function(){
    this.setData({show_timeChoose_popup:false,canvas_height:400})
  },
})