// 金额块json
// blocks{
//   id
//   value
// }

import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data: {
    custom_data:{"backText":"设置","content":"可选金额块"},
    activeNames:[],

    block_id:null,
    block_value:null,
    block_value_error:false,
    block_id_error:"",

    blocks:[],
  },
  reset:function(){
    this.setData({
      block_id:null,
      block_value:null,
      block_value_error:false,
      block_id_error:"",
    })
  },
  onShow:function(){
    var blocks = wx.getStorageSync('blocks')||[]
    this.setData({blocks:blocks})
  },
  onChange_van_collapse:function(event){
    this.setData({
      activeNames: event.detail
    });
  },
  update_block_id:function(e){
    this.setData({block_id:e.detail})
  },
  update_block_value:function(e){
    this.setData({block_value:e.detail})
  },
  add:function(){
    if(this.data.block_value == null){
      this.setData({block_value_error:true})
      return;
    }

    var block = {"id":"","value":""}
    var blocks = this.data.blocks
    block.id = blocks.length>0?blocks[blocks.length-1].id+1:1
    block.value = this.data.block_value
    blocks.push(block)
    wx.setStorageSync('blocks', blocks)
    this.setData({blocks:blocks})
    this.reset()

    wx.showToast({
      icon:'none',
      title: '添加成功',
    })
  },
  delete:function(e){
    var value = e.target.dataset.value
    var id = e.target.id
    Dialog.confirm({
      message: '你确定删除'+value+'吗?'
    }).then(() => {
      // on confirm
      var blocks = this.data.blocks
      for(var i in blocks){
        if(blocks[i].id == id){
          blocks.splice(i,1)
          break
        }
      }
      wx.setStorageSync('blocks', blocks)
      this.setData({blocks:blocks})
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
    this.setData({block_id_error:"",activeNames:['1']})
    var id = e.target.id;
    this.getInput(id);
  },
  getInput:function(id){
    var block = this.getBlock(id)
    this.setData({
      block_id:block.id,
      block_value:block.value,
    })
  },
  getBlock:function(id){
    var blocks = this.data.blocks
    for(var i in blocks)
      if(blocks[i].id == id)
        return blocks[i]
  },
  update:function(){
    if(this.data.block_id==null){
      this.setData({block_id_error:"无ID无法编辑"})
      return;
    }
    
    var block = {"id":"","value":""}
    block.id = this.data.block_id
    block.value = this.data.block_value
    var blocks = wx.getStorageSync('blocks') || []
    for(var i in blocks){
      if(blocks[i].id == block.id){
        blocks[i]=block
        break;
      }
    }
    wx.setStorageSync('blocks', blocks)
    this.setData({blocks:blocks,activeNames: []})
    this.reset()

    wx.showToast({
      icon:'none',
      title: '编辑成功',
    })
  },
})