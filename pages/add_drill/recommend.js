Page({
  data: {
    productList:[],
    grade: [1, 2, 3, 4, 5]
  },
  onLoad:function(){
    this.getData()
  },
  getData:function(){
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/products/recommend ',
      data:{},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        that.setData({
          productList: res.data.productList
        })
      }
    })
    console.log(this.data.productList)
  },
  bindDrillTap: function (e) {
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
