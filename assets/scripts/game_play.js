window.onload = function() {
    "use strict"; 
    window.c = document.getElementById("main");
    window.ctx = c.getContext("2d");
    var offsetLeft = c.offsetLeft,
        offsetTop = c.offsetTop;

    c.addEventListener("click", function(event){
        var x = event.pageX - offsetLeft,
            y = event.pageY - offsetTop;

        current_bhs.forEach(function (bh) {
            console.log(x, y);
            console.log(bh);
            console.log(y > bh.event_y && y < bh.event_y + bh.event_h && x > bh.event_x && x < bh.event_x + bh.event_w);
            if (y > bh.event_y && y < bh.event_y + bh.event_h && x > bh.event_x && x < bh.event_x + bh.event_w) {
                console.log("clicked an element");
            }
        });


    }, false);

    window.level = 1;

    /****** Object variables *******/

    window.object_num = 10;
    window.item_num = 4;

    window.object_w = 50;
    window.object_h = 50;

    window.max_delta = 4;
    window.min_delta = 1;

    window.speed = 15;

    /****** End of Object variables *******/

    /****** Black hole variables *******/

    // event horizon width and height
    window.event_w = 100;
    window.event_h = 100;

    window.bh_w = 50;
    window.bh_h = 50;

    // Number of appearences for each blackhole
    window.aprns_num_blue = 10;
    window.aprns_num_purp = 5;
    window.aprns_num_blac = 1;

    // Number of objects each blackhole eats 
    window.blue_eat = 3;
    window.purp_eat = 2;
    window.black_eat = 1;


    // Speed at which each blackhole pulls
    window.blue_delta = 1;
    window.purp_delta = 3;
    window.black_delta = 5;

    // Min and max milliseconds between blackhole appearences
    window.aprns_min_time = 500;
    window.aprns_max_time = 3000;

    window.period = 0;
    window.counter = 0; 
    window.curr_bh = null;

    /* Things to do:
    - Create a blackhole object, specify which kind of blackhole it is with a string.
    - Specify fields such as location, # of appearences, # of objects to eat, which 
    function to call to draw it etc
    - Create an event horizon object and collision detection for it. 

    */

    push_objects();
    push_blackholes();

    draw_objects();

    /*var img = new Image();
    img.onload = function() {
        window.ctx.drawImage(img, 0, 0);
    }
    img.src = "assets/images/blackhole.svg";*/
}

var Space_Object = function(item_draw) {
    this.x = random(0, window.c.width - window.object_w);
    this.y = random(0, window.c.height - window.object_h);
    this.dx = initial_random_direction();
    this.dy = initial_random_direction();
    this.width = window.object_w;
    this.height = window.object_h;
    this.item_draw = item_draw;
}

var Blackhole = function(type) {
    // event horizon coordinates
    var coords = random_bh();
    this.event_x = coords[0];//random(0, window.c.width - window.event_w);
    this.event_y = coords[1];//random(0, window.c.height - window.event_h);

    // coordinates of the center
    this.x = this.event_x + (window.event_w/2);
    this.y = this.event_y + (window.event_h/2);

    // blue, purple or black type
    this.type = type;

    switch (type){
        case "blue":
            this.draw_bh = draw_blue_blackhole;
            this.appearence = window.aprns_num_blue * window.level;
            this.num_eat = window.blue_eat;
            this.pull_speed = window.blue_delta;
            break;
        case "purple":
            this.draw_bh = draw_purple_blackhole;
            this.appearence = window.aprns_num_purp * window.level;
            this.num_eat = window.purp_eat;
            this.pull_speed = window.purp_delta;
            break;
        default: // black
            this.draw_bh = draw_blackhole;
            this.appearence = window.aprns_num_blac * window.level;
            this.num_eat = window.black_eat;
            this.pull_speed = window.black_delta;
    }

}

