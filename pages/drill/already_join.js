Page({

  data: {
    grade: ["基础", "基础", "基础", "基础", "进阶", "进阶"],
    product:null,
    n:0,
    totalTime:'0秒',
    todayTime:'0秒',
    lastType:1
  },

  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id:id
    }) 
  },
  onShow: function (){
    var id = this.data.id
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/product/' + id + '',
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        var totalTime1 = res.data.product.userProduct.totalTime
        var totalTime2 = Math.floor(totalTime1 / 3600)
        var todayTime1 = res.data.product.userProduct.todayTime
        var todayTime2 = Math.floor(todayTime1 / 60)
        that.setData({
          lastType:res.data.product.userProduct.lastType,
          product: res.data.product,
          totalTime: totalTime2,
          todayTime: todayTime2,
          n: res.data.product.userProduct.percentage.toFixed(1)
        })
        wx.createSelectorQuery().selectViewport().boundingClientRect(function (rect) {
          var width = rect.width *150 / 750;
          var percentage = Math.round(res.data.product.userProduct.percentage)
          var rad = Math.PI * 2 / 100,
            endAngle = -Math.PI / 2 + percentage * rad,
            x = width / 2, y = width / 2, radius = width / 2 - 5;
          var ctx = wx.createCanvasContext('canvasArcCir1');
          ctx.setLineWidth(2);
          ctx.setStrokeStyle('#00cc97');
          ctx.setLineCap('round');
          ctx.beginPath();
          ctx.arc(x, y, radius, -Math.PI /2, endAngle, false);
          ctx.stroke()
          ctx.draw()
          var cxt_arc = wx.createCanvasContext('canvasCircle1');
          cxt_arc.setLineWidth(2);
          cxt_arc.setStrokeStyle('#b2b2b2');
          cxt_arc.setLineCap('round');
          cxt_arc.beginPath();
          if (percentage == 0) {
            cxt_arc.arc(x, y, radius, 0, 2 * Math.PI, false);
          } else {
            cxt_arc.arc(x, y, radius, endAngle, Math.PI *3/2, false);
          }
          cxt_arc.stroke();
          cxt_arc.draw();
        }).exec()
      }
    })  
  },
 //进入单词页
  bindReciteTap:function(e){
    wx.navigateTo({
      url: 'words/list?id=' + this.data.product.id + '&type=' + e.currentTarget.dataset.type+'&time=0&category=' + this.data.product.category,
    })
  }
})