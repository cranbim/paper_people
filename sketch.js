var video;
var poseNet;
var figures=[];
var ready=false;
var person;


var emptyFigureData={
  pose:{
    score:0.99,
    keypoints: [
      {position:{x:0, y:0}},
      {position:{x:0, y:0}},
      {position:{x:0, y:0}},
      {position:{x:0, y:0}},
      {position:{x:0, y:0}},
      {position:{x:0, y:0}},
      {position:{x:0, y:0}},
      {position:{x:0, y:0}},
      {position:{x:0, y:0}},
      {position:{x:0, y:0}},
      {position:{x:0, y:0}},
      {position:{x:0, y:0}},
      {position:{x:0, y:0}},
      {position:{x:0, y:0}},
      {position:{x:0, y:0}},
      {position:{x:0, y:0}},
      {position:{x:0, y:0}}
    ]
  }
};

var paperBg;
var plaidBg;
var sp;

function preload(){
  paperBg=loadImage("crumpledPaperMedium.jpg");
  plaidBg=loadImage("plaid1.jpg");
  dnaPage=loadImage("dnaPageMedium.jpg");
  sp=loadImage("simplePerson.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video=createCapture(VIDEO);
  video.hide();
  poseNet=ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);
  person=new StickPerson(emptyFigureData);
  person.updatePoints(emptyFigureData);
  
  pp=new PaperPeople(100,220,10,dnaPage);
}

function draw() {
  // background(100);
  background(paperBg);
  // pp.show(sp);
  var perImg=createImage(100,100);//=sp.copy();
  person.showVid(video,0,0,0.2);
  if(ready){
    person.show(0,0,0.2);
    person.easePoints();
    person.updatePoints();
    
    // person.showPerson(width/2,height/2,160);
    perImg=person.getPersonImage(220);
    image(perImg,150,0,50,110);
  }
  pp.show(perImg);

}

function modelReady(){
  console.log("poseNet ready");
  ready=true;
}

function gotPoses(poses){
  person.refreshPoints(poses[0]);
  // person.easePoints();
  person.updatePoints();
}

// function easePosePoints(data){
//   var ease=0.1;
//   // console.log(data.pose);
//   if(data && data.pose){
//     data.pose.keypoints.forEach(function(dp,i){
//       if(smoothPoints[i].x){
//         smoothPoints[i].x=smoothPoints[i].x+(dp.position.x-smoothPoints[i].x)*ease;
//         smoothPoints[i].y=smoothPoints[i].y+(dp.position.y-smoothPoints[i].y)*ease;
//       } else {
//         smoothPoints[i].x=dp.position.y;
//         smoothPoints[i].y=dp.position.y;
//       }
//     });
//   }
//   console.log(smoothPoints);
// }



