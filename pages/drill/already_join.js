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
        var product = res.data.product
        var examList = []
        if (product.category == 4) {
          examList = res.data.examList
        }
        var productVideoList = []
        if (product.category == 5){
          productVideoList = res.data.productVideoList
        }
        var n = res.data.product.userProduct.percentage.toFixed(1)
        if (n == 100.0){
          n =100
        }
        that.setData({
          lastType:res.data.product.userProduct.lastType,
          product: product,
          examList: examList,
          productVideoList: productVideoList,
          totalTime: totalTime2,
          todayTime: todayTime2,
          n: n
        },function(){
          wx.createSelectorQuery().selectViewport().boundingClientRect(function (rect) {
            var width = rect.width * 150 / 750;
            var percentage = Math.round(res.data.product.userProduct.percentage)
            var rad = Math.PI * 2 / 100,
              endAngle = -Math.PI / 2 + percentage * rad,
              x = width / 2, y = width / 2, radius = width / 2 - 5;
            var ctx = wx.createCanvasContext('canvasArcCir1');
            ctx.setLineWidth(2);
            ctx.setStrokeStyle('#00cc97');
            ctx.setLineCap('round');
            ctx.beginPath();
            ctx.arc(x, y, radius, -Math.PI / 2, endAngle, false);
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
              cxt_arc.arc(x, y, radius, endAngle, Math.PI * 3 / 2, false);
            }
            cxt_arc.stroke();
            cxt_arc.draw();

            if ((product.category == 2) || (product.category == 3)){
              var iconType = []
              var lineStatus = []
              var l = rect.width * 28 / 750;
              lineStatus.push((product.userProduct.list - 1) * 10 + product.userProduct.unit - 1)
              lineStatus.push(product.userProduct.group - 1)
              for (var i = 0 ;i<2;i++){
                if (lineStatus[i] == 0) {
                  iconType.push("iconfont icon-right")
                } else if (lineStatus[i] == 305) {
                  iconType.push("icon-finish")
                } else {
                  iconType.push("")
                  var ctx_pro = wx.createCanvasContext('canvasProgress'+i);
                  ctx_pro.setLineWidth(6);
                  ctx_pro.setLineCap('butt');
                  ctx_pro.beginPath();
                  ctx_pro.moveTo(0, l / 2);
                  ctx_pro.lineTo(l * lineStatus[i]/ 305, l / 2);
                  ctx_pro.setStrokeStyle('#00cc97');
                  ctx_pro.stroke();
                  ctx_pro.beginPath();
                  ctx_pro.moveTo(l * lineStatus[i] / 305, l / 2);
                  ctx_pro.lineTo(l, l / 2);
                  ctx_pro.setStrokeStyle('#b2b2b2');
                  ctx_pro.stroke();
                  ctx_pro.draw();
                }
              }
              that.setData({
                iconType: iconType
              })
            }

            if (product.category == 4) {
              var iconType = []
              var l = rect.width * 28 / 750;
              var userExamList = res.data.userExamList
              for (var i = 0; i < userExamList.length; i++) {
                if (userExamList[i] == null) {
                  iconType.push("iconfont icon-right")
                } else if (userExamList[i].status == 1) {
                  iconType.push("icon-finish")
                } else {
                  iconType.push("")
                  var ctx_pro = wx.createCanvasContext('canvasProgress' + i);
                  ctx_pro.setLineWidth(6);
                  ctx_pro.setLineCap('butt');
                  ctx_pro.beginPath();
                  ctx_pro.moveTo(0, l / 2);
                  ctx_pro.lineTo(l * userExamList[i].percentage / 100, l / 2);
                  ctx_pro.setStrokeStyle('#00cc97');
                  ctx_pro.stroke();
                  ctx_pro.beginPath();
                  ctx_pro.moveTo(l * userExamList[i].percentage / 100, l / 2);
                  ctx_pro.lineTo(l, l / 2);
                  ctx_pro.setStrokeStyle('#b2b2b2');
                  ctx_pro.stroke();
                  ctx_pro.draw();
                }
              }
              that.setData({
                iconType: iconType,
                userExamList: userExamList
              })
            }
          }).exec()
        
        })
      }  
    })  
  },
 //进入单词页
  bindReciteTap:function(e){
    if (this.data.product.category==5){
      var index = e.currentTarget.dataset.type
      wx.setStorageSync("productVideo", this.data.productVideoList[index])
      wx.navigateTo({
        url: 'video',
      })
    }
    if (this.data.product.category==4){
      var type = e.currentTarget.dataset.type
      var index = 0
      for (var i =0;i<this.data.examList.length;i++){
        if (this.data.examList[i].id == type){
          index = i
        }
      }
      wx.setStorageSync("sectionNumbers", this.data.examList[index].sectionNumbers)
      if (this.data.userExamList[index] == null){
        var that = this;
        var ticket = wx.getStorageSync('tempTicket')
        wx.request({
          url: 'https://weichen.bjtcsj.com/api/exam/' + this.data.examList[index].id + '/start',
          data: {},
          header: {
            'content-type': 'application/json',
            'ticket': ticket
          },
          method: 'POST',
          success: function (res) {
            wx.navigateTo({
              url: 'morningCall/start_exam?id=' + res.data.userExam.id,
            })
          }
        })
      } else {
        var userExam = this.data.userExamList[index]
        if (userExam.status==1){
          wx.navigateTo({
            url: 'morningCall/mockExamResult?id=' + userExam.id,
          })
        } else {
          if (userExam.currentPage == 'start_exam') {
            wx.navigateTo({
              url: 'morningCall/start_exam?id=' + userExam.id,
            })
          } else
            if (userExam.currentPage == 'start_section') {
              wx.navigateTo({
                url: 'morningCall/start_section?id=' + userExam.id,
              })
            } else {
              wx.navigateTo({
                url: 'morningCall/question?id=' + userExam.id + '&questionId=' + userExam.currentPage,
              })
            }
        }
      }
    }
    if ((this.data.product.category == 2) || (this.data.product.category == 3)){
      wx.navigateTo({
        url: 'words/list?id=' + this.data.product.id + '&type=' + e.currentTarget.dataset.type + '&time=0&category=' + this.data.product.category,
      })
    }
  }
})