import tools from "./tools.js";

export default {
  alert(content, success){
    wx.showModal({
      content,
      success,
      title:'系统提示',
      showCancel:false,
      confirmText:'确定'
    });
  },
  confirm(content, success) {
    wx.showModal({
      content,
      success,
      title: '系统提示',
      showCancel: true,
      confirmText: '确定'
    });
  },
  loading(title, success) {//现实loading
    wx.showLoading({
      title,
      mask:true,
      success
    });
  },
  hideLoading(){//关闭loading
    wx.hideLoading();
  },
  navigateTo(url, success) {//本业跳转
    wx.navigateTo({
      url,
      success
    });
  },
  redirectTo(url, success){//本业跳转
    wx.redirectTo({
      url,
      success
    });
  },
  reLaunch(url, success) {//关闭所有页面跳转
    wx.reLaunch({
      url,
      success
    });
  },
  switchTab(url, success) {//跳tabBar
    wx.switchTab({
      url,
      success
    });
  },
  navigateBack(){//返回上一页
    wx.navigateBack();
  },
  downloadFile(url,success,fail){
    wx.downloadFile({
      url: url,
      success: success,
      fail: fail
    });
  },
  getStorage(key, success, fail){
    wx.getStorage({
      key: key,
      success: success,
      fail: fail,
      complete:function(res){
        //console.log(res);
      }
    });
  },
  setStorage(key, data, success, fail) {
    wx.setStorage({
      key: key,
      data: data,
      success: success,
      fail: fail
    });
  },
  getSystemInfo(success){
    wx.getSystemInfo({
      success
    });
  }
}