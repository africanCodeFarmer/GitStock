import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data: {
    custom_data:{"backText":"主页","content":"全局数据管理"}
  },
  onClick_updateSpendLogsValues:function(){
    wx.showLoading({
      title: '优化花支日志金额格式中...',
      mask:true,
    })

    var spendLogs = wx.getStorageSync('spendLogs') || []
    for(var i in spendLogs){
      for(var j in spendLogs[i].datas){
        spendLogs[i].datas[j].value = parseFloat(spendLogs[i].datas[j].value)
      }
    }
    wx.setStorageSync('spendLogs', spendLogs)

    wx.hideLoading({
      complete: (res) => {},
    })
    wx.showToast({
      icon:'none',
      title: '优化完毕',
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