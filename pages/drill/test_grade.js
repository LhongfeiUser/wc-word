Page({
  data: {
    pro: [
      {
        title:"选出下面三个单词中，含义不同的单词",
        choices: ["arcane", "esoteric", "patent"],
        answer: 2
      },
      {
        title: "选出下面三个单词中，含义不同的单词",
        choices: ["acquiesce", "demur", "consent"],
        answer: 1
      },
      {
        title: "选出下面三个单词中，含义不同的单词",
        choices: ["germane", "extraneous", "irrelevant"],
        answer: 0
      },
      {
        title: "选出下面三个单词中，含义不同的单词",
        choices: ["transitory", "permanent", "ephemeral"],
        answer: 1
      },
      {
        title: "选出下面三个单词中，含义不同的单词",
        choices: ["garrulous", "loquacious", "reticent"],
        answer: 2
      },
      {
        title: "选出下面三个单词中，含义不同的单词",
        choices: ["ebullient", "lukewarm", "tepid"],
        answer: 0
      },
      {
        title: "选出下面三个单词中，含义不同的单词",
        choices: ["charlatan", "fraud", "sage"],
        answer: 2
      },
      {
        title: "选出下面三个单词中，含义不同的单词",
        choices: ["partial", "partisan", "dispassionate"],
        answer: 2
      },
      {
        title: "选出下面三个单词中，含义不同的单词",
        choices: ["encyclopedic", "comprehensive", "circumscribed"],
        answer: 2
      },
      {
        title: "选出下面三个单词中，含义不同的单词",
        choices: ["cosmopolitan", "insular", "parochial"],
        answer: 0
      },
      {
        title: "选出a streak of的中文释义",
        choices: ["大量的","有一点","一定程度上","一块牛排"],
        answer: 1
      },
      {
        title: "选出all the more的中文释义",
        choices: ["尤其；格外","几乎是","大于全部","根本不"],
        answer: 0
      },
      {
        title: "选出stop short of的中文释义",
        choices: ["除……之外","不再缺乏","差点就","以……为代价"],
        answer: 2
      },
      {
        title: "选出have no bearing on的中文释义",
        choices: ["与……有关","与……无关","上面没有熊","在……影响下"],
        answer: 1
      },
      {
        title: "选出be at odds with的中文释义",
        choices: ["归因于","半途而废","和奇数在一起","与……不一致"],
        answer: 3
      }
    ],
    count: 15,
    isShow: false,
    _num: null,
    _num2: null,
    dex: 0,
    wrongNumber: 0,
    showResult:false
  },
  //下一题
  bindNextTap: function (e) {
    this.setData({
      dex: this.data.dex + 1,
      _num: null,
      _num2: null,
      isShow: false,
    })
    if (this.data.dex >= this.data.count) {
      this.showResult()
    }
  },

  //选择
  bindConfirmTap: function (e) {
    if (!this.data.isShow) {
      var answer = this.data.pro[this.data.dex].answer
      var choices = e.currentTarget.id
      if (answer == choices) {
        this.setData({
          _num: answer,
        })
        setTimeout(() => {
          this.setData({
            dex: this.data.dex + 1,
            _num: null,
            _num2: null,
            isShow: false,
          })
          if (this.data.dex >= this.data.count) {
            this.showResult()
          }
        }, 800)

      } else {
        this.setData({
          isShow: true,
          _num: answer,
          _num2: choices,
          wrongNumber: this.data.wrongNumber + 1
        })
      }
    }
  },

  //结果
  showResult : function (){
    var ticket = wx.getStorageSync('tempTicket')
    var grade = 0
    if (this.data.wrongNumber<9){
      grade = 1
    }
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/myself',
      data: {
        grade: grade
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'ticket': ticket
      },
      method: 'POST',
      success: (res) => {
      }
    })
    this.setData({
      showResult:true
    }) 
  },
  bindRecommendTap: function () {
    wx.redirectTo({
      url: '/pages/add_drill/recommend',
    })
  }
})