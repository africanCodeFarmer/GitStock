const app = getApp()
var util = require('../public/public.js');

Page({
  data:{
    active_tab :0,

    task_title:"today",

    show_add_task_popup:false,
    task_colors:[],
    task_durations:[],
    task_types:[],

    task_duration:0,
    task_color:"#000000",
    task_name:null,
    task_name_error:false,
    choose_task_type: 0,
    task_type:"", //.text

    tasks:[],
  },
  getTaskType_useText(text){
    var task_types = this.data.task_types
    for(var i in task_types)
      if(task_types[i].text == text)
        return task_types[i];
  },
  go_add:function(e){
    if(this.data.task_name==null){
      this.setData({
        task_name_error:true
      })
      return;
    }

    var tasks = this.data.tasks
    var dayIndex = this.data.task_title
    var time = util.formatTime(new Date()).split(' ')[0]
    tasks = this.tasks_checkUpdateTime(tasks) //检测一下时间
    var taskTime = util.formatTime(new Date())
    var task = {
      id:tasks[0][dayIndex].length>0?(tasks[0][dayIndex].length+1):1,
      completed:false,
      name:this.data.task_name,
      color:this.data.task_color,
      create_time:taskTime,
      type:this.data.task_type,
      icon:this.getTaskType_useText(this.data.task_type).icon,
      duration:this.data.task_duration,
      count:0,
      remain_time:"",
      complete_time:"",
    }
    tasks[0][dayIndex].unshift(task)
    
    wx.setStorageSync('tasks', tasks)
    this.setData({
      tasks:tasks
    })

    this.reset()
    this.onClose_add_task_popup()
  },
  reset:function(){
    this.setData({
      task_duration:0,
      task_color:"#000000",
      task_name:null,
      task_name_error:false,
      task_type:this.data.task_types[0].text, //.text
      choose_task_type:0,
    })
  },
  update_task_name:function(e){
    this.setData({task_name:e.detail})
  },
  onClickNav:function(e){
    var index = e.detail.index
    var task_type = this.data.task_types[index]
    this.setData({
      task_type:task_type.text,
      choose_task_type:index
    })
  },
  onClick_task_duration_block:function(e){
    var duration = e.target.dataset.value
    this.setData({task_duration:duration})
  },
  onClick_task_color:function(e){
    var color = e.target.dataset.color
    this.setData({
      task_color:color,
    })
  },
  onClick_addTask:function(){
    this.setData({
      show_add_task_popup:true,
    })
  },
  onClose_add_task_popup:function(){
    this.setData({
      show_add_task_popup:false,
    })
  },
  onChange_tab:function(e){
    var title = e.detail.title
    this.setData({
      task_title:title,
    })
  },
  //日期变更时更新tasks json
  tasks_checkUpdateTime:function(tasks){
    var yearMonthDay = util.formatTime(new Date()).split(' ')[0]
    if(tasks.length==0 || tasks[0].time !=yearMonthDay){
      tasks.unshift({
        time:yearMonthDay,
        today:[],
        everyday:[],
        limitTime:[],
      })
    }
    wx.setStorageSync('tasks', tasks)
    return tasks;
  },
  onShow:function(){
    this.getTabBar().init();

    var tasks = wx.getStorageSync('tasks') || []
    tasks = this.tasks_checkUpdateTime(tasks)
    var task_types = wx.getStorageSync('task_types') || []
    var task_type = task_types[0].text
    var task_durations = wx.getStorageSync('task_durations') || []
    var task_colors = wx.getStorageSync('task_colors') || []
    this.setData({
      task_colors:task_colors,
      task_durations:task_durations,
      task_types:task_types,
      task_type:task_type,
      tasks:tasks,
    })
  },
  task_setting:function(){
    wx.navigateTo({
      url: 'task_setting/task_setting',
    })
  },
})
