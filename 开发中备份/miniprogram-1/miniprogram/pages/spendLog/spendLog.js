const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data:{
    spendLogs:[],
    show_edit_dialog:false,
    spendLogData:[],
    spend_types:[],
  },
  onCancel_search:function(){
    this.setData({
      spendLogs:wx.getStorageSync('spendLogs') || []
    })
  },
  //时间 注释 消费类型 字段名 金额搜索
  search:function(value){
    //name comment string.indexOf()>=0
    var ans = [];
    var spendLogs = wx.getStorageSync('spendLogs') || []

    for(var i in spendLogs){
      ans.push({
        time:spendLogs[i].time,
        datas:[]
      })

      var datas = spendLogs[i].datas
      for(var j in datas){
        var name = datas[j].name
        var comment = datas[j].comment || ""
        var time = datas[j].time
        var spend_type = datas[j].spend_type || ""
        var spend_money = datas[j].value
        if(name.indexOf(value)>=0 || comment.indexOf(value)>=0 || time.indexOf(value)>=0 || spend_type.indexOf(value)>=0 || spend_money.indexOf(value)>=0)
          ans[i].datas.push(datas[j])
      }
      if(ans[i].datas.length==0) //无数据
        ans.splice(i,1)
    }
    this.setData({spendLogs:ans}) //更新搜索数据
  },
  onSearch:function(e){
    var value = e.detail
    this.search(value)
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
  updateSpendLogData:function(spendLogData){
    var spendLogs = this.data.spendLogs
    for(var i in spendLogs){
      if(spendLogs[i].time == spendLogData.time){
        var datas = spendLogs[i].datas
        for(var j in datas){
          if(datas[j].id == spendLogData.id){
            datas[j] = spendLogData
            break
          }
        }  
        spendLogs[i].datas = datas 
        break
      }
    }
    this.setData({spendLogs:spendLogs})
    wx.setStorageSync('spendLogs', spendLogs)
  },
  update:function(){
    this.updateSpendLogData(this.data.spendLogData)
    this.setData({show_edit_dialog:false})
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
