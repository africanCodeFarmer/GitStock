import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data: {
    activeNames_color:[],
    picker_color:"#000",
    colorData: {
        //基础色相，即左侧色盘右上顶点的颜色，由右侧的色相条控制
        hueData: {
            colorStopRed: 255,
            colorStopGreen: 0,
            colorStopBlue: 0,
        },
        //选择点的信息（左侧色盘上的小圆点，即你选择的颜色）
        pickerData: {
            x: 0, //选择点x轴偏移量
            y: 480, //选择点y轴偏移量
            red: 0, 
            green: 0,
            blue: 0, 
            hex: '#000000'
        },
        //色相控制条的位置
        barY: 0
    },
    rpxRatio: 1, //此值为你的屏幕CSS像素宽度/750，单位rpx实际像素



    custom_data:{"backText":"设置","content":"任务颜色"},
    activeNames:[],

    comment_id:null,
    comment_name:null,
    comment_name_error:false,
    comment_id_error:"",

    comments:[],
  },
  reset:function(){
    this.setData({
      comment_id:null,
      comment_name:null,
      comment_name_error:false,
      comment_id_error:"",
    })
  },
  onShow:function(){
    var comments = wx.getStorageSync('comments')||[]
    this.setData({comments:comments})
  },
  onChange_van_collapse:function(event){
    this.setData({
      activeNames: event.detail
    });
  },
  update_comment_id:function(e){
    this.setData({comment_id:e.detail})
  },
  update_comment_name:function(e){
    this.setData({comment_name:e.detail})
  },
  add:function(){
    if(this.data.comment_name == null){
      this.setData({comment_name_error:true})
      return;
    }

    var comment = {"id":"","name":""}
    var comments = this.data.comments
    comment.id = comments.length>0?comments[comments.length-1].id+1:1
    comment.name = this.data.comment_name
    comments.push(comment)
    wx.setStorageSync('comments', comments)
    this.setData({comments:comments})
    this.reset()

    wx.showToast({
      icon:'none',
      title: '添加成功',
    })
  },
  delete:function(e){
    var name = e.target.dataset.name
    var id = e.target.id
    Dialog.confirm({
      message: '你确定删除'+name+'吗?'
    }).then(() => {
      // on confirm
      var comments = this.data.comments
      for(var i in comments){
        if(comments[i].id == id){
          comments.splice(i,1)
          break
        }
      }
      wx.setStorageSync('comments', comments)
      this.setData({comments:comments})
      this.reset()
    }).catch(() => {
      // on cancel
    });
  },
  edit:function(e){
    this.setData({comment_id_error:"",activeNames:['1']})
    var id = e.target.id;
    this.getInput(id);
  },
  getInput:function(id){
    var comment = this.getComment(id)
    this.setData({
      comment_id:comment.id,
      comment_name:comment.name,
    })
  },
  getComment:function(id){
    var comments = this.data.comments
    for(var i in comments)
      if(comments[i].id == id)
        return comments[i]
  },
  update:function(){
    if(this.data.comment_id==null){
      this.setData({comment_id_error:"无ID无法编辑"})
      return;
    }
    
    var comment = {"id":"","name":""}
    comment.id = this.data.comment_id
    comment.name = this.data.comment_name
    var comments = wx.getStorageSync('comments') || []
    for(var i in comments){
      if(comments[i].id == comment.id){
        comments[i]=comment
        break;
      }
    }
    wx.setStorageSync('comments', comments)
    this.setData({comments:comments,activeNames: []})
    this.reset()

    wx.showToast({
      icon:'none',
      title: '编辑成功',
    })
  },
  onLoad() {
    //设置rpxRatio
    var that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
            rpxRatio: res.screenWidth / 750
        })
      }
    })
  },
  //选择改色时触发（在左侧色盘触摸或者切换右侧色相条）
  onChangeColor(e) {
    var htmlColor = e.detail.colorData.pickerData.hex
    this.setData({
      picker_color:htmlColor
    })
  },
  onChange_van_collapse_color:function(event){
    this.setData({
      activeNames_icon: event.detail
    });
  },
})