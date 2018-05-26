module.exports = {
  //版本号
  version:100,
  //资源文件获取方式local,downzip,download
  //正式配置
  // apiHost: 'https://news.meiyashop.com.cn/',
  // staticsDownload: 'downzip',
  // zipPath: 'https://apps.suibianyuming.com.cn/knife.zip',

  //测试配置
  apiHost: 'http://www.test.com/',
  staticsDownload: 'local',
  localPath: '/statics/',

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