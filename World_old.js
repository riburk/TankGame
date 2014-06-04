(function(ns) {
    var canvas;
    ns.ctx = null;
    ns.WIDTH = 1200;
    ns.HEIGHT = 500;
    var animationInterval;
    var target;
    var scaleFactor = 1;
    var explosionHeightMultiplier = 3;
    var MAX_STATIONARY_CYCLES = 100;
    var surfaceArray = [];
    const numGroundSegments = 24;
    var groundArray = [];
    var projectile;

    world.collidableObject = {
        collisionCheckArray: [],
        registerForCollisions: function(object, callback){
            this.collisionCheckArray.push({obj:object, collisionFunction:callback});
        }
    };

    var rect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        dx: 0,
        dy: 0,
        strokeColor: "black",
        fillColor: "white",


        setValues: function(x, y , width, height){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
        },

        draw: function () {
            ns.ctx.beginPath();
            ns.ctx.rect(this.x, this.y, this.width, this.height);
            ns.ctx.closePath();
            ns.ctx.fillStyle = this.fillColor;
            ns.ctx.fill();
            ns.ctx.lineWidth = .5;
            ns.ctx.strokeStyle = this.strokeColor;
            ns.ctx.stroke();
        },

//        checkCollision: function (otherX, otherY, otherW, otherH) {
//            var collided = (otherX + otherW > this.x && otherX < this.x + this.width &&
//                otherY < this.y + this.height && otherY + otherH > this.y);
//            if(collided)
//                return collided;
//            return collided;
//        }

        checkCollision: function (other) {
            var otherX = other.x + other.dx;
            var otherY = other.y + other.dy;
            var collided = false;
//            if(other instanceof Block) {
                collided = (otherX + other.width > this.x && otherX < this.x + this.width &&
                    otherY < this.y + this.height && otherY + other.height > this.y);
//            }
//            if(other instanceof ns.Projectile){
//                collided = otherX + other.radius > this.x && otherX - other.radius < this.x + this.width &&
//                    otherY - other.radius < this.y + this.height && otherY + other.radius > this.y;
//            }
            return collided;
        }
    };
    rect.prototype = collidableObject;



    function generateGroundArray(numGroundSegments) {
        groundArray = new Array();
        for (var i = 0; i < numGroundSegments; i++) {
            groundArray.push(Math.random() * 9 * 30)
        }
        return groundArray;
    }

    function getGroundSegmentWidth() {
        return ns.WIDTH / groundArray.length;
    }

    function createSurface(groundArray) {
        var segmentWidth = getGroundSegmentWidth();
        var surfaceArray = [];
        for (var i = 0; i < groundArray.length; i++) {
            surfaceArray.push(new SurfaceBlock(i * segmentWidth, 1, segmentWidth, groundArray[i]));
        }
        return surfaceArray;
    }

    function SurfaceBlock(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    SurfaceBlock.prototype = rect;

    function createTarget(size, initialVelocity) {
        var targetSegment = groundArray.length - Math.floor(Math.random() * 5) - 1;
        target = new Target(targetSegment * getGroundSegmentWidth() + 1, groundArray[targetSegment] + 2, size - 2, size / 2 - 2, initialVelocity);
        return target;
    }


    function clear() {
        ns.ctx.clearRect(0, 0, ns.WIDTH, ns.HEIGHT);
    }

    function init() {
        canvas = document.getElementById("canvas");
        ns.ctx = canvas.getContext("2d");
        ns.ctx.transform(1, 0, 0, -1, 0, ns.HEIGHT);
        document.getElementById("detonate").onclick = fire;
        document.getElementById("reset").onclick = reset;
        reset();
    }

    function drawSurface(surfaceArray) {
        for (var block in surfaceArray) {
            surfaceArray[block].draw();
        }
    }

    function reset() {
        clearInterval(animationInterval);
//        ns.ctx.fillStyle = "#FAF7F8";
//        rect(0, 0, ns.WIDTH, ns.HEIGHT);
        rect.setValues(0, 0, ns.WIDTH, ns.HEIGHT).draw("black", "#FAF7F8")

        ns.ctx.fillStyle = "white";

        surfaceArray = createSurface(generateGroundArray(numGroundSegments));
        target = createTarget(50, 5);
        projectile = new ns.Projectile(50, 4, 4, "black", "white");


        drawSurface(surfaceArray);
        ns.ctx.fillStyle = "black";
        target.draw();
    }

    function fire() {
        clearInterval(animationInterval);
        projectile.fire();
        target.explode();
        animationInterval = setInterval(draw, 20);
    }

    function Target(x, y, size, gridSize, initialVelocity) {
        this.x = x;
        this.y = y;
        this.height = size;
        this.width = size;
        this.fillColor = "black";
        this.strokeColor = "black";
        var explosionArc = 120;
        var blockArray = [];
        var blockSize = Math.floor(size / gridSize);
        var dx, dy, angle;
        var exploding = false;
        //this.rect = new Rect(x, y, size, size);

        var arcSlice = explosionArc / gridSize;
        for (var i = 0; i < gridSize; i++) {
            blockArray.push([]);
            for (var j = 0; j < gridSize; j++) {
                angle = -(explosionArc) / 2 - 90 + j * arcSlice + Math.random() * arcSlice * i;
                dx = initialVelocity * Math.cos(angle * Math.PI / 180);
                dy = -initialVelocity * Math.sin(angle * Math.PI / 180) * Math.random() * i / gridSize * explosionHeightMultiplier;
                blockArray[i].push(new Block(x + j * blockSize, y + i * blockSize, blockSize, dx, dy, "black", "black"))
            }
        }

        this.render = function () {
            if(!exploding){
                return this.draw();
            }
            for (var rowNum in blockArray) {
                for (var colNum in blockArray[rowNum]) {
                    if (!blockArray[rowNum][colNum].render()) {
                        blockArray[rowNum].splice(colNum, 1);
                        if (blockArray[rowNum].length == 0) {
                            blockArray.splice(rowNum);
                        }
                    }
                }
            }
        };

        this.isDone = function () {
            return blockArray.length == 0;
        }

        this.explode = function(){
            exploding = true;
        }
    }
    Target.prototype = rect;

    function Block( x, y, size, dx, dy, strokeColor, fillColor  ) {
        //this.rect = new Rect(x, y, size, size);
        //var vector = new Vector(dx, dy);
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.width = size;
        this.height = size;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
        this.stationaryCycleCount = 0;
        this.lifetime = Math.floor(Math.random() * 100); // needs a seed; seems to follow same pattern every time
        this.lifetime = this.lifetime % 2 == 0 ? this.lifetime : 10000;
        this.drawCycleCount = 0;

        // return true if there was a collision between this block and the given obstacle
        // return false otherwise
        function adjustVectorForCollisions(obstacle) {
            if (obstacle.checkCollision(this)) {
                if (this.x + this.width < obstacle.x || this.x > obstacle.x + obstacle.width) {
                    this.dx = -this.dx * .7;
                }
                if (this.y > obstacle.y + obstacle.height || this.y + this.height < obstacle.y) {
                    this.dy = -this.dy * .3;
                }
                return true;
            }
            return false;
        }

        this.render = function () {
            if (/*this.drawCycleCount >= this.lifetime || */this.stationaryCycleCount >= MAX_STATIONARY_CYCLES) {
                return false;
            }

            this.dy -= .2 * scaleFactor;

            var currentSegment = Math.floor(this.x / getGroundSegmentWidth());
            for (var i = currentSegment - 1; i <= currentSegment + 1 && i < surfaceArray.length; i++) {
                var initialCollision = adjustVectorForCollisions.call(this, surfaceArray[i]);
                // if there was a collision then the rebound may have crossed into an obstacle that was already checked,
                // we have to recheck the previous obstacle
                if (initialCollision) {
                    adjustVectorForCollisions.call(this, surfaceArray[i - 1])
                }
            }

            this.x += this.dx * scaleFactor;
            this.y += this.dy * scaleFactor;
            this.draw();

            if (Math.abs(this.dy) < 0.2) {
                this.stationaryCycleCount++;
            } else {
                this.stationaryCycleCount = 0;
            }
            this.drawCycleCount++;
            return true;
        }
    }
    Block.prototype = rect;



    function draw() {
        clear();
        // draw background
//        ns.ctx.fillStyle = "#FAF7F8";
//        rect(0, 0, ns.WIDTH, ns.HEIGHT);
        rect.setValues(0, 0, ns.WIDTH, ns.HEIGHT).draw();

        // draw all the surface blocks
        ns.ctx.fillStyle = "white";
        for (var block in surfaceArray) {
            surfaceArray[block].draw();
        }

        ns.ctx.fillStyle = "black";
        target.render();
        projectile.render();
    }

    init();
})(window.world = window.world || {});
