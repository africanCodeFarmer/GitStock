// month_free_count 每月可以不打卡次数

import Dialog from '@vant/weapp/dialog/dialog';
const util = require('../../public/public.js')

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
    var plans = wx.getStorageSync('plans') || []
    for(var i in plans)
      plans[i].free_count = this.data.month_free_count

    wx.setStorageSync('month_free_count', this.data.month_free_count)
    wx.setStorageSync('plans', plans)
    wx.showToast({
      icon:'none',
      title: '已更新每月可不打卡次数',
    })
  },
})