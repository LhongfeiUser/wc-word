Page({

  /**
   * 页面的初始数据
   */
  data: {
    grade: ["基础", "基础", "基础", "基础", "进阶","进阶"],
    product:null,
  },
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    this.getData(id)
  },
  getData: function (id) {
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/product/'+id+'',
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        var product = res.data.product
        var examList = []
        if (product.category==4){
          examList = res.data.examList
        }
        that.setData({
          product: product,
          examList: examList
        })
       
      }
    })
  },
  bindJoinTap:function(){
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    var id = this.data.product.id;
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/product/' + id + '/join',
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'POST',
      success: function (res) {
        wx.redirectTo({
          url: 'already_join?id=' + that.data.product.id,
        })
      }
    })
    
  }
})