const util = require('../../utils/util.js')
const app = getApp()
const wxCharts = require('../../utils/wxcharts.js');
var windowW = 0;

Page({
  data:{
    month:"0",
    animationCharts:"",
    dayCompeleteDataArray: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

    showChartsView:"none",

    page: 1, //page*40个数据
    
    animation:"",

    input_note:"",
    changeId:0,
    showChangeView:false,

    //今日任务日志
    nowDayTaskLogs:[],
    nowDayIsDate:[],

    //历史完成日志
    taskLogs:[],
    taskLogsIsDate:[],
  },

  //恢复出厂设置
  clearAllStorage:function(){
    var that = this
    wx.showModal({
      title: '',
      content: '清空所有数据?',
      confirmText:'yes',
      cancelText:'no',
      success:function(res){
        if(res.confirm){
          wx.clearStorageSync()
          wx.showToast({
            icon: 'none',
            title: '清空成功',
            duration: 1000,
          })

          app.onLaunch()
          that.onShow()
        }
      }
    })
  },

  click:function(e){
    // console.log(e.currentTarget.id);
    // var nowDayTaskLogs = wx.getStorageSync('nowDayTaskLogs') || []
    // var taskLogs = wx.getStorageSync('taskLogs') || []
    // var profix = e.currentTarget.id.substring(0, 1)
    // var id = e.currentTarget.id.substring(1)

    var nowDayTaskLogs = wx.getStorageSync('nowDayTaskLogs') || []
    var taskLogs = wx.getStorageSync('taskLogs') || []

    var profix = e.currentTarget.id.substring(0, 1)
    var id = e.currentTarget.id.substring(1)
    var tempInputNote = ""

    if (profix == 'n') {
      tempInputNote = nowDayTaskLogs[id]
    }
    else
      tempInputNote = taskLogs[id]

    //input_note: tempInputNote.split(":")[3] || "",
    this.setData({
      input_note: tempInputNote,
      changeId: e.currentTarget.id,
      showChangeView: true
    })

    this.animation.opacity(1).step({ duration: 200 })
    this.setData({
      animation: this.animation.export(),
    })

    //console.log(e.target.id)
    this.onShow()
  },

  onLoad: function () {
    this.animationCharts = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
    })

    // 屏幕宽度
    this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth
    });
    //console.log(this.data.imageWidth);

    //计算屏幕宽度比列
    windowW = this.data.imageWidth / 375;
    //console.log(windowW);
    
    this.animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
    })

    this.animation.opacity(0).step({ duration: 0 }).opacity(1).step({ duration: 200 })
    this.setData({
      animation: this.animation.export(),
    })
  },

  onShow:function(){
    //统计完成数
    var nowDayTaskLogs = wx.getStorageSync('nowDayTaskLogs') || []
    var nowDayTaskCompeleteCount = 0;
    if (nowDayTaskLogs.length>1)
      nowDayTaskCompeleteCount = nowDayTaskLogs.length-1

    if (nowDayTaskLogs[0].indexOf("_")<0){
      nowDayTaskLogs[0] = nowDayTaskLogs[0] + "_" + nowDayTaskCompeleteCount
      wx.setStorageSync('nowDayTaskLogs', nowDayTaskLogs)
    }

    //lineCanvas
    // new wxCharts({
    //   canvasId: 'lineCanvas',
    //   type: 'line',
    //   legend: false,
    //   categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    //   animation: false,
    //   series: [
    //     {
    //       name: '成交量1',
    //       data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    //       format: function (val, name) {
    //         return val.toFixed(0) + '';
    //       }
    //     }, 
    //     // {
    //     //   name: '成交量2',
    //     //   data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
    //     //   format: function (val, name) {
    //     //     return val.toFixed(2) + '万';
    //     //   }
    //     // }
    //   ],
    //   xAxis: {
    //     disableGrid: true
    //   },
    //   yAxis: {
    //     title: '',
    //     format: function (val) {
    //       return val.toFixed(2);
    //     },
    //     min: 0
    //   },
    //   width: (375 * windowW),
    //   height: (200 * windowW),
    //   dataLabel: true,
    //   dataPointShape: true,
    //   extra: {
    //   }
    // });

    //判断日期变更
    var time = util.formatTime(new Date())
    var needPrintTime = time.split(" ")[0]
    var date = time.split("/")
    var myDate = date[2].split(" ")
    if (!(wx.getStorageSync('myDate') === myDate[0]) && !(wx.getStorageSync('myDate') == ""))
      app.onLaunch()

    this.setData({
      //今天的任务日志
      nowDayTaskLogs: (wx.getStorageSync('nowDayTaskLogs') || []).map(log => {
        return log.substring(1)
      }),
      nowDayIsDate: (wx.getStorageSync('nowDayTaskLogs') || []).map(log => {
        return log.substring(0,1)
      }),

      //历史的任务日志
      taskLogs: (wx.getStorageSync('taskLogs') || []).map(log => {
        return log.substring(1)
      }),
      taskLogsIsDate: (wx.getStorageSync('taskLogs') || []).map(log => {
        return log.substring(0,1)
      }),
    })
  },

  //清空日志按钮
  clearLogs: function () {
    var that = this
    wx.showModal({
      title: '',
      content: '确认清空历史?',
      confirmText: "yes",
      cancelText: 'no',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('taskLogs')

          that.onShow()

          wx.showToast({
            icon: 'none',
            title: '清空完毕',
            duration: 1000,
          })
        }
      }
    })
  },

  //触底多显示page*40条数据
  onReachBottom: function () {
    if (this.data.taskLogs.length > this.data.page * 40) {
      var tempPage = parseInt(this.data.page)
      tempPage += 1
      this.setData({
        page: tempPage
      })
    }
    else{
      wx.showToast({
        icon: 'none',
        title: '没有更多数据啦',
        duration: 1000,
      })
    }
  },

  closeChangeView: function () {
    this.animation.opacity(0).step({ duration: 200 })
    this.setData({
      animation: this.animation.export(),
    })

    var that = this
    setTimeout(function () {
      that.setData({
        showChangeView: false
      })
    }, 200)
  },

  goChange: function (e) {
    //console.log(e.detail.value["input_note"])

    var nowDayTaskLogs = wx.getStorageSync('nowDayTaskLogs') || []
    var taskLogs = wx.getStorageSync('taskLogs') || []

    var str = e.detail.value["input_note"]
    var profix = this.data.changeId.substring(0, 1)
    var id = this.data.changeId.substring(1)

    if (profix == 'n') {
      // var temp = nowDayLogs[id].split(":")
      // temp[3]=str
      // nowDayLogs[id] = temp.join(":")
      nowDayTaskLogs[id] = str
      wx.setStorageSync('nowDayTaskLogs', nowDayTaskLogs)
    }
    else {
      // var temp = logs[id].split(":")
      // temp[3] = str
      // logs[id] = temp.join(":")
      taskLogs[id] = str
      wx.setStorageSync('taskLogs', taskLogs)
    }

    this.animation.opacity(0).step({ duration: 200 })
    this.setData({
      animation: this.animation.export(),
    })

    var that = this
    setTimeout(function () {
      that.setData({
        showChangeView: false
      })

      wx.showToast({
        icon: 'none',
        title: '修改成功',
        duration: 1000,
      })
    }, 200)

    this.onShow()
  },

  //删除功能
  delete: function () {
    var that = this

    var nowDayTaskLogs = wx.getStorageSync('nowDayTaskLogs') || []
    var taskLogs = wx.getStorageSync('taskLogs') || []

    var profix = that.data.changeId.substring(0, 1)
    var id = that.data.changeId.substring(1)

    var msg = ""
    if (profix == 'n')
      msg = nowDayTaskLogs[id]
    else
      msg = taskLogs[id]

    var that = this
    wx.showModal({
      title: '删除',
      content: msg + ' ?',
      confirmText: 'yes',
      cancelText: 'no',
      success: function (res) {
        if (res.confirm) {
          if (profix == 'n') {
            nowDayTaskLogs.splice(id, 1)
            wx.setStorageSync('nowDayTaskLogs', nowDayTaskLogs)
          }
          else {
          taskLogs.splice(id, 1)
            wx.setStorageSync('taskLogs', taskLogs)
          }

          that.animation.opacity(0).step({ duration: 200 })
          that.setData({
            animation: that.animation.export(),
          })

          setTimeout(function () {
            that.setData({
              showChangeView: false
            })
          }, 200)

          wx.showToast({
            icon: 'none',
            title: '删除成功',
            duration: 1000,
          })

          that.onShow()
        }
      }
    })
  },

  showChartsView:function(){
    var nowDayTaskLogs = wx.getStorageSync('nowDayTaskLogs')||[]
    var taskLogs = wx.getStorageSync('taskLogs') || []

    var month = nowDayTaskLogs[0].split("/")[1]
    this.setData({
      month: month
    })

    var days = {};
    var dayCompeleteDataArray = this.data.dayCompeleteDataArray;

    for(var i=1;i<=31;i++){
      days[i]=0
    }

    days[parseInt(nowDayTaskLogs[0].split("/")[2].split("_")[0])] = parseInt(nowDayTaskLogs[0].split("/")[2].split("_")[1]);
    for (var i = 0; i < taskLogs.length;i++){
      if (taskLogs[i].startsWith("t") && taskLogs[i].split("/")[1]==month)
        days[parseInt(taskLogs[i].split("/")[2].split("_")[0])] = parseInt(taskLogs[i].split("/")[2].split("_")[1]);
    }
    console.log(days)

    for (var i = 0; i <= 30;i++){
      dayCompeleteDataArray[i]=days[i+1];
    }
    console.log(dayCompeleteDataArray)
    
    this.setData({
      showChartsView: "",
      dayCompeleteDataArray: dayCompeleteDataArray,
    })

    //显示图表
    //columnCanvas 生成
    var dayCompeleteDataArray = this.data.dayCompeleteDataArray
    new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: false,
      legend: false,
      categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      series: [
        {
          name: '日完成数',
          // data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
          data:dayCompeleteDataArray,
          format: function (val, name) {
            return val=="0"?"":val.toFixed(0);
          }
        },
        // {
        //   name: '成交量',
        //   data: [6.00, 9.00, 20.00, 45.00],
        //   format: function (val, name) {
        //     return val.toFixed(2) + '万';
        //   }
        // }
      ],
      yAxis: {
        // format: function (val) {
        //   return val + '万';
        // },
        // title: 'hello',
        format: function (val) {
          return val.toFixed(0);
        },
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 4
        }
      },
      width: (375 * windowW),
      height: (200 * windowW),
    });

    var that = this
    setTimeout(function () {
      that.animationCharts.opacity(1).translateY(-6).step({ duration: 200 })
      that.setData({
        animationCharts: that.animationCharts.export(),
      })
    },200);
  },

  closeChartsView:function(){
    this.animationCharts.opacity(0).translateY(6).step({ duration: 200 })
    this.setData({
      animationCharts: this.animationCharts.export(),
    })

    var that = this
    setTimeout(function () {
      that.setData({
        showChartsView: "none"
      })
    }, 200)
  }
})