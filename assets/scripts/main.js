var main = function (){
    "user strict";

    // On initial run hide pages not part of the start page
    $("#game-page").hide();
    $("#transition-page").hide();
    $("#bh-svg-blu").hide();
    $("#bh-svg-blk").hide();
    $("#bh-svg-prp").hide();
    $("#pause-page").hide();
    $("#instruction-page").hide();

    //-------- High-Score variabls and functions --------//
    window.MINIMUM_SCORE = -1000; // Less than the lowest score possible

    // Shows highscores on start-page, displays empty string for 
    // 2nd and 3rd top scores, for first show 0. Otherwise show the user's
    // scores accordingly. 
    function display_high_scores(){
        if(localStorage.hs_1 == window.MINIMUM_SCORE){
            $("#show-score-1").text("0");
        }else{
            $("#show-score-1").text(String(localStorage.hs_1));
        }
        if(localStorage.hs_2 == window.MINIMUM_SCORE){
            $("#show-score-2").text("");
        }else{
            $("#show-score-2").text(String(localStorage.hs_2));
        }
        if(localStorage.hs_3 == window.MINIMUM_SCORE){
            $("#show-score-3").text("");
        }else{
           $("#show-score-3").text(String(localStorage.hs_3));  
        }
    }

    // Reset to less than lowest possible score, for updating purposes.
    function reset_scores(){
        localStorage.hs_1 = window.MINIMUM_SCORE;
        localStorage.hs_2 = window.MINIMUM_SCORE;
        localStorage.hs_3 = window.MINIMUM_SCORE; 
    }

    // Retrieve High Score in html5 local storage, if first time playing
    // Set high score to less than the lowest possible score. 
    if(typeof(Storage) !== "undefined") {
        if (!localStorage.hs_1){
            localStorage.hs_1 = window.MINIMUM_SCORE;
        }
        if (!localStorage.hs_2){
            localStorage.hs_2 = window.MINIMUM_SCORE;
        }
        if (!localStorage.hs_3){
            localStorage.hs_3 = window.MINIMUM_SCORE;
        }
        display_high_scores(); 
    } else {
        $("#show-score").text("Local Storage Not Supported");
    }
    
    //-------- Start-Page Buttons --------//
    // Start button, replace start-page with game-page
    $("#start-button").click(function() {
        
        // Set default level background (accounts for restart case)
        $("#main").addClass("canvas-bg-default").removeClass("canvas-bg-lvl2");
        
        // Hide show necessary pages
        $("#start-page").hide();
        $("#instruction-page").hide();
        $("#game-page").show();

        // Run necessary game functions for game-play
        run_game();
    });

    // Reset score button; set high scores to default values, then update
    // display
    $("#reset-score").click(function() {
        reset_scores();
        display_high_scores();
    });

    // Toggle how to play page
    $("#instruction-button").click(function(){
        $("#instruction-page").toggle();
    });

    // ----------- GAME PAGE --------------// 
    
    // Global CONSTANTS
    window.GAME_LENGTH = 60;    // Game time 
    window.STARTING_SCORE = 200 // Starting score every level, if changed, then
                                // also change MINIMUM_SCORE
    
    /* Declare game object, assign necessary game variables, and game object
     * functions. Perform transition, start game loop, call draw functions and
     * any other necessary functions pertaining to game logic. */                    
    function run_game(){

        // Create The Game Object, with default starting fields
        var Game = {}; 
        Game.current_level = 1; 
        Game.object_num = 10; 
        Game.score = window.STARTING_SCORE;
        Game.timer = window.GAME_LENGTH; 

        // Signal for game over
        Game.over = false;  

        // Signal for game pause
        Game.pause = false; 

        // Resets the game, setting all pertinent values back to default
        Game.reset = function(){

            // Set timer to 0 in info bar
            $("#timer-display").text(String(Game.timer) + " Seconds");

            // Empty objects and blackhole data structures
            objects = new Array();
            current_bhs = new Array();

            // Reload new objects, reset timer and game over status
            Game.timer = window.GAME_LENGTH;
            Game.object_num = window.object_num;
            Game.over = false; 
            push_objects(); 
        };

        // This starts the Game timer. The timer is displayed on the 
        // info bar. It returns the id of the interval (used for clearing). 
        Game.run_timer = function(){
            return setInterval(function() {
                if(Game.timer > 0){
                    if(!Game.pause && !Game.over){
                        Game.timer--;   
                    }
                    $("#timer-display").text(String(Game.timer) + " Seconds"); 
                }
            }, 1000);
        }
        
        window.c = document.getElementById("main");
        window.ctx = c.getContext("2d");

        window.level = 1;
        window.total_score = window.STARTING_SCORE;

        /****** Object variables *******/

        window.object_num = 10;

        window.object_w = 50;
        window.object_h = 50;

        // Object speed limits
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

        // blackhole width and height
        window.bh_w = 50;
        window.bh_h = 50;

        // Number of appearences for each blackhole type
        window.aprns_num_blue = 10;
        window.aprns_num_purp = 6;
        window.aprns_num_blac = 1;

        // Number of objects each blackhole eats 
        window.blue_eat = 3;
        window.purp_eat = 2;
        window.black_eat = 1;

        // 1/Speed at which each blackhole pulls
        window.blue_delta = 60;
        window.purp_delta = 40;
        window.black_delta = 24;

        // Points gained when blackhole pulls object
        window.bh_eating_pts = -50;

        // Min and max milliseconds between blackhole appearences
        window.aprns_min_time = 500;
        window.aprns_max_time = 800;

        /****** End of Black hole variables *******/

        // The time needed to elapse between each black hole (random)
        window.period = 0;
        window.counter = 0; 

        var offsetLeft = c.offsetLeft,
            offsetTop = c.offsetTop;

        // Initiate on click event
        c.addEventListener("click", user_click, false);
        Game.reset();

        // Set pause click event. Activates/Deactivates pause signal and pop up.
        // Also disable mouse-click handler on pause activate.
        $("#ib-pause-button").click(function() {
            if(Game.pause == false){
                $("#ib-pause-button").text("Resume");
                c.removeEventListener("click", user_click, false);
                $("#pause-page").show();
                Game.pause = true;
            }else {
                $("#ib-pause-button").text("Pause");
                c.addEventListener("click", user_click, false);
                $("#pause-page").hide();
                Game.pause = false;
            }
        });

        /* Game transition handler */
        Game.transition = function(){

            /* On game over or level clear, compare game score with the top 3 
             * scores on storage, update accordingly */
            function compare_score(){
                if(Game.score > localStorage.hs_1){
                    localStorage.hs_3 = localStorage.hs_2;
                    localStorage.hs_2 = localStorage.hs_1;
                    localStorage.hs_1 = Game.score;
                }else if(Game.score > localStorage.hs_2){
                    localStorage.hs_3 = localStorage.hs_2;
                    localStorage.hs_2 = Game.score;
                }else if(Game.score > localStorage.hs_3){
                    localStorage.hs_3 = Game.score;
                }
            }

            /* Called when level is cleared successfully and the user must 
             * transition to the next level via on click button. Set up fields 
             * for next level. */
            function level_transition(){

                // Update next level counter
                Game.current_level++;

                // Level 2 settings: Adjust speeds accordingly for level 
                // for difficulty
                if (Game.current_level == 2){

                    // Change to new background
                    $("#main").addClass("canvas-bg-lvl2").removeClass("canvas-bg-default");
              

                    // Speed up black hole spawn times for level 2
                    window.aprns_min_time = 150;
                    window.aprns_max_time = 400;
                    
                    // Speed up object speed for level 2
                    window.max_delta = 8;
                    window.min_delta = 4;
                }

                // Reset game values to default
                Game.reset();

                // Retart Game loop, retrieve id
                Game.loop = setInterval(Game.run, 33); 

                // Restart Game timer, see run_timer for details on reset               
                Game.time_interval_id = Game.run_timer();

                // Hide/Show windos for necessary transition
                $("#transition-page").hide();
                $("#game-page").show();

                // Update info-bar values to reflect new level properties
                $("#ib-level").text("Level: " + String(Game.current_level));
                display_high_scores();
            }

            /* Called when user fails to complete a level successfully,  
             * return user to start page, and update high score data. */
            function return_transition(){
                $("#transition-page").hide();
                $("#game-page").hide();
                $("#start-page").show();
                display_high_scores(); 
            }

            var trans_msg, button_msg;

            // Check for successfull/unsuccessfull completion of level. 
            // Set appropriate transition functions listed above accordingly.
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

            // Set appropriate transition popup messages
            $("#transition-message").text(trans_msg);
            $("#transition-score").text("Score: " + String(Game.score));
            $("#transition-button").text(button_msg);
            $("#transition-page").show();
        }

        /* Game run operation */
        Game.run = function(){
            Game.object_num = objects.length;
            
            // Updates the score in info bar
            if (Game.score != window.total_score){
                Game.score = window.total_score;
                $("#ib-score").text("Score: " + String(Game.score)); 
            }

            // Check for game over conditions
            // Game ends if timer hits 0 or there are 0 space objects
            if(!Game.timer || !Game.object_num){
                Game.over = true;
            }

            // If game over, end loop/timer and transition
            if (Game.over){
                clearInterval(Game.loop);
                clearInterval(Game.time_interval_id);
                console.log("Game over!");
                Game.transition();
            }
            if(!Game.pause){
                draw_objects();
            }
        }

        // Game initial Loop runs ~30fps
        Game.loop = setInterval(Game.run, 33);

        // Info-Bar values, initial set. Updated continuously in game loop:
        // Timer 
        Game.timer = window.GAME_LENGTH;

        // Start game timer (see function), retrieve id for clearing
        Game.time_interval_id = Game.run_timer();

        // Score
        $("#ib-score").text("Score: " + String(Game.score)); 

        // Level
        $("#ib-level").text("Level: " + String(Game.current_level));
    }

    /************************************************/
    /* --------------- GAME FUNCTIONS ------------- */ 
    /************************************************/ 

    /********** CONTAINERS **************/
    // Contains all the space objects on canvas
    var objects = new Array();

    // Contains all blackholes on canvas
    var current_bhs = new Array();

    // Contains the types of the blackholes that need to appear on the canvas.
    // Required to keep track of the frequency of the different blackholes.
    var bh_types = new Array();
    /************************************/

    /**
     * Represents a space object. Gets sucked in my blackholes
     * if too close to them.
     * @constructor
     * @param {function} item_draw - The function that draws the space
     * object on the canvas.
     */
    var Space_Object = function(item_draw) {
        this.x = random(0, window.c.width - window.object_w);
        this.y = random(0, window.c.height - window.object_h);
        this.dx = initial_random_direction();
        this.dy = initial_random_direction();
        this.width = window.object_w;
        this.height = window.object_h;
        this.item_draw = item_draw;
    }

    /**
     * Represents a blackhole. 
     * @constructor
     * @param {string} type - Type of the blackhole: blue, purple or black.
     */
    var Blackhole = function(type) {

        // Randomly generated event horizon coordinates
        var coords = random_bh();
        this.event_x = coords[0];
        this.event_y = coords[1];

        // coordinates of the center of the blackhole
        this.x = this.event_x + (window.event_w/2);
        this.y = this.event_y + (window.event_h/2);

        this.type = type;

        // Number of objects eaten so far
        this.eaten = 0;

        // Each bh needs its unique rotation counter
        this.rotation_counter = 0;

        // Update rotation (for rotation animation)
        this.update_rotation = function (){
            this.rotation_counter += 2;
            if(this.rotation_counter >= 361){
                this.rotation_counter = 0;
            }

        };

        switch (type){
            case "blue":
                this.draw_bh = draw_blue_blackhole;
                // Frequency of appearence for this type of blackhole
                this.appearence = window.aprns_num_blue * window.level;
                // Space object eating limit
                this.eat_limit = window.blue_eat;
                this.pull_speed = window.blue_delta;
                // Points earned for destroying this type
                this.points = 5;
                break;
            case "purple":
                this.draw_bh = draw_purple_blackhole;
                this.appearence = window.aprns_num_purp * window.level;
                this.eat_limit = window.purp_eat;
                this.pull_speed = window.purp_delta;
                this.points = 10;
                break;
            default: // black
                this.draw_bh = draw_blackhole;
                this.appearence = window.aprns_num_blac * window.level;
                this.eat_limit = window.black_eat;
                this.pull_speed = window.black_delta;
                this.points = 20;
        }
    }

    /**
     * Checks whether there are any blackholes that have reached their eating
     * limit. If so, removes blackhole. 
     * @function
     */
    function check_bh_limit() {
        current_bhs.forEach(function(bh) {
            if (bh.eaten >= bh.eat_limit) {
                remove_bh(bh);
            }
        });
    }

    /**
     * Draws all the sprites in the game. 
     * @function
     */
    function draw_objects() {

        window.ctx.clearRect(0, 0, window.c.width, window.c.height);

        check_bh_limit();

        // Draw the space objects
        for (var i = 0; i < objects.length; i++){
            draw(objects[i]);
        }

        // redraw the blackholes that are still supposed to appear on the screen
        for (var i = 0; i < current_bhs.length; i ++) {
            var bh = current_bhs[i];
            bh.draw_bh(bh.x, bh.y, bh);
        }

        // When counter reaches 0, it's time to spawn another blackhole. 
        if (window.counter == 0) {

            if (bh_types.length <= 0) {
                push_types();
            }
            if (current_bhs.length <= window.MAX_BLACKHOLES){
                var i = random(0, bh_types.length);
                var type = bh_types[i]; // pick random type
                var bh = new Blackhole(type); 
                current_bhs.push(bh); 

                // Remove that type from the array, to guarantee difference
                // in frequency between the different blackholes
                bh_types.slice(i, 1);
                period_reset();
            }
        }

        else {
            window.counter--;
        }
    }

    /************ CLICK HANDLERS ******************/

    /**
     * Enables user mouse click. When a blackhole is clicked, removes
     * blackhole.
     * @function
     */
    function user_click() {

        var parentOffset = $(this).parent().offset();
        var x = event.pageX - parentOffset.left;
        var y = event.pageY - parentOffset.top;

        current_bhs.forEach(function (bh) {
            var dx = x - bh.x,
                dy = y - bh.y,
                dist = Math.sqrt(dx*dx + dy*dy);

                if (dist < (bh_w/2)) {
                    window.total_score += bh.points;
                    remove_bh(bh);

                }
        });
    }

    /************ END OF CLICK HANDLERS ******************/

    /**
     * Removes a blackhole.
     * @function
     * @param {Blackhole} bh - The blackhole object to be removed.
     */
    function remove_bh(bh) {
        var i = current_bhs.indexOf(bh);
        current_bhs.splice(i, 1);
    }

    /**
     * Pushes blackhole types into the bh_types array according to their 
     * appearence frequency. 
     * @function
     */
    function push_types() {
        var blue = window.aprns_num_blue,
            purple = window.aprns_num_purp,
            black = window.aprns_num_blac;

        for (var i = 0; i < blue; i++) 
            bh_types.push("blue");

        for (var i = 0; i < purple; i++) 
            bh_types.push("purple");

        for (var i = 0; i < black; i++) 
            bh_types.push("black");
    }

    /**
     * Pushes all the space objects needed to the objects array. 
     * @function
     */
    function push_objects() {

        /* Spaceship 1 */
        objects.push(new Space_Object(draw_spaceship1));

        /* Spaceship 2 */
        objects.push(new Space_Object(draw_spaceship2));

        /* Asteroid */
        objects.push(new Space_Object(draw_asteroid));

        /* Planet 1*/
        objects.push(new Space_Object(draw_planet1));

        /* Planet 2 */
        objects.push(new Space_Object(draw_planet2));

        /* Astronaut */
        objects.push(new Space_Object(draw_astronaut));

        /* Star */
        objects.push(new Space_Object(draw_star));

        /* Satellite */
        objects.push(new Space_Object(draw_satellite));

        /* Alien 1 */
        objects.push(new Space_Object(draw_alien1));

        /* Alien 2 */
        objects.push(new Space_Object(draw_alien2));
    }
        
    /**
     * Removes a space object.
     * @function
     * @param {Space_Object} obj - The space object to be removed.
     */
    function remove_object(obj) {
        var i = objects.indexOf(obj);
        objects.splice(i, 1);
        
    }

    /**
     * Returns whether the space object obj has been pulled by any blackhole. 
     * If true, animates the object pulling and disappearence. 
     * @function
     * @param {Space_Object} obj - The space object
     * @returns {boolean}
     */
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
            if (!(x > (bhx + bhw) || (x + w) < bhx
                || y > (bhy + bhh) || (y + h) < bhy)) {
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
                window.total_score += bh_eating_pts;
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

    /**
     * Executes the space object drawing functions, detects collision and 
     * changes the dx/dy values accordingly. 
     * @function
     * @param {Space_Object} obj - The space object to be drawn
     */
    function draw(obj) {

        var ctx = window.ctx;
        obj.item_draw(obj.x, obj.y, obj.width, obj.height);

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

    /******************* RANDOM NUMBER GENERATOR FUNCTIONS ********************/

    /**
     * Generates a random time period between the appearence of blackholes. 
     * @function
     */
    function period_reset() {
        window.period = random(window.aprns_min_time, window.aprns_max_time);
        window.counter = Math.floor(window.period/window.speed);    
    }

    /* Iterate through every black hole consecutively until a co-ordinate is 
     * found that satisfies enough space requirements for a new black hole 
     * to be created. If overlaps occur, re-start search from the beginning. */
    function random_bh() {

        // The new black-hole co-ordinate
        var coord = new Array();

        // Retrieve initial testing point
        var x = random(0, window.c.width - window.event_w);
        var y = random(0, window.c.height - window.event_h);

        // Compare for overlap with every blackhole on canvas
        var i = 0;
        while (i < current_bhs.length){
            var bh = current_bhs[i];
            
            var does_overlap = overlaps(x, y, bh.event_x, bh.event_y);

            // If an overlap occurs, get new point, and restart search. 
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

    /**
     * Generates a random number between min and max. 
     * @function
     * @param {Number} min 
     * @param {Number} max
     * @returns {Number}
     */
    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * Generates a random number for the initial direction of space objects. 
     * This function is needed because the initial value of dx/dy
     * can be negative, however cannot be 0. This function takes this into account
     * @function
     * @returns {Number}
     */
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
    /*************** END OF RANDOM NUMBER GENERATOR FUNCTIONS *****************/

    /******************* SPRITE DRAWING FUNCTIONS *****************************/

    /*********** Black holes **************/
    
    // Convert to radians
    var convert_radians = Math.PI/180;

    /* Translate image, rotate, and draw it in shifted point, without 
     * affecting contexting. Re-scale to appropriate size before drawing. */
    function rotate_and_draw(img, x, y, angle_amnt)
    { 
        // save co-ords 
        ctx.save(); 

        // move to center
        ctx.translate(x, y);

        // rotate from point
        ctx.rotate(angle_amnt * convert_radians);
        ctx.scale(0.1,0.1);

        // draw in shifted area
        ctx.drawImage(img, -(img.width/2), -(img.height/2));

        // restore co-ords
        ctx.restore(); 
    }

    /**
     * Draws a blue blackhole bh on the canvas given the coordinates x and y.
     * @function
     * @param {Number} x - The x coordinate
     * @param {Number} y - The y coordinate
     * @param {Blackhole} bh - The blackhole to be drawn
     */
    function draw_blue_blackhole(x, y, bh) {
        var event_x = x - 50;
        var event_y = y - 50;

        var w = window.object_w;
        var h = window.object_h;

        var img = document.getElementById("bh-svg-blu");

        // Update rotation counter of the blackhole bh.
        bh.update_rotation();

        // Rotate/draw at new angle. 
        rotate_and_draw(img, x, y, bh.rotation_counter);   
    }

    /**
     * Draws a purple blackhole bh on the canvas given the coordinates x and y.
     * @function
     * @param {Number} x - The x coordinate
     * @param {Number} y - The y coordinate
     * @param {Blackhole} bh - The blackhole to be drawn
     */
    function draw_purple_blackhole(x, y, bh) {
        var event_x = x - 50;
        var event_y = y - 50;

        var w = window.object_w;
        var h = window.object_h;

        var img = document.getElementById("bh-svg-prp");

        // Update rotation counter of the blackhole bh.
        bh.update_rotation();

        // Rotate/draw at new angle. 
        rotate_and_draw(img, x, y, bh.rotation_counter);
    }

    /**
     * Draws a black blackhole bh on the canvas given the coordinates x and y.
     * @function
     * @param {Number} x - The x coordinate
     * @param {Number} y - The y coordinate
     * @param {Blackhole} bh - The blackhole to be drawn
     */
    function draw_blackhole(x, y, bh) {
        var event_x = x - 50;
        var event_y = y - 50;

        var w = window.object_w;
        var h = window.object_h;

        var img = document.getElementById("bh-svg-blk");
        
        // Update rotation counter of the blackhole bh.
        bh.update_rotation();

        // Rotate/draw at new angle. 
        rotate_and_draw(img, x, y, bh.rotation_counter);
    }


    /*********** Space Objects **************/


    /**
     * Draws an alien 1 on canvas given coordinates x, y, width w and height h. 
     * @function
     * @param {Number} x - The x coordinate
     * @param {Number} y - The y coordinate
     * @param {Number} w - The width of the object
     * @param {Number} h - The height of the object
     */
    function draw_alien1(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y + (7/8)*h, w/8, h/8);  
        ctx.rect(x + (2/8)*w, y + (7/8)*h, w/8, h/8);
        ctx.rect(x + (5/8)*w, y + (7/8)*h, w/8, h/8);
        ctx.rect(x + (7/8)*w, y + (7/8)*h, w/8, h/8);
        ctx.rect(x + (1/8)*w, y + (6/8)*h, w/8, h/8);
        ctx.rect(x + (3/8)*w, y + (6/8)*h, w/4, h/8);
        ctx.rect(x + (6/8)*w, y + (6/8)*h, w/8, h/8);
        ctx.rect(x + (2/8)*w, y + (5/8)*h, w/8, h/8);
        ctx.rect(x + (5/8)*w, y + (5/8)*h, w/8, h/8);
        ctx.rect(x + (1/8)*w, y + (2/8)*h, w*(6/8), h/8);
        ctx.rect(x , y + (3/8)*h, w, h/4);
        ctx.rect(x + (2/8)*w, y + (1/8)*h, w*(4/8), h/8);
        ctx.rect(x + (3/8)*w, y , w*(2/8), h/8);
        ctx.strokeStyle = "Black";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#41DC34";
        ctx.fill();

        ctx.beginPath();
        ctx.rect(x + (2/8)*w, y + (3/8)*h, w/8, h/8);  
        ctx.rect(x + (5/8)*w, y + (3/8)*h, w/8, h/8);  
        ctx.fillStyle = "black";
        ctx.fill();
    }

    /**
     * Draws an alien 2 on canvas given coordinates x, y, width w and height h. 
     * @function
     * @param {Number} x - The x coordinate
     * @param {Number} y - The y coordinate
     * @param {Number} w - The width of the object
     * @param {Number} h - The height of the object
     */
    function draw_alien2(x, y, w, h) {

        ctx.beginPath();
        ctx.rect(x + (1/8)*w, y + (7/8)*h, w/8, h/8);
        ctx.rect(x, y + (2/8)*h, w/8, h*(6/8));
        ctx.rect(x + (6/8)*w, y + (7/8)*h, w/8, h/8);
        ctx.rect(x + w*(7/8), y + (2/8)*h, w/8, h*(6/8));
        ctx.rect(x + (3/8)*w, y + (6/8)*h, w/4, h/8);
        ctx.rect(x + (2/8)*w, y + (2/8)*h, w/2, h/2);
        ctx.rect(x + (1/8)*w, y + (3/8)*h, w/8, h/4);
        ctx.rect(x + (6/8)*w, y + (3/8)*h, w/8, h/4);
        ctx.rect(x + (3/8)*w, y + (1/8)*h, w/4, h/8);
        ctx.rect(x + (2/8)*w, y, w/8, h/8);
        ctx.rect(x + (5/8)*w, y, w/8, h/8);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.fillStyle = "#CF9865";
        ctx.fill();

        ctx.beginPath();
        ctx.rect(x + (2/8)*w, y + (3/8)*h, w/8, h/8);
        ctx.rect(x + (5/8)*w, y + (3/8)*h, w/8, h/8);
        ctx.fillStyle = "black";
        ctx.fill();
    }

    /**
     * Draws an astronaut on canvas given coordinates x, y, width w and height h. 
     * @function
     * @param {Number} x - The x coordinate
     * @param {Number} y - The y coordinate
     * @param {Number} w - The width of the object
     * @param {Number} h - The height of the object
     */
    function draw_astronaut(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x + (2/8)*w, y, w/2, h*(5/8));
        ctx.rect(x + (1/8)*w, y + (1/8)*h, w/8, h*(2/8));
        ctx.rect(x + (6/8)*w, y + (1/8)*h, w/8, h*(2/8));
        ctx.rect(x, y + (2/8)*h, w/8, h*(3/8));
        ctx.rect(x + (7/8)*w, y + (2/8)*h, w/8, h*(3/8));
        ctx.rect(x + (2/8)*w, y + (5/8)*h, w/8, h*(3/8));
        ctx.rect(x + (5/8)*w, y + (5/8)*h, w/8, h*(3/8));
        ctx.rect(x + (1/8)*w, y + (7/8)*h, w/8, h/8);
        ctx.rect(x + (6/8)*w, y + (7/8)*h, w/8, h/8);
        ctx.fillStyle = "gray";
        ctx.fill();

        ctx.beginPath();
        ctx.rect(x + (3/8)*w, y + (1/8)*h, w/4, h/8);
        ctx.fillStyle = "black";
        ctx.fill();
    }

    /**
     * Draws a satellite on canvas given coordinates x, y, width w and height h. 
     * @function
     * @param {Number} x - The x coordinate
     * @param {Number} y - The y coordinate
     * @param {Number} w - The width of the object
     * @param {Number} h - The height of the object
     */
    function draw_satellite(x, y, w, h) {
        ctx.beginPath();
        ctx.moveTo(x + (1/8)*w, y);
        ctx.lineTo(x + 24 ,y +  17);
        ctx.lineTo(x + 17, y + 24);
        ctx.lineTo(x, y + (1/8)*h);
        ctx.lineTo(x + (1/8)*w, y);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#009999";
        ctx.fill(); 

        ctx.beginPath();
        ctx.moveTo(x + w, y + (7/8)*h);
        ctx.lineTo(x + 35, y + 28);
        ctx.lineTo(x + 27, y + 35);
        ctx.lineTo(x + (7/8)*w, y + h);
        ctx.lineTo(x + w, y + (7/8)*h);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#009999";
        ctx.fill(); 

        ctx.beginPath();
        ctx.moveTo(x + 26, y + 19);
        ctx.lineTo(x + 32, y +25);
        ctx.lineTo(x + 18, y + 40);
        ctx.lineTo(x + 12, y + 34);
        ctx.lineTo(x + 26, y + 19);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.fillStyle = "DarkSlateGray";
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + 30, y + 22);
        ctx.lineTo(x + w*(25/36), y + (2.7/8)*h);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + 22, y + 22);
        ctx.lineTo(x+ 20, y + 20);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + 29, y + 29);
        ctx.lineTo(x + 31, y + 31);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x + w*(25/36), y + (2.7/8)*h, 1.5, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.strokeStyle = "white";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x + w*(25/36), y + (2.7/8)*h, 5, Math.PI*(1/4), Math.PI*(7/6), true);
        ctx.strokeStyle = "white";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x + w*(25/36), y + (2.7/8)*h, 10, Math.PI*(1/4), Math.PI*(7/6), true);
        ctx.strokeStyle = "white";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x + w*(25/36), y + (2.7/8)*h, 15, Math.PI*(1/4), Math.PI*(7/6), true);
        ctx.strokeStyle = "white";
        ctx.stroke();
    }

    /**
     * Draws a spaceship 1 on canvas given coordinates x, y, width w and height h. 
     * @function
     * @param {Number} x - The x coordinate
     * @param {Number} y - The y coordinate
     * @param {Number} w - The width of the object
     * @param {Number} h - The height of the object
     */
    function draw_spaceship1 (x, y, w, h) {
        //Body
        ctx.beginPath();
        ctx.ellipse(x + (w/2), y + (h - 15), 25, 15, 0, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fillStyle = "#df4400";
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.ellipse(x+ (w/2), y + (h/2), 15, 25, 0, 0, Math.PI, true);
        ctx.stroke();
        ctx.fillStyle = "#50ffd1";
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.ellipse(x+ (w/2), y + (h/2), 15, 5, 0, 0, Math.PI, false);
        ctx.stroke();
        ctx.fillStyle = "#50ffd1";
        ctx.fill();
    }

    /**
     * Draws an spaceship 2 on canvas given coordinates x, y, width w and height h. 
     * @function
     * @param {Number} x - The x coordinate
     * @param {Number} y - The y coordinate
     * @param {Number} w - The width of the object
     * @param {Number} h - The height of the object
     */
    function draw_spaceship2 (x, y, w, h) {
        // Body
        ctx.fillStyle = "#b4726f";
        ctx.fillRect(x + (w/4), y + (h/4), w/2, h/2);
        ctx.strokeStyle = "black";
        ctx.stroke();

        // Head
        ctx.beginPath();
        ctx.arc(x + (w/2), y + (h/4), h/4 , 0, Math.PI, true);
        ctx.stroke();
        ctx.fillStyle = "#b5b5b5";
        ctx.fill();

        // Wing 1
        ctx.beginPath();
        ctx.moveTo(x + (w/4), y + (h/4));
        ctx.lineTo(x, y + ((3/4)*h));
        ctx.lineTo(x + ((1/4)*w) ,y + ((3/4)*h));
        ctx.stroke();
        ctx.fillStyle = "#b73f00";
        ctx.fill();

        // Wing 2
        ctx.beginPath();
        ctx.moveTo(x + ((3/4)*w), y + ((1/4)*h));
        ctx.lineTo(x + w, y + ((3/4)*h));
        ctx.lineTo(x + ((3/4)*w), y + ((3/4)*h));
        ctx.stroke();
        ctx.fillStyle = "#b73f00";
        ctx.fill();

        // Tail
        ctx.beginPath();
        ctx.moveTo(x + ((3/8)*w), y + ((3/4)*h));
        ctx.lineTo(x + ((1/4)*w), y + h);
        ctx.lineTo(x + ((3/4)*w), y + h);
        ctx.lineTo(x + ((5/8)*w), y + ((3/4)*h));
        ctx.stroke();
        ctx.fillStyle = "#8dad85";
        ctx.fill();
    }

    /**
     * Draws an asteroid on canvas given coordinates x, y, width w and height h. 
     * @function
     * @param {Number} x - The x coordinate
     * @param {Number} y - The y coordinate
     * @param {Number} w - The width of the object
     * @param {Number} h - The height of the object
     */
    function draw_asteroid(x, y, w, h) {

        ctx.beginPath();
        ctx.rect(x + (1/8)*w, y + (1/8)*h, w*(6/8), h*(6/8));
        ctx.rect(x, y + (4/8)*h, w*(1/8), h*(3/8));
        ctx.rect(x + (1/8)*w, y + (7/8)*h, w*(4/8), h*(1/8));
        ctx.rect(x + (2/8)*w, y, w*(4/8), h*(1/8));
        ctx.rect(x + (7/8)*w, y + (2/8)*h, w*(1/8), h*(4/8));
        ctx.stroke();
        ctx.fillStyle = "DarkSlateGray";
        ctx.fill();

        ctx.beginPath();
        ctx.rect(x + (4/8)*w, y + (1/8)*h, w/8, h/8);
        ctx.rect(x + (2/8)*w, y + (5/8)*h, w/8, h/8);
        ctx.rect(x + (5/8)*w, y + (4/8)*h, w/8, h/8);
        ctx.fillStyle = "black";
        ctx.fill();
    }

    /**
     * Draws a planet 1 on canvas given coordinates x, y, width w and height h. 
     * @function
     * @param {Number} x - The x coordinate
     * @param {Number} y - The y coordinate
     * @param {Number} w - The width of the object
     * @param {Number} h - The height of the object
     */
    function draw_planet1(x, y, w, h) {

        ctx.beginPath();
        ctx.arc(x + (w/2), y + (h/2), (w/2), 0, Math.PI * 2, false);
        ctx.closePath();

        var grd = ctx.createLinearGradient(0,0, window.c.width, window.c.height);

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

        ctx.beginPath();
        ctx.moveTo(x, y + (h/2) - 5);
        ctx.bezierCurveTo(x - h, y + h - 15, x + 2*w, y + h - 15, x + w, y + (h/2) - 5);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "maroon";
        ctx.stroke();
    }

    /**
     * Draws a planet 2 on canvas given coordinates x, y, width w and height h. 
     * @function
     * @param {Number} x - The x coordinate
     * @param {Number} y - The y coordinate
     * @param {Number} w - The width of the object
     * @param {Number} h - The height of the object
     */
    function draw_planet2 (x, y, w, h) {
        // Ring
        ctx.beginPath();
        ctx.ellipse(x + (w/2), y + (h/2), 35, 8, Math.PI*(3/4), 0, Math.PI, false);
        ctx.strokeStyle = "#ffcb29";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Body
        ctx.beginPath();
        ctx.arc(x + (w/2), y + (h/2), (w/3), 0, Math.PI * 2, false);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#f05885";
        ctx.fill();

        // Ring
        ctx.beginPath();
        ctx.ellipse(x + (w/2), y + (h/2), 35, 8, Math.PI*(3/4), 0, Math.PI, true);
        ctx.strokeStyle = "#ffcb29";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    /**
     * Draws a star on canvas given coordinates x, y, width w and height h. 
     * @function
     * @param {Number} x - The x coordinate
     * @param {Number} y - The y coordinate
     * @param {Number} w - The width of the object
     * @param {Number} h - The height of the object
     */
    function draw_star(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x + (8/17)*w, y, w/17, h/17);
        ctx.rect(x + (7/17)*w, y + (1/17)*h, w*(1/17), h*(2/17));
        ctx.rect(x + (9/17)*w, y + (1/17)*h, w*(1/17), h*(2/17));
        ctx.rect(x + (6/17)*w, y + (3/17)*h, w*(1/17), h*(2/17));
        ctx.rect(x + (10/17)*w, y + (3/17)*h, w*(1/17), h*(2/17));
        ctx.rect(x + (5/17)*w, y + (5/17)*h, w/17, h/17);
        ctx.rect(x + (11/17)*w, y + (5/17)*h, w/17, h/17);

        ctx.rect(x + (8/17)*w, y + (16/17)*h, w/17, h/17);
        ctx.rect(x + (7/17)*w, y + (14/17)*h, w*(1/17), h*(2/17));
        ctx.rect(x + (9/17)*w, y + (14/17)*h, w*(1/17), h*(2/17));
        ctx.rect(x + (6/17)*w, y + (12/17)*h, w*(1/17), h*(2/17));
        ctx.rect(x + (10/17)*w, y + (12/17)*h, w*(1/17), h*(2/17));
        ctx.rect(x + (5/17)*w, y + (11/17)*h, w/17, h/17);
        ctx.rect(x + (11/17)*w, y + (11/17)*h, w/17, h/17);

        ctx.rect(x, y + (8/17)*w, w/17, h/17);
        ctx.rect(x + (1/17)*h, y  + (7/17)*w, w*(2/17), h*(1/17));
        ctx.rect(x + (1/17)*h, y + (9/17)*w, w*(2/17), h*(1/17));
        ctx.rect(x + (3/17)*h, y + (6/17)*w , w*(2/17), h*(1/17));
        ctx.rect(x + (3/17)*h , y + (10/17)*w, w*(2/17), h*(1/17));
        ctx.rect(x + (5/17)*h, y + (5/17)*w, w/17, h/17);
        ctx.rect(x + (5/17)*h, y + (11/17)*w, w/17, h/17);

        ctx.rect(x + (16/17)*w, y + (8/17)*w, w/17, h/17);
        ctx.rect(x + (14/17)*h, y  + (7/17)*w, w*(2/17), h*(1/17));
        ctx.rect(x + (14/17)*h, y + (9/17)*w, w*(2/17), h*(1/17));
        ctx.rect(x + (12/17)*h, y + (6/17)*w , w*(2/17), h*(1/17));
        ctx.rect(x + (12/17)*h , y + (10/17)*w, w*(2/17), h*(1/17));
        ctx.rect(x + (11/17)*h, y + (5/17)*w, w/17, h/17);
        ctx.rect(x +  (11/17)*h, y + (11/17)*w, w/17, h/17);
        ctx.strokeStyle = "#6E2C00";
        ctx.stroke();
        ctx.fillStyle = "#F39C12";
        ctx.fill();

        ctx.beginPath();
        ctx.rect(x + (5/17)*w, y + (6/17)*h, w*(7/17), h*(5/17));
        ctx.rect(x + (3/17)*w, y + (7/17)*h, w*(2/17), h*(3/17));
        ctx.rect(x + (12/17)*w, y + (7/17)*h, w*(2/17), h*(3/17));
        ctx.rect(x + (1/17)*w, y + (8/17)*h, w*(2/17), h*(1/17));
        ctx.rect(x + (14/17)*w, y + (8/17)*h, w*(2/17), h*(1/17));
        ctx.rect(x + (6/17)*w, y + (5/17)*h, w*(5/17), h*(1/17));
        ctx.rect(x + (6/17)*w, y + (11/17)*h, w*(5/17), h*(1/17));
        ctx.rect(x + (7/17)*w, y + (3/17)*h, w*(3/17), h*(2/17));
        ctx.rect(x + (7/17)*w, y + (12/17)*h, w*(3/17), h*(2/17));
        ctx.rect(x + (8/17)*w, y + (1/17)*h, w*(1/17), h*(2/17));
        ctx.rect(x + (8/17)*w, y + (14/17)*h, w*(1/17), h*(2/17));
        ctx.strokeStyle = "#CA6F1E";
        ctx.stroke();
        ctx.fillStyle = "#F1C40F";
        ctx.fill();
    }

    /******************* END OF SPRITE DRAWING FUNCTIONS **********************/

    /************************************************/
    /* ----------- End of GAME Functions ---------- */ 
    /************************************************/

};

$(document).ready(main);
