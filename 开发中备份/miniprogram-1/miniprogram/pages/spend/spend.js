const app = getApp()

Page({
  data:{
    stocks:{},
  },
  onShow:function(){
    this.getTabBar().init();
    var stocks = wx.getStorageSync('stocks') || []
    this.setData({stocks:stocks})
  },
  stock_setting:function(){
    wx.navigateTo({
      url: 'stock_setting/stock_setting',
    })
  },
})