function StickPerson(startData){
  var nose, eyes, ears, shoulders, hips, upperArmL, lowerArmL;
  var upperLegL, lowerLegL, upperArmR, lowerArmR, upperLegR, lowerLegR;
  var headWidth, headHeight, neck, naval, headAngle;
  var relHeadPos={x:0, y:0};
  var relCentre, relHeadSize, relNeckPos, relLHand, relRHand, relNaval
  var relUAL, relUAR, relLAL, relLAR, relULL, relULR, relLLL, relLLR, relLFoot, relRFoot;
  var boundingBox;
  var ease=0.7;
  var osb=createGraphics(160,160);
  
  var smoothPoints=startData.pose.keypoints;
  var currentData;
  
  // var osb=createGraphics(150,200);
  this.refreshPoints=function(data){
    currentData=data;
  };
  
  this.easePoints=function(){
    var ease=0.3;
    // console.log(smoothPoints);
    if(currentData && currentData.pose){
      currentData.pose.keypoints.forEach(function(dp,i){
        if(smoothPoints[i].position.x){
          smoothPoints[i].position.x=smoothPoints[i].position.x+(dp.position.x-smoothPoints[i].position.x)*ease;
          smoothPoints[i].position.y=smoothPoints[i].position.y+(dp.position.y-smoothPoints[i].position.y)*ease;
        } else {
          smoothPoints[i].position.x=dp.position.y;
          smoothPoints[i].position.y=dp.position.y;
        }
      });
    }
    // console.log(smoothPoints);
  };
  
  this.updatePoints=function(){
    if(smoothPoints){
      // console.log(data.pose.keypoints[0]);
      nose=[{x: smoothPoints[0].position.x, y: smoothPoints[0].position.y}];
      eyes=[{x: smoothPoints[1].position.x, y: smoothPoints[1].position.y}, {x: smoothPoints[2].position.x, y: smoothPoints[2].position.y}];
      ears=[{x: smoothPoints[3].position.x, y: smoothPoints[3].position.y}, {x: smoothPoints[4].position.x, y: smoothPoints[4].position.y}];
      shoulders=[{x: smoothPoints[5].position.x, y: smoothPoints[5].position.y}, {x: smoothPoints[6].position.x, y: smoothPoints[6].position.y}];
      hips=[{x: smoothPoints[11].position.x, y: smoothPoints[11].position.y}, {x: smoothPoints[12].position.x, y: smoothPoints[12].position.y}];
      upperArmL=[{x: smoothPoints[5].position.x, y: smoothPoints[5].position.y}, {x: smoothPoints[7].position.x, y: smoothPoints[7].position.y}];
      lowerArmL=[{x: smoothPoints[7].position.x, y: smoothPoints[7].position.y}, {x: smoothPoints[9].position.x, y: smoothPoints[9].position.y}];
      upperLegL=[{x: smoothPoints[11].position.x, y: smoothPoints[11].position.y}, {x: smoothPoints[13].position.x, y: smoothPoints[13].position.y}];
      lowerLegL=[{x: smoothPoints[13].position.x, y: smoothPoints[13].position.y}, {x: smoothPoints[15].position.x, y: smoothPoints[15].position.y}];
      upperArmR=[{x: smoothPoints[6].position.x, y: smoothPoints[6].position.y}, {x: smoothPoints[8].position.x, y: smoothPoints[8].position.y}];
      lowerArmR=[{x: smoothPoints[8].position.x, y: smoothPoints[8].position.y}, {x: smoothPoints[10].position.x, y: smoothPoints[10].position.y}];
      upperLegR=[{x: smoothPoints[12].position.x, y: smoothPoints[12].position.y}, {x: smoothPoints[14].position.x, y: smoothPoints[14].position.y}];
      lowerLegR=[{x: smoothPoints[14].position.x, y: smoothPoints[14].position.y}, {x: smoothPoints[16].position.x, y: smoothPoints[16].position.y}];
      headWidth=dist(ears[0].x, ears[0].y, ears[1].x, ears[1].y);
      neck={x: (shoulders[0].x+shoulders[1].x)/2, y: (shoulders[0].y+shoulders[1].y)/2};
      headPos=dist(nose[0].x, nose[0].y, neck.x, neck.y);
      headHeight=headPos*0.6*2;
      headAngle=atan2(ears[1].y-ears[0].y, ears[1].x-ears[0].x);
      naval={x: (hips[0].x+hips[1].x)/2, y: (hips[0].y+hips[1].y)/2};
      
      boundingBox={
        l: 1000,
        r: -1000,
        t: 1000,
        b: -1000,
        cx:0,
        cy:0,
        w:0,
        h:0,
        ar:1
      };
      smoothPoints.forEach(function(kp){
        if(kp.position.x<boundingBox.l) boundingBox.l=kp.position.x;
        if(kp.position.x>boundingBox.r) boundingBox.r=kp.position.x;
        if(kp.position.y-headHeight/2<boundingBox.t) boundingBox.t=kp.position.y-headHeight/2;
        if(kp.position.y>boundingBox.b) boundingBox.b=kp.position.y;
      });
      boundingBox.cx=(boundingBox.r+boundingBox.l)/2;
      boundingBox.cy=(boundingBox.t+boundingBox.b)/2;
      boundingBox.w=(boundingBox.r-boundingBox.l);
      boundingBox.h=(boundingBox.b-boundingBox.t);
      boundingBox.ar=boundingBox.w/boundingBox.h;
      // console.log(boundingBox);
      
      
      // relCentre={x: (naval.x+neck.x)/2, y: (naval.y-neck.y)/2};
      // relCentre={x: boundinBox.cx/boundingBox.w, y: boundingBox.cy/boundingbox.h};
      // relHeadPos.x=((nose[0].x-boundingBox.cx)/boundingBox.w);
      // // , y: relHeadPos.y+((nose[0].y-boundingBox.cy)/boundingBox.w-relHeadPos.y)};
      // console.log(relHeadPos.x);
      relHeadPos={x: (nose[0].x-boundingBox.cx)/boundingBox.w, y: (nose[0].y-boundingBox.cy)/boundingBox.h};
      relHeadSize=headWidth/boundingBox.w;
      relNeck={x: (neck.x-boundingBox.cx)/boundingBox.w, y: (neck.y-boundingBox.cy)/boundingBox.h};
      relNaval={x: (naval.x-boundingBox.cx)/boundingBox.w, y: (naval.y-boundingBox.cy)/boundingBox.h};
      relUAL=[{x: (upperArmL[0].x-boundingBox.cx)/boundingBox.w, y: (upperArmL[0].y-boundingBox.cy)/boundingBox.w},
              {x: (upperArmL[1].x-boundingBox.cx)/boundingBox.w, y: (upperArmL[1].y-boundingBox.cy)/boundingBox.w}];
      relLAL=[{x: (lowerArmL[0].x-boundingBox.cx)/boundingBox.w, y: (lowerArmL[0].y-boundingBox.cy)/boundingBox.w},
              {x: (lowerArmL[1].x-boundingBox.cx)/boundingBox.w, y: (lowerArmL[1].y-boundingBox.cy)/boundingBox.w}];
      relUAR=[{x: (upperArmR[0].x-boundingBox.cx)/boundingBox.w, y: (upperArmR[0].y-boundingBox.cy)/boundingBox.w},
              {x: (upperArmR[1].x-boundingBox.cx)/boundingBox.w, y: (upperArmR[1].y-boundingBox.cy)/boundingBox.w}];
      relLAR=[{x: (lowerArmR[0].x-boundingBox.cx)/boundingBox.w, y: (lowerArmR[0].y-boundingBox.cy)/boundingBox.w},
              {x: (lowerArmR[1].x-boundingBox.cx)/boundingBox.w, y: (lowerArmR[1].y-boundingBox.cy)/boundingBox.w}];
      relULL=[{x: (upperLegL[0].x-boundingBox.cx)/boundingBox.w, y: (upperLegL[0].y-boundingBox.cy)/boundingBox.w},
              {x: (upperLegL[1].x-boundingBox.cx)/boundingBox.w, y: (upperLegL[1].y-boundingBox.cy)/boundingBox.w}];
      relLLL=[{x: (lowerLegL[0].x-boundingBox.cx)/boundingBox.w, y: (lowerLegL[0].y-boundingBox.cy)/boundingBox.w},
              {x: (lowerLegL[1].x-boundingBox.cx)/boundingBox.w, y: (lowerLegL[1].y-boundingBox.cy)/boundingBox.w}];
      relULR=[{x: (upperLegR[0].x-boundingBox.cx)/boundingBox.w, y: (upperLegR[0].y-boundingBox.cy)/boundingBox.w},
              {x: (upperLegR[1].x-boundingBox.cx)/boundingBox.w, y: (upperLegR[1].y-boundingBox.cy)/boundingBox.w}];
      relLLR=[{x: (lowerLegR[0].x-boundingBox.cx)/boundingBox.w, y: (lowerLegR[0].y-boundingBox.cy)/boundingBox.w},
              {x: (lowerLegR[1].x-boundingBox.cx)/boundingBox.w, y: (lowerLegR[1].y-boundingBox.cy)/boundingBox.w}];
      // console.log(relNaval);
      // console.log(headPos+" "+relHeadPos);
    }
  };
  

  
  this.showVid=function(vidImg,x,y,scl){
    push();
    translate(x,y);
    scale(scl);
    translate(vidImg.width/2, vidImg.height/2);
    scale(-1,1);
    imageMode(CENTER);
    image(vidImg,0,0);
    pop();
  };
  
  this.show=function(x,y,scl){
    push();
    translate(x,y);
    scale(scl);
    translate(video.width/2, video.height/2);
    scale(-1, 1);
    translate(-video.width/2, -video.height/2);
    fill(255,180);
    noStroke();
    push();
    translate(neck.x, neck.y);
    rotate(headAngle);
    translate(0,headPos);
    ellipse(0,0, headWidth, headHeight);
    pop();
    stroke(255,100);
    strokeWeight(headWidth/3);
    line(neck.x, neck.y, naval.x, naval.y);
    line(shoulders[0].x, shoulders[0].y, upperArmL[1].x, upperArmL[1].y);
    line(lowerArmL[0].x, lowerArmL[0].y, lowerArmL[1].x, lowerArmL[1].y);
    line(shoulders[1].x, shoulders[1].y, upperArmR[1].x, upperArmR[1].y);
    line(lowerArmR[0].x, lowerArmR[0].y, lowerArmR[1].x, lowerArmR[1].y);
    line(hips[0].x, hips[0].y, lowerLegL[1].x, lowerLegL[1].y);
    line(hips[1].x, hips[1].y, lowerLegR[1].x, lowerLegR[1].y);
    strokeWeight(3);
    stroke(0,200,200);
    noFill();
    rect(boundingBox.l, boundingBox.t, boundingBox.r-boundingBox.l, boundingBox.b-boundingBox.t);
    ellipse(boundingBox.cx,boundingBox.cy,10);
    pop();
  };
  
  this.getPersonImage=function(h){
    var ar=boundingBox.ar || 1;// var w=h;
    var w=h*ar;
    // console.log(w,h,ar);
    osb=createGraphics(w,h);
    // osb.background(0,200,200);
    osb.translate(w/2, h/2);
    osb.scale(-1,1);
    osb.fill(255);
    osb.noStroke();
    osb.ellipse(relHeadPos.x*w, relHeadPos.y*h, h/3);
    osb.stroke(255);
    osb.strokeWeight(h/8);
    // osb.strokeCap(SQUARE);
    osb.line(relNeck.x*w, relNeck.y*w, relNaval.x*w, relNaval.y*w);
    osb.line(relNeck.x*w, relNeck.y*w, relUAL[1].x*w, relUAL[1].y*w);//relUAL[0].x*w
    osb.line(relLAL[0].x*w, relLAL[0].y*w, relLAL[1].x*w, relLAL[1].y*w);
    osb.line(relNeck.x*w, relNeck.y*w, relUAR[1].x*w, relUAR[1].y*w);//relUAR[0].x*w
    osb.line(relLAR[0].x*w, relLAR[0].y*w, relLAR[1].x*w, relLAR[1].y*w);
    osb.line(relNaval.x*w, relNaval.y*w, relULL[1].x*w, relULL[1].y*w);//relULL[0].x*w
    osb.line(relLLL[0].x*w, relLLL[0].y*w, relLLL[1].x*w, relLLL[1].y*w);
    osb.line(relNaval.x*w, relNaval.y*w, relULR[1].x*w, relULR[1].y*w);//relULR[0].x*w
    osb.line(relLLR[0].x*w, relLLR[0].y*w, relLLR[1].x*w, relLLR[1].y*w);
    return osb.get();
  };
  
  this.showPerson=function(x,y,h){
    var w=h*boundingBox.ar;
    push();
    translate(x,y);
    scale(-1,1);
    stroke(255,0,0,150);
    strokeWeight(3);
    noFill();
    rectMode(CENTER);
    rect(0,0,w,h);
    ellipse(0,0,10);
    fill(235,135,0,255);
    noStroke();
    ellipse(relHeadPos.x*w, relHeadPos.y*h, h/4);
    stroke(235,135,0,255);
    strokeWeight(h/8);
    line(relNeck.x*w, relNeck.y*w, relNaval.x*w, relNaval.y*w);
    line(relNeck.x*w, relNeck.y*w, relUAL[1].x*w, relUAL[1].y*w);//relUAL[0].x*w
    line(relLAL[0].x*w, relLAL[0].y*w, relLAL[1].x*w, relLAL[1].y*w);
    line(relNeck.x*w, relNeck.y*w, relUAR[1].x*w, relUAR[1].y*w);//relUAR[0].x*w
    line(relLAR[0].x*w, relLAR[0].y*w, relLAR[1].x*w, relLAR[1].y*w);
    
    line(relNaval.x*w, relNaval.y*w, relULL[1].x*w, relULL[1].y*w);//relULL[0].x*w
    line(relLLL[0].x*w, relLLL[0].y*w, relLLL[1].x*w, relLLL[1].y*w);
    line(relNaval.x*w, relNaval.y*w, relULR[1].x*w, relULR[1].y*w);//relULR[0].x*w
    line(relLLR[0].x*w, relLLR[0].y*w, relLLR[1].x*w, relLLR[1].y*w);
    pop();
  }
}

