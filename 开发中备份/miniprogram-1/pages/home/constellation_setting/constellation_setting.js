import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data: {
    custom_data:{"backText":"主页","content":"星座运势设置"},
    constellation:null,
  },
  update_constellation:function(){
    wx.setStorageSync('constellation', this.data.constellation)
    wx.showToast({
      icon:'none',
      title: '更新我的星座成功',
    })
  },
  onChange_constellation:function(e){
    this.setData({constellation:e.detail})
  },
  onShow:function(){
    var constellation = wx.getStorageSync('constellation') || ''
    this.setData({constellation:constellation})
  }
})