var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

var amapFile = require('../../libs/amap-wx.js');

Page({
  data:{
    suggest:[],
    suggestKeyword:"",
    show_Location:true,

    longitude:0.0,
    latitude:0.0,

    markers:[],
    markers_schedule:[],

    markersData:[],
    markers_search:[],
    markers_search_poi:[],

    input_shop_name:"",

    tapMarker:{},

    showDetail:false,
    showScrollView:false,

    polyline:[{
      points:[],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],

    showWayViewStatus:false,
    animation:'',

    temperature:0,
    weather:"",
    city:"",

    allSpend:0.0,

    showWeather:false,
  },

  onLoad:function(){
    var that = this

    var myAmapFun = new amapFile.AMapWX({ key: 'e5627f4d2246135a5af0b6a6de2692c5' });
    myAmapFun.getWeather({
      success: function (data) {
        that.setData({
          temperature: data.temperature.data,
          weather: data.weather.data,
          city: data.city.data,
        })
      },
    })

    this.animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease-in',
    })

    qqmapsdk = new QQMapWX({
      key: 'ZQBBZ-CJ5WX-ZDS4X-7JPIF-ZLM4H-M3B3U'
    });

    wx.getLocation({
      type:'gcj02',
      success: function(res) {
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude,
        })
      },
    })
  },

  getSuggest:function(e){
    var that = this
    var location = this.data.latitude+","+this.data.longitude

    qqmapsdk.getSuggestion({
      keyword:e.detail.value,
      location: location,
      success:function(res){
        var sug=[]
        for (var i = 0; i < res.data.length;i++){
          sug.push({
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          })
        }
        that.setData({
          showDetail:false,
          showScrollView:true,
          suggest: sug,
          markers_search_poi:[],
        })
      }
    })
  },

  fillKeyword:function(e){
    var id = e.currentTarget.id
    var markers_search = []

    //markers_search
    markers_search.push({
      title: this.data.suggest[id].title,
      id: this.data.suggest[id].id,
      latitude: this.data.suggest[id].latitude,
      longitude: this.data.suggest[id].longitude,
      width: 20,
      height: 20
    })

    this.setData({
      markers_search: markers_search,

      suggestKeyword:this.data.suggest[id].title,
      suggest:[],

      latitude: this.data.suggest[id].latitude,
      longitude: this.data.suggest[id].longitude,
      show_Location:false,
    })

    this.onShow()
  },

  resetLocation:function(){
    var that = this

    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          show_Location:true,
        })
      },
    })

    wx.showToast({
      icon:'none',
      title: '重新定位成功',
      duration:1000,
    })
  },

  onShow:function(){
    var markers = []

    var myHashMap={}
    var markersData = this.data.markersData || []
    var markers_schedule = wx.getStorageSync('schedule') || this.data.markers_schedule
    var markers_search = this.data.markers_search
    var markers_search_poi = this.data.markers_search_poi

    //markersData添加缓存schedule里的data 才能响应tap
    for (var i = 0; i < markers_schedule.length; i++) {
      if (!myHashMap[markers_schedule[i].id]){
        myHashMap[markers_schedule[i].id]=true
        markers.push(markers_schedule[i])
        markersData.push(markers_schedule[i])
      }
    }

    for (var i = 0; i < markers_search.length;i++){
      if (!myHashMap[markers_search[i].id]) {
        myHashMap[markers_search[i].id] = true
        markers.push(markers_search[i])
      }
    }

    for (var i = 0; i < markers_search_poi.length;i++){
      if (!myHashMap[markers_search_poi[i].id]) {
        myHashMap[markers_search_poi[i].id] = true
        markers.push(markers_search_poi[i])
      }
    }

    var allSpend = 0
    for (var i = 0; i < markers_schedule.length; i++){
      allSpend += parseFloat(markers_schedule[i].spend)||0.0
    }

    this.setData({
      allSpend: allSpend,
      markers_schedule: markers_schedule,
      markersData: markersData,
      markers:markers
    })
  },

  showLocationPOI:function(e){
    var keyword = e.detail.value["input_shop_name"]||e.detail.value
    var that = this
    var location = this.data.latitude + "," + this.data.longitude

    qqmapsdk.search({
      keyword: keyword,
      page_size:20,
      location: location,
      success:function(res){
        var markersData = res.data
        var myHashMap = {}

        var markers_search_poi = []
        for (var i = 0; i < res.data.length;i++){
          if (!myHashMap[res.data[i].id]){
            myHashMap[res.data[i].id]=true;

            markers_search_poi.push({
              title: res.data[i].title,
              id: res.data[i].id,
              latitude: res.data[i].location.lat,
              longitude: res.data[i].location.lng,
              iconPath: "photos/poiIcon.png", //图标路径
              width: 16,
              height: 16,
            })
          }
        }

        //添加缓存schedule里的data 可能bug 目前安全
        var schedule = wx.getStorageSync('schedule') || []
        for (var i = 0; i < schedule.length; i++) {
          markersData.push(schedule[i])
        }

        that.setData({
          markersData: markersData,

          markers_search_poi: markers_search_poi,

          latitude: markers_search_poi[0].latitude || that.data.latitude,
          longitude: markers_search_poi[0].longitude || that.data.longitude,
        })
        that.onShow()
      }
    })
  },

  clearSearchKeyword:function(){
    this.setData({
      suggestKeyword:"",
      suggest:[],
    })
  },

  tapMarkers:function(e){
    var temp = {};
    for (var i = 0; i < this.data.markersData.length;i++)
      if(this.data.markersData[i].id === e.markerId){
        temp = this.data.markersData[i]
      }

    this.setData({
      tapMarker: temp,
      showScrollView:false,
      showDetail: true,
    })
  },

  removeSchedule:function(){
    var markers_schedule = this.data.markers_schedule
    for (var i = 0; i < markers_schedule.length; i++)
      if (markers_schedule[i].id == this.data.tapMarker.id)
        markers_schedule.splice(i,1)

    var markers = this.data.markers
    for (var i = 0; i < markers.length; i++)
      if (markers[i].id == this.data.tapMarker.id)
        markers[i].iconPath = "photos/poiIcon.png"
    
    this.setData({
      markers_schedule: markers_schedule,
      markers: markers,
    })

    //删除对应的polyline
    // var polyline = this.data.polyline
    // var compareLat = this.data.tapMarker.location.lat
    // var compareLng = this.data.tapMarker.location.lng
    // for (var i = 0; i < polyline[0].points.length;i++){
    //   var lat = polyline[0].points[i].latitude
    //   var lng = polyline[0].points[i].longitude
    //   if (compareLat == lat && compareLng==lng){
    //     polyline[0].points.splice(i,1)
    //     break;
    //   }
    // }
    // this.setData({
    //   polyline: polyline
    // })
    //console.log(this.data.tapMarker.location.lat) //lat lng

    //更新缓存
    wx.setStorageSync('schedule', markers_schedule)

    this.onShow()

    wx.showToast({
      icon: 'none',
      title: '移除成功',
      duration: 1000,
    })
  },

  addSchedule:function(e){
    var markers_schedule = this.data.markers_schedule

    //加入行程后在markers_search_poi删除原来的点 更新爱心图标
    var markers_search_poi = this.data.markers_search_poi
    var markers = this.data.markers
    for (var i = 0; i < markers_search_poi.length;i++)
      if (markers_search_poi[i].id == this.data.tapMarker.id)
        markers_search_poi.splice(i,1)
    for (var i = 0; i < markers.length; i++)
      if (markers[i].id == this.data.tapMarker.id)
        markers[i].iconPath = "photos/markers_schedule.png"

    var exist = false
    for (var i = 0; i < markers_schedule.length;i++){
      if (markers_schedule[i].id == this.data.tapMarker.id){
        wx.showToast({
          icon:'none',
          title: '更新成功',
          duration:1000,
        })
        exist=true;

        //更新
        //var all_input = e.detail.value['all_input'].split("'")

        markers_schedule[i]={
          play: e.detail.value.play,
          spend: e.detail.value.spend,
          way: e.detail.value.way,
          time: e.detail.value.time,
          location: { lat: this.data.tapMarker.location.lat, lng: this.data.tapMarker.location.lng },
          address: this.data.tapMarker.address,
          exist: true,

          title: this.data.tapMarker.title,
          id: this.data.tapMarker.id,
          latitude: this.data.tapMarker.location.lat,
          longitude: this.data.tapMarker.location.lng,
          iconPath: "photos/markers_schedule.png", //图标路径
          width: 16,
          height: 16,
        }

        break;
      }
    }
    
    if(!exist){
      markers_schedule.push({
        play: e.detail.value.play,
        spend: e.detail.value.spend,
        way: e.detail.value.way,
        time: e.detail.value.time,
        location: { lat: this.data.tapMarker.location.lat, lng: this.data.tapMarker.location.lng },
        address: this.data.tapMarker.address,
        exist: true,

        title: this.data.tapMarker.title,
        id: this.data.tapMarker.id,
        latitude: this.data.tapMarker.location.lat,
        longitude: this.data.tapMarker.location.lng,
        iconPath: "photos/markers_schedule.png", //图标路径
        width: 16,
        height: 16,
      })

      wx.showToast({
        icon: 'none',
        title: '添加成功',
        duration: 1000,
      })
    }

    var markers = this.data.markers
    markers.push(markers_schedule)
    this.setData({
      markers: markers,
    })

    //更新费用
    var allSpend = 0
    for (var i = 0; i < markers_schedule.length; i++) {
      allSpend += parseFloat(markers_schedule[i].spend) || 0.0
    }

    this.setData({
      allSpend: allSpend,
      markers_schedule: markers_schedule,
      markers_search_poi: markers_search_poi,
    })

    //加入polyline 路线
    // var polyline = this.data.polyline
    // polyline[0].points.push({
    //   latitude: markers_schedule[markers_schedule.length-1].latitude,
    //   longitude: markers_schedule[markers_schedule.length-1].longitude
    // })

    // this.setData({
    //   polyline: polyline
    // })

    //加入缓存
    wx.setStorageSync('schedule', markers_schedule)

    this.onShow()
  },

  clearSearchPOI:function(){
    this.setData({
      input_shop_name:""
    })
  },

  searchPOI:function(){
    
  },

  clickScheduleColumn:function(e){
    // console.log(e.target.id)
    var markers = this.data.markers

    for(var i=0;i<markers.length;i++){
      if (markers[i].id == e.target.id){
        this.setData({
          latitude: markers[i].latitude,
          longitude: markers[i].longitude,
        })
      }
    }

    //console.log(e)
    var temp = {};
    for (var i = 0; i < this.data.markersData.length; i++)
      if (this.data.markersData[i].id === e.target.id) {
        temp = this.data.markersData[i]
      }

    this.setData({
      tapMarker: temp,
      showScrollView: false,
      showDetail: true,
    })
  },

  //显示路线 不做
  showWay:function(){
    this.animation.translateY(-220).step({ duration: 400 })
    this.setData({
      animation: this.animation.export(),
      showWayViewStatus:true
    })
  },

  closeShowWayView:function(){
    this.animation.translateY(0).step({ duration: 400 })
    this.setData({
      animation: this.animation.export(),
    })

    var that = this
    setTimeout(function(){
      that.setData({
        showWayViewStatus: false,
      })
    },400)
  },

  clearSchedule:function(){
    var that = this
    wx.showModal({
      title: '删除所有安排点?',
      confirmText:'yes',
      cancelText:'no',
      success:function(res){
        if(res.confirm){
          wx.removeStorageSync('schedule')
          that.onShow()

          that.setData({
            allSpend:0.0,
            markers: [],
            markers_schedule: [],

            markersData: [],
            markers_search: [],
            markers_search_poi: [],
          })

          wx.showToast({
            icon: 'none',
            title: '删除成功',
            duration: 1000,
          })
        }
      }
    })
  },

  showWeather:function(){
    var weatherStatus = this.data.showWeather
    if(weatherStatus)
      this.setData({
        showWeather:false
      })
    else
      this.setData({
        showWeather: true
      })
  },

  showInputBlurMsg:function(){
    wx.showToast({
      icon:'none',
      title: '请点击 加改行程 保存',
      duration:2400,
    })
  }
})