Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList:[],
    page:1
  },
  onShow: function () {
    var that=this;
    that.Rankings(that)
  },
  Rankings: (that) => {
    var ticket = wx.getStorageSync('tempTicket');
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/users/rank',
      data: {
        type: 1,
        page: 1,
        Size: 8,
      },
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: (res) => {
        console.log(res.data)
        let ary = res.data.userList;
        for (var i = 0; i < ary.length; i++) {
          ary[i].todayTime = Math.floor(ary[i].todayTime / 60)
          if (ary[i].sign == null) {
            ary[i].sign = "用户暂无最新动态"
          }
        }
        that.setData({
          userList: ary,
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
      url: 'https://weichen.bjtcsj.com/api/users/rank',
      data: {
        type: 1,
        page: page,
        Size: 8,
      },
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: (res) => {
        if (res.data.userList.length > 0) {
          let ary = res.data.userList;
          for (var i = 0; i < ary.length; i++) {
            ary[i].todayTime = Math.floor(ary[i].todayTime / 60)
            if (ary[i].sign == null) {
              ary[i].sign = "用户暂无最新动态"
            }
          }
          that.setData({
            loading: false,
            userList: that.data.userList.concat(ary)
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