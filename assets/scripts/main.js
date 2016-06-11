var main = function (){
    "user strict";


    // ----------- START PAGE ---------------// 

    $("#game-page").hide();
    $("#transition-page").hide();

    // Retrieve High Score in html5 local storage, if first time playing
    // Set high score to default value 0. 
    if(typeof(Storage) !== "undefined") {
        if (!localStorage.high_score){
            localStorage.high_score = 0;
        }
        $("#show-score").text(String(localStorage.high_score)); 
    } else {
        $("#show-score").text("Local Storage NotSupported");
    }
    
    // Start button, replace start-page with game-page
    $("#start-button").click(function() {
        $("#start-page").hide();
        $("#game-page").show();

        run_game();
    });



    // ----------- GAME PAGE --------------// 
    // Global CONSTANTS
    window.GAME_LENGTH = 11;    // Game time - 1
    window.STARTING_SCORE = 200 // Starting score every level

    function run_game(){

        // --------------- The Game ---------------------//
        var Game = {}; 
        Game.current_level = 1; 
        Game.object_num = 10; 
        Game.score = window.STARTING_SCORE;
        Game.timer = window.GAME_LENGTH; 
        Game.over = false;
        Game.pause = false; 
        Game.reset = function(){
            objects = new Array();
            current_bhs = new Array();
            push_objects(); 
        };
        
        // --------------------------------------------------------------//
        // ----------------- NANA'S ONLOAD VARIABLES --------------------// 
        // --------------------------------------------------------------//

        window.c = document.getElementById("main");
        window.ctx = c.getContext("2d");

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

        // Max number of blackholes that should appear at any given time
        window.MAX_BLACKHOLES = 25; 

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
        window.blue_delta = 20;
        window.purp_delta = 10;
        window.black_delta = 6;

        // Min and max milliseconds between blackhole appearences
        window.aprns_min_time = 500;
        window.aprns_max_time = 3000;

        window.period = 0;
        window.counter = 0; 
        window.curr_bh = null;

        var offsetLeft = c.offsetLeft,
            offsetTop = c.offsetTop;

        c.addEventListener("click", user_click, false);

        Game.reset();

        // Set pause click event: 
        $("#ib-pause").click(function() {
            if(Game.pause == false){
                c.removeEventListener("click", user_click, false);
                Game.pause = true;
            }else {
                c.addEventListener("click", user_click, false);
                Game.pause = false;
            }
        });


        // --------------------------------------------------------------//
        // -------------- END OF  NANA'S ONLOAD VARIABLES ---------------// 
        // --------------------------------------------------------------//

        Game.transition = function(){
            function compare_score(){
                if(Game.score > localStorage.high_score){
                    localStorage.high_score = Game.score;
                }
            }
            function level_transition(){
                Game.current_level++;
                Game.timer = window.GAME_LENGTH;
                Game.object_num = 10;
                Game.over = false;

                // Reset objects
                Game.reset();

                Game.loop = setInterval(Game.run, 33);
                $("#transition-page").hide();
                $("#game-page").show();
            }
            function return_transition(){
                $("#transition-page").hide();
                $("#game-page").hide();
                $("#start-page").show();
            }

            var trans_msg, button_msg;

            if (!Game.object_num){
                // If 0 objects, show game over transition
                trans_msg = "Game Over";
                button_msg = "Back to start";
                compare_score();
                $("#transition-button").unbind("click").click(return_transition);
            } else {
                trans_msg = "Success!"; 
                // If !0 objects and level = 1, show level transition
                if (Game.current_level === 1){
                    button_msg = "Go to Level 2";
                    compare_score();
                    $("#transition-button").unbind("click").click(level_transition);
                } else {
                // If !0 objects and level = 2, show finish transition
                    button_msg = "Go to start";
                    compare_score();
                    $("#transition-button").unbind("click").click(return_transition);
                }
            }

            $("#transition-message").text(trans_msg);
            $("#transition-score").text("Score: " + String(Game.score));
            $("#transition-button").text(button_msg);
            $("#transition-page").show();
        }

        // Game run operation
        Game.run = function(){

            // Check for game over conditions
            // Game ends if timer hits 0 or there are 0 space objects
            if(!Game.timer || !Game.object_num){
                Game.over = true;
            }

            // If game over, end loop and transition
            if (Game.over){
                clearInterval(Game.loop);
                console.log("Game over!");
                Game.transition();
            }
            if(!Game.pause){
                draw_objects();
            }
            
        }

        // Game initial Loop runs ~30fps
        Game.loop = setInterval(Game.run, 33);

        /************************************************/
        /* ------------------INFO - BAR --------------- */ 
        /************************************************/

        // Back button, re-directs to Start
        $("#back-button").click(function() {
            $("#start-page").show();
            $("#game-page").hide();
        });

        // Timer 
        Game.timer = window.GAME_LENGTH;
        setInterval(function() {
            if(Game.timer > 0){
                if(!Game.pause){
                    Game.timer--;   
                }
                
                $("#timer-display").text(String(Game.timer) + " Seconds");  
            }
        }, 1000);

        // Score
        $("#ib-score").text("Score: " + String(Game.score)); 

        // Level
        $("#ib-level").text("Level: " + String(Game.current_level));
    }

    /************************************************/
    /* --------------- GAME FUNCTIONS ------------- */ 
    /************************************************/
    
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
        this.eaten = 0;

        switch (type){
            case "blue":
                this.draw_bh = draw_blue_blackhole;
                this.appearence = window.aprns_num_blue * window.level;
                this.eat_limit = window.blue_eat;
                this.pull_speed = window.blue_delta;
                break;
            case "purple":
                this.draw_bh = draw_purple_blackhole;
                this.appearence = window.aprns_num_purp * window.level;
                this.eat_limit = window.purp_eat;
                this.pull_speed = window.purp_delta;
                break;
            default: // black
                this.draw_bh = draw_blackhole;
                this.appearence = window.aprns_num_blac * window.level;
                this.eat_limit = window.black_eat;
                this.pull_speed = window.black_delta;
        }
    }

    function check_bh_limit() {
        current_bhs.forEach(function(bh) {
            if (bh.eaten >= bh.eat_limit) {
                remove_bh(bh);
            }
        });
    }

    function draw_objects() {

        window.ctx.clearRect(0, 0, window.c.width, window.c.height);

        // Check if the blackholes reached eating limit
        check_bh_limit();

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
            // When counter == 0, it's time to spawn a new blackhole
            // Get number for type via random generator, create new blackhole
            // of that type, then add to current_blackholes

            // 1-3 is black, 4-9 is purple, 10-18 is blue
            // These values can be adjusted and attributed to globals constants 
            // to change frequency for each color

            if (current_bhs.length <= window.MAX_BLACKHOLES){
                var blackhole_type = random(1, 18);
                var blackhole = create_blackhole(blackhole_type); 
                current_bhs.push(blackhole); 
                period_reset();
            }

        }

        else {
            window.counter--;
        }

        //draw_purple_blackhole(50, 50);

        //setTimeout(draw_objects, window.speed);
    }

    /************ CLICK HANDLERS ******************/
    function user_click() {

        var parentOffset = $(this).parent().offset();
        var x = event.pageX - parentOffset.left;
        var y = event.pageY - parentOffset.top;

        //var x = event.pageX - c.offsetLeft,
        //    y = event.pageY - c.offsetTop;

        current_bhs.forEach(function (bh) {

            console.log(x, y);
            console.log(bh);

            var dx = x - bh.x,
                dy = y - bh.y,
                dist = Math.sqrt(dx*dx + dy*dy);

                if (dist < (bh_w/2)) {
                   remove_bh(bh);
                }
        });
    }

    function remove_bh(bh) {
        var i = current_bhs.indexOf(bh);
        current_bhs.splice(i, 1);
    }

    /************ END OF CLICK HANDLERS ******************/


    /********** CONTAINERS **************/
    var objects = new Array();
    var current_bhs = new Array(); // the blackholes present on the canvas
    /************************************/

    function create_blackhole(type){
        var color;
        if(type <= 3){
            color = "black";
        }else if (type <= 9){
            color = "purple";
        }else {
            color = "blue";
        }

        var bh = new Blackhole(color);
        return bh; 
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
    function remove_object(obj) {
        var i = objects.indexOf(obj);
        objects.splice(i, 1);
    }

    function object_pulled(obj) {
        var x = obj.x,
            y = obj.y,
            h = obj.height,
            w = obj.width,
            bhw = window.event_w,
            bhh = window.event_h,
            this_bh = null;

        current_bhs.forEach(function(bh) {
            var bhx = bh.event_x,
                bhy = bh.event_y;
            if (!(x > (bhx + bhw) || (x + w) < bhx || y > (bhy + bhh) || (y + h) < bhy)) {
                this_bh =  bh;
            }
        });


        if (this_bh != null) {

            var dx = this_bh.x - (obj.x + (window.object_w/2)),
                dy = this_bh.y - (obj.y + (window.object_h/2)),
                dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < (bh_w/2)) {
                remove_object(obj);
                this_bh.eaten++;
            }

            else {

                obj.x += dx/this_bh.pull_speed;
                obj.y += dy/this_bh.pull_speed;
            }

            return true;
        }

        else {
            return false;
        }
    }

    /* This function executes the item drawing functions, detects collision and 
       changes the dx/dy values accordingly */
    function draw(obj) {

        var ctx = window.ctx;
        obj.item_draw(obj.x, obj.y, obj.width, obj.height);
        /*ctx.fillStyle = "#FF0000";
        ctx.fillRect(obj.x, obj.y, 50, 50);*/

        if (!object_pulled(obj)) {

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
    }

    /******************* RANDOM NUMBER GENERATOR FUNCTIONS **********************/

    function period_reset() {
        window.period = random(window.aprns_min_time, window.aprns_max_time);
        window.counter = Math.floor(window.period/window.speed);    
    }

    // Returns [x, y] such that the coordinates don't overlap with another
    function random_bh() {
        var coord = new Array();

        var x = random(0, window.c.width - window.event_w);
        var y = random(0, window.c.height - window.event_h);

        //for (var i = 0; i < blackholes.length; i++)
        var i = 0;
        while (i < current_bhs.length){
            var bh = current_bhs[i];
            
            var does_overlap = overlaps(x, y, bh.event_x, bh.event_y);

            if(does_overlap){
                x = random(0, window.c.width - window.event_w);
                y = random(0, window.c.height - window.event_h);
                i = -1;
            }
            i++;  
            
        }

        coord.push(x);
        coord.push(y);

        return coord;

    }

    function overlaps(x, y, bhx, bhy) {
        var w = window.event_w; 
        var h = window.event_h;
        return !(x > (bhx + w) || (x + w) < bhx || y > (bhy + h) || (y + h) < bhy);
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
    
    /************************************************/
    /* ----------- End of GAME Functions ---------- */ 
    /************************************************/

};

$(document).ready(main);
