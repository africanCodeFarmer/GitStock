//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data:{
    //目标图片 名字 价格
    aimImagePath:"photos/wait.jpg",
    aimName:"",
    aimPrice:"",

    //各余额量
    wx_stock:0,
    zfb_stock: 0,
    yhk_stock: 0,
    qt_stock: 0,
    dh_stock: 0,
    dd_stock: 0,
    fk_stock:0,

    showMyModal:false,

    //选择+或者- 选择wx
    sign:"+",
    choose:"",

    //前段进度条值
    aimPercent:'0',

    //实现历史相关
    showMyHistories:false,
    histories:[],

    showTransferModal:false,
    transferRange: [
      [
        "微信",
        "支付宝",
        "银行卡",
        "其他",
        "等待入账",
      ],
      [
        "微信",
        "支付宝",
        "银行卡",
        "其他",
        "饭卡",
      ],
    ],
    transferValue:[
      [
        "wx",
        "zfb",
        "yhk",
        "qt",
        "dd",
      ],
      [
        "wx",
        "zfb",
        "yhk",
        "qt",
        "fk",
      ],
    ],
    iIndex:0,
    jIndex:0,
  },

  //确认转账
  goTransfer:function(e){
    // console.log("从 " + this.data.transferValue[0][this.data.iIndex] + " 到 " + this.data.transferValue[1][this.data.jIndex] + " 转 " + e.detail.value["transfer_money"])
    if (this.data.transferValue[0][this.data.iIndex] == this.data.transferValue[1][this.data.jIndex]){
      wx.showToast({
        icon:'none',
        title: '不能自己转给自己',
        duration:1000,
      })
    }
    else{
      var fromStockName = this.data.transferValue[0][this.data.iIndex]+"_stock"
      var toStockName = this.data.transferValue[1][this.data.jIndex]+"_stock"
      var money = parseInt(e.detail.value["transfer_money"])
      
      var formStockValue = parseInt(wx.getStorageSync(fromStockName)||0)
      var toStockValue = parseInt(wx.getStorageSync(toStockName) || 0)
      //console.log(formStockValue + " " + toStockValue)
      
      formStockValue -=money
      toStockValue +=money
      
      wx.setStorageSync(fromStockName, formStockValue)
      wx.setStorageSync(toStockName, toStockValue)

      //写入今天的日志
      var formChinaName = this.data.transferRange[0][this.data.iIndex]
      var toChinaName = this.data.transferRange[1][this.data.jIndex]

      var msgForm = "-" + formChinaName + "-" + money.toString() + ": 转到" + toChinaName
      var msgTo = "+" + toChinaName + "+" + money.toString() + ": 收到" + formChinaName+"转账"
      var logs = wx.getStorageSync('nowDayLogs') || []
      logs.push(msgForm)
      logs.push(msgTo)
      wx.setStorageSync('nowDayLogs', logs)

      this.onShow()
    }

    this.setData({
      showTransferModal:false
    })
  },

  showWantTransfer:function(e){
    this.setData({
      iIndex:e.detail.value[0],
      jIndex:e.detail.value[1]
    })
    //console.log(e.detail.value) 从transferValue[0][iIndex]到transferValue[1][jIndex]处理字段
  },

  wantTransfer:function(){
    this.setData({
      showTransferModal:true,
    })
  },

  closeTransferModal:function(){
    this.setData({
      showTransferModal:false
    })
  },

  //关闭历史实现
  closeHistory:function(){
    this.setData({
      showMyHistories:false
    })
  },

  //清空历史实现
  clearHistory: function () {
    var that = this
    wx.showModal({
      title: '',
      content: '确定删除历史实现?',
      showCancel: true,
      cancelText: 'no',
      cancelColor: '',
      confirmText: 'yes',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('historyLogs')
          that.setData({
            histories:[]
          })

          wx.showToast({
            icon:'none',
            title: '清空成功',
            duration:1000,
          })
        }
      }
    })
  },

  //展示历史实现
  showHistories:function(){
    this.setData({
      showMyHistories:true,
      histories:wx.getStorageSync('historyLogs')
    })
  },

  //点击+
  wantAdd:function(e){
    this.setData({
      sign:"+",
      showMyModal:true,
      choose:e.target.dataset.choose,
    })
  },
  //点击-
  wantSub:function(e){
    this.setData({
      sign: "-",
      showMyModal:true,
      choose: e.target.dataset.choose,
    })
  },

  //+-操作
  changeSubmit:function(e){
    //待还标志
    var dhSign = "";

    var tempAllString = e.detail.value["input_value"]
    var tempSplitString = tempAllString.split(" ")
    var tempValue = ""
    var check = true;
    //数值检测填充
    var tempBeginString = tempSplitString[0].substring(0,1)
    if (tempBeginString!="" && tempBeginString >= '0' && tempBeginString <='9'){
      tempValue = tempSplitString[0]
    
      //注释填充
      var tempNote =""
      if (tempSplitString.length>1)
        tempNote = tempSplitString[tempSplitString.length - 1]
      
      //wx
      if (this.data.choose == "微信") {
        if (this.data.sign == '+') {
          var temp = parseInt(tempValue) + parseInt(this.data.wx_stock)
          this.data.wx_stock = temp.toString()
          wx.setStorageSync('wx_stock', this.data.wx_stock)
        }
        else {
          var temp = parseInt(this.data.wx_stock) - parseInt(tempValue)
          this.data.wx_stock = temp.toString()
          wx.setStorageSync('wx_stock', this.data.wx_stock)
        }
      }
      //zfb
      else if (this.data.choose == "支付宝") {
        if (this.data.sign == '+') {
          var temp = parseInt(tempValue) + parseInt(this.data.zfb_stock)
          this.data.zfb_stock = temp.toString()
          wx.setStorageSync('zfb_stock', this.data.zfb_stock)
        }
        else {
          var temp = parseInt(this.data.zfb_stock) - parseInt(tempValue)
          this.data.zfb_stock = temp.toString()
          wx.setStorageSync('zfb_stock', this.data.zfb_stock)
        }
      }
      //yhk
      else if (this.data.choose == "银行卡") {
        if (this.data.sign == '+') {
          var temp = parseInt(tempValue) + parseInt(this.data.yhk_stock)
          this.data.yhk_stock = temp.toString()
          wx.setStorageSync('yhk_stock', this.data.yhk_stock)
        }
        else {
          var temp = parseInt(this.data.yhk_stock) - parseInt(tempValue)
          this.data.yhk_stock = temp.toString()
          wx.setStorageSync('yhk_stock', this.data.yhk_stock)
        }
      }
      //qt
      else if (this.data.choose == "其他") {
        if (this.data.sign == '+') {
          var temp = parseInt(tempValue) + parseInt(this.data.qt_stock)
          this.data.qt_stock = temp.toString()
          wx.setStorageSync('qt_stock', this.data.qt_stock)
        }
        else {
          var temp = parseInt(this.data.qt_stock) - parseInt(tempValue)
          this.data.qt_stock = temp.toString()
          wx.setStorageSync('qt_stock', this.data.qt_stock)
        }
      }
      //dh
      else if (this.data.choose == "待还") {
        if (this.data.sign == '+')
          dhSign = "a";
        else
          dhSign = "s";

        if (this.data.sign == '+') {
          var temp = parseInt(tempValue) + parseInt(this.data.dh_stock)
          this.data.dh_stock = temp.toString()
          wx.setStorageSync('dh_stock', this.data.dh_stock)
        }
        else {
          var temp = parseInt(this.data.dh_stock) - parseInt(tempValue)
          this.data.dh_stock = temp.toString()
          wx.setStorageSync('dh_stock', this.data.dh_stock)
        }
      }
      //fk
      else if (this.data.choose == "饭卡") {
        if (this.data.sign == '+') {
          var temp = parseInt(tempValue) + parseInt(this.data.fk_stock)
          this.data.fk_stock = temp.toString()
          wx.setStorageSync('fk_stock', this.data.fk_stock)
        }
        else {
          var temp = parseInt(this.data.fk_stock) - parseInt(tempValue)
          this.data.fk_stock = temp.toString()
          wx.setStorageSync('fk_stock', this.data.fk_stock)
        }
      }
      //dd
      else if (this.data.choose == "等待入账") {
        if (this.data.sign == '+') {
          var temp = parseInt(tempValue) + parseInt(this.data.dd_stock)
          this.data.dd_stock = temp.toString()
          wx.setStorageSync('dd_stock', this.data.dd_stock)
        }
        else {
          var temp = parseInt(this.data.dd_stock) - parseInt(tempValue)
          this.data.dd_stock = temp.toString()
          wx.setStorageSync('dd_stock', this.data.dd_stock)
        }
      }

      //写入日志 eg:wx+10 测试 dhSign是a s前缀
      var msg ="";
      if(dhSign=="a"||dhSign=="s"){
        msg = dhSign + this.data.choose + this.data.sign + tempValue + ": " + tempNote
      }
      else
        msg = this.data.sign + this.data.choose + this.data.sign + tempValue + ": " + tempNote
      
      var logs = wx.getStorageSync('nowDayLogs') || []
      logs.push(msg)
      wx.setStorageSync('nowDayLogs', logs)
    }

    //关闭窗口
    this.setData({
      showMyModal:false
    })

    //刷新页面
    this.onShow()

    wx.showToast({
      icon:'none',
      title: '操作成功',
      duration:1000,
    })
  },

  //关闭按钮
  closeButton:function(){
    this.setData({
      showMyModal:false
    })
  },

  onShow:function(){
    clearTimeout()

    this.setData({
      aimImagePath: (wx.getStorageSync('aimImagePath') == "" || wx.getStorageSync('aimImagePath') == "NaN") ? "photos/wait.jpg" : wx.getStorageSync('aimImagePath'),
      aimName:wx.getStorageSync('aimName'),
      aimPrice:wx.getStorageSync('aimPrice'),

      wx_stock: (wx.getStorageSync('wx_stock') == "" || wx.getStorageSync('wx_stock') =="NaN") ? '0' : wx.getStorageSync('wx_stock'),
      zfb_stock: (wx.getStorageSync('zfb_stock') == "" || wx.getStorageSync('zfb_stock') == "NaN") ? '0' : wx.getStorageSync('zfb_stock'),
      yhk_stock: (wx.getStorageSync('yhk_stock') == "" || wx.getStorageSync('yhk_stock') == "NaN") ? '0' : wx.getStorageSync('yhk_stock'),
      qt_stock: (wx.getStorageSync('qt_stock') == "" || wx.getStorageSync('qt_stock') == "NaN") ? '0' : wx.getStorageSync('qt_stock'),
      dh_stock: (wx.getStorageSync('dh_stock') == "" || wx.getStorageSync('dh_stock') == "NaN") ? '0' : wx.getStorageSync('dh_stock'),
      fk_stock: (wx.getStorageSync('fk_stock') == "" || wx.getStorageSync('fk_stock') == "NaN") ? '0' : wx.getStorageSync('fk_stock'),
      dd_stock: (wx.getStorageSync('dd_stock') == "" || wx.getStorageSync('dd_stock') == "NaN") ? '0' : wx.getStorageSync('dd_stock'),
    })

    var tepmWxStock = parseInt(this.data.wx_stock)
    var tempZfbStock = parseInt(this.data.zfb_stock)
    var tempYhkStock = parseInt(this.data.yhk_stock)
    var tempQtStock = parseInt(this.data.qt_stock)
    var tempDhStock = parseInt(this.data.dh_stock)
    var tempAimPrice = parseInt(this.data.aimPrice)

    this.setData({
      aimPercent: (((tepmWxStock + tempZfbStock + tempYhkStock + tempQtStock) / (tempAimPrice + tempDhStock))*100).toFixed(2)
    })
  },

  //设置目标跳转
  change:function(){
    wx.navigateTo({
      url: '../change/change',
    })
  },

  onLoad: function () {  
  },
})
