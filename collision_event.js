class CollisionEvent {
  constructor(t, nParticleA, nParticleB, collisionCountA, collisionCountB) {
    this.t = t; //time of collision
    this.nParticleA = nParticleA;
    this.nParticleB = nParticleB;
    this.collisionCountA = collisionCountA; //collision count of the particle at the time of creation of the event
    this.collisionCountB = collisionCountB;
  }
}