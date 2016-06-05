window.onload = function() {

	var c = document.getElementById("main");
    window.ctx = c.getContext("2d");

    window.x_coord = random_x();
    window.y_coord = random_y();

    window.max = 4;
    window.min = 1;

    window.dx = initial_random_direction();

    window.dy = initial_random_direction();

    window.speed = 15;

    setInterval(draw, window.speed);
}


function draw() {
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
