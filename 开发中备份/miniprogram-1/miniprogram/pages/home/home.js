// 原则json
// principles{
//   id
//   text
//   count
// }

const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog';
var util = require('../public/public.js');

Page({
  data:{
    show_completed_plan:false,

    plans:[],

    gradientColor: {
      '0%': '#1CBBB4',
      '100%': '#0388F5'
    },

    show_title_text:false,

    greet_text:"",

    show_add_principle:false,
    editing:false,
    editID:0,

    input_principle:"",
    input_principle_error:false,

    principles:[],
  },
  onClick_reveal_completed_plan:function(){
    this.setData({show_completed_plan:true})
  },
  onClick_complete:function(e){
    var id = e.target.id
    var name = e.target.dataset.name
    
    Dialog.confirm({
      title: '完成',
      message: '确定完成'+name+'了吗?'
    }).then(() => {
      // on confirm
      var plans = this.data.plans
      for(var i in plans)
        if(plans[i].id == id){
          plans[i].completed=true
          plans[i].complete_time=util.formatTime(new Date())
        }

      this.setData({plans:plans})
      wx.setStorageSync('plans', plans)
      
      wx.showToast({
        icon:'none',
        title: '完成任务',
      })
    }).catch(() => {
      // on cancel
    });
  },
  hitCard:function(e){
    var id = e.target.id
    var name = e.target.dataset.name
    
    Dialog.confirm({
      title: '打卡',
      message: '确定打卡'+name+'吗?'
    }).then(() => {
      // on confirm
      var plans = this.data.plans
      for(var i in plans)
        if(plans[i].id == id){
          var remain_day = plans[i].remain_day-1<0?0:plans[i].remain_day-1
          plans[i].remain_day=plans[i].type=="remain"?remain_day:plans[i].remain_day;
          plans[i].insist_day=plans[i].type=="insist"?plans[i].insist_day+1:plans[i].insist_day;
        }

      this.setData({plans:plans})
      wx.setStorageSync('plans', plans)
      
      wx.showToast({
        icon:'none',
        title: '打卡成功',
      })
    }).catch(() => {
      // on cancel
    });
  },
  plan_setting:function(){
    wx.navigateTo({
      url: '../home/plan_setting/plan_setting',
    })
  },
  onClick_data_setting:function(){
    wx.navigateTo({
      url: '../home/data_setting/data_setting',
    })
  },
  onClick_principle_addCount:function(){
    var principles = this.data.principles
      for(var i in principles){
        if(principles[i].id == this.data.editID){
          principles[i].count+=25
          break;
        }
      }
    
    this.setData({principles:principles})
    wx.setStorageSync('principles', principles)

    this.reset_add_principle()

    wx.showToast({
      icon:'none',
      title: '触犯+1次',
    })

    this.sortPrinciple()
    this.onClose_add_principle()
  },
  sortPrinciple:function(){
    var principles = this.data.principles
    for(var i=0;i<principles.length;i++){
      for(var j=0;j<principles.length;j++){
        var itext = principles[i].text.substr(0,1)
        var jtext = principles[j].text.substr(0,1)
        if(principles[i].count>principles[j].count || (principles[i].count==principles[j].count && itext<jtext) ){
          var temp = principles[i]
          principles[i] = principles[j]
          principles[j] = temp
        }
      }
    }
    this.setData({principles:principles})
    wx.setStorageSync('principles', principles)
  },
  delete_principle:function(){
    var id = 0
    var principle = {}
    var principles = this.data.principles
      for(var i in principles){
        if(principles[i].id == this.data.editID){
          principle = principles[i]
          id = i
          break;
        }
      }
    
    Dialog.confirm({
      title: '删除',
      message: '确定删除'+principle.text+'吗?'
    }).then(() => {
      // on confirm
      principles.splice(id,1)
      this.setData({principles:principles})
      wx.setStorageSync('principles', principles)

      this.reset_add_principle()

      wx.showToast({
        icon:'none',
        title: '删除成功',
      })
    }).catch(() => {
      // on cancel
    });

    this.onClose_add_principle()
  },
  edit:function(e){
    var id = e.target.id
    var principle = null
    var principles = this.data.principles
    for(var i in principles)
      if(principles[i].id == id)
        principle = principles[i]

    //获取对象 填充input_principle
    this.setData({
      show_add_principle:true,
      editing:true,
      editID:id,
      input_principle:principle.text,
    })
  },
  reset_add_principle:function(){
    this.setData({
      input_principle:"",
      input_principle_error:false,
      editing:false,
      editID:0,
    })
  },
  change_principle:function(e){
    this.setData({input_principle:e.detail})
  },
  update_principle:function(){
    var principles = this.data.principles
    for(var i in principles)
      if(principles[i].id == this.data.editID)
        principles[i].text = this.data.input_principle

    wx.setStorageSync('principles', principles)
    this.setData({principles:principles})

    this.reset_add_principle()
    this.onClose_add_principle()

    wx.showToast({
      icon:'none',
      title: '编辑成功',
    })
  },
  add_principle:function(){
    if(this.data.input_principle==''){
      this.setData({input_principle_error:true})
      return;
    }

    var input_principle = this.data.input_principle
    var principles = this.data.principles

    var maxID=0
    for(var i in principles)
      if(principles[i].id>maxID)
        maxID=principles[i].id
        
    principles.unshift({
      id:maxID+1,
      text:input_principle,
      count:0,
    })
    wx.setStorageSync('principles', principles)
    this.setData({principles:principles})

    this.reset_add_principle()
    this.onClose_add_principle()

    this.sortPrinciple()
    wx.showToast({
      icon:'none',
      title: '添加成功',
    })
  },
  onClick_add_principle:function(){
    this.setData({show_add_principle:true,editing:false,editID:0,})
  },
  onClose_completed_plan_popup:function(){
    this.setData({show_completed_plan:false,})
  },
  onClose_add_principle:function(){
    this.setData({show_add_principle:false,})
  },
  onClick_dog:function(){
    this.setData({show_title_text:this.data.show_title_text==false?true:false})
  },
  fillGreetText:function(){
    var hour = parseInt(util.formatTime(new Date()).substr(11,2))
    var text = ""
    if(hour < 6){text="凌晨好!"}
    else if (hour < 9){text="早上好!"}
    else if (hour < 12){text="上午好!"}
    else if (hour < 14){text="中午好!"}
    else if (hour < 17){text="下午好!"}
    else if (hour < 19){text="傍晚好!"}
    else if (hour < 22){text="晚上好!"}
    else {text="夜里好!"}
    this.setData({greet_text:text})
  },
  onShow:function(){
    this.getTabBar().init()
    
    this.fillGreetText()
    var principles = wx.getStorageSync('principles') || []
    var plans = wx.getStorageSync('plans') || []
    this.setData({
      principles:principles,
      plans:plans
    })
  },
})
