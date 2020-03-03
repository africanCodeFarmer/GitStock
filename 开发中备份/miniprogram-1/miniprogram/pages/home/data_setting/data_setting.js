import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp()

Page({
  data: {
    custom_data:{"backText":"主页","content":"全局管理"},

    theme:"",
  },
  toggle_theme:function(){
    Dialog.confirm({
      title: '主题',
      message:'确定切换主题?',
    }).then(() => {
      // on confirm
      var theme = this.data.theme=='day'?'night':'day'
      
      app.globalData.theme = theme
      app.globalData.bgColor = theme=='night'?'bg-black':'bg-gradual-blue'
      
      wx.setStorageSync('theme', theme)
      this.setData({theme:theme})

      wx.reLaunch({
        url: '../../home/home',
      })

      wx.showToast({
        icon:'none',
        title: '切换成功',
      })
    }).catch(() => {
      // on cancel
    });
  },
  onShow:function(){
    var theme = wx.getStorageSync('theme') || "night"
    this.setData({theme:theme})
  },
  onLoad:function(){
    //设置导航栏颜色
    var custom_data = this.data.custom_data
    custom_data['bgColor'] = getApp().globalData.bgColor
    this.setData({
      custom_data:custom_data
    })
  },
  onClick_clear_tasks:function(){
    Dialog.confirm({
      title: '清空',
      message: '删除任务日志所有数据!?'
    }).then(() => {
      // on confirm
      var tasks = wx.getStorageSync('tasks') || []
      for(var i in tasks)
        if(i!=0)
          tasks.splice(i,1)
      wx.setStorageSync('tasks', tasks)

      wx.showToast({
        icon:'none',
        title: '已清空任务日志',
      })
    }).catch(() => {
      // on cancel
    });
  },
  onClick_clearAll:function(){
    Dialog.confirm({
      title: '清空',
      message: '删除所有数据!?\n删除所有数据!?\n删除所有数据!?'
    }).then(() => {
      // on confirm
      wx.clearStorageSync()
      app.onLaunch()

      wx.showToast({
        icon:'none',
        title: '已清空所有数据',
      })
    }).catch(() => {
      // on cancel
    });
  },
  onClick_clear_spendLogs:function(){
    Dialog.confirm({
      title: '清空',
      message: '删除花支日志所有数据!?'
    }).then(() => {
      // on confirm
      wx.removeStorageSync('spendLogs')

      wx.showToast({
        icon:'none',
        title: '已清空花支日志',
      })
    }).catch(() => {
      // on cancel
    });
  },
})