function PaperPeople(w,h,n,img){
  var p;
  var p2;
  var noiseShift=50;
  var setAnchors;
  var baseAngle=0;
  var angleRange=2.5;
  var p2w=w;
  var p2h=h;
  var numPeople=n;
  
  var maskBuffer;
  var paperOffset=[];
  var hues=[];
  var coveredWidth=0;
  var coveredHeight=0
  
  p2=new Person2();
  for(var i=0; i<numPeople; i++){
    paperOffset[i]={x: floor(random(100)), y: floor(random(100))};
    hues[i]=random(360);
  }
  maskBuffer=new MaskBuffer(p2w, p2h, img);

  this.show=function(imgLive){
    // get your source image
    // maskBuffer.render();
    maskBuffer.renderImage(imgLive)
    var img=maskBuffer.getImage();
    // image(img,0,0);
    var angle=(noise(frameCount/500 + i*0.01)-0.5)*angleRange;
    setAnchors={right: {x:width/2-coveredWidth/2, y:height*0.7-coveredHeight/2},left: {x:-w, y:height/2}};
    for(var i=0; i<10; i++){
      var dir=i%2===0?1:-1;
      angle=baseAngle+(noise((frameCount+i)/100, i)-0.5)*angleRange;
      setAnchors=p2.show(setAnchors,w,h,dir*angle,dir,0, img, hues[i]);
    }
    coveredWidth=50+setAnchors.right.x;
    coveredHeight=setAnchors.right.y;
  };

}


