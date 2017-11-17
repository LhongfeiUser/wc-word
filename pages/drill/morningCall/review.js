Page({
  data: {
    reviewStatus: ["Not Seen", "Not Answered", "Incomplete", "Answered"],
    reviewMark: ["", "✔"],
    goToIndex:null
  },
  onLoad: function (options) {
    var sectionNumbers = wx.getStorageSync('sectionNumbers')
    var id = options.id
    var questionId = options.questionId
    var sSerialNumber = options.sSerialNumber
    var qSerialNumber = options.qSerialNumber
    var qNumbers = options.qNumbers
    var sectionContent = "Section " + sSerialNumber + " of " + sectionNumbers
    if (questionId > 0) {
      sectionContent = sectionContent + " | Question " + qSerialNumber + " of " + qNumbers
    }
    var that = this;
    var leftTime = options.leftTime
    var lTime = this.formatTime(leftTime)
    this.setData({
      id: id,
      questionId: questionId,
      sectionContent: sectionContent,
      sSerialNumber: sSerialNumber,
      leftTime: leftTime,
      lTime: lTime,
      useTime: 0
    })
    timing(that)
    function timing(that) {
      var leftTime = that.data.leftTime - 1
      var useTime = that.data.useTime + 1
      var lTime = that.formatTime(leftTime)
      that.timeout = setTimeout(function () {
        that.setData({
          leftTime: leftTime,
          lTime: lTime,
          useTime: useTime
        });
        if (leftTime > 0) {
          timing(that);
        } else {
          that.timeOut()
        }
      }
        , 1000)
    };
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/user_exam/' + id + '/review',
      data: {
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          questionIdList: res.data.questionIdList,
          questionStatusList: res.data.questionStatusList,
          questionStatusStyleList: res.data.questionStatusList,
          questionMarkList: res.data.questionMarkList
        })
      }
    })
  },
  timeOut: function () {
    var id = this.data.id
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/user_exam/' + id + '/0/time_out',
      data: {
        useTime: this.data.useTime,
        leftTime: this.data.leftTime,
        answer: ""
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'ticket': ticket
      },
      method: 'POST',
      success: function (res) {
        wx.redirectTo({
          url: res.data.next + '?id=' + id,
        })
      }
    })
  },
  formatTime: function (leftTime) {
    var time = "";
    var hh = parseInt(leftTime / 3600);
    if (hh < 10) {
      time = time + "0";
    }
    time = time + hh + ":";
    var mm = parseInt((leftTime % 3600) / 60);
    if (mm < 10) {
      time = time + "0";
    }
    time = time + mm + ":";
    var ss = leftTime % 60;
    if (ss < 10) {
      time = time + "0";
    }
    time = time + ss;
    return time
  },
  bindReturnTap: function (e) {
    var id = this.data.id
    var that = this;
    var leftTime = this.data.leftTime
    if (this.data.questionId > 0) {
      var useTime = this.data.useTime
      var ticket = wx.getStorageSync('tempTicket')
      wx.request({
        url: 'https://weichen.bjtcsj.com/api/user_exam/' + id + '/use_time',
        data: {
          leftTime: leftTime,
          useTime: useTime
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'ticket': ticket
        },
        method: 'POST',
        success: function (res) {
          wx.redirectTo({
            url: 'question?id=' + id + '&questionId=' + that.data.questionId,
          })
        }
      })
    } else {
      wx.redirectTo({
        url: 'finish_section?id=' + id + '&questionId=' + that.data.questionIdList[that.data.questionIdList.length - 1] + '&leftTime=' + leftTime + '&sSerialNumber=' + that.data.sSerialNumber,
      })
    }
  },
  bindGoToTap: function (e) {
    var goToIndex = this.data.goToIndex
    if (goToIndex!=null){
      var id = this.data.id
      var leftTime = this.data.leftTime
      var useTime = this.data.useTime
      var that = this;
      var ticket = wx.getStorageSync('tempTicket')
      wx.request({
        url: 'https://weichen.bjtcsj.com/api/user_exam/' + id + '/use_time',
        data: {
          leftTime: leftTime,
          useTime: useTime
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'ticket': ticket
        },
        method: 'POST',
        success: function (res) {
          wx.redirectTo({
            url: 'question?id=' + id + '&questionId=' + that.data.questionIdList[goToIndex],
          })
        }
      })
    }
  },
  bindSelectTap: function (e) {
    var index = e.currentTarget.dataset.index
    if (this.data.questionStatusList[index] >0){
      var goToIndex = this.data.goToIndex
      var questionStatusStyleList = this.data.questionStatusStyleList
      if (goToIndex!=null){
        questionStatusStyleList[goToIndex] = this.data.questionStatusList[goToIndex]
      }
      questionStatusStyleList[index] = "selected"
      this.setData({
        questionStatusStyleList: questionStatusStyleList,
        goToIndex:index
      })
    }
  },
  onUnload: function () {
    clearTimeout(this.timeout)
  }
})