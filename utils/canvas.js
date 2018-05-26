import statics from "./statics.js";

const ctools = {
  getX(x) {
    return x / statics.gWidth * statics.innerWidth;
  },
  getBaseX(x) {
    return x / statics.innerWidth * statics.gWidth;
  },
  getBaseY() {
    return statics.gWidth * statics.innerHeight / statics.innerWidth;
  },
  getAngle(x1, y1, x2, y2) {
    return 360 * Math.atan((x1 - x2) / (y1 - y2)) / (2 * Math.PI);
  },
  getAngleXY(x, y, angle, radius = 4) {
    let x1 = x + radius * Math.sin((angle * Math.PI / 180));
    let y1 = y + radius * Math.cos((angle * Math.PI / 180));
    return { x1, y1 };
  },
  rnd(start, end) {
    return Math.floor(Math.random() * (end - start) + start)
  }
}
//常用工具
export default ctools
//绘图
export class Canvas{
  ctx
  constructor(ctx) {
    if (ctx) {
      this.ctx = ctx;
    }
  }
  restore(){//恢复原状
    this.ctx.restore();
    this.ctx.save();
  }
  beginPath(lineWidth=1){
    this.ctx.beginPath();
    this.ctx.lineWidth = lineWidth;
  }
  point(x, y, radius=4, color = "#000") {//话圆
    x = ctools.getX(x);
    y = ctools.getX(y);
    radius = ctools.getX(radius);
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
  }
  moveTo(x, y) {
    x = ctools.getX(x);
    y = ctools.getX(y);
    this.ctx.moveTo(x,y);
  }
  lineTo(x, y) {
    x = ctools.getX(x);
    y = ctools.getX(y);
    this.ctx.lineTo(x, y);
  }
  circle(x, y, radius, color) {
    x = ctools.getX(x);
    y = ctools.getX(y);
    radius = ctools.getX(radius);
    this.ctx.strokeStyle = color;
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
  }
  strokeRect(x, y, width, height) {
    x = ctools.getX(x);
    y = ctools.getX(y);
    width = ctools.getX(width);
    height = ctools.getX(height);
    this.ctx.strokeRect(x, y, width, height)
  }
  stroke(color = "#000") {//绘制线条
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }
  fillRect(x, y, width, height, color = "#000"){
    x = ctools.getX(x);
    y = ctools.getX(y);
    width = ctools.getX(width);
    height = ctools.getX(height);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height)
  }
  fillText(text, x, y, color = '#000') {
    x = ctools.getX(x);
    y = ctools.getX(y);
    this.ctx.font = 'bold 12px sans-serif'
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
  }
