const util = require('../../utils/util.js')

Page({
  data:{
    aimImagePath:"",
    aimName:"",
    aimPrice:"",
  },

  onShow:function(){
    this.setData({
      aimName: wx.getStorageSync('aimName')||"",
      aimPrice: wx.getStorageSync('aimPrice')||"",
      aimImagePath: wx.getStorageSync('aimImagePath') || "",
    })
  },

  //提交目标更改
  formSubmit:function(e){
    var tempMsg =""
    var that = this
    if(!(wx.getStorageSync('aimName')==""&&wx.getStorageSync('aimPrice')=="")){
      wx.showModal({
        title: '',
        content: '你之前的目标完成了吗?',
        confirmText:"yes",
        cancelText:"no",
        success:function(res){

          //点击:我已经实现了
          if (res.confirm) {

            //加入历史实现 historyLogs
            var time = util.formatTime(new Date())
            var histories = wx.getStorageSync('historyLogs') || []
            var tempHistory = time+" "+wx.getStorageSync('aimName')+": "+wx.getStorageSync('aimPrice')+" 成为现实"
            histories.unshift(tempHistory)
            wx.setStorageSync('historyLogs', histories)

            //显示反馈 
            tempMsg = "更改成功 实现历史+1"
          }
          else if(res.cancel){
            tempMsg = "更改目标成功"
          }


          //设置本地缓存
          var temp = e.detail.value
          wx.setStorageSync('aimImagePath', that.data.aimImagePath)
          wx.setStorageSync('aimName', temp["new_name"])
          wx.setStorageSync('aimPrice', temp["new_price"])

          //回主页
          setTimeout(function(){
            wx.navigateBack({})
          },1000)

          wx.showToast({
            icon: 'none',
            title: tempMsg,
            duration: 1000,
          })
        }
      })
    }
    else{
      //设置本地缓存
      var temp = e.detail.value
      wx.setStorageSync('aimImagePath', this.data.aimImagePath)
      wx.setStorageSync('aimName', temp["new_name"])
      wx.setStorageSync('aimPrice', temp["new_price"])

      //回主页
      setTimeout(function () {
        wx.navigateBack({})
      }, 1000)

      wx.showToast({
        icon: 'none',
        title: '更改目标成功',
        duration: 1000,
      })
    }
  },

  //选择新图片
  chooseNewImage:function(){
    var that = this
    wx.chooseImage({
      count:1,
      success:function(res){
        //res.tempFilePaths[0]
        wx.saveFile({
          tempFilePath: res.tempFilePaths[0],
          success:function(res){
            that.setData({
              aimImagePath:res.savedFilePath
            })
          }
        })
      }
    })
  }
})