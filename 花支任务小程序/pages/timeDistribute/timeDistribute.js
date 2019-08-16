Page({
  data:{
    columns:["","","","","","","","","","","","","","","","","","border-bottom:1px solid gray;"],
    distributes:[],
  },

  //清空单栏
  wantClearColumn:function(e){
    var tempDis = this.data.distributes
    tempDis[e.target.id]="",
    this.setData({
      distributes: tempDis
    })
    wx.setStorageSync('timeDistribute', tempDis)

    this.onShow()

    wx.showToast({
      icon:'none',
      title: '清理成功',
      duration:1000,
    })
  },

  //点击清空按钮
  wantClear:function(){
    var that = this
    wx.showModal({
      title: '',
      content: '清空规划?',
      confirmText:'yes',
      cancelText:'no',
      success:function(res){
        if(res.confirm){
          wx.removeStorageSync('timeDistribute')
          that.setData({
            distributes:[],
          })

          that.onShow()

          wx.showToast({
            icon: 'none',
            title: '清空成功',
            duration: 1000,
          })
        }
      }
    })
  },

  //点击更改按钮
  changeDistribute:function(e){
    wx.setStorageSync('timeDistribute', e.detail.value)
    this.onShow()
    
    wx.showToast({
      icon:'none',
      title: '更新成功',
      duration:1000,
    })
  },

  onShow:function(){
    this.setData({
      distributes: wx.getStorageSync('timeDistribute') || []
    })
  },

  wantBack:function(){
    wx.navigateBack({})
  },
})