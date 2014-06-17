(function(tankGame) {
    var canvas;
    tankGame.ctx = null;
    tankGame.WIDTH = 1200;
    tankGame.HEIGHT = 500;
    tankGame.animationInterval = null;
    var target;
    tankGame.scaleFactor = 1;
    var numGroundSegments, initialGroundSegments = 8;
    var tryCount = 0;
    var projectile;
    var surface;
    var worldBox;
    var tank;
    tankGame.explosionStartEvent = new Event("explosionStart");
    tankGame.explosionEndEvent = new Event("explosionEnd");
    tankGame.projectileMissEvent = new Event("projectileMiss");
    tankGame.projectileBounceEvent = new Event("projectileBounce");
    tankGame.cannonAngleChangeEvent = new Event("cannonAngleChange");
    var projectileVelocityEl;
    var gameScore = 0;
    tankGame.levelScore = 0;
    var gameLevel = 0;

    document.addEventListener("explosionStart", function(e){
        tryCount = 0;
        projectile = null;
    });
    document.addEventListener("explosionEnd", function(e){
        setTimeout(levelUp, 2000);
    });

    function showGameOverMessage() {
        document.getElementById("fire").onclick = null;
        setTimeout(function(){
                document.getElementById("gameOver").setAttribute("style", "display: block");
                document.getElementById("restart").focus();
            }, 500);
    }

    function hideGameOverMessage() {
        document.getElementById("gameOver").setAttribute("style", "display: none");
        document.getElementById("fire").onclick = fire;
    }



    document.addEventListener("projectileMiss", function(e){
        tankGame.levelScore -= Math.floor(tankGame.levelScore / 4);
        document.getElementById("levelScoreLabel").innerHTML = tankGame.levelScore;

        if(tryCount++ >= 3){
            showGameOverMessage();
            //restart();
        }
        setTimeout(function(){projectile = null}, 500);
    });
    document.addEventListener("projectileBounce", function(e){
        if(projectile.bounceCount++ > 2) {
            projectile = null;
        }
    });
    document.addEventListener("cannonAngleChange", function(e){
        var angleDegreeLabel = document.getElementById("angleDegreeLabel");
        angleDegreeLabel.innerHTML =  Math.floor(e.angle);
        var angleSlider = document.getElementById("angleDegrees");
        angleSlider.value =  180 - e.angle;
    });



    document.onkeydown = function(event){
        tank.fineMovement = event.shiftKey;

        if(event.keyCode == 38 ){
            tank.cannonUp = true;
            tank.cannonDown = false;

        }
        else if(event.keyCode == 40){
            tank.cannonDown = true;
            tank.cannonUp = false;
        }
        else if(event.keyCode == 32){
                fire();
        }
        else if(event.keyCode == 16){
            tank.fineMovement = true;
        }

        else if(event.keyCode == 37){
            projectileVelocityEl.value -= .1;
            document.getElementById("projectileVelocityLabel").innerHTML = projectileVelocityEl.value;
        }
        else if(event.keyCode == 39){
            // this is a strange way to calculate it, but javascript was giving an incorrect value for += .1
            projectileVelocityEl.value = (projectileVelocityEl.value * 10 + 1)/10;
            document.getElementById("projectileVelocityLabel").innerHTML = projectileVelocityEl.value;
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
        if(event.keyCode = 16){
            tank.fineMovement = false;
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

    function init(){
        canvas = document.getElementById("canvas");
        tankGame.ctx = canvas.getContext("2d");
        tankGame.ctx.transform(1, 0, 0, -1, 0, tankGame.HEIGHT);
        projectileVelocityEl = document.getElementById("projectileVelocity");
        restart();
    }

    function restart() {
        hideGameOverMessage();
        var restartBtn = document.getElementById("restart");
        restartBtn.onclick = restart;
        tryCount = 0;
        numGroundSegments = initialGroundSegments;
        worldBox = new tankGame.Rect().setValues(0, 0, tankGame.WIDTH, tankGame.HEIGHT);
        tank = new tankGame.Tank(2, 81);
        document.getElementById("angleDegreeLabel").innerHTML = tank.getAngle();
        gameScore = 0;
        gameLevel = 0;
        tankGame.levelScore = 0;
        document.getElementById("gameScoreLabel").innerHTML = gameScore.toString();
        tankGame.sound.init();
        levelUp();
    }

    function levelUp() {
        clearInterval(tankGame.animationInterval);
        worldBox.draw("black", "#FAF7F8");

        surface = new tankGame.Surface(numGroundSegments++);
        target = createTarget(50, 5);
        target.registerForCollisions(surface, tankGame.collision.rebound);
        var tankLocationY = surface.surfaceArray[1].height + 1;
        var tankLocationX = 1.5 * surface.segmentWidth;
        tank.setLocation(tankLocationX, tankLocationY);
        projectile = null;
        gameScore += tankGame.levelScore;
        document.getElementById("gameScoreLabel").innerHTML = gameScore.toString();
        gameLevel++;
        tankGame.levelScore = 500 + (gameLevel * 100);
        document.getElementById("levelScoreLabel").innerHTML = tankGame.levelScore;

        tankGame.animationInterval = setInterval(draw, 15);
    }

    function fire() {
        if(projectile != null) return;

        projectile = tank.fireCannon(document.getElementById("projectileVelocity").value);
        projectile.registerForCollisions(surface, tankGame.collision.stick);
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

    tankGame.onAngleDegreeInput = function(val) {
        var angleDegreeLabel = document.getElementById("angleDegreeLabel");
        angleDegreeLabel.innerHTML = val;
        tank.setAngle(180 - val);
    };

    tankGame.onProjectileVelocityInput = function(val) {
        var projectileVelocityLabel = document.getElementById("projectileVelocityLabel");
        projectileVelocityLabel.innerHTML = val;
    }
})(window.tankGame = window.tankGame || {});
