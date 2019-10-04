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

    //余额间转账 相关
    showTransferModal:false,
    transferRange: [
      [
        "微信",
        "支付宝",
        "银行卡",
        "其他",
        "等待入账",
        "饭卡",
      ],
      [
        "微信",
        "支付宝",
        "银行卡",
        "其他",
        "饭卡",
        "待还",
      ],
    ],
    transferValue:[
      [
        "wx",
        "zfb",
        "yhk",
        "qt",
        "dd",
        "fk",
      ],
      [
        "wx",
        "zfb",
        "yhk",
        "qt",
        "fk",
        "dh",
      ],
    ],
    iIndex:0,
    jIndex:0,

    animation:"",
  },

  onLoad:function(){
    this.animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
    })

    this.animation.opacity(0).step({ duration: 0 }).opacity(1).step({ duration: 200 })
    this.setData({
      animation: this.animation.export(),
    })
  },

  //确认转账 从 " + this.data.transferValue[0][this.data.iIndex] + " 到 " + this.data.transferValue[1][this.data.jIndex] + " 转 " + e.detail.value["transfer_money"]
  goTransfer:function(e){
    //自转判定
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

      var money = parseFloat(e.detail.value["transfer_money"])
      var formStockValue = parseFloat(wx.getStorageSync(fromStockName)||0)
      var toStockValue = parseFloat(wx.getStorageSync(toStockName) || 0)
      
      formStockValue -=money
      
      if (toStockName=="dh_stock")
        toStockValue -= money
      else
        toStockValue +=money

      formStockValue = formStockValue.toFixed(2)
      toStockValue = toStockValue.toFixed(2)
      money =  money.toFixed(2)

      wx.setStorageSync(fromStockName, formStockValue)
      wx.setStorageSync(toStockName, toStockValue)

      //myDate[1] 时间
      var time = util.formatTime(new Date())
      var needPrintTime = time.split(" ")[0]
      var date = time.split("/")
      var myDate = date[2].split(" ")

      //写入今天的日志
      var formChinaName = this.data.transferRange[0][this.data.iIndex]
      var toChinaName = this.data.transferRange[1][this.data.jIndex]

      var isDhMsg = false; 
      if (toStockName == "dh_stock")
        isDhMsg = true;

      var msgForm = "-" + myDate[1] + " "+formChinaName + "-" + money.toString() + ": 转到" + toChinaName

      //花呗注释处理
      if (isDhMsg)
        var msgTo = "-" + myDate[1] + " "+toChinaName + "+" + money.toString() + ": "
      else
        var msgTo = "+" + myDate[1] + " " + toChinaName + "+" + money.toString() + ": "

      var logs = wx.getStorageSync('nowDayLogs') || []
      logs.push(msgForm)
      logs.push(msgTo)
      wx.setStorageSync('nowDayLogs', logs)

      this.onShow()
    }

    this.animation.opacity(0).step({ duration: 200 })
    this.setData({
      animation: this.animation.export(),
    })

    var that = this
    setTimeout(function () {
      that.setData({
        showTransferModal: false
      })
    }, 200)
  },

  //想要从iIndex转账jIndex
    //console.log(e.detail.value) 从transferValue[0][iIndex]到transferValue[1][jIndex]处理字段
  showWantTransfer:function(e){
    this.setData({
      iIndex:e.detail.value[0],
      jIndex:e.detail.value[1]
    })
  },

  //显示转账窗口
  wantTransfer:function(){
    this.setData({
      showTransferModal:true,
    })

    this.animation.opacity(1).step({ duration: 200 })
    this.setData({
      animation: this.animation.export(),
    })
  },

  //关闭转账窗口
  closeTransferModal:function(){
    this.animation.opacity(0).step({ duration: 200 })
    this.setData({
      animation: this.animation.export(),
    })

    var that = this
    setTimeout(function () {
      that.setData({
        showTransferModal: false
      })
    }, 200)
  },

  //关闭历史实现
  closeHistory:function(){
    this.animation.opacity(0).step({ duration: 200 })
    this.setData({
      animation: this.animation.export(),
    })

    var that = this
    setTimeout(function(){
      that.setData({ showMyHistories: false })
    },200)
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

  //显示历史实现
  showHistories:function(){
    this.setData({
      showMyHistories:true,
      histories:wx.getStorageSync('historyLogs')
    })

    this.animation.opacity(1).step({ duration: 200 })
    this.setData({
      animation: this.animation.export(),
    })
  },

  //点击+
  wantAdd:function(e){
    this.setData({
      sign:"+",
      showMyModal:true,
      choose:e.target.dataset.choose,
    })

    this.animation.opacity(1).step({ duration: 200 })
    this.setData({
      animation: this.animation.export(),
    })
  },
  //点击-
  wantSub:function(e){
    this.setData({
      sign: "-",
      showMyModal:true,
      choose: e.target.dataset.choose,
    })

    this.animation.opacity(1).step({ duration: 200 })
    this.setData({
      animation: this.animation.export(),
    })
  },

  //+-操作
  changeSubmit:function(e){
    var dhSign = ""; //待还标志
    var tempAllString = e.detail.value["input_value"]
    var tempSplitString = tempAllString.split(" ")
    var tempValue = ""
    var check = true;

    //数值填充
    var tempBeginString = tempSplitString[0].substring(0,1)
    if (tempBeginString!="" && tempBeginString >= '0' && tempBeginString <='9'){
      tempValue = tempSplitString[0]
    
      //注释填充 拼接注释字符串
      var tempNote = tempSplitString[1]||""
      for (var i in tempSplitString)
        if(i>1)
          tempNote += " "+tempSplitString[i]
      
      //wx
      if (this.data.choose == "微信") {
        if (this.data.sign == '+') {
          var temp = parseFloat(tempValue) + parseFloat(this.data.wx_stock)
          temp = temp.toFixed(2);
          this.data.wx_stock = temp.toString()
          wx.setStorageSync('wx_stock', this.data.wx_stock)
        }
        else {
          var temp = parseFloat(this.data.wx_stock) - parseFloat(tempValue)
          temp = temp.toFixed(2);
          this.data.wx_stock = temp.toString()
          wx.setStorageSync('wx_stock', this.data.wx_stock)
        }
      }
      //zfb
      else if (this.data.choose == "支付宝") {
        if (this.data.sign == '+') {
          var temp = parseFloat(tempValue) + parseFloat(this.data.zfb_stock)
          temp = temp.toFixed(2);
          this.data.zfb_stock = temp.toString()
          wx.setStorageSync('zfb_stock', this.data.zfb_stock)
        }
        else {
          var temp = parseFloat(this.data.zfb_stock) - parseFloat(tempValue)
          temp = temp.toFixed(2);
          this.data.zfb_stock = temp.toString()
          wx.setStorageSync('zfb_stock', this.data.zfb_stock)
        }
      }
      //yhk
      else if (this.data.choose == "银行卡") {
        if (this.data.sign == '+') {
          var temp = parseFloat(tempValue) + parseFloat(this.data.yhk_stock)
          temp = temp.toFixed(2);
          this.data.yhk_stock = temp.toString()
          wx.setStorageSync('yhk_stock', this.data.yhk_stock)
        }
        else {
          var temp = parseFloat(this.data.yhk_stock) - parseFloat(tempValue)
          temp = temp.toFixed(2);
          this.data.yhk_stock = temp.toString()
          wx.setStorageSync('yhk_stock', this.data.yhk_stock)
        }
      }
      //qt
      else if (this.data.choose == "其他") {
        if (this.data.sign == '+') {
          var temp = parseFloat(tempValue) + parseFloat(this.data.qt_stock)
          temp = temp.toFixed(2);
          this.data.qt_stock = temp.toString()
          wx.setStorageSync('qt_stock', this.data.qt_stock)
        }
        else {
          var temp = parseFloat(this.data.qt_stock) - parseFloat(tempValue)
          temp = temp.toFixed(2);
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
          var temp = parseFloat(tempValue) + parseFloat(this.data.dh_stock)
          temp = temp.toFixed(2);
          this.data.dh_stock = temp.toString()
          wx.setStorageSync('dh_stock', this.data.dh_stock)
        }
        else {
          var temp = parseFloat(this.data.dh_stock) - parseFloat(tempValue)
          temp = temp.toFixed(2);
          this.data.dh_stock = temp.toString()
          wx.setStorageSync('dh_stock', this.data.dh_stock)
        }
      }
      //fk
      else if (this.data.choose == "饭卡") {
        if (this.data.sign == '+') {
          var temp = parseFloat(tempValue) + parseFloat(this.data.fk_stock)
          temp = temp.toFixed(2);
          this.data.fk_stock = temp.toString()
          wx.setStorageSync('fk_stock', this.data.fk_stock)
        }
        else {
          var temp = parseFloat(this.data.fk_stock) - parseFloat(tempValue)
          temp = temp.toFixed(2);
          this.data.fk_stock = temp.toString()
          wx.setStorageSync('fk_stock', this.data.fk_stock)
        }
      }
      //dd
      else if (this.data.choose == "等待入账") {
        if (this.data.sign == '+') {
          var temp = parseFloat(tempValue) + parseFloat(this.data.dd_stock)
          temp = temp.toFixed(2);
          this.data.dd_stock = temp.toString()
          wx.setStorageSync('dd_stock', this.data.dd_stock)
        }
        else {
          var temp = parseFloat(this.data.dd_stock) - parseFloat(tempValue)
          temp = temp.toFixed(2);
          this.data.dd_stock = temp.toString()
          wx.setStorageSync('dd_stock', this.data.dd_stock)
        }
      }

      //tempValue 显示金额%.2f
      tempValue = parseFloat(tempValue).toFixed(2)
      tempValue = tempValue.toString()

      //myDate[1] 时间
      var time = util.formatTime(new Date())
      var needPrintTime = time.split(" ")[0]
      var date = time.split("/")
      var myDate = date[2].split(" ")

      //写入日志 eg:wx+10 测试 dhSign是a s前缀
      var msg ="";
      if(dhSign=="a"||dhSign=="s"){
        msg = dhSign +myDate[1]+" "+ this.data.choose + this.data.sign + tempValue + ": " + tempNote
      }
      else
        msg = this.data.sign + myDate[1] + " " + this.data.choose + this.data.sign + tempValue + ": " + tempNote
      
      var logs = wx.getStorageSync('nowDayLogs') || []
      logs.push(msg)
      wx.setStorageSync('nowDayLogs', logs)
    }

    //关闭窗口
    this.animation.opacity(0).step({ duration: 200 })
    this.setData({
      animation: this.animation.export(),
    })

    var that = this
    setTimeout(function () {
      that.setData({
        showMyModal: false
      })
    }, 200)

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
    this.animation.opacity(0).step({ duration: 200 })
    this.setData({
      animation: this.animation.export(),
    })

    var that = this
    setTimeout(function () {
      that.setData({
        showMyModal: false
      })
    }, 200)
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

    var tepmWxStock = parseFloat(this.data.wx_stock)
    var tempZfbStock = parseFloat(this.data.zfb_stock)
    var tempYhkStock = parseFloat(this.data.yhk_stock)
    var tempQtStock = parseFloat(this.data.qt_stock)
    var tempDhStock = parseFloat(this.data.dh_stock)
    var tempAimPrice = parseFloat(this.data.aimPrice)

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
})
