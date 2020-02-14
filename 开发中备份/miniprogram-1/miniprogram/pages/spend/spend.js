const app = getApp()

Page({
  data:{
    money_blocks:[5,10,15,20,25,30,50,100,200,300,500,1000],
    stocks:{},
    show_money_popup:false,
    comments:{},
  },
  addMoney:function(){
    this.setData({show_money_popup:true,})
  },
  reduceMoney:function(){
    this.setData({show_money_popup:true,})
  },
  onClose_money_popup:function(){
    this.setData({show_money_popup:false})
  },
  onShow:function(){
    this.getTabBar().init();
    var stocks = wx.getStorageSync('stocks') || []
    var comments = wx.getStorageSync('comments') || []
    this.setData({
      stocks:stocks,
      comments:comments,
    })
  },
  stock_setting:function(){
    wx.navigateTo({
      url: 'stock_setting/stock_setting',
    })
  },
})
