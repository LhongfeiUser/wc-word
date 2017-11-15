Page({
  data: {
    array:[],
    list:1,
    unit:1,
    gorup:1,
    wordsCount:null,
    type:null,
    id:null,
    time:0,
    category:1
  },
  onLoad: function (options) {
    //计时器
    var that=this
    var id=options.id;
    var type=options.type;
    var time = parseInt(options.time)
    var category = options.category;
    that.setData({
      id:id,
      type:type,
      time: time,
      category: category
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
    var ticket = wx.getStorageSync('tempTicket')
    //发送请求GET
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/words/'+id+'/'+type,
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          array:res.data.wordList,
          wordsCount:res.data.wordList.length,
          unit:res.data.userProduct.unit,
          list:res.data.userProduct.list,
          group:res.data.userProduct.group
        })
        wx.setStorageSync("wordList", res.data.wordList)
        wx.setStorageSync("list", res.data.userProduct.list)
        wx.setStorageSync("unit", res.data.userProduct.unit)
        wx.setStorageSync("group", res.data.userProduct.group)
        if (type==1){
          wx.setNavigationBarTitle({
            title: 'List' + that.data.list + ' ' + 'Unit' + that.data.unit + ' ' + 1 + '/' + that.data.wordsCount
          })
        } else {
          wx.setNavigationBarTitle({
            title: 'Group' + that.data.group + ' ' + 1 + '/' + that.data.wordsCount
          })
        }
        that.audioCtx = wx.createAudioContext('myAudio')
        that.audioCtx.setSrc("http://weichen.bjtcsj.com/file/sound/" + that.data.array[0].word + ".mp3")
      }
    })
  
  },

  bindSwiperChange: function (e) {   
    if (e.detail.current < this.data.wordsCount) {
      if (this.data.type == 1) {
        wx.setNavigationBarTitle({
          title: 'List' + this.data.list + ' ' + 'Unit' + this.data.unit + ' ' + (e.detail.current + 1) + '/' + this.data.wordsCount
        })
      } else {
        wx.setNavigationBarTitle({
          title: 'Group' + this.data.group + ' ' + (e.detail.current + 1) + '/' + this.data.wordsCount
        })
      }
      this.audioCtx.setSrc("http://weichen.bjtcsj.com/file/sound/" + this.data.array[e.detail.current].word + ".mp3")
    } else {
      clearTimeout(this.timeout)
      wx.redirectTo({
        url: 'summary?id=' + this.data.id + '&type=' + this.data.type + '&category=' + this.data.category +'&time='+this.data.time,
      })
    }
  },
  audioPlay: function () {
    this.audioCtx.play()
  },
  onUnload: function () {
    clearTimeout(this.timeout)
  }
}) 