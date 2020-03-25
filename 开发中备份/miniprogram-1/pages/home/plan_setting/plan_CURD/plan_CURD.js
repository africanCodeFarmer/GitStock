// 计划json
// plans{
//   id
//   name
//   desc
//   reward
//   plan_day
//   remain_day
//   insist_day
//   type remain|insist
//   completed
//   create_time
//   complete_time

//   status null | hitCard //打卡
//   free_count //每月可以不打卡数
// }

var util = require('../../../public/public.js');
import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data: {
    custom_data:{"backText":"设置","content":"计划"},
    activeNames:[],

    plan_id:null,
    plan_id_error:"",
    plan_name:null,
    plan_name_error:false,
    plan_desc:null,
    plan_desc_error:false,
    plan_day:0,
    plan_day_error:false,
    plan_reward:null,
    plan_type:'remain',
    plan_completed:'false',

    plans:[],
  },
  onChange_plan_type(event) {
    this.setData({
      plan_type: event.detail
    });
  },
  onChange_plan_completed(event) {
    this.setData({
      plan_completed: event.detail
    });
  },
  reset:function(){
    this.setData({
      plan_id:null,
      plan_id_error:"",
      plan_name:null,
      plan_name_error:false,
      plan_desc:null,
      plan_desc_error:false,
      plan_day:0,
      plan_day_error:false,
      plan_reward:null,
      plan_type:'remain',
      plan_completed:'false',
    })
  },
  onShow:function(){
    var plans = wx.getStorageSync('plans')||[]
    this.setData({plans:plans})
  },
  onChange_van_collapse:function(event){
    this.setData({
      activeNames: event.detail
    });
  },
  update_plan_id:function(e){
    this.setData({plan_id:e.detail})
  },
  update_plan_name:function(e){
    this.setData({plan_name:e.detail})
  },
  update_plan_desc:function(e){
    this.setData({plan_desc:e.detail})
  },
  update_plan_day:function(e){
    this.setData({plan_day:e.detail})
  },
  update_plan_reward:function(e){
    this.setData({plan_reward:e.detail})
  },
  add:function(){
    if(this.data.plan_name == null){
      this.setData({plan_name_error:true})
      return;
    }
    if(this.data.plan_desc == null){
    }
    if(this.data.plan_day == null || (this.data.plan_day==0&&this.data.plan_type=='remain')){
      this.setData({plan_day_error:true})
      return;
    }

    var plans = this.data.plans
    //搜索id最大值
    var maxID = 0
    for(var i in plans)
      if(plans[i].id>maxID)
        maxID=plans[i].id
    var plan = {
      id:maxID+1,
      name:this.data.plan_name,
      desc:this.data.plan_desc,
      plan_day:parseInt(this.data.plan_day),
      reward:this.data.plan_reward,

      remain_day:parseInt(this.data.plan_day),
      insist_day:0,
      type:this.data.plan_type,

      completed:this.data.plan_completed=="true"?true:false,
      complete_time:null,

      create_time:util.formatTime(new Date()),

      status:null,
      free_count:wx.getStorageSync('month_free_count') || 10,
    }
    plans.unshift(plan)
    wx.setStorageSync('plans', plans)
    this.setData({plans:plans})
    this.reset()

    wx.showToast({
      icon:'none',
      title: '添加成功',
    })
  },
  delete:function(e){
    var name = e.target.dataset.name
    var id = e.target.id

    Dialog.confirm({
      message: '你确定删除'+name+'吗?'
    }).then(() => {
      // on confirm
      var plans = this.data.plans
      for(var i in plans){
        if(plans[i].id == id){
          plans.splice(i,1)
          break
        }
      }
      wx.setStorageSync('plans', plans)
      this.setData({plans:plans})
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
    this.setData({plan_id_error:"",activeNames:['1']})
    var id = e.target.id;
    this.getInput(id);
  },
  getInput:function(id){
    var plan = this.getPlan(id)
    this.setData({
      plan_id:plan.id,
      plan_name:plan.name,
      plan_desc:plan.desc,
      plan_day:plan.plan_day,
      plan_reward:plan.reward,
      plan_type:plan.type,
      plan_completed:plan.completed==true?"true":"false",
    })
  },
  getPlan:function(id){
    var plans = this.data.plans
    for(var i in plans)
      if(plans[i].id == id)
        return plans[i]
  },
  update:function(){
    if(this.data.plan_id==null){
      this.setData({plan_id_error:"无ID无法编辑"})
      return;
    }

    var plans = wx.getStorageSync('plans') || []
    for(var i in plans){
      if(plans[i].id == this.data.plan_id){
        plans[i].name = this.data.plan_name
        plans[i].desc = this.data.plan_desc
        plans[i].plan_day = parseInt(this.data.plan_day)
        plans[i].remain_day= parseInt(this.data.plan_day)
        plans[i].reward = this.data.plan_reward
        plans[i].type = this.data.plan_type
        plans[i].completed = this.data.plan_completed=="true"?true:false
        plans[i].create_time = util.formatTime(new Date())
        break;
      }
    }
    wx.setStorageSync('plans', plans)
    this.setData({plans:plans,activeNames: []})
    this.reset()

    wx.showToast({
      icon:'none',
      title: '编辑成功',
    })
  },
})