const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog';
var util = require('../public/public.js');

Page({
  data:{
    tasks:[],
    taskLogsData:{},

    show_edit_dialog:false,
    show_taskLog_day:0,
  },
  onClick_statistic:function(){
    wx.navigateTo({
      url: '../../packageTab1/taskLog/statistic/statistic',
    })
  },
  onReachBottom:function(){
    var show_taskLog_day = this.data.show_taskLog_day+10
    this.setData({show_taskLog_day:show_taskLog_day})
    //if(show_taskLog_day>=this.data.tasks.length){
      //return;
    //}

    //this.setData({show_taskLog_day:show_taskLog_day})
    // wx.showToast({
    //   icon:'none',
    //   title: '数据已追加',
    // })
  },
  onCancel_search:function(){
    this.setData({
      tasks:wx.getStorageSync('tasks') || []
    })

    wx.showToast({
      icon:'none',
      title: '数据已还原',
    })
  },
  //时间 任务名搜索
  onSearch:function(e){
    var value = e.detail
    var ans = []
    var tasks = this.data.tasks
    
    //利用complete_time实现同时搜索
    for(var i in tasks){
      var needPOP = true
      ans.push(tasks[i]);
      for(var j in tasks[i].types){
        if(j.indexOf('_')>=0){ //跳过完成数
          continue;
        }
        for(var k in tasks[i].types[j]){
          var taskLogsData = tasks[i].types[j][k] //每条数据
          if(taskLogsData==null || taskLogsData.completed==false) //跳过null和未完成
            continue;

          //搜索
          var time = taskLogsData.complete_time.split(' ')[0]
          if(taskLogsData.name.indexOf(value)>=0 || time.indexOf(value)>=0){
            needPOP = false
          }
          else
            tasks[i].types[j][k]=null;
        }
      }
      if(needPOP)
        ans.pop()
    }

    this.setData({tasks:ans}) //更新搜索数据
    wx.showToast({
      icon:'none',
      title: '数据已刷新',
    })
  },
  edit_choose_type:function(e){
    var text = e.target.dataset.text
    var icon = e.target.dataset.icon
    var taskLogsData = this.data.taskLogsData
    taskLogsData.type = text
    taskLogsData.icon = icon
    this.setData({taskLogsData:taskLogsData})
  },
  onChange_task_name:function(e){
    var taskLogsData = this.data.taskLogsData
    taskLogsData.name = e.detail
    this.setData({taskLogsData:taskLogsData})
  },
  update:function(){
    var taskLogsData = this.data.taskLogsData
    var tasks = this.data.tasks
    for(var i in tasks){
      if(tasks[i].time == taskLogsData.time){
        var specificTasks = tasks[i].types[taskLogsData.title]
        for(var j in specificTasks){
          if(specificTasks[j]!=null && specificTasks[j].id == taskLogsData.id){
            tasks[i].types[taskLogsData.title][j]={
              completed:specificTasks[j].completed,
              color:specificTasks[j].color,
              create_time:specificTasks[j].create_time,
              duration:specificTasks[j].duration,
              count:specificTasks[j].count,
              remain_time:specificTasks[j].remain_time,
              complete_time:specificTasks[j].complete_time,

              id:taskLogsData.id,
              name:taskLogsData.name,
              type:taskLogsData.type,
              icon:taskLogsData.icon,
            }
          }
        }
        break;
      }
    }


    this.setData({tasks:tasks,show_edit_dialog:false})
    wx.setStorageSync('tasks', tasks)

    wx.showToast({
      icon:'none',
      title: '编辑成功',
    })
  },
  onClose_edit_dialog:function(){
    this.setData({show_edit_dialog:false})
  },
  getSpendLogData_useTimeAndID:function(time,id){
    var spendLogs = wx.getStorageSync('spendLogs') || []
    for(var i in spendLogs){
      if(spendLogs[i].time == time){
        var spendLogDatas = spendLogs[i].datas
        for(var j in spendLogDatas){
          if(spendLogDatas[j].id == id)
            return spendLogDatas[j]
        }
      }
    }
  },
  init_spend_types:function(type){
    var types = wx.getStorageSync('types') || []
    var result = []
    for(var i in types)
      if(types[i].type == type)
        result.push(types[i])
    this.setData({
      task_types:result
    })
  },
  edit:function(e){
    var id = e.target.id
    var time = e.target.dataset.time
    var title = e.target.dataset.title
    var name = e.target.dataset.name

    var today = util.formatTime(new Date()).split(' ')[0]
    if(today == time){
      wx.showToast({
        icon:'none',
        title: '今日任务日志不可编辑',
      })
      return;
    }

    //填充taskLogsData对象
    this.fillTaskLogsData(time,title,id)
    this.setData({show_edit_dialog:true})
  },
  fillTaskLogsData:function(time,title,id){
    var tasks = this.data.tasks
    for(var i in tasks){
      if(tasks[i].time == time){
        var specificTasks = tasks[i].types[title]
        for(var j in specificTasks){
          if(specificTasks[j]!=null && specificTasks[j].id == id){
            this.setData({
              taskLogsData:{
                id:specificTasks[j].id,
                completed:specificTasks[j].completed,
                name:specificTasks[j].name,
                color:specificTasks[j].color,
                create_time:specificTasks[j].create_time,
                type:specificTasks[j].type,
                icon:specificTasks[j].icon,
                duration:specificTasks[j].duration,
                count:specificTasks[j].count,
                remain_time:specificTasks[j].remain_time,
                complete_time:specificTasks[j].complete_time,

                //这两个属性用于update
                title:title,
                time:time,
              }
            })
            break;
          }
        }
        break
      }
    }
  },
  delete:function(e){
    var id = e.target.id
    var time = e.target.dataset.time
    var title = e.target.dataset.title
    var name = e.target.dataset.name
    var tasks = this.data.tasks
    
    var today = util.formatTime(new Date()).split(' ')[0]
    if(today == time){
      wx.showToast({
        icon:'none',
        title: '今日任务日志不可删除',
      })
      return;
    }

    Dialog.confirm({
      title: '删除',
      message: '确定删除'+name+'吗?'
    }).then(() => {
      // on confirm
      for(var i in tasks){
        if(tasks[i].time == time){
          var specificTasks = tasks[i].types[title]
          for(var j in specificTasks){
            if(specificTasks[j]!=null && specificTasks[j].id == id){
              tasks[i].types[title+"_completed_count"]-- //完成量-1
              tasks[i].types[title].splice(j,1)
              break;
            }
          }
          break;
        }
      }

      this.setData({tasks:tasks})
      wx.setStorageSync('tasks', tasks)
      wx.showToast({
        icon:'none',
        title: '删除成功',
      })
    }).catch(() => {
      // on cancel
    });
  },
  onShow:function(){
    this.getTabBar().init();

    var tasks = wx.getStorageSync('tasks') || []
    var task_types = wx.getStorageSync('task_types') || []
    this.setData({
      tasks:tasks,
      task_types:task_types,
    })

    //计算最开始要显示几天的日志
    var show_taskLog_day = this.data.show_taskLog_day
    var count_data = 0
    for(var i in tasks){
      count_data += tasks[i].types.today_completed_count
      count_data += tasks[i].types.everyday_completed_count
      count_data += tasks[i].types.limitTime_completed_count
      if(count_data<=10)
      show_taskLog_day++
    }
    this.setData({show_taskLog_day:show_taskLog_day})
  }
})
