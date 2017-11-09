//获取应用实例
var app = getApp()
var interval;
var varName;

Page({
  data: {
    grade:["基础","进阶"],
    n: [],
    user: [],
    examTime:0,
    totalTime: "0",
    // todayTime: "0",
    productList:null,
    recommendProductList:null,
    b:0,
  },
  onShow: function (options) {
    var that=this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/myself',
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
          var date1 = res.data.user.examTime.replace(/-|-/g, "/")
          var pl = ""
          if (date1.substr(0, 4) != '2017') {
            pl = "+"
          }
          var date3 = new Date(date1).getTime()
          var date2 = new Date().getTime()
          var date4 = (date3 - date2) / (24 * 60 * 60 * 1000);
          var examTime = parseInt(date4);
          if (examTime < 0) {
            examTime = 0;
          }
          var time1 = res.data.user.totalTime
          var time2 = Math.floor(time1 / 3600)
          // var time3 = res.data.user.todayTime
          var time4 = Math.floor(time1 / 60)
          that.setData({
            user: res.data.user,
            examTime: examTime + pl,
            totalTime: time2,
            // todayTime: time4
          })
      }
    })
   
    //发送请求GET
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/products/user',
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          productList:res.data.productList
        })
        var arr=[];
        wx.createSelectorQuery().selectViewport().boundingClientRect(function (rect) {
          var width = rect.width * 118 /750;
          res.data.productList.forEach(function (product, index) {
            var percentage = product.userProduct.percentage.toFixed(1)
            arr.push(percentage)
            var rad = Math.PI * 2 / 100,
              startAngle = -Math.PI / 2, endAngle = -Math.PI / 2 + percentage * rad,
              x = width / 2, y = width / 2, radius = width / 2 - 5;

            var ctx = wx.createCanvasContext('canvasArcCir' + index);
            ctx.setLineWidth(2);
            ctx.setStrokeStyle('#00cc97');
            ctx.setLineCap('round');
            ctx.beginPath();
            ctx.arc(x, y, radius, startAngle, endAngle, false);
            ctx.stroke()
            ctx.draw()
            var cxt_arc = wx.createCanvasContext('canvasCircle' + index);
            cxt_arc.setLineWidth(2);
            cxt_arc.setStrokeStyle('#b2b2b2');
            cxt_arc.setLineCap('round');
            cxt_arc.beginPath();
            if (percentage ==0){
              cxt_arc.arc(x, y, radius, 0, 2 * Math.PI, false);
            } else {
              cxt_arc.arc(x, y, radius, endAngle, Math.PI * 3 / 2 , false);
            }
            cxt_arc.stroke();
            cxt_arc.draw();

          })
          that.setData({
            n: arr
          })
        }).exec()
      }
    })
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/products/recommend',
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          recommendProductList: res.data.productList
        })
      }
    })          
  },

//跳往查单词页面
  bindsearchWordTap:function(){
     wx.navigateTo({
       url: 'drill/words/search',
     })
  },
  //跳往推荐页面
  bindrecommendTap: function () {
    wx.navigateTo({
      url: 'add_drill/recommend',
    })
  },
  //跳往评估页面
  bindTestGradeTap: function () {
    wx.navigateTo({
      url: 'drill/test_grade',
    })
  },
  //跳往添加页面
  bindAddTap:function(){
    wx.navigateTo({
      url: 'add_drill/add',
    })
  },
  //跳往产品页
  bindDrillTap:function(e){
    var product = e.currentTarget.dataset.product;
    if (product.isJoined == 1){
      wx.navigateTo({
        url: '/pages/drill/already_join?id=' + product.id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/drill/join?id=' + product.id,
      })
    }
  }
})