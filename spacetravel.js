var interval = 50; // milliseconds

function space(canvas){
    var cvs = canvas;
    var ctx = cvs.getContext("2d");

    var spaceshuttle = null;
    var stars = [];

    this.initializeSpaceShuttle = function(shuttle){
        spaceshuttle = shuttle;
        cvs.onkeydown = this.event;
    };
    
    this.spaceShuttle = function(){
        return spaceshuttle;
    };

    this.addStar = function(star){
        stars.push(star);
    };
    
    function moveObject(stars, object, dt)
    {
        // x(t+dt) = x(t) + v * dt + a * dt * dt / 2
        // x(t-dt) = x(t) - v * dt + a * dt * dt / 2
        // x(t+dt) = 2 * x(t) - x(t-dt) + a * dt * dt

        var ax = 0;
        var ay = 0;
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

        object.setX(x);
        object.setY(y);
    }
    
    this.moveShuttle = function(){
        //spaceshuttle.clearShuttle(ctx);
        moveObject(stars, spaceshuttle, interval);
        //alert(spaceshuttle);
        spaceshuttle.drawShuttle(ctx);
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

    this.drawShuttle = function(context){
        context.beginPath();
        context.fillStyle = 'red';
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
        accely -= 0.1;
    };

    this.moveDown = function(){
        accely += 0.1;
    };

    this.moveLeft = function(){
        accelx -= 0.1;
    };

    this.moveRight = function(){
        accelx += 0.1;
    };
}

function heavenlyObject(x, y, mass){
    var radius = 10;

    this.accelerateX = function(object){
        var dx = this.getX() - object.getX();
        var dy = this.getY() - object.getY();
        var r2 = dx * dx + dy * dy;
        var rdiv = r2 * Math.sqrt(r2);
        return this.mass() * dx/ rdiv;
    };

    this.accelerateY = function(object){
        var dx = this.getX() - object.getX();
        var dy = this.getY() - object.getY();
        var r2 = dx * dx + dy * dy;
        var rdiv = r2 * Math.sqrt(r2);
        return this.mass() * dy/ rdiv;
    };

    this.getX = function(){
        return x;
    };

    this.getY = function(){
        return y;
    };
    
    this.mass = function(){
        return mass * 0.1;
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

    for(var i = 1; i < 2 ; ++i){
        var star = new heavenlyObject(cvs.width - 250 - i * 300, cvs.height - 250, 5);
        star.drawObject(cvs.getContext("2d"));
        sky.addStar(star);
    }

    var shuttle = new spaceShuttle(100, 50, 5, 99, 50);
    sky.initializeSpaceShuttle(shuttle);
    alert(shuttle);
    shuttle.drawShuttle(cvs.getContext("2d"));
    setInterval(sky.moveShuttle, interval);
}

