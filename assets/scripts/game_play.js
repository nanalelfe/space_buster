window.onload = function() {

	var c = document.getElementById("main");
    window.ctx = c.getContext("2d");

    animate();


}

function draw() {
	var ctx = window.ctx;

    ctx.beginPath();
    ctx.arc(150, 150, 75, 0, Math.PI, false);
    ctx.closePath();
    //ctx.stroke();

    var grd = ctx.createLinearGradient(0,0,450,0);
    grd.addColorStop(0,"pink");
    grd.addColorStop(1,"turquoise");

    ctx.fillStyle = grd;
    ctx.fill();

    ctx.fillRect(125, 130, 50, 50); // x, y, w, h

    ctx.beginPath();
    ctx.moveTo(140, 150);
    ctx.lineTo(160, 150);
    ctx.lineTo(150, 170);
    ctx.lineTo(140, 150);
    ctx.closePath();

    ctx.strokeStyle = "lightcyan";
    ctx.stroke();
}

function animate() {
    
    // Always clear the canvas after drawing each frame
    window.ctx.clearRect(0, 0, 1000, 1000);
    
    // Draw here, including conditionals
    
    /*ctx.fillStyle = "#000000";
    ctx.fillRect(x, 40,50, 50);*/

    draw();

    /******** DRAW FUNCTION COPY PASTED ********

    ctx.beginPath();
    ctx.arc(150, 150, 75, 0, Math.PI, false);
    ctx.closePath();
    //ctx.stroke();
    var grd = ctx.createLinearGradient(0,0,450,0);
    grd.addColorStop(0,"pink");
    grd.addColorStop(1,"turquoise");

    ctx.fillStyle = grd;
    ctx.fill();

    ctx.fillRect(125, 130, 50, 50); // x, y, w, h

    ctx.beginPath();
    ctx.moveTo(140, 150);
    ctx.lineTo(160, 150);
    ctx.lineTo(150, 170);
    ctx.lineTo(140, 150);
    ctx.closePath();

    ctx.strokeStyle = "lightcyan";
    ctx.stroke();
    /****************************************/


    ctx.translate(3, 2); 


    setTimeout(animate, 33);

    
    // This will run animate() every 33 ms
    
}