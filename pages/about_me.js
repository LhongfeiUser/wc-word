Page({

  /**
   * 页面的初始数据
   */
  data: {
    yearArray: ['2017年', '2018年', '2019年'],
    yearValue: "选择考试年份",
    yearClass: "isPlaceholder",
    expectedArray: [['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', '170'],
      ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', '170'],
      ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6']],
    expectedValue: "选择预期分数",
    expectedClass: "isPlaceholder",
    expectedIndex: [25,40,7],
    daysArray: null,
    daysValue: "请先选择考试年份",
    daysClass: "isPlaceholder",
    isforbidden: true,
    btnDisabled: true,
  },
  //年份
  yearChange: function (e) {
    this.setData({
      yearIndex: e.detail.value,
      yearValue: this.data.yearArray[e.detail.value],
      yearClass: "",
    })
    if (e.detail.value !== '0') {
      this.setData({
        daysIndex: '0',
        daysArray: ['待定'],
        daysValue: "待定",
        daysClass: "",
        isforbidden: true
      })
    } else {
      this.setData({
        daysIndex: '0',
        daysArray: ['11月10日', '11月19日', '12月03日', '12月15日', '12月22日'],
        daysValue: "选择考试日期",
        daysClass: "isPlaceholder",
        isforbidden: false
      })
    }
    if (this.data.yearClass + this.data.daysClass + this.data.expectedClass == ""){
      this.setData({
        btnDisabled:false
      })
    } else {
      this.setData({
        btnDisabled: true
      })
    }
  },

  //日期
  daysChange: function (e) {
    this.setData({
      daysIndex: e.detail.value,
      daysValue: this.data.daysArray[e.detail.value],
      daysClass: "",
    })
    if (this.data.yearClass + this.data.daysClass + this.data.expectedClass == "") {
      this.setData({
        btnDisabled: false
      })
    } else {
      this.setData({
        btnDisabled: true
      })
    }
  },
  //预期
  expectedChange: function (e) {
    this.setData({
      expectedIndex: e.detail.value,
      expectedValue: this.data.expectedArray[0][e.detail.value[0]] + "+" + this.data.expectedArray[1][e.detail.value[1]] + "+" + this.data.expectedArray[2][e.detail.value[2]] ,
      expectedClass: "",
    })
    if (this.data.yearClass + this.data.daysClass + this.data.expectedClass == "") {
      this.setData({
        btnDisabled: false
      })
    } else {
      this.setData({
        btnDisabled: true
      })
    }
  },
  //提交
  bindBtnTap: function (e) {
    var _examTime = this.data.yearValue
    if (this.data.daysValue == "待定"){
      _examTime = _examTime + "01月01日"
    } else {
      _examTime = _examTime + this.data.daysValue
    }
    var examTime = _examTime.replace(/年|月/g, "-").replace(/日/g, "")
    var expected = this.data.expectedValue
    console.log(examTime, expected)
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/myself',
      data: {
        expectedMark: expected,
        examTime: examTime
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'ticket':ticket,
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 200) {
          wx.reLaunch({
            url: 'drill',
          })
        } else {
          wx.showModal({
            title: "出错了",
            content: res.data.message,
            showCancel: false
          })
        }
      }
    })
  },
})