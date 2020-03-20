// 花支类型json
// types{
//   id
//   text 名
//   icon //class="cuIcon-?"
//   type 花支类- 收入类+
// }

import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data: {
    custom_data:{"backText":"设置","content":"花支类型"},
    activeNames:[],

    activeNames_icon:[],
    icons:[],
    filled_icons:false,
    
    radio_value:'-', //type 花费类- 收入类+
    type_id:null,
    type_text:null,
    type_text_error:false,
    type_text_validate_error:"",
    type_id_error:"",
    type_icon:"question",

    types:[],
  },
  onChange_radio:function(e){
    this.setData({radio_value:e.detail})
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
    this.setData({type_icon:icon,activeNames_icon:[],filled_icons:false})
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
      radio_value:'-',
      type_id:null,
      type_text:null,
      type_text_error:false,
      type_text_validate_error:"",
      type_id_error:"",
      type_icon:"question",
    })
  },
  onShow:function(){
    var types = wx.getStorageSync('types')||[]
    this.setData({types:types})
  },
  onChange_van_collapse:function(event){
    this.setData({
      activeNames: event.detail
    });
  },
  update_type_id:function(e){
    this.setData({type_id:e.detail})
  },
  update_type_text:function(e){
    this.setData({type_text:e.detail})
  },
  add_name_validate:function(name){
    var types = wx.getStorageSync('types') || []
    for(var i in types)
      if(types[i].text==name)
        return true;
    return false;
  },
  add:function(){
    if(this.data.type_text == null){
      this.setData({type_text_error:true})
      return;
    }
    if(this.add_name_validate(this.data.type_text)){
      this.setData({type_text_validate_error:"名称已存在"})
      return;
    }

    var type = {"id":"","text":"","icon":"","type":""}
    var types = this.data.types
    type.id = types.length>0?types[types.length-1].id+1:1
    type.text = this.data.type_text
    type.icon = this.data.type_icon
    type.type = this.data.radio_value
    types.push(type)
    wx.setStorageSync('types', types)
    this.setData({types:types})
    this.reset()

    wx.showToast({
      icon:'none',
      title: '添加成功',
    })
  },
  delete:function(e){
    var text = e.target.dataset.text
    var id = e.target.id

    if(id==1 || id==2){
      wx.showToast({
        icon:'none',
        title: '无法删除',
      })
      return;
    }

    Dialog.confirm({
      message: '你确定删除'+text+'吗?'
    }).then(() => {
      // on confirm
      var types = this.data.types
      for(var i in types){
        if(types[i].id == id){
          types.splice(i,1)
          break
        }
      }
      wx.setStorageSync('types', types)
      this.setData({types:types})
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
    this.setData({type_id_error:"",activeNames:['1']})
    var id = e.target.id;
    this.getInput(id);
  },
  getInput:function(id){
    var type = this.getType(id)
    this.setData({
      type_id:type.id,
      type_text:type.text,
      type_icon:type.icon,
      radio_value:type.type
    })
  },
  getType:function(id){
    var types = this.data.types
    for(var i in types)
      if(types[i].id == id){
        return types[i]
      }
  },
  update_spendLogs:function(oldType,newType){
    var spendLogs = wx.getStorageSync('spendLogs') || []
    for(var i in spendLogs){
      var datas = spendLogs[i].datas
      for(var j in datas){
        if(oldType.text == datas[j].spend_type && oldType.icon == datas[j].icon){
          datas[j].icon = newType.icon
          datas[j].spend_type = newType.text
        }
      }
      spendLogs[i].datas = datas
    }
    wx.setStorageSync('spendLogs', spendLogs)
  },
  update:function(){
    if(this.data.type_id==null){
      this.setData({type_id_error:"无ID无法编辑"})
      return;
    }
    
    var type = {"id":"","text":""}
    type.id = this.data.type_id
    type.text = this.data.type_text
    type.icon = this.data.type_icon
    type.type = this.data.radio_value
    var types = wx.getStorageSync('types') || []
    for(var i in types){
      if(types[i].id == type.id){
        this.update_spendLogs(types[i],type) //更新花支日志类型
        types[i]=type
        break;
      }
    }
    wx.setStorageSync('types', types)
    this.setData({types:types,activeNames: []})
    this.reset()

    wx.showToast({
      icon:'none',
      title: '编辑成功',
    })
  },
})