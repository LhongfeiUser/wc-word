var _ = require('../../../utils/lodash')

Page({
  data: {
    array: [],
    list: 1,
    unit: 1,
    group: 1,
    type: null,
    id: null,
    time: null,
    category: 1,

    words: [],
    pro: null,
    wordsCount: null,
    isShow: false,
    _num: null,
    _num2:null,
    dex: 0,
    WrongWord:[],
  },
 
  onLoad: function (options, e) {
    var that = this;
    var id = options.id;
    var type = options.type;
    var category = options.category;
    var time = parseInt(options.time)
    var ticket = wx.getStorageSync('tempTicket');
    var wordList = wx.getStorageSync('wordList');
    var list = wx.getStorageSync('list');
    var unit = wx.getStorageSync('unit');
    var group = wx.getStorageSync('group');
    this.setData({
      id: id,
      type: type,
      category: category,
      time: time,
      array: wordList,
      unit: unit,
      group: group,
      list: list,
      wordsCount: wordList.length,
    })
    timing(this)
    function timing(that) {
      var time = that.data.time
      that.timeout = setTimeout(function () {
        that.setData({
          time: time + 1
        });
        timing(that);
      }
        , 1000)
    };
    that.setData({ words: _.keyBy(wordList, 'id') })
    that.setData({
      pro: _.map(_.shuffle(that.data.words), (word) => {
        return {
          chinese: word.testMethodList,
          choices: _.shuffle(_.concat(
            _.take(_.shuffle(_.difference(_.keys(that.data.words), [word.id.toString()])), 3),
            word.id.toString()
          )),
          answer: word.id.toString(),
          selected: null
        }

      })
    })
    wx.setNavigationBarTitle({
      title: '巩固练习'
    })
  },
  //下一题
  bindNextTap: function (e) {
    this.setData({
      dex: this.data.dex + 1,
      _num: null,
      _num2: null,
      isShow: false,
    })
    if(this.data.dex>=this.data.wordsCount){
      wx.redirectTo({
        url: 'practice_summary?id=' + this.data.id + '&type=' + this.data.type + '&category=' + this.data.category + '&time=' + this.data.time,
      })
    }
  },

  //选择
  bindConfirmTap: function (e) {
    if (!this.data.isShow){
      var answer = this.data.pro[this.data.dex].answer
      var choices = this.data.pro[this.data.dex].choices[e.currentTarget.id]
      if (answer == choices) {
        this.setData({
          _num: e.target.id,
        })
        setTimeout(() => {
          this.setData({
            dex: this.data.dex + 1,
            _num: null,
            _num2: null,
            isShow: false,
          })
          if (this.data.dex >= this.data.wordsCount) {
            wx.redirectTo({
              url: 'practice_summary?id=' + this.data.id + '&type=' + this.data.type + '&category=' + this.data.category + '&time=' + this.data.time,
            })
          }
        }, 800)

      } else {
        var misdata = this.data.words[answer];
        if (this.data.WrongWord.indexOf(misdata) == -1) {
          this.data.WrongWord.push(misdata)
        }
        wx.setStorageSync('WrongWord', this.data.WrongWord)
        for (var i =0;i<4;i++){
          if (answer == this.data.pro[this.data.dex].choices[i]){
            this.setData({
              isShow: true,
              _num: i,
              _num2: e.target.id,
            })
          }
        }
      }
    }
  },
  //不记得了
  bindDefinitionTap: function (e) {
    if (!this.data.isShow) {
      var answer = this.data.pro[this.data.dex].answer
      var misdata = this.data.words[answer];
      if (this.data.WrongWord.indexOf(misdata) == -1) {
        this.data.WrongWord.push(misdata)
      }
      wx.setStorageSync('WrongWord', this.data.WrongWord)
      for (var i = 0; i < 4; i++) {
        if (answer == this.data.pro[this.data.dex].choices[i]) {
          this.setData({
            isShow: true,
            _num: i,
            _num2: 4,
          })
        }
      }
    }
  },
 
  //查看释义
  bindparaphraseTap:function(e){
    var answer = this.data.pro[this.data.dex].answer
    var wordMeaning=this.data.words[answer]
    wx.setStorageSync("wordMeaning", wordMeaning)
    wx.navigateTo({
      url: 'word?category=' + this.data.category,
    })
  },
  onUnload: function () {
    clearTimeout(this.timeout)
  }
})