import config from "./config.js";

export default {
  //接口地址格式化地址
  formatUrl(url) {
    if (url.indexOf("http") === 0){
      return url;
    }else{
      return config.apiHost + url;
    }
  },
  pathUrl(url){
    if (url.indexOf("http") === 0) {
      return url;
    } else {
      return config.apiHost + url;
    }
  },
  getConfig(key) {
    return config[key] ? config[key] : null;
  },
  //判断是否为空
  empty(vars) {
    var result = false;
    if (vars) {
      if (typeof (vars) == 'object') {
        if (vars instanceof Object && Object.keys(vars).length == 0) {
          result = true;
        } else if (vars instanceof Array && vars.length == 0) {
          result = true;
        }
      }
    } else {
      result = true;
    }
    return result;
  },
  /*自定义log*/
  log(res, msg) {
    if (config.debug){
      console.log(`=====${msg}=====`);
      console.log(res);
    }
  },
  //数组中是否存在数据
  in_array(search, arr) {
    for (var i in arr) {
      if (arr[i] == search) {
        return true;
      }
    }
    return false;
  },
  //去除数组中的重复数据
  unique_array(arr) {
    var tmp = new Array();
    for (var i = 0; i < arr.length; i++) {
      //该元素在tmp内部不存在才允许追加
      if (tmp.indexOf(arr[i]) == -1) {
        tmp.push(arr[i]);
      }
    }
    return tmp;
  },

  //字符串转json格式
  str2json(str) {
    var json = eval('(' + str + ')');
    return json;
  },

  //字符串转数组格式
  str2arr(str) {
    var json = Array();
    var arr = str.split(";");
    arr.map((item) => {
      json.push(item.split(","));
    });
    return json
  },

  //格式化数字，保留小数
  formatNumber(val, fixed) {
    fixed = fixed ? fixed : 2;
    return val ? 0 : parseFloat(val).toFixed(fixed);
  },
  
  //格式化时间戳
  formatDate(time, format) {
    var newDate = new Date();
    time ? newDate.setTime(time) : '';
    format = format ? format : 'yyyy-MM-dd hh:mm:ss';
    var date = {
      "M+": newDate.getMonth() + 1,
      "d+": newDate.getDate(),
      "h+": newDate.getHours(),
      "m+": newDate.getMinutes(),
      "s+": newDate.getSeconds(),
      "q+": Math.floor((newDate.getMonth() + 3) / 3),
      "S+": newDate.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (newDate.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
      }
    }
    return format;
  },

  //格式化时间戳
  dateTime(format) {
    var date = new Date(Date.parse(format.replace(/-/g, "/")));
    return date.getTime();
  },
}