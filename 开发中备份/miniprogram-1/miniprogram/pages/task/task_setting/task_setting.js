Page({
  data: {
    custom_data:{"backText":"任务","content":"设置"}
  },
  onLoad:function(){
    //设置导航栏颜色
    var custom_data = this.data.custom_data
    custom_data['bgColor'] = getApp().globalData.bgColor
    this.setData({
      custom_data:custom_data
    })
  },
})