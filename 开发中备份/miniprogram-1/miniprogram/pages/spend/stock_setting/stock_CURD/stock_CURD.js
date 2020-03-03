// 余额字段json
// stocks{
//   id
//   name
//   value
//   status:allow|not allow|wait
// }

import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data: {
    custom_data:{"backText":"设置","content":"余额字段"},
    activeNames: [],
    
    radio_value:'1',
    stock_id:null,
    stock_name:null,
    stock_name_error:false,
    stock_id_error:"",
    stock_value:0.0,

    stocks:[],
    stock_status:["allow","not allow","wait"],
  },
  onLoad:function(){
    //设置导航栏颜色
    var custom_data = this.data.custom_data
    custom_data['bgColor'] = getApp().globalData.bgColor
    this.setData({
      custom_data:custom_data
    })
  },
  getStock:function(id){
    var stocks = this.data.stocks
    for(var i in stocks)
      if(stocks[i].id == id){
        return stocks[i]
      }
  },
  update:function(){
    if(this.data.stock_id==null){
      this.setData({stock_id_error:"无ID无法编辑"})
      return;
    }

    var stock = {"id":"","name":"","value":"","status":""}
    stock.id = this.data.stock_id
    stock.name = this.data.stock_name
    stock.value = this.data.stock_value
    stock.status = this.data.stock_status[this.data.radio_value-1]
    var stocks = wx.getStorageSync('stocks') || []
    for(var i in stocks){
      if(stocks[i].id == stock.id){
        stocks[i]=stock
        break;
      }
    }
    wx.setStorageSync('stocks', stocks)
    this.setData({stocks:stocks,activeNames: []})
    this.resetInput()

    wx.showToast({
      icon:'none',
      title: '编辑成功',
    })
  },
  getInput:function(id){
    var stock = this.getStock(id)
    var change = {"allow":"1","not allow":"2","wait":"3"}
    this.setData({
      radio_value:change[stock.status],
      stock_id:stock.id,
      stock_name:stock.name,
      stock_value:stock.value,
    })
  },
  resetInput:function(){
    this.setData({
      radio_value:'1',
      stock_id:null,
      stock_name:null,
      stock_name_error:false,
      stock_id_error:"",
      stock_value:0.0,
    })
  },
  onChange_radio:function(e){
    this.setData({radio_value:e.detail})
  },
  update_stock_id:function(e){
    this.setData({stock_id:e.detail})
  },
  update_stock_name:function(e){
    this.setData({stock_name:e.detail})
  },
  update_stock_value:function(e){
    this.setData({stock_value:e.detail})
  },
  add:function(){
    var id = this.data.stock_id
    var name = this.data.stock_name
    var value = this.data.stock_value
    var status = this.data.stock_status[this.data.radio_value-1]

    if(name!=null){
      var stocks = wx.getStorageSync('stocks') || []
      stocks.push({
        "id":stocks.length>0?stocks[stocks.length-1].id+1:1,
        "name":name,
        "value":value,
        "status":status,
      });
      wx.setStorageSync('stocks', stocks)

      this.setData({
        stocks:stocks
      })
      this.resetInput()
    }
    else{
      this.setData({
        stock_name_error:true
      })
    }

    wx.showToast({
      icon:'none',
      title: '添加成功',
    })
  },
  onShow:function(){
    var stocks = wx.getStorageSync('stocks') || []
    this.setData({stocks:stocks})
  },
  delete:function(e){
    var name = e.target.dataset.name
    var id = e.target.id
    Dialog.confirm({
      message: '你确定删除'+name+'吗?'
    }).then(() => {
      // on confirm
      var stocks = this.data.stocks
      for(var i in stocks){
        if(stocks[i].id == id){
          stocks.splice(i,1)
          break
        }
      }
      wx.setStorageSync('stocks', stocks)
      this.setData({stocks:stocks})
      this.resetInput()
    }).catch(() => {
      // on cancel
    });
  },
  edit:function(e){
    this.setData({stock_id_error:"",activeNames:['1']})
    var id = e.target.id;
    this.getInput(id);
  },
  onChange_van_collapse:function(event){
    this.setData({
      activeNames: event.detail
    });
  }
})