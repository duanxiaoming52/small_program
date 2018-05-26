import tools from "./tools.js";
import wxapi from "./wxapi.js";

export default {
  manager: null,
  getManager() {
    if (tools.empty(this.manager)) {
      this.manager = wx.getFileSystemManager();
    }
  },
  validate(callback){
    this.getManager();
    let version = tools.getConfig('version');
    let system = `${wx.env.USER_DATA_PATH}/system`;
    wxapi.getStorage('version',(res)=>{
      console.log(res.data, version);
      if (parseInt(res.data) == version) {
        callback && callback();
      } else {
        console.log('clear');
        this.clear();
        setTimeout(function () {
          callback && callback();
        }, 100);
      }
    },()=>{
      console.log('make version');
      wxapi.setStorage('version', version,()=>{
        callback && callback();
      });
    });
  },
  clear(){
    wx.clearStorage();
    this.rmUserDir(wx.env.USER_DATA_PATH);
    this.rmStorDir();
  },
  rmStorDir(){
    this.manager.getSavedFileList({
      success: (res) => {
        console.log(res);
        res.fileList.map((item)=>{
          this.manager.removeSavedFile({
            filePath: item.filePath,
            success:(resd)=>{
              console.log('sfile', item);
            }
          });
        });
      }
    });
  },
  rmUserDir(dirPath){
    this.readdir(dirPath, (result) => {
      result.files.map((item) => {
        let filePath = `${dirPath}/${item}`;
        this.manager.stat({
          path: filePath,
          complete: (stats) => {
            if (stats.stats.isDirectory()) {
              this.rmUserDir(filePath);
            } else {
              this.manager.unlinkSync(filePath);
              console.log('ufile', filePath);
            }
          }
        })
      });
    });
  },
  rmdir(filePath) {//`${wx.env.USER_DATA_PATH}/knife`
    console.log(filePath);
    this.manager.rmdir({
      dirPath: filePath,
      recursive:false,
      complete: (res) => {
        console.log(res);
      }
    });
  },
  readdir(filePath, callback) {//`${wx.env.USER_DATA_PATH}/knife`
    this.manager.readdir({
      dirPath: filePath,
      complete: (res) => {
        callback(res);
      }
    });
  }
}