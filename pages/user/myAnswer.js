// pages/user/myAnswer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    discussAnswerList: [],
    id: '',
    headImgUrl: '',
    nickName: null,
  },
  onLoad: function (options) {
    this.setData({
      headImgUrl: options.src,
      nickName: options.nickName,
    })
  },
  onShow:function(){
    var that=this;
    that.AnswerGetData(that)
  },
  //获取回答数据
  AnswerGetData: function (that) {
    var ticket = wx.getStorageSync('tempTicket');
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/discuss/my_answers',
      data: {
        page:1,
        size:99,
      },
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var ary = res.data.discussAnswerList;
        if (ary.length) {
          for (var i = 0; i < ary.length; i++) {
            var date1 = ary[i].createdTime.replace(/-|-/g, "/")
            var date3 = new Date(date1).getTime()
            var date2 = new Date().getTime()
            var date4 = (date2 - date3) / 1000;
            if (date4 < 60) {
              ary[i].createdTime = "刚刚回答"
            }
            if (date4 >= 60) {
              ary[i].createdTime = Math.floor(date4 / 60) + "分钟前回答"
            }
            if (date4 >= 3600) {
              ary[i].createdTime = Math.floor(date4 / 3600) + "小时前回答"
            }
            if (date4 >= 86400) {
              ary[i].createdTime = Math.floor(date4 / 86400) + "天前回答"
            }
          }
          that.setData({
            discussAnswerList: ary,
          })
        }

      }
    })
  },

  //跳到详情
  bindAskDetailsTap:function(e){
    var id=e.currentTarget.id;
    wx.navigateTo({
      url: '../community/askDetails?id='+id,
    })
  }
})