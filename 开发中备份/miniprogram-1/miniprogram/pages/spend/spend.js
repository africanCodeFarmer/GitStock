const app = getApp()
var util = require('../public/public.js');

Page({
  data:{
    spend_types:[],
    choose_spend_type :0,
    spend_type:"",

    money_blocks:{},
    stocks:{},
    stock:{},
    show_money_popup:false,
    money_popup_title:"",
    comments:{},

    input_value:"",
    input_comment:"",
    input_value_comment:"",
    go_spend_sign:"", //+-符号
    input_value_comment_error:"",

    spendLogs:[]
  },
  go_spend:function(){
    var str = this.data.input_value_comment
    var sign = this.data.go_spend_sign
    var stock = this.data.stock
    var stocks = this.data.stocks
    var input_clip = this.data.input_value_comment.split(' ')
    var value = input_clip.length>0?input_clip[0]:""
    var comment = input_clip.length>1?input_clip[input_clip.length-1]:""
    
    if(value==""){
      this.setData({input_value_comment_error:"正确格式:金额 注释"})
      return;
    }

    if(sign=='-'){ //-
      stock.value = parseFloat(stock.value)-parseFloat(value)
    }else{ //+
      stock.value = parseFloat(stock.value)+parseFloat(value)
    }

    this.updateStockFromStocks(stock)
    
    //写日志操作
    var time = util.formatTime(new Date()).split(' ')[0]
    var detail_time = util.formatTime(new Date()).split(' ')[1]
    var spendLogs = this.data.spendLogs
    if(!this.checkTimeExistSpendLogs(time)) //时间不存在
      spendLogs.unshift({"time":time,"datas":[]})
    var spendLog = this.use_time_getSpendLog(time)
    var log = {
      "id":spendLog.datas.length>0?spendLog.datas[0].id+1:1,
      "detail_time":detail_time,
      "name":stock.name,
      "value":value,
      "comment":comment,
      "spend_type":this.data.spend_type,
      "operate":sign
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
    var spend_type = this.data.spend_types[index]
    this.setData({spend_type:spend_type.text})
  },
  getStock:function(id){
    var stocks = this.data.stocks
    for(var i in stocks)
      if(stocks[i].id == id)
        return stocks[i]
  },
  addMoney:function(e){
    var id = e.target.id
    var stock = this.getStock(id)
    var money_popup_title = '+ '+stock.name
    var spend_type = this.data.spend_type //消费类型
    this.setData({
      show_money_popup:true,
      stock:stock,
      money_popup_title:money_popup_title,
      go_spend_sign:'+'
    })
  },
  reduceMoney:function(e){
    var id = e.target.id
    var stock = this.getStock(id)
    var money_popup_title = '- '+stock.name
    var spend_type = this.data.spend_type
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
  onShow:function(){
    this.getTabBar().init();
    var stocks = wx.getStorageSync('stocks') || []
    var comments = wx.getStorageSync('comments') || []
    var money_blocks = wx.getStorageSync('blocks') || []
    var spend_types = wx.getStorageSync('types') || []
    var spendLogs = wx.getStorageSync('spendLogs') || []
    
    this.setData({
      stocks:stocks,
      comments:comments,
      money_blocks:money_blocks,
      spend_types:spend_types,
      spend_type:spend_types.length>0?spend_types[0].text:"",
      spendLogs:spendLogs,
    })
  },
  stock_setting:function(){
    wx.navigateTo({
      url: 'stock_setting/stock_setting',
    })
  },
})
