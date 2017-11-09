Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabChange: '0',
    //发现
      user:{},
      todayTime:0,
      totalTime:0,
      userList:[],
    //问答
    stringQuiz:'',
    searchStringQuiz:"",
    questionList:[],
    quizLoading:false,
    quizLoadingComplete:false,

    totalPage:0,
    page:1,
    size:8,
    type:1,
    lastHide:1
  },
  onLoad:function(){
    var that = this;
    that.DiscoverGetData(that)
    that.PeopleNearby(that)
    that.QuizGetData(that)
  },
  onShow:function(){
    var that = this
    if (this.data.lastHide == 0){
      this.setData({
        page:1,
        questionList: []
      })
      that.QuizGetData(that)
    }
  },
 
  //Tab 选项
  bindTabTap: function (e) {
    this.setData({
      tabChange: e.target.id
    })
  },
  
  //发现页面

  //获取发现页面数据
  DiscoverGetData: function (that) {
    var ticket = wx.getStorageSync('tempTicket');
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/users/rank',
      data: {
        type:1,
        size:1,
        page:1
      },
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        var user = res.data.userList[0]
        var totalTime1 = user.totalTime
        var totalTime2 = (totalTime1 / 3600).toFixed(1);        
        var todayTime1 = user.todayTime
        var todayTime2 = (todayTime1 / 60).toFixed(1);
        that.setData({
          user: user,
          totalTime: totalTime2,
          todayTime: todayTime2,
        })
      }
    })
    }, 
  

 

  // 附近人GET
  PeopleNearby:(that)=>{
    var ticket = wx.getStorageSync('tempTicket');
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/nearby_users',
      data: {
        page:1,
        size:20
      },
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: (res)=>{ 
           if (res.data.code ==200){
             let ary = res.data.userList;
             for (var i = 0; i < ary.length; i++) {
               ary[i].todayTime = Math.floor(ary[i].todayTime / 60)
               ary[i].distance = ary[i].distance.toFixed(1)
               if (ary[i].sign==null){
                 ary[i].sign = "用户暂无最新动态"
               }
             }
             that.setData({
               userList: ary,
             })
           }       
           
      }
    })
  },
  
  //跳往全部排名
  bindAllRankingsTap: function () {
    this.setData({
      lastHide: 1
    })
    wx.navigateTo({
      url: 'community/all_rankings',
    })
  },


  //问答页面
  searchQuiz:function(e){
    var stringQuiz =e.detail.value
    this.setData({
      stringQuiz: stringQuiz
    })
  },
  //搜索
  bindSearchAskTap:function(){
    var that = this
    this.setData({
      page:1,
      searchStringQuiz:this.data.stringQuiz,
      questionList:[]
    })
    this.QuizGetData(that)
  },
  
  //获取问答数据
  QuizGetData: function (that) {
    var ticket = wx.getStorageSync('tempTicket');
    var page = that.data.page,
      size = that.data.size,
      searchStringQuiz = that.data.searchStringQuiz;
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/discuss/search_questions',
      data: {
        string: searchStringQuiz,
        size: size,
        page: page
      },
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        var ary = res.data.questionList;
        var createdTime='';
        for(var i=0;i<ary.length;i++){
          var date1 = ary[i].createdTime.replace(/-|-/g, "/")
          var date3 = new Date(date1).getTime()
          var date2 = new Date().getTime()
          var date4 = (date2 - date3)/1000;
          if (date4 < 60) {
            createdTime = "刚刚提问"
          }
          if (date4 >= 60) {
            createdTime = Math.floor(date4 / 60) + "分钟前提问"
          }
          if (date4 >= 3600) {
            createdTime = Math.floor(date4 / 3600) + "小时前提问"
          }
          if (date4 >= 86400){
            createdTime = Math.floor(date4 / 86400) + "天前提问"
          }
          ary[i].createdTime = createdTime;
        }
        
        that.setData({
          questionList: that.data.questionList.concat(ary),
          totalPage: res.data.totalPage,
          quizLoading:false,
        })
      }
    })
  },
  //跳往提问页面
  bindQuizTap:function(){
    this.setData({
      lastHide: 0
    })
    wx.navigateTo({
      url: 'community/quiz',
    })
  },
  //跳往详情页面
  bindAskDetailsTap: function (e) {
    var id=e.currentTarget.id
    this.setData({
      lastHide: 1
    })
    wx.navigateTo({
      url: 'community/askDetails?id='+id,
    })
  },
  
  //上拉加载
  onReachBottom: function () {
    if (this.data.tabChange ==1){
      var that = this
      if (that.data.page <= that.data.totalPage) {
        that.setData({
          page: that.data.page + 1,
          quizLoading: true
        })
        that.QuizGetData(that)
      } else {
        that.setData({
          quizLoading: false,
          quizLoadingComplete: true,
        })
        setTimeout(function () {
          that.setData({
            quizLoadingComplete: false,
          })
        }, 1000)
      }
    }
  },
})
