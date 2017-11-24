var WxParse = require('../../../utils/wxParse/wxParse.js');
Page({
  data: {
    questionCategory: ["","Reading Comprehension - Longer Passage"
      , "Reading Comprehension - Shorter Passage", "Text Completion", "Sentence Equivalence","Arithmetic", "Algebra", "Geometry", "Data Analysis"],
    questionType: ["", "1 blank", "2 blanks", "3 blanks", "Multiple-choice – Select One"
      , "Multiple-choice – Select One or More", "N/A"
      , "", "", "", ""
      , "Quantitative Comparison", "Multiple-choice--Select One", "Multiple-choice--Select One or More", "Numeric Entry"]
  },
  onLoad: function (options) {
    var id = options.id
    var questionId = options.questionId
    this.setData({
      id: id,
      questionId: questionId
    })
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/user_exam/' + id + '/' + questionId+"/info",
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var options = [], options2 = [], options3 = [], isSelected = [], isRight = []
        var type = res.data.question.type
        if ((type == 2) || (type == 3)) {
          options = res.data.options[0]
          options2 = res.data.options[1]
          if (type == 3) {
            options3 = res.data.options[2]
          }
          
        } else if (type == 14) {
        } else if (type == 11) {
        } else {
          options = res.data.options
        }
        if(type!=14){
          var answerList = res.data.answerList
          var rightAnswerList = res.data.rightAnswerList
          for (var i = 0; i < options.length + options2.length + options3.length; i++) {
            if (answerList.indexOf(i + 1) >= 0) {
              isSelected.push("selected")
            } else {
              isSelected.push("")
            }
            if (rightAnswerList.indexOf(i + 1) >= 0) {
              isRight.push("right")
            } else if (answerList.indexOf(i + 1) >= 0) {
              isRight.push("wrong")
            } else {
              isRight.push("")
            }
          }
        }
        var answer = 'Wrong'
        if (res.data.rightAnswer == res.data.answer){
          answer = 'Right'
        }
        that.setData({
          exam: res.data.exam,
          section: res.data.section,
          question: res.data.question,
          useTime: res.data.useTime,
          answer: answer,
          options: options,
          options2: options2,
          options3: options3,
          isSelected: isSelected,
          isRight: isRight
        })
        WxParse.wxParse('content', 'html', res.data.question.content, that);
        if (res.data.question.solution)
        WxParse.wxParse('solution', 'html', res.data.question.solution, that);
        if ((res.data.question.category == 1) || (res.data.question.category == 2) || (res.data.question.category == 8)) {
          WxParse.wxParse('resource', 'html', res.data.question.resourceContent, that);
        }
    
      }
    })
  },
  bindMarkTap: function (e) {
    var isMarked = 1 - this.data.isMarked
    var id = this.data.id
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/user_exam/' + id + '/' + this.data.questionId + '/mark',
      data: {
        isMarked: isMarked
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'ticket': ticket
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          isMarked: isMarked
        })
      }
    })
  }
})