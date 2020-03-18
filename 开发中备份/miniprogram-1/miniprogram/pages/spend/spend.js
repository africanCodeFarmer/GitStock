const app = getApp()
var util = require('../public/public.js');
import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data:{
    task_types:[],
    choose_spend_type :0,
    spend_type:"",

    stocks:{},
    stock:{},

    show_money_popup:false,
    money_popup_title:"",
    money_blocks:{},
    comments:{},

    input_value:"",
    input_comment:"",
    input_value_comment:"",
    go_spend_sign:"", //+-符号
    input_value_comment_error:"",

    spendLogs:[],

    show_money_transfer_popup:false,
    picker_columns:[],
    transfer_error:"",
    transfer_value:null,
    transfer_value_error:"",

    show_target_achieved_popup:false,
    targets_achieved:[],
    target_achieved_count:0,
    
    target_percent:[], //目标们的百分比

    money_allow_count:0, //总余额
  },
  onClick_show_target_achieved_popup:function(){
    this.setData({show_target_achieved_popup:true})
  },
  onClose_target_achieved_popup:function(){
    this.setData({show_target_achieved_popup:false})
  },
  onClick_achieve:function(e){
    var id = e.target.id
    var name = e.target.dataset.name

    Dialog.confirm({
      title: '实现',
      message: "你已经买了"+name+"吗!?"
    }).then(() => {
      // on confirm
      var targets = wx.getStorageSync('targets') || []
      var time = util.formatTime(new Date())
      for(var i in targets){
        if(targets[i].id==id){
          targets[i].achieved=true
          targets[i].achieved_time = time
        }
      }
      this.setData({targets:targets})
      wx.setStorageSync('targets', targets)

      //更新完成和未完成目标
      targets = this.getWhereTargets({"achieved":false})
      var targets_achieved = this.getWhereTargets({"achieved":true})
      this.setData({
        targets:targets,
        targets_achieved:targets_achieved,
        target_achieved_count:targets_achieved.length,
      })

      //刷新百分比
      this.refresh_target_percent()

      wx.showToast({
        icon:'none',
        title: '实现目标',
      })
    }).catch(() => {
      // on cancel
    });
  },
  onClick_transfer_block:function(e){
    var value = e.target.dataset.value
    this.setData({
      transfer_value:value,
    })
  },
  onChange_transfer_value:function(e){
    this.setData({transfer_value:e.detail})
  },
  go_transfer:function(){
    var picker = this.selectComponent("#transfer_picker");
    var values = picker.getValues()
    var fromName = values[0]
    var toName = values[1]

    if(fromName == toName){
      this.setData({transfer_error:"请不要自己转账给自己"})
      return;
    }
    if(this.data.transfer_value==null){
      this.setData({transfer_value_error:"请输入金额"})
      return;
    }

    var fromStock = this.getStock_useName(fromName)
    var toStock = this.getStock_useName(toName)
    fromStock.value = (parseFloat(fromStock.value)-parseFloat(this.data.transfer_value)).toFixed(2)
    toStock.value = (parseFloat(toStock.value)+parseFloat(this.data.transfer_value)).toFixed(2)
    this.updateStockFromStocks(fromStock)
    this.updateStockFromStocks(toStock)

    //写日志操作
    var time = util.formatTime(new Date()).split(' ')[0]
    var detail_time = util.formatTime(new Date()).split(' ')[1]
    var spendLogs = this.data.spendLogs
    if(!this.checkTimeExistSpendLogs(time)) //时间不存在
      spendLogs.unshift({"time":time,"datas":[],"day_spend":0,"day_income":0})
    var spendLog = this.use_time_getSpendLog(time)
    var log = {
      "id":spendLog.datas.length>0?spendLog.datas[0].id+1:1,
      "time":time,
      "detail_time":detail_time,
      "name":fromName,
      "value":this.data.transfer_value,
      "comment":"转账给"+toName,
      "spend_type":null,
      "operate":'-',
      "remain":fromStock.value,
      "icon":"refund"
    }
    spendLog.datas.unshift(log)
    var log = {
      "id":spendLog.datas.length>0?spendLog.datas[0].id+1:1,
      "time":time,
      "detail_time":detail_time,
      "name":toName,
      "value":this.data.transfer_value,
      "comment":"从"+fromName+"收款",
      "spend_type":null,
      "operate":'+',
      "remain":toStock.value,
      "icon":"refund"
    }
    spendLog.datas.unshift(log)
    this.update_spendLogs(spendLog) //更新转账日志

    this.setData({
      transfer_error:"",
      transfer_value_error:"",
      transfer_value:null,
      show_money_transfer_popup:false,
    })

    wx.showToast({
      icon:'none',
      title: '完成转账',
    })
  },
  onChange_picker(event) {
  },
  transferMoney:function(){
    this.setData({show_money_transfer_popup:true})
  },
  onClose_money_transfer_popup:function(){
    this.setData({show_money_transfer_popup:false})
  },
  getSpendType_useSpendType(spendType){
    var task_types = this.data.task_types
    for(var i in task_types)
      if(task_types[i].text == spendType)
        return task_types[i]
    return null;
  },
  go_spend:function(){
    var str = this.data.input_value_comment
    var sign = this.data.go_spend_sign
    var stock = this.data.stock
    var stocks = this.data.stocks
    var input_clip = this.data.input_value_comment.split(' ')
    var value = input_clip.length>0?input_clip[0]:""
    var comment = input_clip.length>1?input_clip[input_clip.length-1]:""
    var icon = this.getSpendType_useSpendType(this.data.spend_type)==null?"moneybag":this.getSpendType_useSpendType(this.data.spend_type).icon

    //金额格式校验
    value = parseFloat(value).toFixed(2)
    if(value==""||isNaN(value)){
      this.setData({input_value_comment_error:"正确格式:金额 注释"})
      return;
    }

    if(sign=='-'){ //-
      stock.value = (parseFloat(stock.value)-parseFloat(value)).toFixed(2)
    }else{ //+
      stock.value = (parseFloat(stock.value)+parseFloat(value)).toFixed(2)
    }
    this.updateStockFromStocks(stock)
    
    //写日志操作
    var time = util.formatTime(new Date()).split(' ')[0]
    var detail_time = util.formatTime(new Date()).split(' ')[1]
    var spendLogs = this.data.spendLogs
    if(!this.checkTimeExistSpendLogs(time)) //时间不存在
      spendLogs.unshift({"time":time,"datas":[],"day_spend":0,"day_income":0})

    //根据花支修改大类中的day_spend day_income
    var day_spend =  spendLogs[0].day_spend
    var day_income = spendLogs[0].day_income
    if(sign=='-'){ //-
      spendLogs[0].day_spend = (parseFloat(day_spend)+parseFloat(value)).toFixed(2)
    }else{ //+
      spendLogs[0].day_income = (parseFloat(day_income)+parseFloat(value)).toFixed(2)
    }

    var spendLog = this.use_time_getSpendLog(time)
    var log = {
      "id":spendLog.datas.length>0?spendLog.datas[0].id+1:1,
      "time":time,
      "detail_time":detail_time,
      "name":stock.name,
      "value":value,
      "comment":comment,
      "spend_type":this.data.spend_type,
      "icon":icon,
      "operate":sign,
      "remain":stock.value,
    }
    spendLog.datas.unshift(log)
    this.update_spendLogs(spendLog) //更新日志

    this.setData({
      show_money_popup:false,
      input_value_comment:"",
      input_value:"",
      input_comment:"",
      input_value_comment_error:"",
    })

    //更新allow总余额
    this.get_money_allow_count(this.data.stocks)

    wx.showToast({
      icon:'none',
      title: sign=='-'?'花支完成':'收入完成',
    })
  },
  update_spendLogs:function(spendLog){
    var spendLogs = this.data.spendLogs
    for(var i in spendLogs){ //保存日志
      if(spendLogs[i].time == spendLog.time){
        spendLogs[i] = spendLog
        break
      }
    }
    wx.setStorageSync('spendLogs', spendLogs)
  },
  use_time_getSpendLog:function(time){
    var spendLogs = this.data.spendLogs
    for(var i in spendLogs)
      if(spendLogs[i].time == time)
        return spendLogs[i]
  },
  checkTimeExistSpendLogs:function(time){
    var spendLogs = this.data.spendLogs
    for(var i in spendLogs)
      if(spendLogs[i].time == time)
        return true
    return false
  },
  updateStockFromStocks:function(stock){
    var stocks = this.data.stocks
    for(var i in stocks)
      if(stocks[i].id == stock.id){
        stocks[i]=stock
        break
      }
    this.setData({stocks:stocks})
    wx.setStorageSync('stocks', stocks)
  },
  onChange_input_value_comment:function(e){
    this.setData({input_value_comment:e.detail})
  },
  onClick_comment:function(e){
    var comment = e.target.dataset.name
    var input_value_comment = this.data.input_value+" "+comment
    this.setData({
      input_comment:comment,
      input_value_comment:input_value_comment,
    })
  },
  onClick_money_block:function(e){
    var value = e.target.dataset.value
    var input_value_comment = value+" "+this.data.input_comment
    this.setData({
      input_value:value,
      input_value_comment:input_value_comment,
    })
  },
  onClickNav:function(e){
    var index = e.detail.index
    var spend_type = this.data.task_types[index]
    this.setData({
      spend_type:spend_type.text,
      choose_spend_type:index
    })
  },
  getStock_useName(name){
    var stocks = this.data.stocks
    for(var i in stocks)
      if(stocks[i].name == name)
        return stocks[i]
  },
  getStock:function(id){
    var stocks = this.data.stocks
    for(var i in stocks)
      if(stocks[i].id == id)
        return stocks[i]
  },
  init_spend_type:function(type){
    //type 花费类为- 收入类为+
    var result = []
    var types = wx.getStorageSync('types') || []
    for(var i in types)
      if(types[i].type == type)
      result.push(types[i])

    //更新默认spend_type(text)
    //更新spend_types
    //类型默认选第一个
    this.setData({
      choose_spend_type:0,
      spend_type:result[0].text,
      task_types:result
    })
  },
  addMoney:function(e){
    this.init_spend_type('+') //初始化可选类型
    
    var id = e.target.id
    var stock = this.getStock(id)
    var money_popup_title = '+ '+stock.name
    this.setData({
      show_money_popup:true,
      stock:stock,
      money_popup_title:money_popup_title,
      go_spend_sign:'+'
    })
  },
  reduceMoney:function(e){
    this.init_spend_type('-') //初始化可选类型

    var id = e.target.id
    var stock = this.getStock(id)
    var money_popup_title = '- '+stock.name
    this.setData({
      show_money_popup:true,
      stock:stock,
      money_popup_title:money_popup_title,
      go_spend_sign:'-'
    })
  },
  onClose_money_popup:function(){
    this.setData({show_money_popup:false})
  },
  getWhereTargets:function(where){
    var targets = wx.getStorageSync('targets') || []
    var ans = []
    for(var i in targets){
      if(targets[i].achieved==where.achieved)
        ans.push(targets[i])
    }
    return where.achieved==false?ans:ans.reverse()
  },
  get_money_allow_count:function(stocks){
    var money_allow_count = 0
    for(var i in stocks){
      if(stocks[i].status == "allow")
        money_allow_count = (parseFloat(money_allow_count)+parseFloat(stocks[i].value)).toFixed(2)
    }
    this.setData({money_allow_count:money_allow_count})

    this.refresh_target_percent()
  },
  //更新目标百分比进度条
  refresh_target_percent:function(){
    var targets = this.data.targets
    var money_allow_count = parseFloat(this.data.money_allow_count)
    var target_percent = []
    for(var i in targets){
      var percent = ((money_allow_count/parseFloat(targets[i].value))*100).toFixed(2)
      target_percent.push(percent)
    }
    this.setData({target_percent:target_percent})
  },
  onShow:function(){
    this.getTabBar().init();
    var stocks = wx.getStorageSync('stocks') || []
    var comments = wx.getStorageSync('comments') || []
    var money_blocks = wx.getStorageSync('blocks') || []
    var task_types = wx.getStorageSync('types') || []
    var spendLogs = wx.getStorageSync('spendLogs') || []
    var targets = this.getWhereTargets({"achieved":false})
    var targets_achieved = this.getWhereTargets({"achieved":true})

    //转账
    var pickers = []
    for(var i in stocks)
      pickers.push(stocks[i].name)

    this.setData({
      stocks:stocks,
      comments:comments,
      money_blocks:money_blocks,
      task_types:task_types,
      spend_type:task_types.length>0?task_types[0].text:"",
      spendLogs:spendLogs,
      picker_columns:[{values:pickers},{values:pickers}],
      targets:targets,
      targets_achieved:targets_achieved,
      target_achieved_count:targets_achieved.length,
    })

    //获取allow总余额
    this.get_money_allow_count(stocks);
  },
  stock_setting:function(){
    wx.navigateTo({
      url: 'stock_setting/stock_setting',
    })
  },
  target_setting:function(){
    wx.navigateTo({
      url: 'target_setting/target_setting',
    })
  },
})
