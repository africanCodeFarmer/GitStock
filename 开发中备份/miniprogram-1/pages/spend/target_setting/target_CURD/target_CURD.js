// 花支目标json 
// targets{
//   id
//   name 目标名
//   desc 目标描述
//   value 目标金额
//   iconPath 
//   achieved 完成boolean
//   create_time
//   achieve_time 完成时间
// }

import Dialog from '@vant/weapp/dialog/dialog';
var util = require('../../../public/public.js');

Page({
  data: {
    custom_data:{"backText":"设置","content":"花支目标"},
    activeNames:[],

    radio_value:'0',
    target_id:null,
    target_id_error:"",
    target_name:null,
    target_name_error:false,
    target_desc:null,
    target_desc_error:false,
    target_value:null,
    target_value_error:false,
    fileList:[],
    target_iconPath_error:false,

    targets:[],
  },
  onChange_radio:function(e){
    this.setData({radio_value:e.detail})
  },
  afterRead_delete:function(){
    this.setData({fileList:[]})
  },
  afterRead:function(e){
    var path = e.detail.file.path
    this.setData({fileList:[{"name":null,"url":path}]})
  },
  reset:function(){
    this.setData({
      radio_value:'0',
      target_id:null,
      target_id_error:"",
      target_name:null,
      target_name_error:false,
      target_desc:null,
      target_desc_error:false,
      target_value:null,
      target_value_error:false,
      fileList:[],
      target_iconPath_error:false,
    })
  },
  onShow:function(){
    var targets = wx.getStorageSync('targets')||[]
    this.setData({targets:targets})
  },
  onChange_van_collapse:function(event){
    this.setData({
      activeNames: event.detail
    });
  },
  update_target_value:function(e){
    this.setData({target_value:e.detail})
  },
  update_target_desc:function(e){
    this.setData({target_desc:e.detail})
  },
  update_target_id:function(e){
    this.setData({target_id:e.detail})
  },
  update_target_name:function(e){
    this.setData({target_name:e.detail})
  },
  add:function(){
    if(this.data.target_name == null){ //无目标名称
      this.setData({target_name_error:true})
      return;
    }
    else if(this.data.target_desc == null){ //无目标描述
      this.setData({target_desc_error:true})
      return;
    }
    else if(this.data.target_value == null){ //无目标金额
      this.setData({target_value_error:true})
      return;
    }
    else if(this.data.fileList.length == 0){ //无目标图片
      this.setData({target_iconPath_error:true})
      return;
    }

    var targets =this.data.targets
    var time = util.formatTime(new Date())
    var target = {
      "id":targets.length==0?1:targets[targets.length-1].id+1,
      "name":this.data.target_name,
      "desc":this.data.target_desc,
      "value":this.data.target_value,
      "iconPath":this.data.fileList[0].url,
      "achieved":this.data.radio_value=='0'?false:true,
      "create_time":time,
      "achieved_time":null,
    }
    targets.push(target)
    wx.setStorageSync('targets', targets)
    this.setData({targets:targets})
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
      var targets = this.data.targets
      for(var i in targets){
        if(targets[i].id == id){
          targets.splice(i,1)
          break
        }
      }
      wx.setStorageSync('targets', targets)
      this.setData({targets:targets})
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
    this.setData({target_id_error:"",activeNames:['1']})
    var id = e.target.id;
    this.getInput(id);
  },
  getInput:function(id){
    var target = this.getTarget(id)
    this.setData({
      target_id:target.id,
      target_name:target.name,
      target_desc:target.desc,
      target_value:target.value,
      fileList:[{"name":null,"url":target.iconPath}],
      radio_value:target.achieved==false?'0':'1',
    })
  },
  getTarget:function(id){
    var targets = this.data.targets
    for(var i in targets)
      if(targets[i].id == id){
        return targets[i]
      }
  },
  update:function(){
    if(this.data.target_id==null){
      this.setData({target_id_error:"无ID无法编辑"})
      return;
    }

    var time = util.formatTime(new Date())
    var target = {
      "id":this.data.target_id,
      "name":this.data.target_name,
      "desc":this.data.target_desc,
      "value":this.data.target_value,
      "iconPath":this.data.fileList[0].url,
      "achieved":this.data.radio_value=='0'?false:true,
      "create_time":time,
      "achieved_time":null,
    }

    var targets = wx.getStorageSync('targets') || []
    for(var i in targets){
      if(targets[i].id == target.id){
        targets[i]=target
        break;
      }
    }
    wx.setStorageSync('targets', targets)
    this.setData({targets:targets,activeNames:[]})
    this.reset()

    wx.showToast({
      icon:'none',
      title: '编辑成功',
    })
  },
})