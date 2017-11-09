Page({

  data: {
    page:1,
    size:10,
    wordList:[],
    inputString:"",
    cString:""
  },

  onLoad: function (options) {
    this.searchWord()
  },
  bindSearchTap:function (){
    this.setData({
      inputString:this.data.cString
    })
    this.searchWord()
  },
  bindInput:function (e){
    this.setData({
      cString: e.detail.value
    })
  },
  bindWordTap:function(e){
    var wordMeaning = e.currentTarget.dataset.word
    wx.setStorageSync("wordMeaning", wordMeaning)
    wx.navigateTo({
      url: 'word?category=3',
    })
  },
  searchWord : function (options){
    var that = this
    var ticket = wx.getStorageSync('tempTicket');
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/words/search',
      data: {
        page: 1,
        size: 20,
        string:this.data.inputString
      },
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: (res) => {
        that.setData({
          wordList: res.data.wordList
        })
      }
    })
  },
  onReachBottom: function () {
    var that = this
    var page = this.data.page + 1
    this.setData({
      loading: true
    })
    var ticket = wx.getStorageSync('tempTicket');
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/words/search',
      data: {
        page: page,
        size: 20,
        string: this.data.inputString
      },
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: (res) => {
        if (res.data.wordList.length>0){
          that.setData({
            loading: false,
            wordList: that.data.wordList.concat(res.data.wordList)
          })
        } else {
          that.setData({
            loading: false,
            loadingComplete: true,
          })
          setTimeout(function () {
            that.setData({
              loadingComplete: false,
            })
          }, 1000)
        }
      }
    })
  },

})