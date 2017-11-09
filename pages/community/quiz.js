// pages/community/quiz.js
var _ = require('../../utils/lodash.js');
Page({
  data: {
    labelList: null,
    title: '',
    labelIds: null,
    label: '',
    content: '',
    isColor: true,
    id: '',
    addPic:'',
    imgUrl:'',
    labelClass:[]
  },

  onShow: function () {
    var that = this;
    var ticket = wx.getStorageSync('tempTicket');
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/discuss/labels',
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        var labelClass = []
        for (var i = 0; i < res.data.labelList.length;i++){
          labelClass.push("")
        }
        that.setData({
          labelList: res.data.labelList,
          labelClass:labelClass
        })
      }
    })
  },

  //获取value

  bindQuestionTap: function (e) {
    this.setData({
      title: e.detail.value
    })
  },

  bindAddTap: function (e) {
    this.setData({
      label: e.detail.value
    })
  },

  bindDescribeTap: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  //选择标签

  bindAddLabelTap: function (e) {
    var labelClass = this.data.labelClass
    if (labelClass[e.target.id]=="") {
      labelClass[e.target.id] = "labelClass1"
      var _label = this.data.labelList[e.target.id].label
      if (this.data.label == '') {
        this.setData({
          label: _label+" ; ",
          labelClass:labelClass
        })
      } else {
        var label = this.data.label
        if (label.lastIndexOf(" ; ") != label.length-3){
          label = label + " ; "
        }
        this.setData({
          label: label + _label + " ; ",
          labelClass: labelClass
        })
      }
    } else {
      var emptyLable = this.data.label.replace(this.data.labelList[e.target.id].label + " ; ", '');
      labelClass[e.target.id] = ""
      this.setData({
        label: emptyLable,
        labelClass: labelClass
      })
    }
  },

  bindAddPic:function(){
    var that=this;
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://weichen.bjtcsj.com/api/upload_img', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'imgFile',
          formData: {
            'type': 3
          },
          success: function (res) {
            var data=JSON.parse(res.data)
            that.setData({
              addPic: tempFilePaths,
              imgUrl:data.imgUrl
            })
          }
        })
      }
    })
  },
  //提交数据

  bindSubmitTap: function () {
   
    var ticket = wx.getStorageSync('tempTicket');
    var title = this.data.title,
      content = this.data.content,
      labelIds = this.data.label,
      imgUrl = this.data.imgUrl;
    if (labelIds.lastIndexOf(" ; ") == labelIds.length - 3) {
      labelIds = labelIds.substr(0, labelIds.length - 3)
    }
    console.log(imgUrl)
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/discuss/question',
      data: {
        title: title,
        content: content,
        labels: labelIds,
        imgUrl: imgUrl
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'ticket': ticket,
      },
      method: 'POST',
      success: function (res) {
        wx.navigateBack();
      }
    })
  },
})