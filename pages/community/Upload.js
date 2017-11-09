 import weCropper from '../../dist/weCropper'

const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = width;

Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,  // 画布宽度
      height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 200) / 2, // 裁剪框x轴起点
        y: (width - 200) / 2, // 裁剪框y轴期起点
        width: 200, // 裁剪框宽度
        height: 200 // 裁剪框高度
      }
    },
    num:null,
  },

  onLoad(option) {
    this.data.num=option.num;
    const { cropperOpt } = this.data
    // 若同一个页面只有一个裁剪容器，在其它Page方法中可通过this.wecropper访问实例
    new weCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 2000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context: ${ctx}`)
        wx.hideToast()
      })

    // 若同一个页面由多个裁剪容器，需要主动做如下处理
    // this.A = new weCropper(cropperOptA)
    // this.B = new weCropper(cropperOptB)
  },

  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  uploadTap() {
    const self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        self.wecropper.pushOrign(src)
      }
    })
  },
  getCropperImage() {
    var that = this;
    that.wecropper.getCropperImage((src) => {
      if (src) {
        that.setData({
          isSrc: src
        })
        wx.showLoading({
          title: '图片上传中',
        })
        wx.uploadFile({
          url: 'https://weichen.bjtcsj.com/api/upload_img', 
          filePath: src,
          name: 'imgFile',
          formData: {
            'type': that.data.num
          },
          success: function (res) {
            var data = JSON.parse(res.data) 
            wx.hideLoading()
            wx.setStorageSync("imgUrl", data.imgUrl)
            wx.navigateBack({})
          }
        })
        
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  }
})