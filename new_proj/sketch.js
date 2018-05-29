var w=16;
var cols;
var rows;
var grid={};
var c_cell=0;

var current;
var my_stack={};
var stack_itr=0;

function setup(){
  frameRate(20);
  createCanvas(400,400);
  cols=width/w;
  rows=height/w;
  for(var i=0;i<rows;i++){
    for(var j=0;j<cols;j++){
      grid[c_cell++]=new cell(j,i);
    }
  }
  console.log(c_cell);

  /*for(k=0;k<rows;k++)
    for(l=0;l<cols;l++)
      console.log( grid[k+(l)*cols].i + " " + grid[k+(l)*cols].j);
      */
  current=grid[261];
  current.start=true;
}

function draw(){
  current.lead=true;
  background(0);
  for(var i=0;i<c_cell;i++){
    grid[i].show();
  }
  console.log("current:"+current.i/w+" "+current.j/w);
  current.visited=true;
  var chosen=current.getNbrs();
  if(chosen==null){
    console.log("picking from stack:" + stack_itr);
    if(stack_itr>0){
      current=my_stack[--stack_itr];
      --stack_itr;//1 2 3 4
    }else{
      console.log("DONE!!");
    }
  }else{
    console.log("chosen:"+chosen.i/w+" "+chosen.j/w);
    my_stack[stack_itr++]=chosen;
    rmWall(current,chosen);
    current=chosen;
    current.visited=true;
  }
}

function rmWall(current,chosen){
  //console.log("current " + current.i + " " + current.j);
  //console.log("chosen " + chosen.i + " " + chosen.j);
  if(chosen.i-current.i>0){
    current.walls[1]=false;
    chosen.walls[3]=false;
  }//right
  else if(chosen.i-current.i<0){
    current.walls[3]=false;
    chosen.walls[1]=false;
  }//left
  else if(chosen.j-current.j>0){
    current.walls[2]=false;
    chosen.walls[0]=false;
  }//down
  else{
    current.walls[0]=false;
    chosen.walls[2]=false;
  }//up
}

function cell(i,j){
  this.i=i*w;
  this.j=j*w;
  this.visited=false;
  this.walls=[true,true,true,true];
  this.lead=false;
  this.start=false;
  this.end=false;

  this.show=function(){
    stroke(255);
    if(this.walls[0])line(this.i,this.j,this.i+w,this.j);//top
    if(this.walls[1])line(this.i+w,this.j,this.i+w,this.j+w);//right
    if(this.walls[2])line(this.i+w,this.j+w,this.i,this.j+w);//bottom
    if(this.walls[3])line(this.i,this.j+w,this.i,this.j);//left

    if(this.visited){
      noStroke();
      fill(255,0,255,70);
      rect(this.i,this.j,w,w);
    }
    if(this.lead){
      noStroke();
      fill(255,0,0,100);
      rect(this.i,this.j,w,w);
      this.lead=false;
    }
    if(this.start || this.end){
      noStroke();
      fill(255,0,0);
      rect(this.i,this.j,w,w);
    }
  }

  this.getNbrs=function(){
    var nbrs=[];
    if(this.i-1>=0)nbrs.push(grid[(i-1)+(j)*cols]);
    if(this.i<width-w)nbrs.push(grid[(i+1)+(j)*cols]);
    if(this.j-1>=0)nbrs.push(grid[(i)+(j-1)*cols]);
    if(this.j+1<height-w)nbrs.push(grid[(i)+(j+1)*cols]);

    var unvisitedNbrs=[];

    console.log("nbrs:"+nbrs.length);

    for(c=0;c<nbrs.length;c++){
      console.log(nbrs[c].i/w + " " + nbrs[c].j/w);
      if(!(nbrs[c].visited))unvisitedNbrs.push(nbrs[c]);
    }

    console.log("unNbrs:"+unvisitedNbrs.length);

    if(unvisitedNbrs.length==0)return null;
    else{
      return unvisitedNbrs[floor(random(0,unvisitedNbrs.length))];
    }
  }
/*
00 10 20 30
01 11 21 31
02 12 22 32
03 13 23 33
(j)*cols+i
*/
}
