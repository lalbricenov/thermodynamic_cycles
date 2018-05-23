function Wall(x1,y1,x2,y2)//coordinates of the 2 edges of a diagonal
{
  if(x1<x2){
    this.xLeft = x1;
    this.xRight = x2;
  }else{
    this.xLeft = x2;
    this.xRight = x1;
  }
  if(y1<y2){
    this.yTop = y1;
    this.yBottom= y2;
  }else{
    this.yTop = y2;
    this.yBottom= y1;
  }
  this.absX1=absToX(this.xLeft);
  this.absX2=absToX(this.xRight);
  this.absY1=absToY(this.yTop);
  this.absY2=absToY(this.yBottom);
  this.height = this.yBottom-this.yTop;
  this.width = this.xRight-this.xLeft;

  this.absHeight = this.absY2-this.absY1;
  this.absWidth = this.absX2 - this.absX1;

  this.display = function(){
    fill(100);
    noStroke();
    console.log(this.absX1,this.absY1,this.absX2,this.absY2);
    rect(this.absX1,this.absY1,this.absWidth,this.absHeight);
  }
}