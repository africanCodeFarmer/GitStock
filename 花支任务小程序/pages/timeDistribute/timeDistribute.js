var util = require('../../utils/util.js'); 

Page({
  data:{
    //hideButton:"display:none;",
    taskCount:0,
    
    hour:0,
    
    //时间分配行
    columns:["","","","","","","","","","","","","","","","","",""],
    distributes:[],
    //border-bottom:1px solid gray;
    
    //显示任务 相关
    notCheckedTasks:[],
    tasksGrade:[],

    showTaskView:false,

    animation:'',

    scrollTop: 0,
  },

  onLoad:function(){
    this.animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
    })
  },

  closeTaskView:function(){
    this.animation.opacity(0).translateY(6).step({ duration: 200 })
    this.setData({
      animation: this.animation.export(),
    })

    var that = this
    setTimeout(function(){
      that.setData({
        showTaskView: false
      })
    },200)
  },

  //显示任务窗口
  showTask:function(){
    var grade=[]
    var temp =[]
    var tasks = wx.getStorageSync('tasks') || []
    var checked = wx.getStorageSync('checked') || []

    var dayTasks = wx.getStorageSync('dayTasks') || []
    var dayChecked = wx.getStorageSync('dayChecked') || []

    for(var i in tasks)
      if(!checked[i]){
        temp.push(tasks[i].substring(1))
        grade.push(tasks[i].substring(0,1))
      }

    for (var i in dayTasks)
      if (!dayChecked[i]) {
        temp.push(dayTasks[i].substring(1))
        grade.push(dayTasks[i].substring(0, 1))
      }

    this.setData({
      notCheckedTasks:temp,
      showTaskView:true,
      tasksGrade:grade,
      taskCount: temp.length
    })

    this.animation.opacity(1).translateY(-6).step({ duration: 200 })
    this.setData({
      animation: this.animation.export(),
    })
  },

  //清空单栏
  wantClearColumn:function(e){
    var tempDis = this.data.distributes
    tempDis[e.target.id]="",
    this.setData({
      distributes: tempDis
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
    //获取当前时间
    var datestamp = util.formatTime(new Date())
    var time = datestamp.split(" ")[1]
    var hour = time.split(":")[0]

    this.setData({
      distributes: wx.getStorageSync('timeDistribute') || [],
      hour: hour
    })
  },

  //返回按钮
  wantBack:function(){
    wx.navigateBack({})
  },

  // onTabItemTap(item) {
  //   if(item.text=='规划'){
  //     if (this.data.hideButton==""){
  //       this.setData({
  //         hideButton:"display:none;",
  //       })
  //       // wx.showToast({
  //       //   title: '隐藏了',
  //       // })
  //     }
  //     else{
  //       this.setData({
  //         hideButton: "",
  //       })
  //       // wx.showToast({
  //       //   title: '显示了',
  //       // })
  //     }
  //   }
  // },

  // startScroll:function(){
  //   wx.showToast({
  //     title: '滑动了',
  //   })
  // }
})