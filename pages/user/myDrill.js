// pages/user/myDrill.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: null,
    n: [],
  },

  onShow: function () {
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/products/user',
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        that.setData({
          productList: res.data.productList
        })
        var arr = [];
        wx.createSelectorQuery().selectViewport().boundingClientRect(function (rect) {
          var width = rect.width * 118 / 750;
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
            if (percentage == 0) {
              cxt_arc.arc(x, y, radius, 0, 2 * Math.PI, false);
            } else {
              cxt_arc.arc(x, y, radius, endAngle, Math.PI * 3 / 2, false);
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
  },

  bindDrillTap: function (e) {
    var product = e.currentTarget.dataset.product;
    wx.navigateTo({
      url: '../drill/already_join?id=' + product.id,
    })
  }
})