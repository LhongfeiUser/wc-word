Page({
  data: {
    wrongWord: [],
    notGrasp:0,
    grasp:0,
    array: [],
    list: 1,
    unit: 1,
    group: 1,
    type: null,
    id: null,
    time: null,
    category: 1
  },
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var type = options.type;
    var category = options.category;
    var time = parseInt(options.time)
    console.log(time)
    var ticket = wx.getStorageSync('tempTicket');
    var wordList = wx.getStorageSync('wordList');
    var list = wx.getStorageSync('list');
    var unit = wx.getStorageSync('unit');
    var group = wx.getStorageSync('group');
    this.setData({
      id: id,
      type: type,
      category: category,
      time: time,
      array: wordList,
      unit: unit,
      group: group,
      list: list
    })
    timing(this)
    function timing(that) {
      var time = that.data.time
      that.timeout = setTimeout(function () {
        that.setData({
          time: time + 1
        });
        timing(that);
      }
        , 1000)
    };
    if (type == 1) {
      wx.setNavigationBarTitle({
        title: 'List' + list + ' Unit' + unit
      })
    } else {
      wx.setNavigationBarTitle({
        title: 'Group' + group
      })
    }
    this.audioCtx = wx.createAudioContext('myAudio')
    
    var wrongWord = wx.getStorageSync('WrongWord')

    this.setData({
      wrongWord: wrongWord,
      grasp: wordList.length-wrongWord.length,
      notGrasp: wrongWord.length,
    })  
  },
 
 //再背一次
  bindReciteTap: function (e) {
    wx.redirectTo({
      url: 'list?id=' + this.data.id + '&type=' + this.data.type + '&category=' + this.data.category + '&time=' + this.data.time
    })
  },
  
  //语音播放
  audioPlay: function (e) {
    this.audioCtx.setSrc("http://weichen.bjtcsj.com/file/sound/" + e.currentTarget.dataset.word + ".mp3")
    this.audioCtx.play()
  },
 
 //下一单元
  bindNextTap: function () {
    var ticket = wx.getStorageSync('tempTicket');
    var that = this
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/word/' + that.data.id + '/' + that.data.type,
      data: {
        time: that.data.time
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'ticket': ticket
      },
      method: 'POST',
      success: function (res) {
        wx.redirectTo({
          url: 'list?id=' + that.data.id + '&type=' + that.data.type + '&category=' + that.data.category + '&time=0'
        })
      }
    })
  },
  onUnload: function () {
    clearTimeout(this.timeout)
  }

})