function Person2(dir, anchorSide){

  this.show=function(anchors,w,h,rot, dir, anchorSide, img,hCol){
    var sclX=cos(rot);
    var sclY=sin(rot);
    var shearH=tan(rot);
    push();
    if(anchorSide===0){
      // console.log(anchors);
      translate(anchors.right.x, anchors.right.y);
      // translate(200,200);
      translate(w*sclX/2, shearH*w/2);
      anchors.left.x=anchors.right.x;
      anchors.left.y=anchors.right.y;
      anchors.right.x=anchors.left.x+sclX*w;
      anchors.right.y=anchors.left.y+shearH*w;
    } else if(anchorSide===1){
      translate(anchors.left.x, anchors.left.y);
      translate(-w*scl/2, shearH*w/2);
      anchors.right.x=anchors.left.x;
      anchors.right.y=anchors.left.y;
      anchors.left.x=anchors.right.x-sclX*w;
      anchors.left.y=anchors.right.y+shearH*w;
    }
    scale(sclX,1);
    shearY(rot);
    scale(dir,1);
    if(img){
      var shade=70+tan(rot)*30;
      colorMode(HSB);
      tint((hCol+frameCount)%360,50,shade,1);
      // fill(100+tan(rot)*50);
      fill((hCol+100)%360,30,shade,0.5);
      
      noStroke();
      // rect(-w/2, -h/2,w,h);
      image(img,-w/2,-h/2);
    } else {
      stroke(255);
      fill(100,100);
      strokeWeight(1);
      rectMode(CENTER);
      rect(0,0,w,h);
      rect(w/4, h/4, w/2, h/2);
    }
    pop();
    return anchors;
  };
  
}

