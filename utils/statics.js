import tools from "./tools.js";
import wxapi from "./wxapi.js";

export default {
  manager:null,
  ckey:0,
  filesKey:[],
  files:{},
  callback:null,
  getManager(){
    if (tools.empty(this.manager)){
      this.manager = wx.getFileSystemManager();
    }
  },
  load(files,callback) {
    let staticsDownload = tools.getConfig('staticsDownload');
    if (staticsDownload == 'local'){
      this.filesKey = Object.keys(files);
      this.files = files;
      callback(files);
    }else{
    this.getManager();
      wxapi.loading('正在加载...',()=>{
        this.filesKey = Object.keys(files);
        this.files = files;
        this.callback = callback;
        this.loadFile();
      });
    }
  },
  loadFile(){
    if (!tools.empty(this.filesKey) && this.ckey < this.filesKey.length){
      let key = this.filesKey[this.ckey];
      this.ckey++;
      wxapi.getStorage(key, (res) => {
        this.manager.access({
          path: res.data,
          success:()=>{
            this.files[key] = res.data;
            this.loadFile();
          },
          fail:()=>{
            this.downloadFile(key);
          }
        });
      },()=>{
        this.downloadFile(key);
      });
    }else{
      wxapi.hideLoading();
      this.callback && this.callback(this.files);
    }
  },
  getFile(key){
    return tools.empty(this.files[key]) ? null : this.files[key];
  },
  downloadFile(key){
    let file = this.files[key];
    wxapi.downloadFile(tools.pathUrl(file), (resTemp) => {
      if (resTemp.statusCode == 200) {
        this.manager.saveFile({
          tempFilePath: resTemp.tempFilePath,
          success: (res) => {
            wxapi.setStorage(key, res.savedFilePath, () => {
              this.files[key] = res.savedFilePath;
            });
          }
        });
      } else {
        this.files[key] = '';
      }
      this.loadFile();
    });
  }
}