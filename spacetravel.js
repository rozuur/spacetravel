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

        var ax = star.accelerateX(object);
        var currx = object.getX();
        var prevx = object.prevX();
        var x = 2 * currx - prevx + ax * dt * dt;

        var ay = star.accelerateY(object);
        var curry = object.getY();
        var prevy = object.prevY();
        var y = 2 * curry - prevy + ay * dt * dt;

        object.setX(x);
        object.setY(y);
    }
    
    this.moveShuttle = function(){
        spaceshuttle.clearShuttle(ctx);
        moveObject(stars[0], spaceshuttle, 50);
        spaceshuttle.drawShuttle(ctx);
    };
}

function spaceShuttle(x, y, mass, px, py){
    var currx = x;
    var prevx = px ? px : x;
    var curry = y;
    var prevy = py ? py : y;

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
        return mass * 50;
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
    
    var shuttle = new spaceShuttle(100, 50, 5);
    var star = new heavenlyObject(cvs.width - 50, cvs.height - 50, 5);
    star.drawObject(cvs.getContext("2d"));
    sky.initializeSpaceShuttle(shuttle);
    sky.addStar(star);
    shuttle.drawShuttle(cvs.getContext("2d"));
    setInterval(sky.moveShuttle, 50);
}
