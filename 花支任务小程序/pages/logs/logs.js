//logs.js
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    page: 1, //page*40个数据
    logs: [],
    signs:[],
    nowDayLogs:[],
    nowDaySigns:[],
  },

  click:function(e){
    //console.log(e.target.id)
    var tempNowDayTaskLogs = wx.getStorageSync('nowDayLogs') || []
    var msg = tempNowDayTaskLogs[e.target.id].substring(1)
    var that = this
    wx.showModal({
      title: '删除记录',
      content: msg,
      confirmText:"yes",
      cancelText:"no",
      success:function(res){
        if(res.confirm){
          tempNowDayTaskLogs.splice(e.target.id,1)
          wx.setStorageSync('nowDayLogs', tempNowDayTaskLogs)
          wx.showToast({
            icon:'none',
            title: '删除成功',
            duration:1000,
          })

          that.onShow()
        }
      }
    })
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
  }
})
