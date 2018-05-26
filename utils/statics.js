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
    this.filesKey = Object.keys(files);
    this.files = JSON.parse(JSON.stringify(files));;
    this.callback = callback;
    let staticsDownload = tools.getConfig('staticsDownload');
    wxapi.loading('正在加载...', () => {
      if (staticsDownload == 'local') {
        let localPath = tools.getConfig('localPath');
        for (let k in this.files) {
          this.files[k] = localPath + this.files[k];
        }
        this.callback && this.callback(this.files);
      } else if (staticsDownload == "downzip") {
        this.downzip();
      } else if (staticsDownload == "download") {
        this.download();
      }
    });
  },
  downzip() {
    this.getManager();
    let key = 'zipPath';
    wxapi.getStorage(key, (res) => {
      for (let k in this.files) {
        this.files[k] = wx.env.USER_DATA_PATH + '/' + this.files[k];
      }
      this.callback && this.callback(this.files);
    }, (res) => {
      let filePath = tools.getConfig(key);
      this.downloadFile(key, filePath, (res) => {
        this.manager.unzip({
          zipFilePath: res.savedFilePath,
          targetPath: `${wx.env.USER_DATA_PATH}/images/`,
          success: () => {
            console.log('unzip', res.savedFilePath);
            for (let k in this.files) {
              this.files[k] = wx.env.USER_DATA_PATH + '/' + this.files[k];
            }
            this.callback && this.callback(this.files);
          }
        });
      });
    });
  },
  download(){
    this.getManager();
    this.loadFile();
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
            let file = this.files[key];
            let filePath = tools.pathUrl(file);
            this.downloadFile(key, filePath, () => {
              this.loadFile();
            });
          }
        });
      },()=>{
        let file = this.files[key];
        let filePath = tools.pathUrl(file);
        this.downloadFile(key,filePath,()=>{
          this.loadFile();
        });
      });
    }else{
      this.callback && this.callback(this.files);
    }
  },
  getFile(key) {
    return tools.empty(this.files[key]) ? null : this.files[key];
  },
  downloadFile(key,filePath,callback){
    wx.downloadFile({
      url: filePath,
      complete: (resTemp) => {
        console.log('download', key, filePath, resTemp);
        if (resTemp.statusCode == 200 || resTemp.statusCode == 403) {
          this.manager.saveFile({
            tempFilePath: resTemp.tempFilePath,
            success: (res) => {
              wxapi.setStorage(key, res.savedFilePath, () => {
                console.log('success', key, res);
                this.files[key] = res.savedFilePath;
                callback && callback(res);
              });
            },
            fail: function (res) {
              callback && callback(res);
            }
          });
        } else {
          this.files[key] = '';
          callback && callback({});
        }
      }
    });
  },
  getSavedFileList(){
    this.manager.getSavedFileList({
      complete:function(res){
        console.log(res, a, b);
      }
    });
  },
  readdir(filePath) {//`${wx.env.USER_DATA_PATH}/knife`
    this.manager.readdir({
      dirPath: filePath,
      success: (res) => {
        console.log(res);
      }
    });
  }
}