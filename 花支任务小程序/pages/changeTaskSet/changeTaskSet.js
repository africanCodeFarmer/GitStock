const util = require('../../utils/util.js')

Page({
  data:{
    userImagePath:"",
    userName:"",
    userNote:"",
  },

  onLoad:function(){
    this.setData({
      userImagePath: wx.getStorageSync('userImagePath') || "",
      userName: wx.getStorageSync('userName') || "",
      userNote: wx.getStorageSync('userNote') || "",
    })
  },

  //选择图片
  chooseNewImage: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        wx.saveFile({
          tempFilePath: res.tempFilePaths[0],
          success: function (res) {
            that.setData({
              userImagePath: res.savedFilePath
            })
          }
        })
      }
    })
  },
  
  //提交设置
  changeTaskSetSubmit:function(res){
    wx.setStorageSync('userName', res.detail.value["userName"])
    wx.setStorageSync('userNote', res.detail.value["userNote"])
    wx.setStorageSync('userImagePath', this.data.userImagePath)

    //回主页
    setTimeout(function () {
      wx.navigateBack({})
    }, 1000)

    wx.showToast({
      icon: 'none',
      title: '更改成功',
      duration: 1000,
    })
  }
})