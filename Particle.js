class Particle {
    constructor()
    {
      // The mass of the particle is 1;
      this.mass = 1;
      
      this.position = createVector(0, 0, 0);
      this.velocity = createVector(0, 0, 0);
      this.acceleration = createVector(0, 0, 0);
  
      this.drag = 0;
      this.gravity = createVector(0, 0, 0);
      
      this.angle = createVector(0, 0, 0); 
      this.angularVelocity = createVector(0, 0, 0);
      this.angularAcceleration = createVector(0, 0, 0);
      
      this.angularDrag = 0;
      
      this.age = 0;
      this.maxAge = 0;
      
      this.isFixedPosition = false;
      
    }
    
    applyForce(force) {
      let f = force.copy();
      // f = m * a, so a = F / m.
      let a = f.div(this.mass);
      // Add this force to the current acceleration.
      this.acceleration.add(a);    
    }
    
    
    update() {
      // Scale the velocity by the drag scalar.
      this.velocity.mult(constrain(0,(1 - this.drag), 1)); //CHANGE 01
      // Add the gravity acceleration to the velocity.
      this.velocity.add(this.gravity);
      // Add any additional accelerations to the velocity.
      this.velocity.add(this.acceleration);
      
      // Clear acceleration (multiply by zero).
      this.acceleration.mult(0);
  
      // If this is fixed, then we always set velocity to zero.
      if (this.isFixedPosition) 
      {
        this.velocity.mult(0);
      }
      
      // Add the velocity to the position.
      this.position.add(this.velocity);
      
      // Scale the angular velocity by the angular drag scalar.    
      this.angularVelocity.mult(constrain(0, (1 - this.angularDrag), 1)); //CHANGE 02
      /// Add any additional accelerations to the angular acceleration.
      this.angularVelocity.add(this.angularAcceleration);
  
      // Clear the angular acceleration (multiply by zero).
      this.angularAcceleration.mult(0);
      
      // Add the angular velocity to the angle.
      this.angle.add(this.angularVelocity);
      
      // Increment the age.
      this.age++;
    }
  }