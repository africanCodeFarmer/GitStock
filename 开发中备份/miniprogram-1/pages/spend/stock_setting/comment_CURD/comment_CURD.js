// 注释块json
// comments{
//   id
//   name
// }

import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data: {
    custom_data:{"backText":"设置","content":"常用注释块"},
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

      wx.showToast({
        icon:'none',
        title: '删除成功',
      })
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
})