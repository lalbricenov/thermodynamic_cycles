function Gas(N,temp){
  this.N = N;
  this.molecules = [];
  this.t = 0;//tiempo
  this.T = temp;
  this.walls = [];
  this.maxX=absWidth*3/4;
  this.minX=absWidth*1/4;
  this.maxY=absHeight*3/4;
  this.minY=absHeight*1/4;
  this.boxWidth = this.maxX-this.minX;
  this.boxHeigth = this.maxY-this.minY;
  this.moleculeMass = 32;
  this.moleculeRadius = 5;
  this.collisionEventsQueue = new PriorityQueue({ comparator: function(a, b) { return a.t - b.t; }});

  this.initialize = function(){
    var wallThickness = absWidth*1/40;//fraction of the window
    var newWall = new Wall(this.maxX,this.minY-wallThickness,this.maxX+wallThickness,this.maxY+wallThickness); 
    this.walls.push(newWall);
    newWall = new Wall(this.minX-wallThickness,this.minY,this.minX, this.maxY); 
    this.walls.push(newWall);
    newWall = new Wall(this.minX-wallThickness,this.minY-wallThickness,this.maxX,this.minY); 
    this.walls.push(newWall);
    newWall = new Wall(this.minX-wallThickness,this.maxY,this.maxX,this.maxY+wallThickness); 
    this.walls.push(newWall);

    for(i=0;i<this.N;i++){
      // console.log("Here.")
      var xNew = this.minX+this.moleculeRadius+(this.boxWidth-2*this.moleculeRadius)*random();
      var yNew = this.minY+this.moleculeRadius+(this.boxHeigth-2*this.moleculeRadius)*random();
      while(this.areThereAnyCollisions(xNew, yNew, this.moleculeRadius)){
        xNew = this.minX+this.moleculeRadius+(this.boxWidth-2*this.moleculeRadius)*random();
        yNew = this.minY+this.moleculeRadius+(this.boxHeigth-2*this.moleculeRadius)*random();
      }

      var molecule = new Molecule(xNew,yNew,5*random(),5*random(),this.moleculeMass,this.moleculeRadius);//in the units of the program
      this.molecules.push(molecule);       
    }
  }
  this.areThereAnyCollisions = function(xI, yI, rI){//Position and radius of molecule i
    //there are no collisions with walls right after initialization
    var dX;
    var dY;
    if(this.molecules.length==0){
      return false;
    }else{
      for(j=0;j<this.molecules.length;j++){
        dX = xI-this.molecules[j].x;
        dY = yI-this.molecules[j].y;
        if(Math.sqrt(dX**2+dY**2)<rI+this.molecules[j].r){
          return true;
        }
      }
      return false;
    }
  }
  
  this.distance = function(i,j){//returns the distance between particles of indices i and j
    var dX = this.molecules[i].x-this.molecules[j].x;
    var dY = this.molecules[i].y-this.molecules[j].y;
    return Math.sqrt(dX**2+dY**2);
  }
  this.display = function(){
    for(i=0;i<4;i++){
      this.walls[i].display();
    }
    for(i=0;i<this.N;i++){
      this.molecules[i].display();
    }
    
       
  }

  this.calculateEvents =function(){
    for(i=0;i<this.N;i++){
      var moleculei=this.molecules[i];
      var tCollision = moleculei.collidesX(this.minX,this.maxX)+this.t;//collision with vertical wall
      var tProvisional=Infinity;
      var nParticle2=-2;//indice of particle that will collide with molecule i. -1 and -2 are walls
      var collisionCount2 =0;//collision count of particle 2 at the time of addition of the event
      for(j=-1;j<this.N;j++){//Now all the other collisions are tested
        if(j==-1){//collision with horizontal wall, -1 for horizontal
          tProvisional = moleculei.collidesY(this.minY,this.maxY)+this.t;
          if(tProvisional<tCollision){
            tCollision = tProvisional;
            nParticle2=j;
            collisionCount2=0;
          }
        }else if(j>i){
          tProvisional = moleculei.collides(this.molecules[j])+this.t;
          if(tProvisional<tCollision){
            tCollision = tProvisional;
            nParticle2=j;
            collisionCount2=this.molecules[j].collisionCount;
          }
        }      
      }
      var collisionEvent = new CollisionEvent(tCollision,i,nParticle2,moleculei.collisionCount,collisionCount2);
      this.collisionEventsQueue.queue(collisionEvent);
    }
  }

  this.isAValidEvent = function(event){
    if(event.nParticleB!=-1 && event.nParticleB!=-2){
      return (this.molecules[event.nParticleA].collisionCount<=event.collisionCountA)&&(this.molecules[event.nParticleB].collisionCount<=event.collisionCountB);
    }else{
      return this.molecules[event.nParticleA].collisionCount<=event.collisionCountA;
    }    
  }
  this.advanceToNextCollision = function(){
    // console.table(this.molecules);
    // console.log(this.kineticEnergy());
    nextEvent = this.collisionEventsQueue.dequeue();
    while(!(this.isAValidEvent(nextEvent))){//While the event is not a valid one
      nextEvent=this.collisionEventsQueue.dequeue();
    }
    // console.log(nextEvent.nParticleA,nextEvent.nParticleB);

    //update positions and time
    for(i=0;i<this.N;i++){
      this.molecules[i].updatePosition(nextEvent.t-this.t);
    }
    // console.log("After position update"+this.kineticEnergy());
    this.t = nextEvent.t;
    //update velocities and collision number
    if(nextEvent.nParticleB==-2){//-2 for vertical wall
      this.molecules[nextEvent.nParticleA].bounceX();
      this.molecules[nextEvent.nParticleA].collisionCount++;
    }else if(nextEvent.nParticleB==-1){//-1 for horizontal wall
      this.molecules[nextEvent.nParticleA].bounceY();
      this.molecules[nextEvent.nParticleA].collisionCount++;
    }else{
      var moleculeA = this.molecules[nextEvent.nParticleA];
      var moleculeB = this.molecules[nextEvent.nParticleB];
      var sigm = moleculeA.r+moleculeB.r;
      var mu = 2*moleculeA.m*moleculeB.m/(moleculeA.m+moleculeB.m);
      var j = mu*((moleculeB.x-moleculeA.x)*(moleculeB.vX-moleculeA.vX)+(moleculeB.y-moleculeA.y)*(moleculeB.vY-moleculeA.vY))/sigm;
      
      var jX= j*(moleculeB.x-moleculeA.x)/sigm;
      var jY= j*(moleculeB.y-moleculeA.y)/sigm;

      this.molecules[nextEvent.nParticleA].vX += jX/moleculeA.m;
      this.molecules[nextEvent.nParticleA].vY += jY/moleculeA.m;
      this.molecules[nextEvent.nParticleB].vX += -jX/moleculeB.m;
      this.molecules[nextEvent.nParticleB].vY += -jY/moleculeB.m;

      this.molecules[nextEvent.nParticleA].collisionCount++;
      this.molecules[nextEvent.nParticleB].collisionCount++;
      this.molecules[nextEvent.nParticleA].updateColor();
      this.molecules[nextEvent.nParticleB].updateColor();
    }
    // console.log("After velocity update"+this.kineticEnergy());
  }
  this.kineticEnergy = function(){
    var k=0;
    for(i=0;i<this.N;i++){
      k+=this.molecules[i].m*(this.molecules[i].vX**2+this.molecules[i].vY**2)/2;
    }
    return k;
  }

}