// 任务json
// tasks{
//   time 年月日
//   types{
//     today{
//       id 
//       completed //bool
//       name
//       color
//       create_time //限时任务的create_time是截止时间
//       type 类型
//       icon 
//       duration 整数分钟
//       count 完成次数
//       remain_time 剩余时间
//       complete_time
//     }
//     everyday
//     limitTime
//     today_completed_count
//     everyday_completed_count
//     limitTime_completed_count
//   }
// }

const app = getApp()
var util = require('../public/public.js');
import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data:{
    active_tab :0,

    task_title:"today",

    show_add_task_popup:false,
    task_colors:[],
    task_durations:[],
    task_types:[],

    task_duration:0,
    task_duration_error:false,
    task_color:"",
    task_name:null,
    task_name_error:false,
    choose_task_type: 0,
    task_type:"", //.text

    tasks:[],

    editing:false,
    editID:0,
    editTaskTitle:"",

    showAllTasks:false,
    remain_taskCount:0,

    show_task_popup:false,
  },
  //只排序今日所有任务
  sortTasks:function(){
    var tasks = this.data.tasks
    var task_colors = this.data.task_colors

    var colorLevel = []
    for(var i in task_colors)
      colorLevel[task_colors[i].value]=i

    //升序排列
    if(tasks.length>0)
      for(var i in tasks[0].types){
        if(i.indexOf('_')>=0)
          continue;

        //冒泡排序
        var specificTasks = tasks[0].types[i]
        for(var j=0;j<specificTasks.length;j++){
          for(var k=j+1;k<specificTasks.length;k++){
            var jcolor =  colorLevel[specificTasks[j].color]
            var kcolor =  colorLevel[specificTasks[k].color]
            var jname = specificTasks[j].name[0]
            var kname = specificTasks[k].name[0]
            if(jcolor>kcolor || (jcolor == kcolor && jname < kname)){
              //j k 互换
              var temp = specificTasks[j]
              specificTasks[j] = specificTasks[k]
              specificTasks[k] = temp
            }
          }
        }
        tasks[0].types[i] = specificTasks
      }

    this.setData({tasks:tasks})
    wx.setStorageSync('tasks', tasks)
  },
  onClick_reveal:function(){
    this.setData({show_task_popup:true})
  },
  onClose_task_popup:function(){
    this.setData({show_task_popup:false})
  },
  update_task_duration:function(e){
    this.setData({task_duration:e.detail})
  },
  //显示所有任务 隐藏已完成任务
  onClick_toggle_showTasks:function(){
    var showAllTasks = this.data.showAllTasks==true?false:true

    wx.showToast({
      icon:'none',
      title: showAllTasks?'显示所有任务':'隐藏完成任务',
    })

    this.setData({
      showAllTasks:showAllTasks
    })
  },
  onClick_complete:function(e){
    if(this.data.task_title=='limitTime') //刷新限时任务时间
      this.refresh_limitTime_remain_time()

    var titleAndID = e.target.id
    var dayIndex = titleAndID.split(' ')[0]
    var id = titleAndID.split(' ')[1]
    
    var tasks = this.data.tasks
    tasks = this.tasks_checkUpdateTime(tasks)
    var specificTasks = tasks[0].types[dayIndex]
    
    var day_completed_count_name = dayIndex+"_completed_count"
    //完成或取消完成
    for(var i in specificTasks){
      if(specificTasks[i].id == id){
        if(specificTasks[i].completed==false){
          specificTasks[i].completed = true
          specificTasks[i].complete_time = util.formatTime(new Date()) 
          specificTasks[i].count++
          tasks[0].types[day_completed_count_name]+=1
        }
        else{
          specificTasks[i].completed = false
          specificTasks[i].complete_time = ""
          specificTasks[i].count--
          tasks[0].types[day_completed_count_name]-=1
        }
      }
    }
    tasks[0].types[dayIndex] = specificTasks

    this.setData({tasks:tasks})
    wx.setStorageSync('tasks', tasks)

    //更新剩余
    this.refresh_remain_taskCount(this.data.task_title)
  },
  go_update:function(e){
    if(this.data.task_duration==''){ //无时间填充0
      this.setData({task_duration:0})
    }

    if(this.data.task_title=='limitTime'){ //刷新限时任务时间
      this.refresh_limitTime_remain_time()
      if(this.data.task_duration==''){
        this.setData({task_duration_error:true})
        return;
      }
    }

    var id = this.data.editID
    var task_title = this.data.editTaskTitle
    var tasks = this.data.tasks
    var specificTasks = tasks[0].types[task_title]
    var time = util.formatTime(new Date())
    var task_duration = parseInt(this.data.task_duration)
    var date = new Date()
    //实行更新
    for(var i in specificTasks){
      if(specificTasks[i].id == id){
        specificTasks[i].name = this.data.task_name
        specificTasks[i].duration = this.data.task_duration
        specificTasks[i].color = this.data.task_color
        specificTasks[i].type = this.data.task_type
        specificTasks[i].icon = this.getTaskType_useText(this.data.task_type).icon
        specificTasks[i].create_time = this.data.task_title=='limitTime'?util.formatTime(new Date(date.setMinutes(date.getMinutes()+task_duration))):time
        specificTasks[i].remain_time = this.data.task_title=='limitTime'?task_duration*60*1000:""
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

    this.sortTasks()

    wx.showToast({
      icon:'none',
      title: '编辑成功',
    })
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
    var name = e.target.dataset.name
    var id = e.target.id
    var task_title = e.target.dataset.title //today

    Dialog.confirm({
      title: '删除',
      message: '确定删除'+name+'吗?'
    }).then(() => {
      // on confirm
      var tasks = this.data.tasks
      var specificTasks = tasks[0].types[task_title]
      for(var i in specificTasks){
        if(specificTasks[i].id==id){
          //如果已完成 完成总数-1
          if(specificTasks[i].completed){
            var day_completed_count_name = this.data.task_title+"_completed_count"
            tasks[0].types[day_completed_count_name]-=1
          }
          specificTasks.splice(i,1)
          break;
        }
      }
      tasks[0].types[task_title] = specificTasks
      wx.setStorageSync('tasks', tasks)
      this.setData({tasks:tasks})

      //更新剩余
      this.refresh_remain_taskCount(this.data.task_title)

      wx.showToast({
        icon:'none',
        title: '删除成功'
      })
    }).catch(() => {
      // on cancel
    });
  },
  getTaskType_useText(text){
    var task_types = this.data.task_types
    for(var i in task_types)
      if(task_types[i].text == text)
        return task_types[i];
  },
  go_add:function(e){
    if(this.data.task_title=='limitTime'){ //刷新限时任务时间
      this.refresh_limitTime_remain_time()
      if(this.data.task_duration==''){
        this.setData({task_duration_error:true})
        return;
      }
    }

    if(this.data.task_name==null){
      this.setData({
        task_name_error:true
      })
      return;
    }

    if(this.data.task_duration==''){ //无时间
      this.setData({task_duration:0})
    }

    var tasks = this.data.tasks
    var dayIndex = this.data.task_title
    var time = util.formatTime(new Date()).split(' ')[0]
    tasks = this.tasks_checkUpdateTime(tasks) //检测一下时间
    var remain_time = this.data.task_title=='limitTime'?parseInt(this.data.task_duration)*60*1000:"" //s
    var date = new Date()
    var taskTime = this.data.task_title=='limitTime'?util.formatTime(new Date(date.setMinutes(date.getMinutes()+(remain_time/60000)))):util.formatTime(date)

    var maxID = 0
    for(var i in tasks[0].types[dayIndex]){
      if(tasks[0].types[dayIndex][i].id > maxID){
        maxID = tasks[0].types[dayIndex][i].id
      }
    }

    var task = {
      id:maxID+1,
      completed:false,
      name:this.data.task_name,
      color:this.data.task_color,
      create_time:taskTime,
      type:this.data.task_type,
      icon:this.getTaskType_useText(this.data.task_type).icon,
      duration:this.data.task_duration,
      count:0,
      remain_time:remain_time,
      complete_time:"",
    }    
    tasks[0].types[dayIndex].unshift(task)
    
    wx.setStorageSync('tasks', tasks)
    this.setData({
      tasks:tasks
    })

    this.reset()
    this.onClose_add_task_popup()

    this.sortTasks() //任务排序

    wx.showToast({
      icon:'none',
      title: '添加成功',
    })
  },
  reset:function(){
    this.setData({
      task_duration:0,
      task_duration_error:false,
      task_color:this.data.task_colors[0].value,
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
    this.reset()

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
  refresh_remain_taskCount:function(task_title){
    var tasks = this.data.tasks
    var specificTasks = tasks[0].types[task_title]
    var remain_taskCount = 0
    for(var i in specificTasks){
      if(specificTasks[i].completed==false)
        remain_taskCount+=1;
    }
    this.setData({remain_taskCount:remain_taskCount})
  },
  onChange_tab:function(e){
    var index = e.detail.current
    var change = {
      "0":"today",
      "1":"everyday",
      "2":"limitTime",
    }
    var title = change[index]
    this.setData({
      task_title:title,
    })

    //统计该类有多少未完成任务
    this.refresh_remain_taskCount(this.data.task_title);
  },
  //日期变更时更新tasks json
  tasks_checkUpdateTime:function(tasks){
    var yearMonthDay = util.formatTime(new Date()).split(' ')[0]
    if(tasks.length==0){
      tasks.unshift({
        time:yearMonthDay,
        types:{
          today:[],
          everyday:[],
          limitTime:[],
          today_completed_count:0,
          everyday_completed_count:0,
          limitTime_completed_count:0,
        }
      })
    }
    else if(tasks[0].time != yearMonthDay){ //日期变更了
      //today新日期 复制今日未完成任务 旧日期 未完成任务置null
      var specificTasks = tasks[0].types.today
      var remainTodayTasks = []
      for(var i in specificTasks)
        if(specificTasks[i].completed==false){ //未完成任务
          remainTodayTasks.push(specificTasks[i])
          specificTasks[i] = null //旧日期 未完成置null
        }
      tasks[0].types.today = specificTasks

      //everyday新日期 全部复制,清除完成状态 旧日期 未完成任务置null
      specificTasks = tasks[0].types.everyday
      var remainEverydayTasks = []
      for(var i in specificTasks){
        remainEverydayTasks.push({
            id:specificTasks[i].id,
            completed:specificTasks[i].completed,
            name:specificTasks[i].name,
            color:specificTasks[i].color,
            create_time:specificTasks[i].create_time,
            type:specificTasks[i].type,
            icon:specificTasks[i].icon,
            duration:specificTasks[i].duration,
            count:specificTasks[i].count,
            remain_time:specificTasks[i].remain_time,
            complete_time:specificTasks[i].complete_time
        })
        if(specificTasks[i].completed){
          remainEverydayTasks[remainEverydayTasks.length-1].completed=false
          remainEverydayTasks[remainEverydayTasks.length-1].complete_time=""
        }
        else //未完成任务置null
          specificTasks[i]=null
      }
      tasks[0].types.everyday = specificTasks

      //limitTime新日期 复制未完成且remain_time还有剩余的任务(先refresh一下remain_time) 旧日期 未完成任务置null
      this.refresh_limitTime_remain_time() //先刷新一下任务时间
      specificTasks = tasks[0].types.limitTime
      var remainLimitTimeTasks = []
      for(var i in specificTasks){
        //未完成且remain_time>0
        if(specificTasks[i].completed==false && specificTasks[i].remain_time>0){
          remainLimitTimeTasks.push(specificTasks[i])
        }
        if(specificTasks[i].completed==false){ //旧日期未完成置null
          specificTasks[i]=null
        }
      }
      tasks[0].types.limitTime = specificTasks

      //unshift新日期
      tasks.unshift({
        time:yearMonthDay,
        types:{
          today:remainTodayTasks,
          everyday:remainEverydayTasks,
          limitTime:remainLimitTimeTasks,
          today_completed_count:0,
          everyday_completed_count:0,
          limitTime_completed_count:0,
        }
      })
    }

    wx.setStorageSync('tasks', tasks)
    return tasks;
  },
  onShow:function(){
    this.getTabBar().init();

    var tasks = wx.getStorageSync('tasks') || []
    this.setData({tasks:tasks}) //因为tasks_checkUpdateTime用到了tasks
    tasks = this.tasks_checkUpdateTime(tasks)
    var task_types = wx.getStorageSync('task_types') || []
    var task_type = task_types[0].text
    var task_durations = wx.getStorageSync('task_durations') || []
    var task_colors = wx.getStorageSync('task_colors') || []
    var task_color = task_colors[0].value
    var show_task_popup = wx.getStorageSync('show_task_popup') || false
    this.setData({
      show_task_popup:show_task_popup,
      task_color:task_color,
      task_colors:task_colors,
      task_durations:task_durations,
      task_types:task_types,
      task_type:task_type,
      tasks:tasks,
    })

    this.refresh_remain_taskCount(this.data.task_title)
    this.refresh_limitTime_remain_time() //刷新限时任务时间
  },
  refresh_limitTime_remain_time:function(){
    var tasks = this.data.tasks
    var specificTasks = tasks[0].types.limitTime
    //根据create_time和现在时间计算更新remain_time
    for(var i in specificTasks){
      if(specificTasks[i].remain_time<=0 || specificTasks[i].completed ) //时间为0 或者 已经完成跳过
        continue;

      var create_time = specificTasks[i].create_time
      //计算剩余时间
      var one = create_time.split(' ')[0].split('/')
      var two = create_time.split(' ')[1].split(':')
      var limit_time = new Date()
      limit_time.setFullYear(one[0])
      limit_time.setMonth(one[1]-1)
      limit_time.setDate(one[2])
      limit_time.setHours(two[0])
      limit_time.setMinutes(two[1])
      limit_time.setSeconds(two[2])
      var current_time = new Date()
      var remain_time = limit_time-current_time

      specificTasks[i].remain_time = remain_time
    }
    tasks[0].types.limitTime = specificTasks
    this.setData({tasks:tasks})
    wx.setStorageSync('tasks', tasks)
  },
  task_setting:function(){
    wx.navigateTo({
      url: 'task_setting/task_setting',
    })
  },
  finish_remain_time:function(e){
    var tasks = this.data.tasks
    var specificTasks = tasks[0].types.limitTime
    for(var i in specificTasks)
      if(specificTasks[i].id == e.target.id)
        specificTasks[i].remain_time=-1000
    tasks[0].types.limitTime =specificTasks

    this.setData({tasks:tasks})
    wx.setStorageSync('tasks', tasks)
  },
})
