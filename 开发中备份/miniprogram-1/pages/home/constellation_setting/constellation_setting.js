import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data: {
    custom_data:{"backText":"主页","content":"星座运势设置"},
    constellation:null,
  },
  update_constellation:function(){
    var that = this

    //读取存入
    var constellation = this.data.constellation
    wx.request({
      url: 'http://web.juhe.cn:8080/constellation/getAll?key=af7471c6fa64da6b5632120547707948&consName='+constellation+'&type=today',
      data: {
      },
      header: {
        'key':'af7471c6fa64da6b5632120547707948',
      },
      success: function(res) {
        wx.setStorageSync('constellationData', res.data)
        wx.setStorageSync('constellation', that.data.constellation)

        wx.showToast({
          icon:'none',
          title: '更新我的星座成功',
        })
      },
      fail:function(){
        wx.showToast({
          icon:'none',
          title: '读取接口数据出错,请重新确定',
        })
      }
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