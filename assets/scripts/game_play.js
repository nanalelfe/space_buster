window.onload = function() {
    "use strict"; 
    window.c = document.getElementById("main");
    window.ctx = c.getContext("2d");

    window.object_num = 10;
    window.item_num = 4;

    window.object_w = 50;
    window.object_h = 50;

    window.max_delta = 4;
    window.min_delta = 1;

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

// The array containing the objects
var objects = new Array();

function push_objects() {
    var num_stars = 3;
    var num_moons = 3;
    var num_spaceships = 2;
    var num_space_junk = 2;

    for (var i = 0; i < num_spaceships; i++) {
        var object = new Space_Object(draw_spaceship);
        objects.push(object);
    }

    for (var i = 0; i < num_moons; i++ ){
        var object = new Space_Object(draw_moon);
        objects.push(object);
    }

    for (var i = 0; i < num_space_junk; i++) {
        var object = new Space_Object(draw_space_junk);
        objects.push(object);
    }

    for (var i = 0; i < num_stars; i++) {
        var object = new Space_Object(draw_star);
        objects.push(object);
    }
    
}


var Space_Object = function(item_draw) {
    this.x = random(0, window.c.width);
    this.y = random(0, window.c.height);
    this.dx = initial_random_direction();
    this.dy = initial_random_direction();
    this.width = window.object_w;
    this.height = window.object_h;
    this.item_draw = item_draw;
}


/******************* ITEM DRAWING FUNCTIONS **********************/
function draw_space_junk(x, y, w, h) {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(x, y, w, h);
}

function draw_moon(x, y, w, h) {
    ctx.beginPath();
    ctx.arc(x + (w/2), y + (h/2), (w/2), 0, Math.PI * 2, false);
    ctx.closePath();
    //ctx.stroke();

    var grd = ctx.createLinearGradient(0,0, window.c.width, window.c.height);

    /*grd.addColorStop(0,"pink");
    grd.addColorStop("0.3","magenta");
    grd.addColorStop("0.5","turquoise");
    grd.addColorStop("0.6","green");
    grd.addColorStop("0.8","blue");
    grd.addColorStop(1,"#0B0B61");*/

    grd.addColorStop(0,"#C0392B");
    grd.addColorStop("0.1","#884EA0");
    grd.addColorStop("0.2","turquoise");
    grd.addColorStop("0.3","#48C9B0");
    grd.addColorStop("0.4","#45B39D");
    grd.addColorStop("0.5","pink");
    grd.addColorStop("0.6","#F9E79F");
    grd.addColorStop("0.7","#9C640C");
    grd.addColorStop("0.8","red");
    grd.addColorStop("0.9","#95A5A6");
    grd.addColorStop(1,"red");

    ctx.fillStyle = grd;
    ctx.fill();

    /*var background = new Image();
    background.src = "moon_texture.png";

    background.onload = function() {
        var pattern = ctx.createPattern(background, "repeat");
        ctx.fillStyle = pattern;
        ctx.fill();
    }*/
}

function draw_spaceship(x, y, w, h) {
    ctx.beginPath();
    ctx.moveTo(x + (w/2), y);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo (x + (w/2), y);
    ctx.closePath();
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
}

function draw_star(x, y, w, h) {
    var rot = Math.PI / 2 * 3;
    var cx = x + (w/2);
    var cy = y + (h/2);
    var x = x;
    var y = y;
    var spikes = 10;
    var outerRadius = (w/2);
    var innerRadius = (w/10);
    var step = Math.PI / spikes;

    ctx.strokeSyle = "#000";
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius)
    for (i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y)
        rot += step
    }
    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#D68910"; // darker
    ctx.stroke(); 
    ctx.fillStyle = "#F1C40F"; // lighter
    ctx.fill();
}

/******************* END OF ITEM DRAWING FUNCTIONS **********************/


/* This function executes the item drawing functions, detects collision and 
   changes the dx/dy values accordingly */
function draw(obj) {

    var ctx = window.ctx;
    obj.item_draw(obj.x, obj.y, obj.width, obj.height);
    /*ctx.fillStyle = "#FF0000";
    ctx.fillRect(obj.x, obj.y, 50, 50);*/


    if (obj.x < 0) {
        obj.dx = random(min_delta, max_delta);
    }

    if (obj.x > window.c.width - obj.width){
        obj.dx = random(min_delta, max_delta);
        obj.dx = - obj.dx;
    } 

    if (obj.y < 0){
        obj.dy = random(min_delta, max_delta);
    }

    if (obj.y > window.c.height - obj.height){
        obj.dy = random(min_delta, max_delta);
        obj.dy = - obj.dy;
    }

    obj.x += obj.dx; 
    obj.y += obj.dy;
}


/******************* RANDOM NUMBER GENERATOR FUNCTIONS **********************/

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


/* This function is needed because the initial value of dx/dy
can be negative, however cannot be 0. This function takes this into account */
function initial_random_direction() {
    var max = window.max_delta;
    var min = - window.max_delta;
    var array = new Array();
    for (var i = min; i <= max; i++){
        if (i != 0)
            array.push(i);
    }

    var index = Math.floor(Math.random() * (array.length));
    return array[index];
}
/******************* END OF RANDOM NUMBER GENERATOR FUNCTIONS **********************/