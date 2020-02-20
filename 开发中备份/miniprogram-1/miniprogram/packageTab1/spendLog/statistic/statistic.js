import * as echarts from '../../ec-canvas/echarts';
var util = require('../../../pages/public/public')

var column_chart = null;
var pie_chart = null;

Page({
  data: {
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),

    ec_column_chart: {},
    ec_pie_chart: {},

    custom_data:{"backText":"花支日志","content":"统计"},

    show_timeChoose_popup:false,

    month_spend:0,
    month_income:0,
    month_title:0,
  },
  getSpendLogs_useTime(time){
    var result = []
    var spendLogs = wx.getStorageSync('spendLogs') || []
    for(var i in spendLogs){
      if(spendLogs[i].time.indexOf(time)>=0)
        result.push(spendLogs[i])
    }
    return result;
  },
  fill_month_income_and_month_spend(month_spendLogs){
    var month_income = 0
    var month_spend = 0
    for(var i in month_spendLogs){
      var day_spend = month_spendLogs[i].day_spend
      if(day_spend>=0)
        month_income += parseFloat(day_spend)
      else
        month_spend += parseFloat(day_spend)
    }
    month_income = month_income.toFixed(2)
    month_spend = month_spend.toFixed(2)

    this.setData({
      month_income:month_income,
      month_spend:month_spend
    })
  },
  fill_month_title:function(time){
    this.setData({month_title:time})
  },
  update_column_chart:function(month_spendLogs){
    var datas=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    for(var i in month_spendLogs){
      var time = parseInt(month_spendLogs[i].time.substr(8,2))-1 //数组基0
      datas[time]=parseFloat(month_spendLogs[i].day_spend).toFixed(2)
    }
    //2.21任务 用datas更新柱状图报错
    this.updateChart_column_chart(datas)
  },
  onShow:function(){
    var time = util.formatTime(new Date()).split(' ')[0]
    var yearAndMonth = time.substr(0,7) //2020/02

    //填充时间
    this.fill_month_title(time)
    //获取本月spendLogs
    var month_spendLogs = this.getSpendLogs_useTime(yearAndMonth)
    //填充月收入和月支出
    this.fill_month_income_and_month_spend(month_spendLogs)
    //更新柱状图
    this.update_column_chart(month_spendLogs)
  },

  timeChoose:function(e){
    console.log(util.formatTime(new Date(e.detail)))
    this.onClose_timeChoose_popup()
  },
  onInput_timeChoose:function(event) {
    this.setData({
      currentDate: event.detail
    });
  },
  onClick_timeChoose:function(){
    this.setData({show_timeChoose_popup:true})
  },
  onClose_timeChoose_popup:function(){
    this.setData({show_timeChoose_popup:false})
  },

  onLoad:function(){
    this.setData({
      ec_pie_chart: {
        onInit: this.initChart_pie
      },
      ec_column_chart: {
        onInit: this.initChart_column
      },
    })
  },

  //柱状图更新数据
  updateChart_column_chart:function(datas){
    var option = {
      title:{
        text:"本月每日花支"
      },
      color: ['#37a2da', '#32c5e9', '#67e0e3'],
      grid: {
        left: 0,
        right: 0,
        bottom: 15,
        top: 60,
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15',16,'17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisTick: { show: false },
          // data: ['汽车之家', '今日头条', '百度贴吧', '一点资讯', '微信', '微博', '知乎'],
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      tooltip: {
        trigger: 'axis',
        formatter: '{b}日: {c}',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      series: [
        {
          name: '花支',
          type: 'line',
          label: {
            normal: {
              show: false,
              position: 'inside'
            }
          },
          data: datas,
        }
      ]
    };

    column_chart.setOption(option);
  },
  //柱状图初始化
  initChart_column:function(canvas, width, height) {
    column_chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(column_chart);

    var option = {
      title:{
        text:"本月每日花支"
      },
      color: ['#37a2da', '#32c5e9', '#67e0e3'],
      // legend: {
      //   data: [],
      //   right:0
      // },
      grid: {
        left: 0,
        right: 0,
        bottom: 15,
        top: 60,
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15',16,'17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisTick: { show: false },
          // data: ['汽车之家', '今日头条', '百度贴吧', '一点资讯', '微信', '微博', '知乎'],
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      tooltip: {
        trigger: 'axis',
        formatter: '{b}日: {c}',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      series: [
        {
          name: '花支',
          type: 'line',
          label: {
            normal: {
              show: false,
              position: 'inside'
            }
          },
          data: [0,10000,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1099,0,0,0,0,0,0,0,0,0,0,0],
        }
      ]
    };

    column_chart.setOption(option);
    return column_chart;
  },

  //饼图初始化
  initChart_pie:function(canvas, width, height) {
    pie_chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(pie_chart);

    var option = {
      title: {
          text: '本月消费类型情况',
          left: 'left',
      },
      tooltip: {
          trigger: 'item',
          //formatter: '{a} {b} : {c} ({d}%)'
          formatter: '{b}: {c}\n{d}%'
      },
      visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
              colorLightness: [0, 1]
          }
      },
      series: [
          {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: [
                  {value: 335, name: '直接访问'},
                  {value: 310, name: '邮件营销'},
                  {value: 274, name: '联盟广告'},
                  {value: 235, name: '视频广告'},
                  {value: 400, name: '搜索引擎'}
              ].sort(function (a, b) { return a.value - b.value; }),
              roseType: 'radius',
              label: {
                show: true,
                formatter: "{b}\n{d}%"
              },
              labelLine: {
                  // lineStyle: {
                  //     color: '#000'
                  // },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
              },
              // itemStyle: {
              //   normal: {
              //     label: {
              //       show: true,
              //       position: 'inner',
              //       formatter: function(params) {
              //         return (params.percent - 0).toFixed(0) + '%'
              //       }
              //     },
              //     labelLine: {
              //       show: false
              //     }
              //   },
              //   emphasis: {
              //     label: {
              //       show: true,
              //       formatter: "{b}\n{d}%"
              //     }
              //   }
              // },

              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                  return Math.random() * 200;
              }
          }
      ]
    };

    pie_chart.setOption(option);
    return pie_chart;
  },
})