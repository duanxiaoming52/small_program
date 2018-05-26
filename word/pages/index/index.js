// word/pages/index/index.js
import files from './files.js';
import statics from '../../../utils/statics.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'',
    inputPic: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    statics.load(files, (res) => {
      wx.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  bindinput:function(e){
    this.setData({
      inputValue: e.detail.value
    });
  },
  bindconfirm:function(e){
    this.search(e.detail.value);
  },
  canceltap:function(){
    this.setData({
      inputValue:'',
      inputPic: []
    });
  },
  submittap: function () {
    this.search(this.data.inputValue);
  },
  search:function(value){
    if (value.length > 0) {
      let key = '', str = '', pic = [];
      for (let i = 0; i < value.length; i++) {
        key = value[i];
        if (files[key]) {
          str += key;
          let picUrl = statics.getFile(key);
          pic.push(picUrl);
        }
      }
      this.setData({
        inputValue: str,
        inputPic: pic
      });
    }
  }
})