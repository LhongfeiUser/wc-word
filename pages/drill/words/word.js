Page({

  data: {
    wordMeaning:null,
    category: 1
  },

  onLoad: function (options) {
    var wordMeaning=wx.getStorageSync("wordMeaning");
    var category = options.category;
    this.setData({
      wordMeaning: wordMeaning,
      category:category
    })
    console.log(wordMeaning.word)
    this.audioCtx = wx.createAudioContext('myAudio')
    this.audioCtx.setSrc("http://weichen.bjtcsj.com/file/sound/" + wordMeaning.word + ".mp3")
    this.audioCtx.play()
  },
  audioPlay: function () {
    this.audioCtx.play()
  },
  bindNavigateBackTap: function (){
    wx.navigateBack({
    })
  }
})