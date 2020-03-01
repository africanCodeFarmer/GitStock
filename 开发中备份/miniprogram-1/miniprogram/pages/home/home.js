const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data:{
    // steps: [
    //   {
    //     text: '步骤一',
    //     desc: '描述信息'
    //   },
    //   {
    //     text: '步骤二',
    //     desc: '描述信息'
    //   },
    //   {
    //     text: '步骤三',
    //     desc: '描述信息'
    //   },
    //   {
    //     text: '步骤四',
    //     desc: '描述信息'
    //   }
    // ]
  },
  onShow:function(){
    this.getTabBar().init()
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
