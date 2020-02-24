const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog';

Page({
  onShow:function(){
    this.getTabBar().init()
  },
  onClick_clear:function(){
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