////////////////////////////////////////////////////////////////////
  drawLineDash(x1, y1, x2, y2, color = '#000', lineWidth = 1) {
    //this.ctx.setLineDash([5,2]);
    this.drawLine(x1, y1, x2, y2, color, lineWidth);
  }
  drawLine(x1, y1, x2, y2, color = '#000', lineWidth=1) {
    this.beginPath(lineWidth);
    this.moveTo(x1,y1);
    this.lineTo(x2, y2);
    this.stroke(color);
  }
  drawImage(src, x, y, width, height) {//绘制图片
    x = ctools.getX(x);
    y = ctools.getX(y);
    width = ctools.getX(width);
    height = ctools.getX(height);
    this.ctx.drawImage(src, x, y, width, height);
  }
  translate(x, y) {//设置坐标中心点
    x = ctools.getX(x);
    y = ctools.getX(y);
    this.ctx.translate(x,y);
  }
  rotate(angle) {//坐标偏移角度
    this.ctx.rotate(angle * Math.PI / 180);
  }
  scale(scaleWidth, scaleHeight) {//坐标缩放
    this.ctx.scale(scaleWidth, scaleHeight)
  }
  clearRect(x, y, width, height) {
    x = ctools.getX(x);
    y = ctools.getX(y);
    width = ctools.getX(width);
    height = ctools.getX(height);
    this.ctx.clearRect(x, y, width, height);
  }
  setGlobalAlpha(alpha){
    this.ctx.globalAlpha = alpha;
  }
  draw(){
    this.ctx.draw();
  }
}
//矩形
export class Rect {
  x = 0
  y = 0;
  width = 0;
  height = 0;
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  isOnRect(spX,spY) {
    if (!this.visible)
      return false
    // console.log(spX, spY, this.x, this.y, this.x + this.width, this.y + this.height);
    return !!(spX >= this.x
      && spX <= this.x + this.width
      && spY >= this.y
      && spY <= this.y + this.height)
  }
}
//圆
export class Circle {
  x = 0
  y = 0;
  radius = 0;
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  isOnCircle(spX, spY) {
    if (!this.visible)
      return false
    // console.log(spX, spY, this.x, this.y, this.x + this.width, this.y + this.height);
    return !!(spX >= this.x
      && spX <= this.x + this.width
      && spY >= this.y
      && spY <= this.y + this.height)
  }
}
//线
export class Line {
  p1
  p2
  angle=0
  constructor(x1, y1, x2, y2) {
    this.p1 = new Point(x1, y1);
    this.p2 = new Point(x2, y2);
  }
  setStart(x1,y1) {
    this.p1 = new Point(x1, y1);
    this.angle = 0;
  }
  setEnd(x2,y2) {
    this.p2 = new Point(x2, y2);
    this.angle = 0;
  }
  getNextPoint(radius=4){
    let angle = this.getAngle(); 
    let x = this.p2.x + radius * Math.sin((angle * Math.PI / 180));
    let y = this.p2.y + radius * Math.cos((angle * Math.PI / 180));
    return new Point(x, y);
  }
  getAngle() {
    if (this.p1 && this.p2 && this.angle == 0) {
      this.angle = ctools.getAngle(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    }
    return this.angle;
  }
  getChangeAngle(angle){
    let lineAngle = this.getAngle();
    return lineAngle - angle + lineAngle;
  }
  isOnLine(x, y, deviation = 2){//是在线上
    let {x1, x2, y1, y2} = this.getMinMax();
    let p = new Point(x, y);
    // console.log(x1, x2, y1, y2,
    //   (p.x - deviation >= x1 || p.x + deviation >= x1) && (p.x - deviation <= x2 || p.x + deviation <= x2),
    //   (p.y - deviation >= y1 || p.y + deviation >= y1) && (p.y - deviation <= y2 || p.y + deviation <= y2)
    // );
    if ((p.x - deviation >= x1 || p.x + deviation >= x1) && (p.x - deviation <= x2 || p.x + deviation <= x2)) {
      if ((p.y - deviation >= y1 || p.y + deviation >= y1) && (p.y - deviation <= y2 || p.y + deviation <= y2)){
        let angle = ctools.getAngle(p.x, p.y, this.p1.x, this.p1.y);
        if (!this.angleMin){
          this.angleAbs = Math.abs(Math.abs(this.angle) - Math.abs(angle));
          return false;
        }
        let angleAbs = Math.abs(Math.abs(this.angle) - Math.abs(angle));
        if (angleAbs > this.angleAbs) {
          return true;
        }
      }
    }
    return false;
  }

  getMinMax(){
    if(!this.minMax){
      let x1, x2, y1, y2
      if (this.p1.x < this.p2.x) {
        x1 = this.p1.x;
        x2 = this.p2.x;
      } else {
        x1 = this.p2.x;
        x2 = this.p1.x;
      }
      if (this.p1.y < this.p2.y) {
        y1 = this.p1.y;
        y2 = this.p2.y;
      } else {
        y1 = this.p2.y;
        y2 = this.p1.y;
      }
      this.minMax = {x1, x2, y1, y2};
    }
    return this.minMax;
  }
}
//点
export class Point {
  x = 0
  y = 0;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  setX(x) {
    this.x = x;
  }
  setY(y) {
    this.y = y;
  }
}
