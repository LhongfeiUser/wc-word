Page({

  /**
   * 页面的初始数据
   */
  data: {
    grade:[1,2,3,4,5],
    tabChange: '0',
    productList:[],
    _productList: [],
    _bg: '_bg'
  },
  onShow: function () {
    this.getData();
    this.getDataTow();
  },
  getData: function () {
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/products ',
      data: {
        grade:'0'
      },
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          productList: res.data.productList
        })
      }
    })
  },
  getDataTow: function () {
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/products ',
      data: {
        grade: '1'
      },
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          _productList: res.data.productList
        })
      }
    })
  },
  bindTabTap:function(e){
    this.setData({
      tabChange:e.target.id
    })
  },
  bindDrillTap:function(e){
    var product = e.currentTarget.dataset.product;
    console.log(product)
    if (product.isJoined == 1) {
      wx.navigateTo({
        url: '/pages/drill/already_join?id=' + product.id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/drill/join?id=' + product.id,
      })
    }
  }
})