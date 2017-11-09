Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChanged :false,
    imgNum: null,
    yearArray: ['2017年', '2018年', '2019年'],
    expectedArray: [['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', '170'],
    ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', '170'],
    ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6']],
    daysArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var nickname = options.nickname
    var that = this;
    if (nickname){
      var yearValue = options.yearValue
      var yearIndex = 0
      for (var i = 0; i < 3; i++) {
        if (that.data.yearArray[i] == yearValue) {
          yearIndex = i
        }
      }
      var daysValue = "待定"
      var daysIndex = 0
      var daysArray = ["待定"]
      if (yearIndex == 0) {
        daysArray = ['11月10日', '11月19日', '12月03日', '12月15日', '12月22日']
        daysValue = options.daysValue
        for (var i = 0; i < daysArray.length; i++) {
          if (daysArray[i] == daysValue) {
            daysIndex = i
          }
        }
      }
      var expectedIndex = [0, 0, 0]
      var expectedValue = options.expectedValue
      var text = expectedValue.split('+');
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < that.data.expectedArray[i].length; j++) {
          if (that.data.expectedArray[i][j] == text[i]) {
            expectedIndex[i] = j
          }
        }
      }
      that.setData({
        isChanged: true,
        yearIndex: yearIndex,
        yearValue: yearValue,
        daysArray: daysArray,
        daysIndex: daysIndex,
        daysValue: daysValue,
        expectedIndex: expectedIndex,
        expectedValue: expectedValue,
        nickname: options.nickname,
        sign: options.sign,
        backImage: options.backImage,
        headImage: options.headImage,
      })
    } else {
      that.GetData(that)
    }
  },
  onShow:function(){
    var imgUrl = wx.getStorageSync("imgUrl")
    if (imgUrl) {
      if (this.data.imgNum == 1){
        this.setData({
          isChanged: true,
          headImage:imgUrl
        })
      }
      if (this.data.imgNum == 2) {
        this.setData({
          isChanged: true,
          backImage: imgUrl
        })
      }
    }   
  },
  GetData: (that) => {
    var ticket = wx.getStorageSync('tempTicket');
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/myself',
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: (res) => {
        var text = res.data.user.examTime.split('-');
        var yearValue = text[0]+"年"
        var yearIndex = 0
        for (var i = 0 ;i<3;i++){
          if (that.data.yearArray[i]==yearValue){
            yearIndex = i
          }
        }
        var daysValue = "待定"
        var daysIndex = 0
        var daysArray = ["待定"]
        if (yearIndex == 0){
          daysArray = ['11月10日', '11月19日', '12月03日', '12月15日', '12月22日']
          daysValue = text[1] + "月" + text[2] + "日"
          for (var i = 0; i < daysArray.length; i++) {
            if (daysArray[i] == daysValue) {
              daysIndex = i
            }
          }
        }
        var expectedIndex = [0,0,0]
        var expectedValue = res.data.user.expectedMark
        text = expectedValue.split('+');
        for (var i = 0 ;i<3;i++){
          for (var j=0;j<that.data.expectedArray[i].length;j++){
            if (that.data.expectedArray[i][j] == text[i]){
              expectedIndex[i] = j
            }
          }
        }
        that.setData({
          yearIndex: yearIndex,
          yearValue: yearValue,
          daysArray: daysArray,
          daysIndex: daysIndex,
          daysValue: daysValue,
          expectedIndex: expectedIndex,
          expectedValue: expectedValue,
          nickname: res.data.user.nickname,
          sign: res.data.user.sign,
          backImage: res.data.user.backImgUrl,
          headImage: res.data.user.headImgUrl,
        })
      }
    })
  },

  bindUploadTap:function(e){
    wx.removeStorageSync("imgUrl")
    this.setData({
      imgNum: e.currentTarget.dataset.num
    })
    wx.navigateTo({
      url: 'Upload?num=' + e.currentTarget.dataset.num,
    })
  },
  //年份
  yearChange: function (e) {
    if (this.data.yearIndex!=e.detail.value){
      this.setData({
        isChanged: true,
        yearIndex: e.detail.value,
        yearValue: this.data.yearArray[e.detail.value],
      })
      if (e.detail.value !== '0') {
        this.setData({
          daysIndex: '0',
          daysArray: ['待定'],
          daysValue: "待定",
        })
      } else {
        this.setData({
          daysIndex: '0',
          daysArray: ['11月10日', '11月19日', '12月03日', '12月15日', '12月22日'],
          daysValue: '11月10日',
        })
      }
    }
  },

  //日期
  daysChange: function (e) {
    if (this.data.daysIndex != e.detail.value) {
      this.setData({
        isChanged: true,
        daysIndex: e.detail.value,
        daysValue: this.data.daysArray[e.detail.value],
      })
    }
  },
  //预期
  expectedChange: function (e) {
    this.setData({
      isChanged: true,
      expectedIndex: e.detail.value,
      expectedValue: this.data.expectedArray[0][e.detail.value[0]] + "+" + this.data.expectedArray[1][e.detail.value[1]] + "+" + this.data.expectedArray[2][e.detail.value[2]],
    })
  },
  bindNicknameInput: function (e) {
    this.setData({
      isChanged: true,
      nickname: e.detail.value
    })
  },
  bindSignInput: function (e) {
    this.setData({
      isChanged: true,
      sign: e.detail.value
    })
  },
  bindCancelTap:function (e){
    wx.navigateBack({
      
    })
  },
  bindSaveTap:function(e){
    var that = this
    var _examTime = this.data.yearValue
    if (this.data.daysValue == "待定") {
      _examTime = _examTime + "01月01日"
    } else {
      _examTime = _examTime + this.data.daysValue
    }
    var examTime = _examTime.replace(/年|月/g, "-").replace(/日/g, "")
    var expected = this.data.expectedValue
    var sign = ""
    if (this.data.sign){
      sign = this.data.sign
    }
    console.log(examTime, expected)
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/myself',
      data: {
        nickname: this.data.nickname,
        sign:sign,
        expectedMark: expected,
        examTime: examTime,
        headImgUrl:this.data.headImage,
        backImgUrl:this.data.backImage
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'ticket': ticket,
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            isChanged: false
          })
          wx.navigateBack({
            
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
  onUnload: function () {
    if (this.data.isChanged){
      var that = this
      wx.showModal({
        title: '提示',
        content: '当前所做修改还未保存，是否回到个人资料页面继续编辑？',
        success: function (res) {
          if (res.confirm) {
            var sign = ""
            if (that.data.sign){
              sign = '&sign=' + that.data.sign
            }
            wx.navigateTo({
              url: '/pages/community/personalData?nickname=' + that.data.nickname + sign + '&yearValue=' + that.data.yearValue + '&daysValue=' + that.data.daysValue + '&expectedValue=' + that.data.expectedValue + '&backImage=' + that.data.backImage + '&headImage=' + that.data.headImage,
            })
          }
        }
      })
    }
   
  }
})