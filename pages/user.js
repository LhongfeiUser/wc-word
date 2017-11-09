Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList:{},

    page:1,
    size:10,
    diaryList:[],
  },
  onShow:function(){
    var that=this
    that.GetData(that);
    that.DiaryGetData(that)
  },
  GetData:(that)=>{
    var ticket = wx.getStorageSync('tempTicket');
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/myself',
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: (res)=>{
        var totalTime = res.data.user.totalTime
        totalTime = Math.floor( totalTime / 3600)
        if (totalTime>700){
          totalTime = 700
        }
        that.setData({
          userList:res.data,
          totalTime:totalTime,
          percent: Math.floor(totalTime/7)
        })
      }
    })
  },
 
  //获取学习日志
  DiaryGetData: (that) => {
    var ticket = wx.getStorageSync('tempTicket');
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/learning/journal',
      data: {
        page:that.data.page,
        size:that.data.size
      },
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: (res) => {
        function getNowFormatDate() {
          var date = new Date();
          var seperator1 = "-";
          var month = date.getMonth() + 1;
          var strDate = date.getDate();
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          return currentdate;
        }
        var currentdate = getNowFormatDate();
        var diaryList = res.data.LearningJournalList;
        for(let i=0;i<diaryList.length;i++){
          var timeAry=diaryList[i].createdTime.split(' ');
          if (currentdate==timeAry[0]){
            diaryList[i].date = "今日"
          } else {
            var dateArr = timeAry[0].split('-')
            diaryList[i].date = dateArr[0] + "年" + dateArr[1] + "月" + dateArr[2] + "日"
          }
          diaryList[i].createdTime = timeAry[1]
          diaryList[i].time = Math.floor(diaryList[i].time / 60);
          var listArr = diaryList[i].currentProgress.split(",")
          if (listArr.length>1){
            diaryList[i].drillName = diaryList[i].product+"顺序背词List"+listArr[1]+" Unit"+listArr[0]
          } else {
            diaryList[i].drillName = diaryList[i].product + "乱序背词Group" + listArr[0]
          }
        }
        that.setData({
          diaryList: diaryList,
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
      url: 'https://weichen.bjtcsj.com/api/learning/journal',
      data: {
        page: page,
        size: that.data.size
      },
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: (res) => {
        console.log(res)
        if (res.data.LearningJournalList.length > 0) {
          function getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
              month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            return currentdate;
          }
          var currentdate = getNowFormatDate();
          var diaryList = res.data.LearningJournalList;
          for (let i = 0; i < diaryList.length; i++) {
            var timeAry = diaryList[i].createdTime.split(' ');
            if (currentdate == timeAry[0]) {
              diaryList[i].date = "今日"
            } else {
              var dateArr = timeAry[0].split('-')
              diaryList[i].date = dateArr[0] + "年" + dateArr[1] + "月" + dateArr[2] + "日"
            }
            diaryList[i].createdTime = timeAry[1]
            diaryList[i].time = Math.floor(diaryList[i].time / 60);
            var listArr = diaryList[i].currentProgress.split(",")
            if (listArr.length > 1) {
              diaryList[i].drillName = diaryList[i].product + "顺序背词List" + listArr[1] + " Unit" + listArr[0]
            } else {
              diaryList[i].drillName = diaryList[i].product + "乱序背词Group" + listArr[0]
            }
          }
          that.setData({
            diaryList: that.data.diaryList.concat(diaryList),
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
  //个人资料
  bindpersonalDataTap:()=>{
    wx.navigateTo({
      url: 'community/personalData',
    })
  },
  
  bindMyDrillTap:function(){
    wx.navigateTo({
      url: 'user/myDrill',
    })
  },

  bindMyQuizTap: function () {
    var src = this.data.userList.user.headImgUrl;
    var nickName = this.data.userList.user.nickname;
    wx.navigateTo({
      url: 'user/myQuiz?src='+src+'&nickName='+nickName,
    })
  },
  bindMyAnswerTap: function () {
    var src = this.data.userList.user.headImgUrl;
    var nickName = this.data.userList.user.nickname;
    wx.navigateTo({
      url: 'user/myAnswer?src=' + src + '&nickName=' + nickName,
    })
  },
  bindTestGradeTap: function () {
    wx.navigateTo({
      url: 'drill/test_grade',
    })
  },
})