function draw_objects() {

    window.ctx.clearRect(0, 0, window.c.width, window.c.height);

    // Draw the moving objects
    for (var i = 0; i < objects.length; i++){
        draw(objects[i]);
    }

    // redraw the blackholes that are still supposed to appear on the screen
    for (var i = 0; i < current_bhs.length; i ++) {
        var bh = current_bhs[i];
        bh.draw_bh(bh.x, bh.y);
    }

    if (window.counter == 0) {
        // Need to remove blackholes from the blackholes-array to
        // randomize the location again
        // Also need to make sure that the blackholes don't overlap
        // when they appear 
        if (blackholes.length == 0) {
            //push_blackholes();
        }
        console.log("a blackhole has been pushed");
        var i = random(0, blackholes.length - 1);
        var bh = blackholes[i];
        bh.draw_bh(bh.x, bh.y);
        current_bhs.push(bh);
        period_reset();
        blackholes.splice(i, 1); // removes 1 item starting from index i

    }

    else {
        window.counter--;
    }

    //draw_purple_blackhole(50, 50);

    setTimeout(draw_objects, window.speed);
}

function remove_bh() {
    //this.removeEventListener("click", this);
    console.log("blackhole was clicked");
}

/********** CONTAINERS **************/
var objects = new Array();
var blackholes = new Array();  // total amount of blackholes
var current_bhs = new Array(); // the blackholes present on the canvas
/************************************/


function push_blackholes(){
    for (i = 0; i < window.aprns_num_blue; i++) {
        var bh = new Blackhole("blue");
        blackholes.push(bh);
    }

    for (i = 0; i < window.aprns_num_purp; i++) {
        var bh = new Blackhole("purple");
        blackholes.push(bh);
    }

    for (i = 0; i < window.aprns_num_blac; i++) {
        var bh = new Blackhole("black");
        blackholes.push(bh);
    }
}

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


/******************* ITEM DRAWING FUNCTIONS **********************/

/*********** Black holes **************/

function draw_blue_blackhole(x, y) {

    var event_x = x - 50;
    var event_y = y - 50;
    ctx.rect(event_x, event_y, 100, 100);
    ctx.lineWidth="1";
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    var w = window.object_w;
    var h = window.object_h;
    ctx.beginPath();
    ctx.arc(x, y, (bh_w/2), 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fillStyle = "#154360";
    ctx.fill();
}

function draw_purple_blackhole(x, y) {

    var event_x = x - 50;
    var event_y = y - 50;
    ctx.rect(event_x, event_y, 100, 100);
    ctx.lineWidth="1";
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    var w = window.object_w;
    var h = window.object_h;
    ctx.beginPath();
    ctx.arc(x, y, (bh_w/2), 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fillStyle = "#4A235A";
    ctx.fill();

    /*var img = new Image();
    img.onload = function() {
        window.ctx.drawImage(img, x - 25, y- 25, 60, 60);
    }
    img.src = "assets/images/blackhole.svg";*/

}

function draw_blackhole(x, y) {

    var event_x = x - 50;
    var event_y = y - 50;
    ctx.rect(event_x, event_y, 100, 100);
    ctx.lineWidth="1";
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    var w = window.object_w;
    var h = window.object_h;
    ctx.beginPath();
    ctx.arc(x, y, (bh_w/2), 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fillStyle = "#000000";
    ctx.fill();

}


/*********** Space Objects **************/

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
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
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

function period_reset() {
    window.period = random(window.aprns_min_time, window.aprns_max_time);
    window.counter = 2000;//Math.floor(window.period/window.speed);
}



// Returns [x, y] such that the coordinates don't overlap with another
// blackhole already created.
function random_bh() {
    var coord = new Array();
    var array = new Array();
    array.concat(blackholes);
    array.concat(current_bhs);
    var x = random(0, window.c.width - window.event_w);
    var y = random(0, window.c.height - window.event_h);

    var i = 0;
    while (i < array.length) {
        var bh = array[i];
        var does_overlap = overlaps(x, bh.x, window.event_w) && overlaps(y, bh.y, window.event_h);

        if (!does_overlap) {
            x = random(0, window.c.width - window.event_w);
            y = random(0, window.c.height - window.event_h);
            i = 0;
        }

        else {
            i++;
        }
    }

    coord.push(x);
    coord.push(y);

    return coord;

}


function overlaps(x, bh_x, bh_size) {

    return (((bh_x <= x)&&(x <= (bh_x + bh_size))) || ((bh_x <= (x + bh_size)) && ((x + bh_size) <= (bh_x + bh_size))));
}

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