function MaskBuffer(w,h,maskedImg){
  var osb=createGraphics(w,h);
  var masked=createImage(w,h);
  var x=w/2;
  var y=h/2;
  var r=h*0.15;
  var driftX=random(-1,1);
  var driftY=random(-1,1);
  var bg=createImage(w,h);
    
  render(0);
  
  this.renderImage=function(img){
    var iw=img.width;
    osb.clear();
    osb.push();
    osb.scale(w/iw);
    osb.image(img,0,0);
    osb.pop();
    // masked.copy(maskedImg,floor(noise(frameCount/100)*200), floor(noise(3+frameCount/100)*200),w,h,0,0,w,h);
    masked.copy(maskedImg,0,0,w*2,h*2,0,0,w,h);
    masked.mask(osb.get());
  };
  
  this.render=function(i){
    render(i);
  };
  
  function render(){
    // x+=driftX;
    // y+=driftY;
    if(x+r>w || x-r<0) driftX*=-1;
    if(y+r>h || y-r<0) driftY*=-1;
    osb.clear();
    osb.fill(0,100,200);
    osb.noStroke();
    osb.ellipse(x,y,r*2);
    // masked.copy(maskedImg,floor(noise(frameCount/100)*200), floor(noise(3+frameCount/100)*200),w,h,0,0,w,h);
    masked.copy(maskedImg,0,0,w,h,0,0,w,h);
    masked.mask(osb.get());
  }
  
  this.getImage=function(){
    return masked.get();
  };
  
}