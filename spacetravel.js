function space(canvas){
    var interval = 50; // milliseconds
    var self = this;
    var cvs = canvas;
    var ctx = cvs.getContext("2d");

    var spaceshuttle = null;
    var stars = [];
    var destination = null;

    var reachedDest = false;
    var collided = false;
    var lost = false;

    this.initializeSpaceShuttle = function(shuttle){
        spaceshuttle = shuttle;
        document.onkeydown = this.event;
        shuttle.drawShuttle(ctx);
    };

    this.initializeDestination = function(dest){
        destination = dest;  
        dest.drawShuttle(ctx, 'blue');
    };
    
    this.spaceShuttle = function(){
        return spaceshuttle;
    };

    this.addStar = function(star){
        stars.push(star);
        star.drawObject(ctx);
    };
    
    function moveObject(stars, object, dt)
    {
        // x(t+dt) = x(t) + v * dt + a * dt * dt / 2
        // x(t-dt) = x(t) - v * dt + a * dt * dt / 2
        // x(t+dt) = 2 * x(t) - x(t-dt) + a * dt * dt

        var ax = object.getAccelerationX();
        var ay = object.getAccelerationY();
        for(var i = 0, sl = stars.length; i < sl; ++i){
            ax += stars[i].accelerateX(object);
            ay += stars[i].accelerateY(object);
        }
        
        //alert("acceleration = " + ax + ","+ ay);

        var currx = object.getX();
        var prevx = object.prevX();
        var x = 2 * currx - prevx + ax * dt * dt;

        var curry = object.getY();
        var prevy = object.prevY();
        var y = 2 * curry - prevy + ay * dt * dt;

        object.setAccelerationX(0);
        object.setAccelerationY(0);
        object.setX(x);
        object.setY(y);
    }
    
    this.moveShuttle = function(){
        if(!self.shuttleCollided() && !self.reachedDestination() && !self.lostInOuterSpace()){
            spaceshuttle.clearShuttle(ctx);
            moveObject(stars, spaceshuttle, interval);
            //alert(spaceshuttle);
            spaceshuttle.drawShuttle(ctx);
        }else{
            if(self.reachedDestination()){            
                alert("Successfully completed the mission.");
            }else{
                alert("Sorry, you have lost your ship");
            }
            self.endGame();
        }
    };

    this.reachedDestination = function(){
        if(!reachedDest){
            reachedDest = objectCollided(destination, spaceshuttle);
        }
        return reachedDest;
    };

    function objectCollided(star, object){
        var dx = star.getX() - object.getX();
        var dy = star.getY() - object.getY();
        var rp = star.getRadius() + object.getRadius();

        return dx * dx + dy * dy < rp * rp;
    }

    this.shuttleCollided = function(){
        if(!collided){

            for(var i = 0, l = stars.length; i < l; ++i){
                if(objectCollided(stars[i], spaceshuttle)){
                    collided = true;
                    break;
                }
            }
        }
        return collided;
    };

    this.lostInOuterSpace = function(){
        if(!lost){
            var x = spaceshuttle.getX();
            var y = spaceshuttle.getY();
            lost =  x < 0 || x > cvs.width || y < 0 || y > cvs.height;
        }
        return lost;
    };

    this.event = function(e){
        if(!e){
            e = window.event;
        }
        if(e && spaceshuttle){
            switch(e.keyCode){
            case 37: // left
                spaceshuttle.moveLeft();
                break;
            case 38: // up
                spaceshuttle.moveUp();
                break;
            case 39: // right
                spaceshuttle.moveRight();
                break;
            case 40: // down
                spaceshuttle.moveDown();
                break;
            }
        }
    };

    this.startGame = function(){
        self.timerId = setInterval(self.moveShuttle, interval);
    };
    
    this.endGame = function(){
        clearInterval(self.timerId);
    };
}

function spaceShuttle(x, y, mass, px, py){
    var currx = x;
    var prevx = px != null? px : x;
    var curry = y;
    var prevy = py != null? py : y;

    var accelx = 0;
    var accely = 0;
    var shuttleMass = mass;
    var radius = 5;

    this.getRadius = function(){
        return radius;
    };

    this.getAccelerationX = function(){
        return accelx;
    };
    
    this.setAccelerationX = function(a){
        accelx = a;
    };

    this.getAccelerationY = function(){
        return accely;
    };
    
    this.setAccelerationY = function(a){
        accely = a;
    };

    this.prevX = function(){
        return prevx;
    };

    this.prevY = function(){
        return prevy;
    };
    
    this.getX = function(){
        return currx;
    };

    this.getY = function(){
        return curry;
    };

    this.setX = function(x){
        prevx = currx;
        currx = x;
    };

    this.setY = function(y){
        prevy = curry;
        curry = y;
    };

    this.getMass = function(){
        return shuttleMass;
    };

    this.drawShuttle = function(context, color){
        if(!color) color = 'red';
        context.beginPath();
        context.fillStyle = color;
        context.arc(this.getX(), this.getY(), radius, 0, Math.PI * 2, true);
        context.fill();
    };

    this.clearShuttle = function(context){
        context.beginPath();
        context.fillStyle = 'white';
        context.arc(this.getX(), this.getY(), radius + 2, 0, Math.PI * 2, true);
        context.fill();
    };

    this.toString = function(){
        return "x,y = "+this.getX()+","+this.getY()+"px,py = "+this.prevX()+","+this.prevY();
    };

    this.moveUp = function(){
        accely -= 0.00005;
    };

    this.moveDown = function(){
        accely += 0.00005;
    };

    this.moveLeft = function(){
        accelx -= 0.00005;
    };

    this.moveRight = function(){
        accelx += 0.00005;
    };
}

function heavenlyObject(x, y, mass){
    var radius = 10;
    var G = 0.1; // gravitational constant?

    this.getRadius = function(){
        return radius;
    };

    this.accelerateX = function(object){
        var dx = this.getX() - object.getX();
        var dy = this.getY() - object.getY();
        var r2 = dx * dx + dy * dy;
        var rdiv = r2 * Math.sqrt(r2);
        return G * this.mass() * dx/ rdiv;
    };

    this.accelerateY = function(object){
        var dx = this.getX() - object.getX();
        var dy = this.getY() - object.getY();
        var r2 = dx * dx + dy * dy;
        var rdiv = r2 * Math.sqrt(r2);
        return G * this.mass() * dy/ rdiv;
    };

    this.getX = function(){
        return x;
    };

    this.getY = function(){
        return y;
    };
    
    this.mass = function(){
        return mass;
    };    

    this.toString = function(){
        return "mass = " + this.mass() + " x = " + this.getX() + " y = " + this.getY();
    };

    this.drawObject = function(context){
        context.beginPath();
        context.fillStyle = 'black';
        context.arc(this.getX(), this.getY(), radius , 0, Math.PI * 2, true);
        context.fill();
    };
}

function test_game(){
    var cvs = document.getElementById("space_travel");
    var sky = new space(cvs);
    
    // for(var i = 1; i < 2 ; ++i){
    //     var star = new heavenlyObject(cvs.width - 50 - i * 300, cvs.height - 250, 5);
    //     star.drawObject(cvs.getContext("2d"));
    //     sky.addStar(star);
    // }
    
    var star = new heavenlyObject(cvs.width / 2, cvs.height / 2 , 5);
    var shuttle = new spaceShuttle(100, 50, 5);
    var dest = new spaceShuttle(100,250,50);

    sky.addStar(star);
    sky.initializeSpaceShuttle(shuttle);
    sky.initializeDestination(dest);

    sky.startGame();
}

