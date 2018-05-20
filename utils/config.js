module.exports = {
  //版本号
  version:100,
  // 接口Url
  apiHost: 'https://news.meiyashop.com.cn/',
  //apiHost: 'http://www.test.com/',

  // 小程序的appID
  appID: 'wx39b61e833ad47d89',
  // 小程序的appSecret
  appSecret: '',
  
  //资源文件获取方式
  staticsDownload:'local',
  // 小程序的deBug
  debug: true,
  // 小程序的名称
  appName: '小程序的名称',
  // 小程序的简单描述
  appDescription: '',
  // 小程序向后端发送formId接口地址
  apiFormIdUrl: 'knife/user/addFormID',
  // 用户身份登陆接口地址
  apiLoginUrl: 'knife/user/login',
  // 用户身份保存身份信息接口地址
  apiSaveUserInfoUrl: 'knife/user/saveInfo'
}