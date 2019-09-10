const util = require('../../utils/util.js')
const app = getApp()

Page({
  data:{
    //用户头像 名字 个性签名
    userImagePath:"",
    userName:"",
    userNote:"",

    //完成的-线标记 任务数组 完成与否数组
    compeleteSign:[],
    tasks:[],
    checked:[],

    //每日任务 完成标记 和 任务 和 √情况
    dayCompeleteSign:[],
    dayTasks:[],
    dayChecked:[],

    showAddModal:false,

    //是否编辑模式
    isEdit:false,
    editId:0,
    input_note:"",

    //dayIsEdit:false,
    //dayEditId:0,

    //等级
    grade:0,
    exp:0,
    upNeedExp:10,

    //显示按钮与否数组 今天任务和每日任务
    showButtons: [],
    dayShowButtons:[],

    //任务等级
    choosed:[false,false,true],
    chooseType:2,

    //显示时 任务等级前缀012数组
    showChooseType:[],
    dayShowChooseType:[],

    //√完成的透明效果数组
    opacityColumn:[],
    dayOpacityColumn:[],

    animation:[],
    dayAnimation:[],

    animationInstance:"",

    addModalAnimation:"",

    isDayTask:false,

    //swiper高度
    swiperHeight:0,
  },

  //swiper改变
  changeSwiper:function(e){
    if(e.detail.current==1)
      this.setData({
        isDayTask:true,
      })
    else
      this.setData({
        isDayTask:false,
      })
  },

  //跳转到时间规划
  gotoTimedistribute:function(){
    wx.navigateTo({
      url: '../timeDistribute/timeDistribute',
    })
  },

  //三个框选一(任务等级 红橙黑)
  changeOneChoose:function(e){
    var tempChoosed = this.data.choosed
    for (var i in tempChoosed)
      if(i!=parseInt(e.detail.value[e.detail.value.length-1]))
        tempChoosed[i]=false;
      else
        tempChoosed[i]=true;

    this.setData({
      choosed: tempChoosed,
      chooseType: e.detail.value[e.detail.value.length - 1]
    })
  },

  onLoad:function(){
    var tasks = wx.getStorageSync('tasks')||[]

    this.animationInstance = wx.createAnimation({
      duration:1000,
      timingFunction:'linear',
    })
    this.addModalAnimation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
    })

    this.addModalAnimation.opacity(0).step({ duration: 0 }).opacity(1).step({ duration:200})
    this.setData({
      addModalAnimation: this.addModalAnimation.export(),
    })
  },

  //隐藏删除编辑按钮
  hideTwoButton:function(e){
    //日常区
    if(this.data.isDayTask){
      var id = e.target.id
      var dayShowButtons = wx.getStorageSync('dayShowButtons') || []
      dayShowButtons[id] = false
      wx.setStorageSync('dayShowButtons', dayShowButtons)

      this.onShow()

      this.animationInstance.translateX(0).step({duration:200})

      var tempdayAnimation = this.data.dayAnimation
      tempdayAnimation[id] = this.animationInstance.export()

      this.setData({
        dayAnimation: tempdayAnimation
      })
      wx.setStorageSync('dayAnimation', this.data.dayAnimation)
    }
    else{
      var id = e.target.id
      var showButtons = wx.getStorageSync('showButtons') || []
      showButtons[id] = false
      wx.setStorageSync('showButtons', showButtons)

      this.onShow()

      this.animationInstance.translateX(0).step({ duration: 200 })

      var tempAnimation = this.data.animation
      tempAnimation[id] = this.animationInstance.export()

      this.setData({
        animation: tempAnimation
      })
      wx.setStorageSync('animation', this.data.animation)
    }
  },
  //显示删除编辑按钮
  showTwoButton:function(e){
    //日常区
    if(this.data.isDayTask){
      var id = e.target.id
      var dayShowButtons = wx.getStorageSync('dayShowButtons')||[]
      dayShowButtons[id]=true
      wx.setStorageSync('dayShowButtons', dayShowButtons)

      this.onShow()

      this.animationInstance.translateX(-4).step({ duration: 200 })

      var tempdayAnimation = this.data.dayAnimation
      tempdayAnimation[id] = this.animationInstance.export()

      this.setData({
        dayAnimation: tempdayAnimation
      })
      wx.setStorageSync('dayAnimation', this.data.dayAnimation)
    }
    else{
      var id = e.target.id
      var showButtons = wx.getStorageSync('showButtons') || []
      showButtons[id] = true
      wx.setStorageSync('showButtons', showButtons)

      this.onShow()

      this.animationInstance.translateX(-4).step({ duration: 200 })

      var tempAnimation = this.data.animation
      tempAnimation[id] = this.animationInstance.export()

      this.setData({
        animation: tempAnimation
      })
      wx.setStorageSync('animation', this.data.animation)
    }
  },

  //跳转去设置头像昵称个性签名
  changeTaskSet:function(){
    wx.navigateTo({
      url: '../changeTaskSet/changeTaskSet',
    })
  },

  onShow:function(){
    clearTimeout()

    //获取屏幕高度 swiper
    var that = this
    wx.getSystemInfo({
      success:function(res){
        that.setData({
          swiperHeight: res.windowHeight*1.35
        })
      }
    })

    this.setData({
      animation: wx.getStorageSync('animation') || [],
      dayAnimation: wx.getStorageSync('dayAnimation') || [],

      userImagePath: (wx.getStorageSync('userImagePath') == "" || wx.getStorageSync('userImagePath')== "NaN") ? "photos/temp.png" : wx.getStorageSync('userImagePath'),
      userName: wx.getStorageSync('userName') || "",
      userNote: wx.getStorageSync('userNote') || "",

      tasks: (wx.getStorageSync('tasks') || []).map(log => {
        return log.substring(1)
      }),
      compeleteSign: wx.getStorageSync('compeleteSign') || [],
      checked: wx.getStorageSync('checked') || [],

      dayTasks: (wx.getStorageSync('dayTasks') || []).map(log => {
        return log.substring(1)
      }),
      dayCompeleteSign: wx.getStorageSync('dayCompeleteSign') || [],
      dayChecked: wx.getStorageSync('dayChecked') || [],

      exp: wx.getStorageSync('exp') || 0,
      grade: wx.getStorageSync('grade') || 0,

      showButtons:wx.getStorageSync('showButtons')||[],
      dayShowButtons: wx.getStorageSync('dayShowButtons') || [],

      showChooseType: (wx.getStorageSync('tasks') || []).map(log => {
        return log.substring(0,1)
      }),
      dayShowChooseType: (wx.getStorageSync('dayTasks') || []).map(log => {
        return log.substring(0, 1)
      })
    })

    //再次检查选中透明状态 每日任务区
    var tempOpacity = wx.getStorageSync('dayOpacityColumn')||[]
    for(var i in this.data.dayChecked)
      if (this.data.dayChecked[i]) {
        tempOpacity[i] = "opacity:0.6;";
      }
      else {
        tempOpacity[i] = "";
      }
    wx.setStorageSync('dayOpacityColumn', tempOpacity)
    this.setData({
      dayOpacityColumn: wx.getStorageSync('dayOpacityColumn') || [],
    })
    //今日任务
    tempOpacity = wx.getStorageSync('opacityColumn') || []
    for (var i in this.data.checked)
      if (this.data.checked[i]) {
        tempOpacity[i] = "opacity:0.6;";
      }
      else {
        tempOpacity[i] = "";
      }
    wx.setStorageSync('opacityColumn', tempOpacity)
    this.setData({
      opacityColumn: wx.getStorageSync('opacityColumn') || [],
    })

    //myDate[1] 时间
    var time = util.formatTime(new Date())
    var needPrintTime = time.split(" ")[0]
    var date = time.split("/")
    var myDate = date[2].split(" ")

    //重新写入日期和今日完成日志
    var logs = []
    var time = util.formatTime(new Date())
    var needPrintTime = time.split(" ")[0]
    logs.unshift("t" + needPrintTime)

    //今日完成
    var nowDayTaskLogs = wx.getStorageSync('nowDayTaskLogs')||[]
    //想要push到今日完成的数组
    var tempWantPushLogs = [];

    for (var i in this.data.tasks)
      if (this.data.checked[i]){
        if (nowDayTaskLogs.length>1)
          for (var j in nowDayTaskLogs){
            if(j==0) continue

            //拼接字符串
            var temp = nowDayTaskLogs[j].split(" ")
            var str = temp[1]
            for (var k in temp){
              if(k>1)
                str +=" "+temp[k]
            }

            if (str === this.data.tasks[i]){
              tempWantPushLogs.push(nowDayTaskLogs[j])
              break;
            }
            if (j == nowDayTaskLogs.length-1){
              tempWantPushLogs.push("r" +myDate[1]+" "+this.data.tasks[i])
              break;
            }
          }
        else
          tempWantPushLogs.push("r" + myDate[1] + " " + this.data.tasks[i])
      }

    for (var i in this.data.dayTasks)
      if (this.data.dayChecked[i]) {
        if(nowDayTaskLogs.length>1)
          for (var j in nowDayTaskLogs) {
            if (j == 0) continue

            //拼接字符串
            var temp = nowDayTaskLogs[j].split(" ")
            var str = temp[1]
            for (var k in temp) {
              if (k > 1)
                str += " " + temp[k]
            }

            if (str === this.data.dayTasks[i]) {
              tempWantPushLogs.push(nowDayTaskLogs[j])
              break;
            }
            if (j == nowDayTaskLogs.length - 1) {
              tempWantPushLogs.push("r" + myDate[1] + " " + this.data.dayTasks[i])
              break;
            }
          }
        else
          tempWantPushLogs.push("r" + myDate[1] + " " + this.data.dayTasks[i])
      }

    tempWantPushLogs.sort()
    for (var i in tempWantPushLogs)
      logs.push(tempWantPushLogs[i])
    wx.setStorageSync('nowDayTaskLogs', logs)
  },

  //点击checkbox(打勾完成操作)
  compeleteTask:function(e){
    //每日任务区
    if(this.data.isDayTask){
      var tempCompeleteSign = wx.getStorageSync('dayCompeleteSign')||[]
      var tempChecked = wx.getStorageSync('dayChecked')||[]

      var exp = wx.getStorageSync('exp') || 0
      var expMsg =""
      var isUp = true

      var id = parseInt(e.target.id)

      if(!tempChecked[id]){
        exp +=1
        expMsg="esp+1"
        tempChecked[id]=true;
        tempCompeleteSign[id] ="text-decoration:line-through;color:gray;";
      }
      else{
        if(exp-1<0){
          var tempGrade = parseInt(wx.getStorageSync('grade'))||0
          tempGrade -=1
          exp +=this.data.upNeedExp-1
          wx.setStorageSync('grade', tempGrade)
          isUp=false
        }
        else{
          exp -=1
          expMsg = "esp-1"
        }
        tempChecked[id] = false;
        tempCompeleteSign[id] = "";
      }

      //升级
      if(isUp)
      if(exp==this.data.upNeedExp){
        exp=0
        var tempGrade = parseInt(wx.getStorageSync('grade')) ||0
        tempGrade +=1
        wx.setStorageSync('grade', tempGrade)
        wx.showToast({
          icon:"none",
          title: "升级",
          duration: 1500,
        })
      }
      else{
        wx.showToast({
          icon:"none",
          title: expMsg,
          duration: 500,
        })
      }

      wx.setStorageSync('exp', exp)
      wx.setStorageSync('dayCompeleteSign', tempCompeleteSign)
      wx.setStorageSync('dayChecked', tempChecked)

      //选中就透明60%
      var tempOpacityColumn = wx.getStorageSync('dayOpacityColumn') || []
      if (tempChecked[id]){
        tempOpacityColumn[id]="opacity:0.6;";
      }
      else{
        tempOpacityColumn[id] = "";
      }
      wx.setStorageSync('dayOpacityColumn', tempOpacityColumn)

      this.onShow()
    }
    else{
      var tempCompeleteSign = wx.getStorageSync('compeleteSign') || []
      var tempChecked = wx.getStorageSync('checked') || []

      var exp = wx.getStorageSync('exp') || 0
      var expMsg = ""
      var isUp = true

      var id = parseInt(e.target.id)

      if (!tempChecked[id]) {
        exp += 1
        expMsg = "esp+1"
        tempChecked[id] = true;
        tempCompeleteSign[id] = "text-decoration:line-through;color:gray;";
      }
      else {
        if (exp - 1 < 0) {
          var tempGrade = parseInt(wx.getStorageSync('grade')) || 0
          tempGrade -= 1
          exp += this.data.upNeedExp - 1
          wx.setStorageSync('grade', tempGrade)
          isUp = false
        }
        else {
          exp -= 1
          expMsg = "esp-1"
        }
        tempChecked[id] = false;
        tempCompeleteSign[id] = "";
      }

      //升级
      if (isUp)
        if (exp == this.data.upNeedExp) {
          exp = 0
          var tempGrade = parseInt(wx.getStorageSync('grade')) || 0
          tempGrade += 1
          wx.setStorageSync('grade', tempGrade)
          wx.showToast({
            icon: "none",
            title: "升级",
            duration: 1500,
          })
        }
        else {
          wx.showToast({
            icon: "none",
            title: expMsg,
            duration: 500,
          })
        }

      wx.setStorageSync('exp', exp)
      wx.setStorageSync('compeleteSign', tempCompeleteSign)
      wx.setStorageSync('checked', tempChecked)

      //选中就透明60%
      var tempOpacityColumn = wx.getStorageSync('opacityColumn') || []
      if (tempChecked[id]) {
        tempOpacityColumn[id] = "opacity:0.6;";
      }
      else {
        tempOpacityColumn[id] = "";
      }
      wx.setStorageSync('opacityColumn', tempOpacityColumn)

      this.onShow()
    }
  },

  //添加编辑窗口的关闭
  addModalClose:function(){
    this.addModalAnimation.opacity(0).step({ duration: 200 })
    this.setData({
      addModalAnimation: this.addModalAnimation.export(),
    })

    var that = this
    setTimeout(function(){
       that.setData({ showAddModal: false, isEdit: false, })
    },200)
  },

  //删除按钮操作
  delete:function(e){
    //日常区
    if(this.data.isDayTask){
      var tempTasks = wx.getStorageSync('dayTasks') || []
      var tempCompeleteSign = wx.getStorageSync('dayCompeleteSign') || []
      var tempChecked = wx.getStorageSync('dayChecked') || []
      var tempShowButtons = wx.getStorageSync('dayShowButtons') || []
      var tempOpacityColumn = wx.getStorageSync('dayOpacityColumn') || []
      
      var id = parseInt(e.target.id)

      //按钮动画
      var tempAnimation = this.data.dayAnimation
      tempAnimation.splice(id,1)
      this.setData({
        dayAnimation: tempAnimation
      })
      wx.setStorageSync('dayAnimation', this.data.dayAnimation)

      tempOpacityColumn.splice(id, 1)
      tempShowButtons.splice(id,1)
      tempTasks.splice(id,1)
      tempCompeleteSign.splice(id,1)
      tempChecked.splice(id,1)

      wx.setStorageSync('dayOpacityColumn', tempOpacityColumn)
      wx.setStorageSync('dayShowButtons', tempShowButtons)
      wx.setStorageSync('dayTasks', tempTasks)
      wx.setStorageSync('dayCompeleteSign', tempCompeleteSign)
      wx.setStorageSync('dayChecked', tempChecked)
    }
    else{
      var tempTasks = wx.getStorageSync('tasks') || []
      var tempCompeleteSign = wx.getStorageSync('compeleteSign') || []
      var tempChecked = wx.getStorageSync('checked') || []
      var tempShowButtons = wx.getStorageSync('showButtons') || []
      var tempOpacityColumn = wx.getStorageSync('opacityColumn') || []

      var id = parseInt(e.target.id)

      //按钮动画
      var tempAnimation = this.data.animation
      tempAnimation.splice(id, 1)
      this.setData({
        animation: tempAnimation
      })
      wx.setStorageSync('animation', this.data.animation)

      tempOpacityColumn.splice(id, 1)
      tempShowButtons.splice(id, 1)
      tempTasks.splice(id, 1)
      tempCompeleteSign.splice(id, 1)
      tempChecked.splice(id, 1)

      wx.setStorageSync('opacityColumn', tempOpacityColumn)
      wx.setStorageSync('showButtons', tempShowButtons)
      wx.setStorageSync('tasks', tempTasks)
      wx.setStorageSync('compeleteSign', tempCompeleteSign)
      wx.setStorageSync('checked', tempChecked)
    }

    this.onShow()

    wx.showToast({
      icon: 'none',
      title: '删除成功',
      duration: 1000,
    })
  },

  //编辑按钮操作
  edit:function(e){
    //日常区
    if(this.data.isDayTask){
      var tempTasks = wx.getStorageSync('dayTasks')||[]
    }
    else{
      var tempTasks = wx.getStorageSync('tasks')||[]
    }

    //更新一下选取的字段
    var tempChoosed = this.data.choosed
    var editType = tempTasks[parseInt(e.target.id)].substring(0, 1)

    for (var i in [0, 1, 2])
      if (i.toString() == editType)
        tempChoosed[i] = true
      else
        tempChoosed[i] = false

    this.setData({
      choosed: tempChoosed,
      chooseType: editType,

      input_note: tempTasks[parseInt(e.target.id)].substring(1),
      showAddModal: true,
      isEdit: true,
      editId: e.target.id,
    })

    this.addModalAnimation.opacity(1).step({ duration: 200 })
    this.setData({
      addModalAnimation: this.addModalAnimation.export(),
    })
  },

  //添加任务操作 console.log(this.data.chooseType) 根据等级 0红 1橙 2黑(默认)
  goAddTask: function (e) {
    //每日任务区
    if(this.data.isDayTask){
      var tempTasks = wx.getStorageSync('dayTasks') || []
      var tempCompeleteSign = wx.getStorageSync('dayCompeleteSign') || []
      var tempChecked = wx.getStorageSync('dayChecked') || []
      var tempShowButtons = wx.getStorageSync('dayShowButtons') || []
      var tempOpacityColumn = wx.getStorageSync('dayOpacityColumn')||[]

      //批量添加处理
      var mulTasks = e.detail.value["input_task"].split("\n")

      if(!this.data.isEdit){
        var tempAnimation = this.data.dayAnimation
        for(var i in mulTasks){
          //任务为空不添加
          if (!mulTasks[mulTasks.length - i - 1]==""){
            tempAnimation.unshift("")
            tempOpacityColumn.unshift("")
            tempShowButtons.unshift(false)
            tempChecked.unshift(false)
            tempCompeleteSign.unshift("")
            tempTasks.unshift(this.data.chooseType+mulTasks[mulTasks.length-i-1])
          }
        }
      }
      else{ //编辑
        tempTasks[this.data.editId] = this.data.chooseType+e.detail.value["input_task"]
        tempShowButtons[this.data.editId] =false
      }
      
      //添加 按钮动画数组
      this.setData({
        dayAnimation:tempAnimation
      })

      wx.setStorageSync('dayAnimation', this.data.dayAnimation)
      wx.setStorageSync('dayOpacityColumn', tempOpacityColumn)
      wx.setStorageSync('dayShowButtons', tempShowButtons)
      wx.setStorageSync('dayTasks', tempTasks)
      wx.setStorageSync('dayCompeleteSign', tempCompeleteSign)
      wx.setStorageSync('dayChecked', tempChecked)
    }
    else{
      var tempTasks = wx.getStorageSync('tasks') || []
      var tempCompeleteSign = wx.getStorageSync('compeleteSign') || []
      var tempChecked = wx.getStorageSync('checked') || []
      var tempShowButtons = wx.getStorageSync('showButtons') || []
      var tempOpacityColumn = wx.getStorageSync('opacityColumn') || []

      //批量添加处理
      var mulTasks = e.detail.value["input_task"].split("\n")

      if (!this.data.isEdit) {
        var tempAnimation = this.data.animation
        for (var i in mulTasks) {
          //任务为空不添加
          if (!mulTasks[mulTasks.length - i - 1] == "") {
            tempAnimation.unshift("")
            tempOpacityColumn.unshift("")
            tempShowButtons.unshift(false)
            tempChecked.unshift(false)
            tempCompeleteSign.unshift("")
            tempTasks.unshift(this.data.chooseType + mulTasks[mulTasks.length - i - 1])
          }
        }
      }
      else { //编辑
        tempTasks[this.data.editId] = this.data.chooseType + e.detail.value["input_task"]
        tempShowButtons[this.data.editId] = false
      }

      //添加 按钮动画数组
      this.setData({
        animation: tempAnimation
      })

      wx.setStorageSync('animation', this.data.animation)
      wx.setStorageSync('opacityColumn', tempOpacityColumn)
      wx.setStorageSync('showButtons', tempShowButtons)
      wx.setStorageSync('tasks', tempTasks)
      wx.setStorageSync('compeleteSign', tempCompeleteSign)
      wx.setStorageSync('checked', tempChecked)
    }

    if (!this.data.isEdit)
      wx.showToast({
        icon: 'none',
        title: '添加成功',
        duration: 1000,
      })
    else
      wx.showToast({
        icon: 'none',
        title: '编辑成功',
        duration: 1000,
      })

    this.setData({
      showAddModal: false,
      isEdit: false,
    })

    this.onShow()
  },

  //显示添加编辑窗口
  addTask: function () {
    var tempChecked = [false,false,true]

    this.setData({
      choosed:tempChecked,
      chooseType:2,
      showAddModal: true,
    })

    this.addModalAnimation.opacity(1).step({ duration: 200 })
    this.setData({
      addModalAnimation: this.addModalAnimation.export(),
    })
  },
})
