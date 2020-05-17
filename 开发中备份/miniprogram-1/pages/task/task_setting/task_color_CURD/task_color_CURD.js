// 颜色json
// task_colors{
//   id
//   value #000
// }

import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data: {
    activeNames_color:[],
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

    task_color_id:null,
    task_color_id_error:"",
    picker_color:"#000",

    task_colors:[],
  },
  levelUp:function(e){
    var id = e.target.id
    var task_colors = this.data.task_colors

    for(var i in task_colors){
      if(task_colors[i].id == id){
        var temp = task_colors[i]
        var changeIndex = i-1<0?task_colors.length-1:i-1;

        //与前id互换
        task_colors[i]=task_colors[changeIndex];
        task_colors[changeIndex]=temp
        
        wx.showToast({
          icon:'none',
          title: '已更新颜色顺序',
        })

        break
      }
    }

    for(var i in task_colors)
      task_colors[i].id=i

    this.setData({task_colors:task_colors})
    wx.setStorageSync('task_colors', task_colors)
  },
  reset:function(){
    this.setData({
      task_color_id:null,
      task_color_id_error:"",
      picker_color:"#000",
    })
  },
  onShow:function(){
    var task_colors = wx.getStorageSync('task_colors')||[]
    this.setData({task_colors:task_colors})
  },
  onChange_van_collapse:function(event){
    this.setData({
      activeNames: event.detail
    });
  },
  update_task_color_id:function(e){
    this.setData({task_color_id:e.detail})
  },
  //选择改色时触发（在左侧色盘触摸或者切换右侧色相条）
  onChangeColor(e) {
    var htmlColor = e.detail.colorData.pickerData.hex
    this.setData({
      picker_color:htmlColor
    })
  },
  add:function(){
    var task_color = {"id":"","value":""}
    var task_colors = this.data.task_colors
    task_color.id = task_colors.length>0?task_colors[task_colors.length-1].id+1:1
    task_color.value = this.data.picker_color
    task_colors.push(task_color)
    wx.setStorageSync('task_colors', task_colors)
    this.setData({task_colors:task_colors})
    this.reset()

    wx.showToast({
      icon:'none',
      title: '添加成功',
    })
  },
  delete:function(e){
    var value = e.target.dataset.value
    var id = e.target.id

    if(id==1){
      wx.showToast({
        icon:'none',
        title: '默认颜色不可删除',
      })
      return;
    }

    Dialog.confirm({
      message: '你确定删除'+value+'吗?'
    }).then(() => {
      // on confirm
      var task_colors = this.data.task_colors
      for(var i in task_colors){
        if(task_colors[i].id == id){
          task_colors.splice(i,1)
          break
        }
      }
      wx.setStorageSync('task_colors', task_colors)
      this.setData({task_colors:task_colors})
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
    this.setData({task_color_id_error:"",activeNames:['1']})
    var id = e.target.id;
    this.getInput(id);
  },
  getInput:function(id){
    var task_color = this.getTaskColor(id)
    this.setData({
      task_color_id:task_color.id,
      picker_color:task_color.value,
    })
  },
  getTaskColor:function(id){
    var task_colors = this.data.task_colors
    for(var i in task_colors)
      if(task_colors[i].id == id)
        return task_colors[i]
  },
  update_taskLogs_color:function(oldColor,newColor){
    var tasks = wx.getStorageSync('tasks') || []
    for(var i in tasks){
      for(var j in tasks[i].types){
        if(j.indexOf('_')>=0){ //跳过统计
          continue;
        }
        var specificTasks = tasks[i].types[j]
        for(var k in specificTasks){ //每个任务
          if(specificTasks[k]!=null && specificTasks[k].color == oldColor){
            tasks[i].types[j][k].color = newColor
          }
        }
      }
    }
    wx.setStorageSync('tasks', tasks)
  },
  update:function(){
    if(this.data.task_color_id==null){
      this.setData({task_color_id_error:"无ID无法编辑"})
      return;
    }
    
    var task_color = {"id":"","value":""}
    task_color.id = this.data.task_color_id
    task_color.value = this.data.picker_color
    var task_colors = wx.getStorageSync('task_colors') || []
    for(var i in task_colors){
      if(task_colors[i].id == task_color.id){
        this.update_taskLogs_color(task_colors[i].value,task_color.value)
        task_colors[i]=task_color
        break;
      }
    }
    wx.setStorageSync('task_colors', task_colors)
    this.setData({task_colors:task_colors,activeNames: []})
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
  onChange_van_collapse_color:function(event){
    this.setData({
      activeNames_color: event.detail
    });
  },
})