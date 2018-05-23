var absWidth = 1280;
var absHeight = 720;

//transformation between systems of reference
function rToAbs(real){
  return [absWidth*real[0]/width,absHeight*real[1]/height];

}
function absToR(abstract){
  return [width*abstract[0]/absWidth,height*abstract[1]/absHeight];
}
function absToY(absY){
  return height*absY/absHeight;
}
function absToX(absX){
  return width*absX/absWidth;
}
//Transformations between SI and units used: K, nm, kb=1, uma=1
function vSItoProgram(vSI){
  return vSI/91.18;
}
function lengthSItoProgram(lSI){
  return lSI*10**9;
}
function tSItoProgram(tSI){
  return tSI*(10**11)/1.0966784;
}