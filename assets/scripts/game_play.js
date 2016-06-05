window.onload = function() {
    "use strict"; 
    var c = document.getElementById("main");
    window.ctx = c.getContext("2d");

    window.max = 4;
    window.min = 1;

    window.speed = 15;

    push_objects();

    for (var i = 0; i < objects.length; i++){
        var temp = objects[i];
        draw(temp.x, temp.y, temp.dx, temp.dy);
        //window.ctx.clearRect(0, 0, 1000, 1000);
        //setInterval(draw, window.speed);
    }



    /*window.x_coord = random_x();
    window.y_coord = random_y();

    window.max = 4;
    window.min = 1;

    window.dx = initial_random_direction();

    window.dy = initial_random_direction();

    window.speed = 15;

    setInterval(draw, window.speed);*/
}

var objects = new Array();

function push_objects() {
    objects.push(new Space_Object());
    objects.push(new Space_Object());
    objects.push(new Space_Object());
}


var Space_Object = function() {
        this.x = random_x();
        this.y = random_y();
        this.dx = initial_random_direction();
        this.dy = initial_random_direction();
        this.width = 50;
        this.height = 50;
}

/*var Space_Object = {

    create: function (draw_function) {
        var newObject = Object.create(this);
        newObject.x = random_x();
        newObject.y = random_y();
        newObject.dx = initial_random_direction();
        newObject.dy = initial_random_direction();
        newObject.width = 50;
        newObject.height = 50;
        newObject.drawing_function = draw_function;
        return newObject;
    },
    move: function () {
        this.x += this.dx;
        this.y += this.dy;
    },

    detect_collision: function() {
        if (this.x < 0){
            this.dx = random_direction();
        }

        if (this.x > 950){
            this.dx = random_direction();
            this.dx = - this.dx;
        } 

        if (this.y < 0){
            this.dy = random_direction();
            //window.dx = - window.dx;
        }

        if (this.y > 590){
            this.dy = random_direction();
            this.dy = - this.dy;
        }
    },

    draw: function() {
        window.ctx.fillStyle = "#FF0000";
        window.ctx.fillRect(x_coord, y_coord, 50, 50);
        this.detect_collision();
        this.move();
        setInterval(this.draw, window.speed);
    }

}; */

function draw_spaceship() {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(x_coord, y_coord, 50, 50);
}

function draw(x, y, dx, dy) {

    var ctx = window.ctx;
    //ctx.clearRect(0, 0, 1000, 1000);
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(x, y, 50, 50);

    if (x < 0) {
        dx = random_direction();
    }

    if (x > 950){
        dx = random_direction();
        dx = - dx;
    } 

    if (y < 0){
        dy = random_direction();
        //window.dx = - window.dx;
    }

    if (y > 590){
        dy = random_direction();
        dy = - dy;
    }


    x += dx; 
    y += dy;

    //ctx.translate(3, 2); 

    //setTimeout(animate, 33);
    setTimeout(function() {
        draw(x, y, dx, dy)
    }, window.speed);

}

/*function draw() {
    var ctx = window.ctx;

    ctx.clearRect(0, 0, 1000, 1000);

    ctx.fillStyle = "#FF0000";
    ctx.fillRect(x_coord, y_coord, 50, 50);

    if (window.x_coord < 0){
        window.dx = random_direction();
    }

    if (window.x_coord > 950){
        window.dx = random_direction();
        window.dx = - window.dx;
    } 

    if (window.y_coord < 0){
        window.dy = random_direction();
        //window.dx = - window.dx;
    }

    if (window.y_coord > 590){
        window.dy = random_direction();
        window.dy = - window.dy;
    }


    window.x_coord += window.dx; 
    window.y_coord += window.dy;

    //ctx.translate(window.dx, window.dy);
}*/

var random_direction =  function() {
    return Math.floor(Math.random() * (window.max - window.min + 1) + window.min);
}

var initial_random_direction = function() {
    var max = window.max;
    var min = - window.max;
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function random_x() {
    return Math.floor(Math.random() * (951));
}

function random_y() {
    return Math.floor(Math.random() * (591));
}
