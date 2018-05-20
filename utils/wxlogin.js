import request from "./request.js";
import tools from "./tools.js";

export default {
  /*用户登录之后，执行func*/
  login(func) {
    wx.getStorage({
      key: 'userInfo',
      success: (res)=>{
        if (typeof func === 'function') {
          func(res.data)
        }
      },
      fail: (res)=>{
        /*未登录过，进行登录，请求用户个人信息授权，发送到服务器*/
        this.wxLogin(func, (userInfo) => {
          //this.authorize(`userInfo`, userInfo);
        });
      },
    });
  },
  /*微信进行登录，获取微信code*/
  /*
  func 登录成功之后执行的函数
  saveFun 保存用户信息到服务器
  */
  wxLogin(func, saveFun){
    wx.login({
      success: (res) => {
        this.serLogin(res.code, func, saveFun)/*登录服务器*/
      },
      fail: function (res) {
        tools.log(res, `登录失败`);
        setTimeout(() => {
          this.wxLogin();/*重新登录*/
        }, 2000);
      },
    })
  },
  /*
  scope.userInfo	        wx.getUserInfo	                                      用户信息
  scope.userLocation	    wx.getLocation, wx.chooseLocation	                    地理位置
  scope.address	          wx.chooseAddress	                                    通讯地址
  scope.invoiceTitle	    wx.chooseInvoiceTitle	                                发票抬头
  scope.werun	            wx.getWeRunData	                                      微信运动步数
  scope.record	          wx.startRecord	                                      录音功能
  scope.writePhotosAlbum	wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum	保存到相册
  scope.camera		                                                              摄像头
  */
  //授权用户信息
  authorize(scope, userInfo){
    wx.authorize({
      scope: `scope.${scope}`,
      success: (res)=>{
        switch (scope) {
          case 'userInfo':
            this.serSaveUser(userInfo);
            break;
        }
      },
      fail: (res)=>{/*用户拒绝*/
        wx.showModal({
          title: '哎呀~~出错了',
          content: '我们只会获取您的头像、昵称，建议您点击确认，进行用户信息授权',
          showCancel: true,
          cancelText: '取消',
          confirmText: '确定',
          success:(res)=>{
            if (res.confirm) {
              wx.openSetting({
                success:(setting)=>{
                  tools.log(setting, `设置后返回`);
                  if (setting.authSetting['scope.userInfo']) {
                    this.serSaveUser(userInfo);
                  }
                }
              })
            } else if (res.cancel) {
              tools.log('用户点击取消')
            }
          }
        })
      },
    })
  },
  //用微信code，从服务器登录
  serLogin(wxcode, func, saveFun) {
    request.ajax(tools.getConfig('apiLoginUrl'), { code: wxcode }, (res) => {
      if (res.code === 1) {
        let uInfo = res.data;
        //保存用户信息到本地storage
        wx.setStorage({
          key: 'userInfo',
          data: uInfo
        });
        //回调函数
        if (typeof func === 'function') {
          func(uInfo);
        }
        if (typeof saveFun === 'function') {
          saveFun(uInfo);
        }
      }
    });
  },
  //将微信的个人信息发送到服务器
  serSaveUser(userInfo){
    wx.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN',
      success: function (res) {
        let tmpUserInfo = res.userInfo;
        tmpUserInfo.sessionid = userInfo.sessionid;
        tmpUserInfo.openid = userInfo.openid;
        tmpUserInfo.uid = userInfo.uid;
        tmpUserInfo.nickname = tmpUserInfo.nickName
        tmpUserInfo.encryptedData = res.encryptedData;
        tmpUserInfo.iv = res.iv;
        tmpUserInfo.signature = res.signature;
        tools.log(tmpUserInfo, 'tmpUserInfo');
        request.ajax(tools.getConfig('apiSaveUserInfoUrl'), tmpUserInfo, (res) => {
          tools.log(res, `保存用户信息到服务器成功`)
        });
      },
      fail: function (res) {
        tools.log(res, `没有授权用户信息`)
      }
    })
  }

  
}