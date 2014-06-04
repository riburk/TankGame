
/*
Bugs:
2. bonk sound is delayed
4. Many times the shot is not makable due to obstructions in front of cannon or target
5. Target can be hit again after it has exploded and is not visible
 */


(function(tankGame) {
    var canvas;
    tankGame.ctx = null;
    tankGame.WIDTH = 1200;
    tankGame.HEIGHT = 500;
    tankGame.animationInterval = null;
    var target;
    tankGame.scaleFactor = 1;
    const numGroundSegments = 8;
    var projectile;
    var surface;
    var worldBox;
    var tank;
    tankGame.explosionStartEvent = new Event("explosionStart");
    tankGame.explosionEndEvent = new Event("explosionEnd");
    tankGame.projectileMissEvent = new Event("projectileMiss");
    tankGame.projectileBounceEvent = new Event("projectileBounce");
    tankGame.cannonAngleChangeEvent = new Event("cannonAngleChange");

    document.addEventListener("explosionStart", function(e){projectile = null});
    document.addEventListener("explosionEnd", function(e){
        setTimeout(reset, 2000)
    });
    document.addEventListener("projectileMiss", function(e){
        setTimeout(function(){projectile = null}, 500);
    });
    document.addEventListener("projectileBounce", function(e){
        if(projectile.bounceCount++ > 2) {
            projectile = null;
        }
    });
    document.addEventListener("cannonAngleChange", function(e){
        var angleLabel = document.getElementById("angleLabel");
        angleLabel.innerHTML = 180 - e.angle;
        var angleSlider = document.getElementById("angle");
        angleSlider.value = 180 - e.angle;

    })



    document.onkeydown = function(event){
        if(event.keyCode == 38 ){
            tank.cannonUp = true;
            tank.cannonDown = false;
        }
        if(event.keyCode == 40){
            tank.cannonDown = true;
            tank.cannonUp = false;
        }
        if(event.keyCode == 32){
            if(projectile == null) {
                fire();
            }
        }
        return true;
    };
    document.onkeyup = function(event){
        if(event.keyCode == 38){
            tank.cannonUp = false;
        }
        if(event.keyCode == 40){
            tank.cannonDown = false;
        }
        return true;
    };

    function createTarget(size, initialVelocity) {
        var targetSegment = surface.surfaceArray.length - Math.floor(Math.random() * 5) - 1;
        target = new tankGame.Target(targetSegment * surface.segmentWidth + 1, surface.surfaceArray[targetSegment].height + 2, size - 2, size / 2 - 2, initialVelocity);
        return target;
    }


    function clear() {
        tankGame.ctx.clearRect(0, 0, tankGame.WIDTH, tankGame.HEIGHT);
    }

    function init() {
        canvas = document.getElementById("canvas");
        tankGame.ctx = canvas.getContext("2d");
        tankGame.ctx.transform(1, 0, 0, -1, 0, tankGame.HEIGHT);
        document.getElementById("detonate").onclick = fire;
        document.getElementById("reset").onclick = reset;
        worldBox = new tankGame.Rect().setValues(0, 0, tankGame.WIDTH, tankGame.HEIGHT);
        tank = new tankGame.Tank(2, 81);
        tankGame.sound.init();
        reset();
    }

    function reset() {
        clearInterval(tankGame.animationInterval);
        worldBox.draw("black", "#FAF7F8")

        surface = new tankGame.Surface(numGroundSegments);
        target = createTarget(50, 5);
        target.registerForCollisions(surface, tankGame.collision.rebound);
        var tankLocationY = surface.surfaceArray[1].height + 1;
        var tankLocationX = 1.5 * surface.segmentWidth;
        tank.setLocation(tankLocationX, tankLocationY);
        projectile = null;
        tankGame.animationInterval = setInterval(draw, 15);
    }

    function fire() {
        projectile = tank.fireCannon();
        projectile.registerForCollisions(surface, tankGame.collision.rebound);
        projectile.registerForCollisions(target, tankGame.collision.blowUp);
    }

    function draw() {
        clear();
        // draw background
        worldBox.draw();

        // draw all the surface blocks
        surface.draw();

        if(target != null && target != undefined){
            target.render();
        }
        tank.draw();
        if(projectile !== null && projectile != undefined ) {
            projectile.render();
        }
    }

    window.onload = function(e) {
        init();
    };



    tankGame.onAngleInput = function(val) {
        var angleLabel = document.getElementById("angleLabel");
        angleLabel.innerHTML = 180 - val;
        tank.setAngle(180 - val);
    }
})(window.tankGame = window.tankGame || {});
