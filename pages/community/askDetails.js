// pages/community/askDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    discussQuestion: {},
    discussAnswerList: [],
    likeColorList:['#CECECE', '#00CC91', '#CECECE'],
    disLikeColorList:['#CECECE', '#CECECE', '#00CC91'],
    id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id: id
    })
  },

  onShow: function () {
    var that = this,
      id = that.data.id;
    that.QuizGetData(that, id);
    that.AnswerGetData(that, id);
  },

  //获取提问数据
  QuizGetData: function (that, id) {
    var ticket = wx.getStorageSync('tempTicket');
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/discuss/question/' + id,
      data: {
        questionId: id
      },
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        var ary = res.data.discussQuestion
        var date1 = ary.createdTime.replace(/-|-/g, "/")
        var date3 = new Date(date1).getTime()
        var date2 = new Date().getTime()
        var date4 = (date2 - date3) / 1000;
        if (date4 < 60) {
          ary.createdTime = "刚刚提问"
        }
        if (date4 >= 60) {
          ary.createdTime = Math.floor(date4 / 60) + "分钟前提问"
        }
        if (date4 >= 3600) {
          ary.createdTime = Math.floor(date4 / 3600) + "小时前提问"
        }
        if (date4 >= 86400) {
          ary.createdTime = Math.floor(date4 / 86400) + "天前提问"
        }
        that.setData({
          discussQuestion: ary
        })
      }
    })
  },

  //获取回答数据
  AnswerGetData: function (that, id) {
    var ticket = wx.getStorageSync('tempTicket');
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/discuss/answers',
      data: {
        questionId: id,
        page:1,
        size:100
      },
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        var ary = res.data.discussAnswerList;
        if(ary.length){
          for (var i = 0; i < ary.length; i++) {
            var date1 = ary[i].createdTime.replace(/-|-/g, "/")
            var date3 = new Date(date1).getTime()
            var date2 = new Date().getTime()
            var date4 = (date2 - date3) / 1000;
            if (date4 < 60) {
              ary[i].createdTime = "刚刚提问"
            }
            if (date4 >= 60) {
              ary[i].createdTime = Math.floor(date4 / 60) + "分钟前提问"
            }
            if (date4 >= 3600) {
              ary[i].createdTime = Math.floor(date4 / 3600) + "小时前提问"
            }
            if (date4 >= 86400) {
              ary[i].createdTime = Math.floor(date4 / 86400) + "天前提问"
            }
            if (ary[i].isLike == null){
              ary[i].isLike = 0
            }
          }
          that.setData({
            discussAnswerList: ary,
          })
        }
        
      }
    })
  },

  // 点赞/反对
  bindLikeNumTab: function (e) {
    var that = this,
      questionId = e.currentTarget.id,
      id = that.data.id,
      num = e.currentTarget.dataset.num,
      ticket = wx.getStorageSync('tempTicket'),
      discussQuestion = that.data.discussQuestion;
    if (discussQuestion.isLike==0) {
      wx.request({
        url: 'https://weichen.bjtcsj.com/api/discuss/like',
        data: {
          questionId: questionId,
          isLike: num
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'ticket': ticket
        },
        method: 'POST',
        success: function (res) {
          if (num == '1') {
            discussQuestion.likeNum = discussQuestion.likeNum+1
            discussQuestion.isLike = 1
            that.setData({
              discussQuestion: discussQuestion,
            })
          } else {
            discussQuestion.dislikeNum = discussQuestion.dislikeNum + 1
            discussQuestion.isLike = 2
            that.setData({
              discussQuestion: discussQuestion,
            })
          }
        }
      })
    }
  },
  
 
  //回答
  bindAnswerTap: function () {
    wx.navigateTo({
      url: 'answer?id=' + this.data.id,
    })
  },

  bindAnswerLikeNumTab: function (e) {
    var dex=e.currentTarget.dataset.dex;
    var answerItem = this.data.discussAnswerList[dex]
    var that = this,
      answerId = e.currentTarget.id,
      answerNum = e.currentTarget.dataset.answernum,
      ticket = wx.getStorageSync('tempTicket');
    if (answerItem.isLike == 0) {
      wx.request({
        url: 'https://weichen.bjtcsj.com/api/discuss/like',
        data: {
          answerId: answerId,
          isLike: answerNum,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'ticket': ticket
        },
        method: 'POST',
        success: function (res) {
          if (answerNum == '1') {
            answerItem.isLike = 1;
            answerItem.likeNum = answerItem.likeNum+1;
            that.setData({
              discussAnswerList: that.data.discussAnswerList,
            })
          } else {
            answerItem.dislikeNum = answerItem.dislikeNum+1
            answerItem.isLike=2 
            that.setData({
              discussAnswerList: that.data.discussAnswerList,
            })
          }
        }
      })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})