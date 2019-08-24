const util = require('../../utils/util.js')
const app = getApp()

Page({
  data:{
    page: 1, //page*20个数据
    
    nowDayTaskLogs:[],
    nowDayIsDate:[],

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

  //触底多显示page*20条数据
  onReachBottom: function () {
    if (this.data.taskLogs.length > this.data.page * 20) {
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
  }
})