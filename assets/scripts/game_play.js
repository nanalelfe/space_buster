window.onload = function() {

	var c = document.getElementById("main");
    window.ctx = c.getContext("2d");

    window.x_coord = 40;
    window.y_coord = 40;

    window.dx = 5;
    window.dy = 5;

    setInterval(draw,10);
    //animate();


}


function draw() {
	var ctx = window.ctx;

    ctx.clearRect(0, 0, 1000, 1000);

    ctx.fillStyle = "#FF0000";
    ctx.fillRect(x_coord, y_coord, 50, 50);

    if ( window.x_coord < 0 || window.x_coord > 950) {
        window.dx = - window.dx;
    } 
  
    if ( window.y_coord < 0 || window.y_coord > 590) {
        window.dy = - window.dy;
    } 
         
    window.x_coord += window.dx; 
    window.y_coord += window.dy;

    
}

function animate() {
    
    // Always clear the canvas after drawing each frame
    window.ctx.clearRect(0, 0, 1000, 1000);
    
    // Draw here, including conditionals
    
    

    draw();

    ctx.translate(3, 2); 


    setTimeout(animate, 33);

    
    // This will run animate() every 33 ms
    
}