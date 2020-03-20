// 任务类型json
// task_types{
//   id
//   text 名
//   icon //class="cuIcon-?"
// }

import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data: {
    custom_data:{"backText":"设置","content":"任务类型"},
    activeNames:[],

    activeNames_icon:[],
    icons:[],
    filled_icons:false,
    
    task_type_id:null,
    task_type_text:null,
    task_type_text_error:false,
    task_type_id_error:"",
    task_type_icon:"question",

    task_types:[],
  },
  fill_icons:function(){
    var icons = [{
      name: 'appreciate',
      
    }, {
      name: 'check',
      
    }, {
      name: 'close',
      
    }, {
      name: 'edit',
      
    }, {
      name: 'emoji',
      
    }, {
      name: 'favorfill',
      
    }, {
      name: 'favor',
      
    }, {
      name: 'loading',
      
    }, {
      name: 'locationfill',
      
    }, {
      name: 'location',
      
    }, {
      name: 'phone',
      
    }, {
      name: 'roundcheckfill',
      
    }, {
      name: 'roundcheck',
      
    }, {
      name: 'roundclosefill',
      
    }, {
      name: 'roundclose',
      
    }, {
      name: 'roundrightfill',
      
    }, {
      name: 'roundright',
      
    }, {
      name: 'search',
      
    }, {
      name: 'taxi',
      
    }, {
      name: 'timefill',
      
    }, {
      name: 'time',
      
    }, {
      name: 'unfold',
      
    }, {
      name: 'warnfill',
      
    }, {
      name: 'warn',
      
    }, {
      name: 'camerafill',
      
    }, {
      name: 'camera',
      
    }, {
      name: 'commentfill',
      
    }, {
      name: 'comment',
      
    }, {
      name: 'likefill',
      
    }, {
      name: 'like',
      
    }, {
      name: 'notificationfill',
      
    }, {
      name: 'notification',
      
    }, {
      name: 'order',
      
    }, {
      name: 'samefill',
      
    }, {
      name: 'same',
      
    }, {
      name: 'deliver',
      
    }, {
      name: 'evaluate',
      
    }, {
      name: 'pay',
      
    }, {
      name: 'send',
      
    }, {
      name: 'shop',
      
    }, {
      name: 'ticket',
      
    }, {
      name: 'back',
      
    }, {
      name: 'cascades',
      
    }, {
      name: 'discover',
      
    }, {
      name: 'list',
      
    }, {
      name: 'more',
      
    }, {
      name: 'scan',
      
    }, {
      name: 'settings',
      
    }, {
      name: 'questionfill',
      
    }, {
      name: 'question',
      
    }, {
      name: 'shopfill',
      
    }, {
      name: 'form',
      
    }, {
      name: 'pic',
      
    }, {
      name: 'filter',
      
    }, {
      name: 'footprint',
      
    }, {
      name: 'top',
      
    }, {
      name: 'pulldown',
      
    }, {
      name: 'pullup',
      
    }, {
      name: 'right',
      
    }, {
      name: 'refresh',
      
    }, {
      name: 'moreandroid',
      
    }, {
      name: 'deletefill',
      
    }, {
      name: 'refund',
      
    }, {
      name: 'cart',
      
    }, {
      name: 'qrcode',
      
    }, {
      name: 'remind',
      
    }, {
      name: 'delete',
      
    }, {
      name: 'profile',
      
    }, {
      name: 'home',
      
    }, {
      name: 'cartfill',
      
    }, {
      name: 'discoverfill',
      
    }, {
      name: 'homefill',
      
    }, {
      name: 'message',
      
    }, {
      name: 'addressbook',
      
    }, {
      name: 'link',
      
    }, {
      name: 'lock',
      
    }, {
      name: 'unlock',
      
    }, {
      name: 'vip',
      
    }, {
      name: 'weibo',
      
    }, {
      name: 'activity',
      
    }, {
      name: 'friendaddfill',
      
    }, {
      name: 'friendadd',
      
    }, {
      name: 'friendfamous',
      
    }, {
      name: 'friend',
      
    }, {
      name: 'goods',
      
    }, {
      name: 'selection',
      
    }, {
      name: 'explore',
      
    }, {
      name: 'present',
      
    }, {
      name: 'squarecheckfill',
      
    }, {
      name: 'square',
      
    }, {
      name: 'squarecheck',
      
    }, {
      name: 'round',
      
    }, {
      name: 'roundaddfill',
      
    }, {
      name: 'roundadd',
      
    }, {
      name: 'add',
      
    }, {
      name: 'notificationforbidfill',
      
    }, {
      name: 'explorefill',
      
    }, {
      name: 'fold',
      
    }, {
      name: 'game',
      
    }, {
      name: 'redpacket',
      
    }, {
      name: 'selectionfill',
      
    }, {
      name: 'similar',
      
    }, {
      name: 'appreciatefill',
      
    }, {
      name: 'infofill',
      
    }, {
      name: 'info',
      
    }, {
      name: 'forwardfill',
      
    }, {
      name: 'forward',
      
    }, {
      name: 'rechargefill',
      
    }, {
      name: 'recharge',
      
    }, {
      name: 'vipcard',
      
    }, {
      name: 'voice',
      
    }, {
      name: 'voicefill',
      
    }, {
      name: 'friendfavor',
      
    }, {
      name: 'wifi',
      
    }, {
      name: 'share',
      
    }, {
      name: 'wefill',
      
    }, {
      name: 'we',
      
    }, {
      name: 'lightauto',
      
    }, {
      name: 'lightforbid',
      
    }, {
      name: 'lightfill',
      
    }, {
      name: 'camerarotate',
      
    }, {
      name: 'light',
      
    }, {
      name: 'barcode',
      
    }, {
      name: 'flashlightclose',
      
    }, {
      name: 'flashlightopen',
      
    }, {
      name: 'searchlist',
      
    }, {
      name: 'service',
      
    }, {
      name: 'sort',
      
    }, {
      name: 'down',
      
    }, {
      name: 'mobile',
      
    }, {
      name: 'mobilefill',
      
    }, {
      name: 'copy',
      
    }, {
      name: 'countdownfill',
      
    }, {
      name: 'countdown',
      
    }, {
      name: 'noticefill',
      
    }, {
      name: 'notice',
      
    }, {
      name: 'upstagefill',
      
    }, {
      name: 'upstage',
      
    }, {
      name: 'babyfill',
      
    }, {
      name: 'baby',
      
    }, {
      name: 'brandfill',
      
    }, {
      name: 'brand',
      
    }, {
      name: 'choicenessfill',
      
    }, {
      name: 'choiceness',
      
    }, {
      name: 'clothesfill',
      
    }, {
      name: 'clothes',
      
    }, {
      name: 'creativefill',
      
    }, {
      name: 'creative',
      
    }, {
      name: 'female',
      
    }, {
      name: 'keyboard',
      
    }, {
      name: 'male',
      
    }, {
      name: 'newfill',
      
    }, {
      name: 'new',
      
    }, {
      name: 'pullleft',
      
    }, {
      name: 'pullright',
      
    }, {
      name: 'rankfill',
      
    }, {
      name: 'rank',
      
    }, {
      name: 'bad',
      
    }, {
      name: 'cameraadd',
      
    }, {
      name: 'focus',
      
    }, {
      name: 'friendfill',
      
    }, {
      name: 'cameraaddfill',
      
    }, {
      name: 'apps',
      
    }, {
      name: 'paintfill',
      
    }, {
      name: 'paint',
      
    }, {
      name: 'picfill',
      
    }, {
      name: 'refresharrow',
      
    }, {
      name: 'colorlens',
      
    }, {
      name: 'markfill',
      
    }, {
      name: 'mark',
      
    }, {
      name: 'presentfill',
      
    }, {
      name: 'repeal',
      
    }, {
      name: 'album',
      
    }, {
      name: 'peoplefill',
      
    }, {
      name: 'people',
      
    }, {
      name: 'servicefill',
      
    }, {
      name: 'repair',
      
    }, {
      name: 'file',
      
    }, {
      name: 'repairfill',
      
    }, {
      name: 'taoxiaopu',
      
    }, {
      name: 'weixin',
      
    }, {
      name: 'attentionfill',
      
    }, {
      name: 'attention',
      
    }, {
      name: 'commandfill',
      
    }, {
      name: 'command',
      
    }, {
      name: 'communityfill',
      
    }, {
      name: 'community',
      
    }, {
      name: 'read',
      
    }, {
      name: 'calendar',
      
    }, {
      name: 'cut',
      
    }, {
      name: 'magic',
      
    }, {
      name: 'backwardfill',
      
    }, {
      name: 'playfill',
      
    }, {
      name: 'stop',
      
    }, {
      name: 'tagfill',
      
    }, {
      name: 'tag',
      
    }, {
      name: 'group',
      
    }, {
      name: 'all',
      
    }, {
      name: 'backdelete',
      
    }, {
      name: 'hotfill',
      
    }, {
      name: 'hot',
      
    }, {
      name: 'post',
      
    }, {
      name: 'radiobox',
      
    }, {
      name: 'rounddown',
      
    }, {
      name: 'upload',
      
    }, {
      name: 'writefill',
      
    }, {
      name: 'write',
      
    }, {
      name: 'radioboxfill',
      
    }, {
      name: 'punch',
      
    }, {
      name: 'shake',
      
    }, {
      name: 'move',
      
    }, {
      name: 'safe',
      
    }, {
      name: 'activityfill',
      
    }, {
      name: 'crownfill',
      
    }, {
      name: 'crown',
      
    }, {
      name: 'goodsfill',
      
    }, {
      name: 'messagefill',
      
    }, {
      name: 'profilefill',
      
    }, {
      name: 'sound',
      
    }, {
      name: 'sponsorfill',
      
    }, {
      name: 'sponsor',
      
    }, {
      name: 'upblock',
      
    }, {
      name: 'weblock',
      
    }, {
      name: 'weunblock',
      
    }, {
      name: 'my',
      
    }, {
      name: 'myfill',
      
    }, {
      name: 'emojifill',
      
    }, {
      name: 'emojiflashfill',
      
    }, {
      name: 'flashbuyfill',
      
    }, {
      name: 'text',
      
    }, {
      name: 'goodsfavor',
      
    }, {
      name: 'musicfill',
      
    }, {
      name: 'musicforbidfill',
      
    }, {
      name: 'card',
      
    }, {
      name: 'triangledownfill',
      
    }, {
      name: 'triangleupfill',
      
    }, {
      name: 'roundleftfill-copy',
      
    }, {
      name: 'font',
      
    }, {
      name: 'title',
      
    }, {
      name: 'recordfill',
      
    }, {
      name: 'record',
      
    }, {
      name: 'cardboardfill',
      
    }, {
      name: 'cardboard',
      
    }, {
      name: 'formfill',
      
    }, {
      name: 'coin',
      
    }, {
      name: 'cardboardforbid',
      
    }, {
      name: 'circlefill',
      
    }, {
      name: 'circle',
      
    }, {
      name: 'attentionforbid',
      
    }, {
      name: 'attentionforbidfill',
      
    }, {
      name: 'attentionfavorfill',
      
    }, {
      name: 'attentionfavor',
      
    }, {
      name: 'titles',
      
    }, {
      name: 'icloading',
      
    }, {
      name: 'full',
      
    }, {
      name: 'mail',
      
    }, {
      name: 'peoplelist',
      
    }, {
      name: 'goodsnewfill',
      
    }, {
      name: 'goodsnew',
      
    }, {
      name: 'medalfill',
      
    }, {
      name: 'medal',
      
    }, {
      name: 'newsfill',
      
    }, {
      name: 'newshotfill',
      
    }, {
      name: 'newshot',
      
    }, {
      name: 'news',
      
    }, {
      name: 'videofill',
      
    }, {
      name: 'video',
      
    }, {
      name: 'exit',
      
    }, {
      name: 'skinfill',
      
    }, {
      name: 'skin',
      
    }, {
      name: 'moneybagfill',
      
    }, {
      name: 'usefullfill',
      
    }, {
      name: 'usefull',
      
    }, {
      name: 'moneybag',
      
    }, {
      name: 'redpacket_fill',
      
    }, {
      name: 'subscription',
      
    }, {
      name: 'loading1',
      
    }, {
      name: 'github',
      
    }, {
      name: 'global',
      
    }, {
      name: 'settingsfill',
      
    }, {
      name: 'back_android',
      
    }, {
      name: 'expressman',
      
    }, {
      name: 'evaluate_fill',
      
    }, {
      name: 'group_fill',
      
    }, {
      name: 'play_forward_fill',
      
    }, {
      name: 'deliver_fill',
      
    }, {
      name: 'notice_forbid_fill',
      
    }, {
      name: 'fork',
      
    }, {
      name: 'pick',
      
    }, {
      name: 'wenzi',
      
    }, {
      name: 'ellipse',
      
    }, {
      name: 'qr_code',
      
    }, {
      name: 'dianhua',
      
    }, {
      name: 'loading2',
      
    }, {
      name: 'btn',
      
    }]
    this.setData({icons:icons})
  },
  choose_icon:function(e){
    var icon = e.currentTarget.dataset.icon
    this.setData({task_type_icon:icon,activeNames_icon:[],filled_icons:false})
  },
  onChange_van_collapse_icon:function(event){
    if(!this.data.filled_icons){
      wx.showLoading({
        title: '',
        mask:true,
      })
      this.setData({filled_icons:true})
      this.fill_icons()
      wx.hideLoading({
        complete: (res) => {},
      })
    }
    else{
      this.setData({filled_icons:false,icons:[]})
    }
    this.setData({
      activeNames_icon: event.detail
    });
  },
  reset:function(){
    this.setData({
      task_type_id:null,
      task_type_id_error:"",
      task_type_text:null,
      task_type_text_error:false,
      task_type_icon:"question",
    })
  },
  onShow:function(){
    var task_types = wx.getStorageSync('task_types')||[]
    this.setData({task_types:task_types})
  },
  onChange_van_collapse:function(event){
    this.setData({
      activeNames: event.detail
    });
  },
  update_task_type_id:function(e){
    this.setData({task_type_id:e.detail})
  },
  update_task_type_text:function(e){
    this.setData({task_type_text:e.detail})
  },
  add:function(){
    if(this.data.task_type_text == null){
      this.setData({task_type_text_error:true})
      return;
    }

    var task_type = {"id":"","text":"","icon":""}
    var task_types = this.data.task_types
    task_type.id = task_types.length>0?task_types[task_types.length-1].id+1:1
    task_type.text = this.data.task_type_text
    task_type.icon = this.data.task_type_icon
    task_types.push(task_type)
    wx.setStorageSync('task_types', task_types)
    this.setData({task_types:task_types})
    this.reset()

    wx.showToast({
      icon:'none',
      title: '添加成功',
    })
  },
  delete:function(e){
    var text = e.target.dataset.text
    var id = e.target.id

    if(id==1){
      wx.showToast({
        icon:'none',
        title: '默认类型不可删除',
      })
      return;
    }

    Dialog.confirm({
      message: '你确定删除'+text+'吗?'
    }).then(() => {
      // on confirm
      var task_types = this.data.task_types
      for(var i in task_types){
        if(task_types[i].id == id){
          task_types.splice(i,1)
          break
        }
      }
      wx.setStorageSync('task_types', task_types)
      this.setData({task_types:task_types})
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
    this.setData({task_type_id_error:"",activeNames:['1']})
    var id = e.target.id;
    this.getInput(id);
  },
  getInput:function(id){
    var task_type = this.getTaskType(id)
    this.setData({
      task_type_id:task_type.id,
      task_type_text:task_type.text,
      task_type_icon:task_type.icon,
    })
  },
  getTaskType:function(id){
    var task_types = this.data.task_types
    for(var i in task_types)
      if(task_types[i].id == id){
        return task_types[i]
      }
  },
  update_taskLogs_type:function(oldType,newType){
    var tasks = wx.getStorageSync('tasks') || []
    for(var i in tasks){
      for(var j in tasks[i].types){
        if(j.indexOf('_')>=0){ //跳过统计
          continue;
        }
        var specificTasks = tasks[i].types[j]
        for(var k in specificTasks){ //每个任务
          if(specificTasks[k]!=null && specificTasks[k].type == oldType.text){
            tasks[i].types[j][k].type = newType.text
            tasks[i].types[j][k].icon = newType.icon
          }
        }
      }
    }
    wx.setStorageSync('tasks', tasks)
  },
  update:function(){
    if(this.data.task_type_id==null){
      this.setData({task_type_id_error:"无ID无法编辑"})
      return;
    }
    
    var task_type = {"id":"","text":"","icon":""}
    task_type.id = this.data.task_type_id
    task_type.text = this.data.task_type_text
    task_type.icon = this.data.task_type_icon
    var task_types = wx.getStorageSync('task_types') || []
    for(var i in task_types){
      if(task_types[i].id == task_type.id){
        this.update_taskLogs_type(task_types[i],task_type)
        task_types[i]=task_type
        break;
      }
    }
    wx.setStorageSync('task_types', task_types)
    this.setData({task_types:task_types,activeNames: []})
    this.reset()

    wx.showToast({
      icon:'none',
      title: '编辑成功',
    })
  },
})