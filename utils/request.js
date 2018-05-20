import tools from "./tools.js";

export default {
  get(url, data = {}, callback = null) {
    return this.send('GET', tools.formatUrl(url), data, callback);
  },
  post(url, data = {}, callback = null) {
    return this.send('POST', tools.formatUrl(url), data, callback);
  },
  ajax(url, data = {}, callback = null) {
    return this.request('POST', tools.formatUrl(url), data, callback);
  },
  send(method, url, data, callback) {
    wx.getStorage({
      key: 'userInfo',
      success: (uInfo) => {
        data.uid = uInfo.data.uid;
        this.request(method, url, data, callback);
      },
      fail: (res) => {
        tools.log(res,'用户未登陆');
      },
    });
  },
  request(method, url, data, callback){
    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: method,//"OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE", "TRACE", "CONNECT"
      dataType: 'json',
      success: function (res) {
        if (tools.getConfig('debug')) {
          console.log('-----异步请求----' + url);
          console.log(data);
          console.log(res);
          console.log('-----------------');
        }
        if (parseInt(res.statusCode) == 200) {
          callback && callback(res.data);
        }
      },
      fail: function (res) {
        console.log('-----请求错误----' + url);
        console.log(data);
        console.log(res);
        console.log('-----------------');
        wx.hideLoading();
        wx.showModal({
          title: "系统提示",
          content: "网络异常，请重试！",
          showCancel: false
        });
      }
    });
  }
}