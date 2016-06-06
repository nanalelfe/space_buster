window.onload = function() {
    "use strict"; 
    window.c = document.getElementById("main");
    window.ctx = c.getContext("2d");

    window.object_num = 10;

    window.max = 4;
    window.min = 1;

    window.speed = 15;

    push_objects();

    draw_objects();
}

function draw_objects() {
    window.ctx.clearRect(0, 0, window.c.width, window.c.height);
    for (var i = 0; i < objects.length; i++){
        draw(objects[i]);
    }

    setTimeout(draw_objects, window.speed);
}

var objects = new Array();

function push_objects() {
    for (var i = 0; i < 3; i++) {
        var object = new Space_Object(draw_spaceship);
        objects.push(object);
    }

    for (var i = 0; i < 2; i++ ){
        var object = new Space_Object(draw_moon);
        objects.push(object);
    }
    
}

var Space_Object = function(item_draw) {
        this.x = random_x();
        this.y = random_y();
        this.dx = initial_random_direction();
        this.dy = initial_random_direction();
        this.width = 50;
        this.height = 50;
        this.item_draw = item_draw;
}

function draw_spaceship(x, y) {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(x, y, 50, 50);
}

function draw_moon(x, y) {
    ctx.beginPath();
    ctx.arc(x + 25, y + 25, 25, 0, Math.PI * 2, false);
    ctx.closePath();
    //ctx.stroke();

    var grd = ctx.createLinearGradient(0,0, window.c.width, window.c.height);

    grd.addColorStop(0,"pink");
    grd.addColorStop("0.3","magenta");
    grd.addColorStop("0.5","turquoise");
    grd.addColorStop("0.6","green");
    grd.addColorStop("0.8","blue");
    grd.addColorStop(1,"#0B0B61");

    ctx.fillStyle = grd;
    ctx.fill();

}


function draw(obj) {

    var ctx = window.ctx;
    obj.item_draw(obj.x, obj.y);
    /*ctx.fillStyle = "#FF0000";
    ctx.fillRect(obj.x, obj.y, 50, 50);*/


    if (obj.x < 0) {
        obj.dx = random_direction();
    }

    if (obj.x > 950){
        obj.dx = random_direction();
        obj.dx = - obj.dx;
    } 

    if (obj.y < 0){
        obj.dy = random_direction();
    }

    if (obj.y > 590){
        obj.dy = random_direction();
        obj.dy = - obj.dy;
    }

    obj.x += obj.dx; 
    obj.y += obj.dy;
}

function random_direction() {
    return Math.floor(Math.random() * (window.max - window.min + 1) + window.min);
}

function initial_random_direction() {
    var max = window.max;
    var min = - window.max;
    var array = new Array();
    for (var i = min; i <= max; i++){
        if (i != 0)
            array.push(i);

    }

    var index = Math.floor(Math.random() * (array.length));
    return array[index];
}

function random_x() {
    return Math.floor(Math.random() * (951));
}

function random_y() {
    return Math.floor(Math.random() * (591));
}
