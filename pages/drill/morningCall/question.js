var WxParse = require('../../../utils/wxParse/wxParse.js');
Page({
  onLoad: function (options) {
    var sectionNumbers = wx.getStorageSync('sectionNumbers')
    var id = options.id
    var questionId = options.questionId
    this.setData({
      id: id,
      questionId: questionId,
      sectionNumbers: sectionNumbers
    })
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/user_exam/' + id + '/' + questionId,
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var leftTime = res.data.leftTime
        var lTime = that.formatTime(leftTime)
        var options = [], options2 = [], options3 = [], answers = [], answers2 = [], answers3 = []
        var type = res.data.question.type
        if ((type == 2)||(type == 3)){
          var answerList = res.data.answerList
          options = res.data.options[0]
          options2 = res.data.options[1]
          for (var i = 0;i<options.length;i++){
            if (answerList.indexOf(i+1)>=0){
              answers.push("selected")
            } else {
              answers.push("")
            }
          }
          for (var i = 0; i < options2.length; i++) {
            if (answerList.indexOf(i + 1+options.length) >= 0) {
              answers2.push("selected")
            } else {
              answers2.push("")
            }
          }
          if (type == 3){
            options3 = res.data.options[2]
            for (var i = 0; i < options3.length; i++) {
              if (answerList.indexOf(i + 1 + options.length + options2.length) >= 0) {
                answers3.push("selected")
              } else {
                answers3.push("")
              }
            }
          }
        } else if (type == 14) {
        } else if (type == 11) {
        } else {
          var answerList = res.data.answerList
          options = res.data.options
          for (var i = 0; i < options.length; i++) {
            if (answerList.indexOf(i + 1) >= 0) {
              answers.push("selected")
            } else {
              answers.push("")
            }
          }
        }
        that.setData({
          section: res.data.section,
          question: res.data.question,
          options: options,
          options2: options2,
          options3: options3,
          answers: answers,
          answers2: answers2,
          answers3: answers3,
          leftTime: leftTime,
          lTime: lTime,
          useTime: 0
        })
        WxParse.wxParse('content', 'html', res.data.question.content, that);
        timing(that)
        function timing(that) {
          var leftTime = that.data.leftTime -1
          var useTime = that.data.useTime + 1
          var lTime = that.formatTime(leftTime)
          that.timeout = setTimeout(function () {
            that.setData({
              leftTime: leftTime,
              lTime: lTime,
              useTime: useTime
            });
            timing(that);
          }
            , 1000)
        };
      }
    })
  },
  formatTime: function(leftTime){
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
  bindSelect2Tap: function(e){
    var index = e.currentTarget.dataset.index
    var blank = e.currentTarget.dataset.blank
    if (blank == 1){
      var options = this.data.options
      var answers = []
      for (var i =0;i<options.length;i++){
        if (index==i){
          answers.push("selected")
        } else {
          answers.push("")
        }
      }
      this.setData({
        answers: answers
      })
    }
    if (blank == 2){
      var options2 = this.data.options2
      var answers2 = []
      for (var i = 0; i < options2.length; i++) {
        if (index == i) {
          answers2.push("selected")
        } else {
          answers2.push("")
        }
      }
      this.setData({
        answers2: answers2
      })
    }
    if (blank == 3){
      var options3 = this.data.options3
      var answers3 = []
      for (var i = 0; i < options3.length; i++) {
        if (index == i) {
          answers3.push("selected")
        } else {
          answers3.push("")
        }
      }
      this.setData({
        answers3: answers3
      })
    }
  },
  bindUpdateTap: function (e) {
    var type = e.currentTarget.dataset.type
    var id = this.data.id
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    var answer = ""
    for (var i = 0;i<this.data.answers.length;i++){
      if (this.data.answers[i]=='selected'){
        answer = answer + (i+1)+","
      }
    }
    for (var i = 0; i < this.data.answers2.length; i++) {
      if (this.data.answers2[i] == 'selected') {
        answer = answer + (this.data.answers.length+i + 1) + ","
      }
    }
    for (var i = 0; i < this.data.answers3.length; i++) {
      if (this.data.answers3[i] == 'selected') {
        answer = answer + (this.data.answers.length + this.data.answers2.length +i + 1) + ","
      }
    }
    if (answer.length>0){
      answer = answer.substr(0,answer.length-1)
    }
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/user_exam/' + id + '/' + this.data.questionId,
      data: {
        useTime: this.data.useTime,
        leftTime : this.data.leftTime,
        answer : answer,
        type: type
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'ticket': ticket
      },
      method: 'POST',
      success: function (res) {
        wx.redirectTo({
          url: 'question?id=' + id + '&questionId=' + res.data.next,
        })
      }
    })
  },
  onUnload: function () {
    clearTimeout(this.timeout)
  }
})