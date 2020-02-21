const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data:{
    spendLogs:[],
    spendLogData:[],
    
    show_edit_dialog:false,
    spend_types:[],

    show_spendLog_day:0,
  },
  onClick_statistic:function(){
    wx.navigateTo({
      url: '../../packageTab1/spendLog/statistic/statistic',
    })
  },
  onReachBottom:function(){
    var show_spendLog_day = this.data.show_spendLog_day+1
    var spendLogs = this.data.spendLogs

    if(show_spendLog_day < spendLogs.length){
      this.setData({show_spendLog_day:show_spendLog_day})

      wx.showToast({
        icon:'none',
        title: '数据已追加',
      })
    }
  },
  onCancel_search:function(){
    this.setData({
      spendLogs:wx.getStorageSync('spendLogs') || []
    })

    wx.showToast({
      icon:'none',
      title: '数据已还原',
    })
  },
  //名称 注释 时间搜索
  search:function(value){
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
        
        if(name.indexOf(value)>=0 || comment.indexOf(value)>=0 || time.indexOf(value)>=0){
          ans[i].datas.push(datas[j])
        }
      }
      if(ans[i].datas.length==0){ //无数据
        ans[i]=null
      }
    }
    this.setData({spendLogs:ans}) //更新搜索数据
    console.log(ans)
  },
  onSearch:function(e){
    var value = e.detail
    this.search(value)

    wx.showToast({
      icon:'none',
      title: '数据已刷新',
    })
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
    var delete_msg= e.target.dataset.message+"\n\n注意\n本操作不会影响到今日总账\n删除后会出现空账情况"

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

    //计算最开始要显示几天的日志
    var show_spendLog_day = this.data.show_spendLog_day
    var count_data = 0
    for(var i in spendLogs){
      count_data += spendLogs[i].datas.length
      if(count_data<=10)
        show_spendLog_day +=1
    }

    this.setData({
      spendLogs:spendLogs,
      spend_types:spend_types,
      show_spendLog_day:show_spendLog_day,
    })
  }
})
