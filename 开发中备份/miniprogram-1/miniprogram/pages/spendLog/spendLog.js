const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data:{
    spendLogs:[],
    show_edit_dialog:false,
    spendLogData:[],
    spend_types:[],
  },
  edit_choose_type:function(e){
    var text = e.target.dataset.text
    var icon = e.target.dataset.icon
    var spendLogData = this.data.spendLogData
    spendLogData.spend_type = text
    spendLogData.icon = icon
    this.setData({spendLogData:spendLogData})
  },
  onChange_spendLogData_comment:function(e){
    var spendLogData = this.data.spendLogData
    spendLogData.comment = e.detail
    this.setData({spendLogData:spendLogData})
  },
  update:function(){
    //1.消费类型布局及修改不保存但数据残留bug 2.更新缓存
    console.log(this.data.spendLogData)
    this.setData({show_edit_dialog:false})
  },
  onClose_edit_dialog:function(){
    this.setData({show_edit_dialog:false})
  },
  getSpendLogData_useTimeAndID:function(time,id){
    var spendLogs = this.data.spendLogs
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
  edit:function(e){
    var id = e.target.id
    var time = e.target.dataset.time
    var spendLogData = this.getSpendLogData_useTimeAndID(time,id)
    this.setData({show_edit_dialog:true,spendLogData:spendLogData})
  },
  delete:function(e){
    var id = e.target.id
    var time = e.target.dataset.time
    var spendLogs = this.data.spendLogs
    var delete_msg= e.target.dataset.message

    Dialog.confirm({
      title: '删除',
      message: delete_msg
    }).then(() => {
      // on confirm
      for(var i in spendLogs){
        if(spendLogs[i].time == time){
          var spendLogData = spendLogs[i].datas
          for(var j in spendLogData){
            if(spendLogData[j].id == id){
              delete_msg = "确定删除"+spendLogData[j].name+" "+spendLogData[j].comment+"?"
              spendLogData.splice(j,1)
              break
            }
          }
          spendLogs[i].datas = spendLogData
          if(spendLogData.length==0) //当前时间大类无数据
            spendLogs.splice(i,1)
          break
        }
      }
      this.setData({spendLogs:spendLogs})
      wx.setStorageSync('spendLogs', spendLogs)
    }).catch(() => {
      // on cancel
    });
  },
  onShow:function(){
    this.getTabBar().init();
    var spendLogs = wx.getStorageSync('spendLogs') || []
    var spend_types = wx.getStorageSync('types') || []
    this.setData({
      spendLogs:spendLogs,
      spend_types:spend_types,
    })
  }
})
