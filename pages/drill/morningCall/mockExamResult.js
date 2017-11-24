Page({
  data: {
    current:0,
    sectionTitle: ["Verbal Reasoning","Quantitative Reasoning"],
    questionCategory: [["Reading Comprehension - Longer Passage"
      , "Reading Comprehension - Shorter Passage", "Text Completion", "Sentence Equivalence"], ["Arithmetic", "Algebra", "Geometry", "Data Analysis"]],
    questionType: ["","1 blank","2 blanks","3 blanks","Multiple-choice – Select One"
			,"Multiple-choice – Select One or More","N/A"
			,"","","",""
			,"Quantitative Comparison","Multiple-choice--Select One","Multiple-choice--Select One or More","Numeric Entry"],
    starts:[1,2,3,4,5]
  },
  onLoad: function (options) {
    var sectionNumbers = wx.getStorageSync('sectionNumbers')
    var id = options.id
    this.setData({
      id: id,
    })
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/user_exam/' + id + '/info',
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        that.setData({
          sectionList: res.data.sectionList,
          questionMap: res.data.questionMap,
          isRightMap: res.data.isRightMap,
          useTimeMap: res.data.useTimeMap
        })
      }
    })
  },
  bindExplainTap: function (e) {
    wx.navigateTo({
      url: 'mockExamExplain?id=' + this.data.id+"&questionId="+e.currentTarget.dataset.id,
    })
  },
  bindNextTap: function () {
    this.setData({
      current: this.data.current+1
    })
  },
  bindBackTap: function () {
    this.setData({
      current: this.data.current -1
    })
  },
})