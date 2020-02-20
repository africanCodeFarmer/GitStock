import * as echarts from '../../ec-canvas/echarts';
var util = require('../../../pages/public/public')

let column_chart = null;
let pie_chart = null;

Page({
  data: {
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),

    ec_column_chart: {},
    ec_pie_chart: {},

    custom_data:{"backText":"花支日志","content":"统计"},

    show_timeChoose_popup:false,
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