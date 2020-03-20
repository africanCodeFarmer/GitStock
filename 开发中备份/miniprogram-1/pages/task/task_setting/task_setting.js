Page({
  data: {
    custom_data:{"backText":"任务","content":"设置"},
    show_task_popup:"",
  },
  onClick_toggle_showAllTasks:function(){
    var show_task_popup = this.data.show_task_popup==false?true:false
    wx.setStorageSync('show_task_popup', show_task_popup)
    this.setData({show_task_popup:show_task_popup})
  },
  onShow:function(){
    var show_task_popup = wx.getStorageSync('show_task_popup') || false
    this.setData({show_task_popup:show_task_popup})
  },
})