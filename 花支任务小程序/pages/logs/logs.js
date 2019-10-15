//logs.js
const util = require('../../utils/util.js')
const app = getApp()
const wxCharts = require('../../utils/wxcharts.js');
var windowW = 0;

Page({
  data: {
    animationCharts:"",

    page: 1, //page*40个数据

    //历史账单
    logs: [],
    signs:[],

    //今日账单
    nowDayLogs:[],
    nowDaySigns:[],

    input_note:"",
    showChangeView:false,
    changeId:"", //前缀 n今日 h历史
    animation:"",
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

  //修改功能
  goChange: function (e) {
    //console.log(e.detail.value["input_note"])

    var nowDayLogs = wx.getStorageSync('nowDayLogs') || []
    var logs = wx.getStorageSync('logs') || []

    var str = e.detail.value["input_note"]
    var profix = this.data.changeId.substring(0, 1)
    var id = this.data.changeId.substring(1)

    if (profix == 'n') {
      // var temp = nowDayLogs[id].split(":")
      // temp[3]=str
      // nowDayLogs[id] = temp.join(":")
      nowDayLogs[id] = str
      wx.setStorageSync('nowDayLogs', nowDayLogs)
    }
    else {
      // var temp = logs[id].split(":")
      // temp[3] = str
      // logs[id] = temp.join(":")
      logs[id] = str
      wx.setStorageSync('logs', logs)
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
  delete:function(){
    var that = this

    var nowDayLogs = wx.getStorageSync('nowDayLogs') || []
    var logs = wx.getStorageSync('logs') || []

    var profix = that.data.changeId.substring(0, 1)
    var id = that.data.changeId.substring(1)

    var msg = ""
    if (profix == 'n') 
      msg = nowDayLogs[id]
    else 
      msg = logs[id]

    var that = this
    wx.showModal({
      title: '删除',
      content: msg+' ?',
      confirmText:'yes',
      cancelText:'no',
      success:function(res){
        if(res.confirm){
          if (profix == 'n') {
            nowDayLogs.splice(id, 1)
            wx.setStorageSync('nowDayLogs', nowDayLogs)
          }
          else {
            logs.splice(id, 1)
            wx.setStorageSync('logs', logs)
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

  //关闭更改视图
  closeChangeView:function(){
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

  //显示更改窗口 //nh id前缀
  click: function (e) {
    var nowDayLogs = wx.getStorageSync('nowDayLogs') || []
    var logs = wx.getStorageSync('logs') || []
    
    var profix = e.target.id.substring(0,1)
    var id = e.target.id.substring(1)
    var tempInputNote = ""
    
    if(profix=='n'){
      tempInputNote = nowDayLogs[id]
    }
    else
      tempInputNote = logs[id]

    //input_note: tempInputNote.split(":")[3] || "",
    this.setData({
      input_note: tempInputNote,
      changeId:e.target.id,
      showChangeView: true
    })

    this.animation.opacity(1).step({ duration: 200 })
    this.setData({
      animation: this.animation.export(),
    })

    //console.log(e.target.id)
    this.onShow()
  },

  //输出日志
  onShow: function () {
    //columnCanvas 生成
    // new wxCharts({
    //   canvasId: 'columnCanvas',
    //   type: 'column',
    //   animation: false,
    //   legend: false,
    //   categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    //   series: [
    //     {
    //       name: '日完成数',
    //       data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    //       format: function (val, name) {
    //         return val.toFixed(0) + '';
    //       }
    //     },
    //     // {
    //     //   name: '成交量',
    //     //   data: [6.00, 9.00, 20.00, 45.00],
    //     //   format: function (val, name) {
    //     //     return val.toFixed(2) + '万';
    //     //   }
    //     // }
    //   ],
    //   yAxis: {
    //     // format: function (val) {
    //     //   return val + '万';
    //     // },
    //     // title: 'hello',
    //     min: 0
    //   },
    //   xAxis: {
    //     disableGrid: false,
    //     type: 'calibration'
    //   },
    //   extra: {
    //     column: {
    //       width: 4
    //     }
    //   },
    //   width: (375 * windowW),
    //   height: (200 * windowW),
    // });

    //lineCanvas
    new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      legend: false,
      categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
      animation: false,
      series: [
        {
          name: '成交量1',
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          format: function (val, name) {
            return val.toFixed(0) + '';
          }
        }, 
        // {
        //   name: '成交量2',
        //   data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
        //   format: function (val, name) {
        //     return val.toFixed(2) + '万';
        //   }
        // }
      ],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: (375 * windowW),
      height: (200 * windowW),
      dataLabel: true,
      dataPointShape: true,
      extra: {
      }
    });

    //判断日期变更
    var time = util.formatTime(new Date())
    var needPrintTime = time.split(" ")[0]
    var date = time.split("/")
    var myDate = date[2].split(" ")
    if (!(wx.getStorageSync('myDate') === myDate[0]) && !(wx.getStorageSync('myDate') == ""))
      app.onLaunch()

    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return log.substring(1)
      }),
      signs: (wx.getStorageSync('logs') || []).map(log => {
        return log.substring(0,1)
      }),
      
      nowDayLogs: (wx.getStorageSync('nowDayLogs') || []).map(log => {
        return log.substring(1)
      }),
      nowDaySigns: (wx.getStorageSync('nowDayLogs') || []).map(log => {
        return log.substring(0, 1)
      }),
    })
  },

  //清空日志
  clearLogs:function(){
    var that = this
    wx.showModal({
      title: '',
      content: '确认清空账单?',
      confirmText:"yes",
      cancelText:'no',
      success:function(res){
        if(res.confirm){
          wx.removeStorageSync('logs')
          wx.removeStorageSync('nowDayLogs')

          //重新写入日期
          var logs = []
          var time = util.formatTime(new Date())
          var needPrintTime = time.split(" ")[0]
          logs.unshift("t" + needPrintTime)
          wx.setStorageSync('nowDayLogs', logs)

          that.onShow()

          wx.showToast({
            icon:'none',
            title: '清空成功',
            duration:1000,
          })
        }
      }
    })
  },

  //触底多显示page*40条数据
  onReachBottom:function(){
    if(this.data.logs.length>this.data.page*40){
      var tempPage = parseInt(this.data.page)
      tempPage +=1
      this.setData({
        page:tempPage
      })
    }
    else{
      wx.showToast({
        icon:'none',
        title: '没有更多数据啦',
        duration:1000,
      })
    }
  },

  showChartsView: function () {
    this.setData({
      showChartsView: true,
    })

    var that = this
    setTimeout(function () {
      that.animationCharts.opacity(1).translateY(-6).step({ duration: 200 })
      that.setData({
        animationCharts: that.animationCharts.export(),
      })
    }, 200);
  },

  closeChartsView: function () {
    this.animationCharts.opacity(0).translateY(6).step({ duration: 200 })
    this.setData({
      animationCharts: this.animationCharts.export(),
    })

    var that = this
    setTimeout(function () {
      that.setData({
        showChartsView: false
      })
    }, 200)
  }
})
