Page({
  onLoad: function (options) {
    var productVideo = wx.getStorageSync("productVideo")
    this.setData({
      productVideo:productVideo
    })
  }
})