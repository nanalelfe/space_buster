window.onload = function() {
    "use strict"; 
    var c = document.getElementById("main");
    window.ctx = c.getContext("2d");

    var canvas_height = c.height;
    var canvas_width = c.width;

    window.max = 4;
    window.min = 1;

    window.speed = 15;

    push_objects();

    draw_objects();

    /*window.x_coord = random_x();
    window.y_coord = random_y();

    window.max = 4;
    window.min = 1;

    window.dx = initial_random_direction();

    window.dy = initial_random_direction();

    window.speed = 15;

    setInterval(draw, window.speed);*/

}

function draw_objects() {
    window.ctx.clearRect(0, 0, 1000, 1000);
    for (var i = 0; i < objects.length; i++){
        //var temp = objects[i];
        draw(objects[i]);
    }

    setTimeout(draw_objects, window.speed);

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

function draw(obj) {

    var ctx = window.ctx;
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(obj.x, obj.y, 50, 50);

    if (obj.x < 0) {
        obj.dx = random_direction();
    }

    if (obj.x > 950){
        obj.dx = random_direction();
        obj.dx = - obj.dx;
    } 

    if (obj.y < 0){
        obj.dy = random_direction();
        //window.dx = - window.dx;
    }

    if (obj.y > 590){
        obj.dy = random_direction();
        obj.dy = - obj.dy;
    }

    obj.x += obj.dx; 
    obj.y += obj.dy;
}

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
