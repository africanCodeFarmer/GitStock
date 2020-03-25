// month_free_count 每月可以不打卡次数

import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data: {
    custom_data:{"backText":"主页","content":"设置"},
    month_free_count:0,
  },
  onShow:function(){
    var month_free_count = wx.getStorageSync('month_free_count') || 10
    this.setData({month_free_count:month_free_count})
  },
  onChange_month_free_count:function(e){
    this.setData({month_free_count:e.detail})
  },
  update_month_free_count:function(){
    wx.setStorageSync('month_free_count', this.data.month_free_count)
    wx.showToast({
      icon:'none',
      title: '已更新每月可不打卡次数',
    })
  },
})