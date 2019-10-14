const util = require('../../utils/util.js')
const app = getApp()

Page({
  data:{
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
})