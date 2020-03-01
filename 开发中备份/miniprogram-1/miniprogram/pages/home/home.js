const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog';
var util = require('../public/public.js');

Page({
  data:{
    // steps: [
    //   {
    //     text: '步骤一',
    //     desc: '描述信息'
    //   },
    //   {
    //     text: '步骤二',
    //     desc: '描述信息'
    //   },
    //   {
    //     text: '步骤三',
    //     desc: '描述信息'
    //   },
    //   {
    //     text: '步骤四',
    //     desc: '描述信息'
    //   }
    // ]

    show_title_text:false,

    greet_text:"",

    show_add_principle:false,
    editing:false,
    editID:0,

    input_principle:"",
    input_principle_error:false,

    principles:[],
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
    principles.unshift({
      id:principles.length>0?(principles[0].id+1):1,
      text:input_principle,
      count:0,
    })
    wx.setStorageSync('principles', principles)
    this.setData({principles:principles})

    this.reset_add_principle()
    this.onClose_add_principle()

    wx.showToast({
      icon:'none',
      title: '添加成功',
    })
  },
  onClick_add_principle:function(){
    this.setData({show_add_principle:true,editing:false,editID:0,})
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

    this.setData({
      principles:principles,
    })
  },
  onClick_clear_tasks:function(){
    Dialog.confirm({
      title: '清空',
      message: '删除任务日志所有数据!?'
    }).then(() => {
      // on confirm
      var tasks = wx.getStorageSync('tasks') || []
      for(var i in tasks)
        if(i!=0)
          tasks.splice(i,1)
      wx.setStorageSync('tasks', tasks)

      wx.showToast({
        icon:'none',
        title: '已清空任务日志',
      })
    }).catch(() => {
      // on cancel
    });
  },
  onClick_clearAll:function(){
    Dialog.confirm({
      title: '清空',
      message: '删除所有数据!?\n删除所有数据!?\n删除所有数据!?'
    }).then(() => {
      // on confirm
      wx.clearStorageSync()
      app.onLaunch()

      wx.showToast({
        icon:'none',
        title: '已清空所有数据',
      })
    }).catch(() => {
      // on cancel
    });
  },
  onClick_clear_spendLogs:function(){
    Dialog.confirm({
      title: '清空',
      message: '删除花支日志所有数据!?'
    }).then(() => {
      // on confirm
      wx.removeStorageSync('spendLogs')

      wx.showToast({
        icon:'none',
        title: '已清空花支日志',
      })
    }).catch(() => {
      // on cancel
    });
  },
})
