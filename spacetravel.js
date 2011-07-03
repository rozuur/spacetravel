function space(canvas){
    var cvs = canvas;
    var ctx = cvs.getContext("2d");

    var spaceshuttle = null;
    var stars = [];

    this.initializeSpaceShuttle = function(shuttle){
        spaceshuttle = shuttle;
    };
    
    this.spaceShuttle = function(){
        return spaceshuttle;
    };

    this.addStar = function(star){
        stars.push(star);
    };

    function moveObject(star, object, dt)
    {
        // x(t+dt) = x(t) + v * dt + a * dt * dt / 2
        // x(t-dt) = x(t) - v * dt + a * dt * dt / 2
        // x(t+dt) = 2 * x(t) - x(t-dt) + a * dt * dt

        var a = star.accelerateX(object.getX());
        var curr = object.getX();
        var prev = object.prevX();
        var x = 2 * curr - prev + a * dt * dt;
        object.setX(x);
    }
    
    this.moveShuttle = function(){
        spaceshuttle.clearShuttle(ctx);
        moveObject(stars[0], spaceshuttle, 50);
        spaceshuttle.drawShuttle(ctx);
    };
}

function spaceShuttle(x, y, mass){
    var currx = x;
    var prevx = x;
    var curry = y;
    var prevy = y;

    var velocity = 0;
    var shuttleMass = mass;
    var radius = 5;

    this.getVelocity = function(){
        return velocity;
    };
    
    this.setVelocity = function(v){
        velocity = v;
    };

    this.prevX = function(){
        return currx;
    };

    this.prevY = function(){
        return curry;
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

}

function heavenlyObject(x, y, mass){
    this.accelerateX = function(x){
        var dx = this.getX() - x;
        return this.mass() / (dx * dx);
    };

    this.accelerateY = function(y){
        var dy = this.getY() - y;
        return this.mass() / (dy * dy);
    };

    this.getX = function(){
        return x;
    };

    this.getY = function(){
        return y;
    };
    
    this.mass = function(){
        return mass * 10;
    };    

    this.toString = function(){
        return "mass = " + this.mass() + " x = " + this.getX() + " y = " + this.getY();
    };
}

function test_game(){
    var cvs = document.getElementById("space_travel");
    var sky = new space(cvs);
    
    var shuttle = new spaceShuttle(100, 50, 5);
    var star = new heavenlyObject(cvs.width - 50, 50, 5);
    sky.initializeSpaceShuttle(shuttle);
    sky.addStar(star);
    shuttle.drawShuttle(cvs.getContext("2d"));
    setInterval(sky.moveShuttle, 50);
}
