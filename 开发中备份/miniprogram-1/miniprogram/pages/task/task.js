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

    editing:false,
    editID:0,
    editTaskTitle:"",
  },
  go_update:function(e){
    var id = this.data.editID
    var task_title = this.data.editTaskTitle
    var tasks = this.data.tasks
    var specificTasks = tasks[0].types[task_title]
    var time = util.formatTime(new Date())
    //实行更新
    for(var i in specificTasks){
      if(specificTasks[i].id == id){
        specificTasks[i].name = this.data.task_name
        specificTasks[i].duration = this.data.task_duration
        specificTasks[i].color = this.data.task_color
        specificTasks[i].type = this.data.task_type
        specificTasks[i].icon = this.getTaskType_useText(this.data.task_type).icon
        specificTasks[i].create_time = time
        break;
      }
    }
    tasks[0].types[task_title] = specificTasks
    wx.setStorageSync('tasks', tasks)

    this.setData({
      tasks:tasks,
      editing:false,
      editID:0,
      editTaskTitle:"",
    })
    this.reset()
    this.onClose_add_task_popup();
  },
  fillInput:function(title,id){
    var tasks = this.data.tasks
    var specificTasks = tasks[0].types[title]
    for(var i in specificTasks){
      if(specificTasks[i].id == id){
        var task = specificTasks[i]
        var task_type = this.getTaskType_useText(task.type)
        var task_types = this.data.task_types
        
        //填充类型
        for(var i in task_types){
          if(task_types[i].text == task_type.text){
            this.setData({choose_task_type:i})
            break;
          }
        }
        //填充其他
        this.setData({
          task_duration:task.duration,
          task_color:task.color,
          task_name:task.name,
          task_name_error:false,
          task_type:task_type.text
        })
        break;
      }
    }
  },
  edit:function(e){
    var id = e.target.id
    var task_title = e.target.dataset.title
    this.fillInput(task_title,id) //获取对象填充

    this.setData({
      show_add_task_popup:true,
      editing:true,
      editID:id,
      editTaskTitle:task_title,
    })
  },
  delete:function(e){
    var id = e.target.id
    var task_title = e.target.dataset.title //today
    var tasks = this.data.tasks
    var specificTasks = tasks[0].types[task_title]
    for(var i in specificTasks){
      if(specificTasks[i].id==id){
        specificTasks.splice(i,1)
        break;
      }
    }
    tasks[0].types[task_title] = specificTasks
    wx.setStorageSync('tasks', tasks)
    this.setData({tasks:tasks})
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
      id:tasks[0].types[dayIndex].length>0?(tasks[0].types[dayIndex].length+1):1,
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
    tasks[0].types[dayIndex].unshift(task)
    
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
      editing:false,
      editID:0,
      editTaskTitle:"",
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
    if(tasks.length==0 || tasks[0].time != yearMonthDay){
      tasks.unshift({
        time:yearMonthDay,
        types:{
          today:[],
          everyday:[],
          limitTime:[],
        }
      })
    }
    // else{ //日期变更了 
    //   //today新日期 复制今日未完成任务 旧日期 删除未完成任务
    //   //everyday新日期 全部复制,清除完成状态 旧日期 删除未完成任务
    //   //limitTime新日期 复制未完成任务 旧日期 删除未完成任务
    // }
    
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
