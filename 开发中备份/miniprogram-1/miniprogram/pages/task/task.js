const app = getApp()

Page({
  data:{
    active_tab :0,
  },
  onShow:function(){
    this.getTabBar().init();
  },
  task_setting:function(){
    wx.navigateTo({
      url: 'task_setting/task_setting',
    })
  },
})
