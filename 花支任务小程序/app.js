// {
//   "text": "行程",
//   "pagePath": "pages/appointment/appointment",
//   "iconPath": "/photos/yh.png",
//   "selectedIconPath": "/photos/syh.png"
// },

//app.js
var util = require('/utils/util.js'); 

App({
  data:{
  },

  onLaunch: function () {
    //提取日(myDate[0])
    var time = util.formatTime(new Date()) 
    var needPrintTime=time.split(" ")[0]  
    var date = time.split("/")
    var myDate = date[2].split(" ")
    
    //wx.setStorageSync('myDate', '15')

    //日期变更
    if (!(wx.getStorageSync('myDate') === myDate[0]) && !(wx.getStorageSync('myDate') == "")){
      
      //把今天的任务加入历史任务
      var taskLogs = wx.getStorageSync('taskLogs')||[]
      var nowDayTaskLogs = wx.getStorageSync('nowDayTaskLogs')||[]
      for (var i in nowDayTaskLogs)
        taskLogs.unshift(nowDayTaskLogs[nowDayTaskLogs.length-i-1])
      wx.setStorageSync('taskLogs', taskLogs)

      //删除今天已经完成的任务
      var tempTasks = wx.getStorageSync('tasks') || []
      var tempCompeleteSign = wx.getStorageSync('compeleteSign') || []
      var tempChecked = wx.getStorageSync('checked') || []
      var tempOpacity = wx.getStorageSync('opacityColumn')||[]
      var tempShowButtons = wx.getStorageSync('showButtons') || []
      var tempAnimation = wx.getStorageSync('animation') || []
      for (var i in tempTasks){
        while (tempChecked[i]){
          tempTasks.splice(i, 1)
          tempCompeleteSign.splice(i, 1)
          tempChecked.splice(i, 1)
          tempOpacity.splice(i,1)
          tempShowButtons.splice(i,1)
          tempAnimation.splice(i,1)
        }
      }
      wx.setStorageSync('showButtons', tempShowButtons)
      wx.setStorageSync('animation', tempAnimation)
      wx.setStorageSync('opacityColumn', tempOpacity)
      wx.setStorageSync('tasks', tempTasks)
      wx.setStorageSync('compeleteSign', tempCompeleteSign)
      wx.setStorageSync('checked', tempChecked)

      //复原日常任务
      var tempTasks = wx.getStorageSync('dayTasks') || []
      var tempCompeleteSign = wx.getStorageSync('dayCompeleteSign') || []
      var tempChecked = wx.getStorageSync('dayChecked') || []
      var tempOpacity = wx.getStorageSync('dayOpacityColumn') || []
      var dayShowButtons = wx.getStorageSync('dayShowButtons') || []
      var dayAnimation = wx.getStorageSync('dayAnimation') || []
      for (var i in tempTasks){
        dayShowButtons[i] = false
        dayAnimation[i] = ""
        while (tempChecked[i]) {
          tempCompeleteSign[i]=""
          tempChecked[i]=false
          tempOpacity[i]=""
          dayShowButtons[i] = false
          dayAnimation[i] = ""
        }
      }
      wx.setStorageSync('dayAnimation', dayAnimation)
      wx.setStorageSync('dayShowButtons', dayShowButtons)
      wx.setStorageSync('dayOpacityColumn', tempOpacity)
      wx.setStorageSync('dayCompeleteSign', tempCompeleteSign)
      wx.setStorageSync('dayChecked', tempChecked)

      //把今天的账单加入历史账单
      var tempNowDay = wx.getStorageSync('nowDayLogs') || []
      var tempLogs = wx.getStorageSync('logs') || []
      for (var i in tempNowDay)
        tempLogs.unshift(tempNowDay[tempNowDay.length-i-1])
      wx.setStorageSync('logs', tempLogs)
      wx.removeStorageSync('nowDayLogs')
    }
    
    //与本地缓存比较,改变了就输出一下日期
    if (wx.getStorageSync('myDate') == "" || !(wx.getStorageSync('myDate') === myDate[0])){
      var logs = wx.getStorageSync('nowDayLogs') || []
      logs.unshift("t"+needPrintTime)

      //更新本地缓存
      wx.setStorageSync('nowDayTaskLogs', logs)
      wx.setStorageSync('nowDayLogs', logs)
      wx.setStorageSync('myDate', myDate[0])
    }
  },
  
  globalData:{
  },
})