//logs.js
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    page: 1, //page*20个数据
    logs: [],
    signs:[],
    nowDayLogs:[],
    nowDaySigns:[],
  },

  //输出日志
  onShow: function () {

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

  //触底多显示page*20条数据
  onReachBottom:function(){
    if(this.data.logs.length>this.data.page*20){
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
  }
})
