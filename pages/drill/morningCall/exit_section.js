Page({
  onLoad: function (options) {
    var sectionNumbers = wx.getStorageSync('sectionNumbers')
    var id = options.id
    var questionId = options.questionId
    var sSerialNumber = options.sSerialNumber
    var qSerialNumber = options.qSerialNumber
    var qNumbers = options.qNumbers
    if (questionId>0){
      var leftTime = options.leftTime
      var lTime = this.formatTime(leftTime)
      this.setData({
        id: id,
        questionId: questionId,
        sectionContent: "Section " + sSerialNumber + " of " + sectionNumbers + " | Question " + qSerialNumber +" of "+ qNumbers,
        leftTime: leftTime,
        lTime: lTime,
        useTime: 0
      })
      var that = this;
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
    } else {
      this.setData({
        id: id,
        questionId: questionId,
        sectionContent: "Section "+ sSerialNumber +" of "+ sectionNumbers
      })
    }
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
    if (this.data.questionId > 0) {
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
              url: 'question?id=' + id + '&questionId=' + that.data.questionId,
            })
        }
      })
    } else {
      wx.redirectTo({
        url: 'start_section?id=' + id,
      })
    }
  },
  bindExitTap: function (e) {
    var id = this.data.id
    var leftTime = 0
    var useTime = 0
    if (this.data.questionId > 0){
      leftTime = this.data.leftTime
      useTime = this.data.useTime
    }
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/user_exam/' + id + '/next_section',
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
          url: res.data.next + '?id=' + id,
        })
      }
    })
  },
  onUnload: function () {
    clearTimeout(this.timeout)
  }
})