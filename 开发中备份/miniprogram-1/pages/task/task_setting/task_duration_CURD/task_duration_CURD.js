// 任务时间json
// task_duration{
//   id
//   value 分钟
// }

import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data: {
    custom_data:{"backText":"设置","content":"任务时间"},
    activeNames:[],

    task_duration_id:null,
    task_duration_id_error:"",
    task_duration_value:null,
    task_duration_value_error:false,

    task_durations:[],
  },
  reset:function(){
    this.setData({
      task_duration_id:null,
      task_duration_id_error:"",
      task_duration_value:null,
      task_duration_value_error:false,
    })
  },
  onShow:function(){
    var task_durations = wx.getStorageSync('task_durations')||[]
    this.setData({task_durations:task_durations})
  },
  onChange_van_collapse:function(event){
    this.setData({
      activeNames: event.detail
    });
  },
  update_task_duration_id:function(e){
    this.setData({task_duration_id:e.detail})
  },
  update_task_duration_value:function(e){
    this.setData({task_duration_value:e.detail})
  },
  add:function(){
    if(this.data.task_duration_value == null){
      this.setData({task_duration_value_error:true})
      return;
    }

    var task_duration = {"id":"","value":""}
    var task_durations = this.data.task_durations
    task_duration.id = task_durations.length>0?task_durations[task_durations.length-1].id+1:1
    task_duration.value = this.data.task_duration_value
    task_durations.push(task_duration)
    wx.setStorageSync('task_durations', task_durations)
    this.setData({task_durations:task_durations})
    this.reset()

    wx.showToast({
      icon:'none',
      title: '添加成功',
    })
  },
  delete:function(e){
    var value = e.target.dataset.value
    var id = e.target.id
    Dialog.confirm({
      message: '你确定删除'+value+'吗?'
    }).then(() => {
      // on confirm
      var task_durations = this.data.task_durations
      for(var i in task_durations){
        if(task_durations[i].id == id){
          task_durations.splice(i,1)
          break
        }
      }
      wx.setStorageSync('task_durations', task_durations)
      this.setData({task_durations:task_durations})
      this.reset()

      wx.showToast({
        icon:'none',
        title: '删除成功',
      })
    }).catch(() => {
      // on cancel
    });
  },
  edit:function(e){
    this.setData({task_duration_id_error:"",activeNames:['1']})
    var id = e.target.id;
    this.getInput(id);
  },
  getInput:function(id){
    var task_duration = this.getTaskDuration(id)
    this.setData({
      task_duration_id:task_duration.id,
      task_duration_value:task_duration.value,
    })
  },
  getTaskDuration:function(id){
    var task_durations = this.data.task_durations
    for(var i in task_durations)
      if(task_durations[i].id == id)
        return task_durations[i]
  },
  update:function(){
    if(this.data.task_duration_id==null){
      this.setData({task_duration_id_error:"无ID无法编辑"})
      return;
    }
    
    var task_duration = {"id":"","value":""}
    task_duration.id = this.data.task_duration_id
    task_duration.value = this.data.task_duration_value
    var task_durations = wx.getStorageSync('task_durations') || []
    for(var i in task_durations){
      if(task_durations[i].id == task_duration.id){
        task_durations[i]=task_duration
        break;
      }
    }
    wx.setStorageSync('task_durations', task_durations)
    this.setData({task_durations:task_durations,activeNames: []})
    this.reset()

    wx.showToast({
      icon:'none',
      title: '编辑成功',
    })
  },
})