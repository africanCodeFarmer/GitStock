//app.js
App({
  globalData:{
    StatusBar:null,
    Custom:null,
    CustomBar:null,
  },
  fill_default_spend_type:function(){
    var spend_types = wx.getStorageSync('types') || []
    if(spend_types.length==0){
      spend_types.push({
        id:'1',
        text:'默认消费类',
        icon:"question"
      })
      wx.setStorageSync('types', spend_types)
    }
  },
  onLaunch: function () {
    this.fill_default_spend_type() //填充默认消费类型

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
  }
})
