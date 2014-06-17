/**
 * Created by richardburkhardt on 5/23/14.
 */
(function(tankGame) {
    var explosionHeightMultiplier = 3;
    var MAX_STATIONARY_CYCLES = 100;


    tankGame.Target = function(x, y, size, gridSize, initialVelocity) {
        this.x = x;
        this.y = y;
        this.height = size;
        this.width = size;
        this.fillColor = "black";
        this.strokeColor = "black";
        this.showScore = true;
        var explosionArc = 120;
        var blockArray = [];
        var blockSize = Math.floor(size / gridSize);
        var dx, dy, angle;
        var exploding = false;
        var arcSlice = explosionArc / gridSize;
        var scoreHeightModifier = 0;

        for (var i = 0; i < gridSize; i++) {
            blockArray.push([]);
            for (var j = 0; j < gridSize; j++) {
                angle = -(explosionArc) / 2 - 90 + j * arcSlice + Math.random() * arcSlice * i;
                dx = initialVelocity * Math.cos(angle * Math.PI / 180);
                dy = -initialVelocity * Math.sin(angle * Math.PI / 180) * Math.random() * i / gridSize * explosionHeightMultiplier;
                blockArray[i].push(new tankGame.Block(x + j * blockSize, y + i * blockSize, blockSize, dx, dy, "black", "black"));
            }
        }

        function drawScore() {
            if(scoreHeightModifier > 100) return;
            tankGame.ctx.transform(1, 0, 0, -1, 0, tankGame.HEIGHT);
            tankGame.ctx.fillStyle = "black";
            tankGame.ctx.font = "50px Georgia";
            tankGame.ctx.fillText(tankGame.levelScore, this.x, tankGame.HEIGHT - (this.y + 100) - scoreHeightModifier++);
            tankGame.ctx.transform(1, 0, 0, -1, 0, tankGame.HEIGHT);
        }

        this.render = function () {
            if (!exploding) {
                return this.draw();
            }
            drawScore.call(this);

            for (var rowNum in blockArray) {
                for (var colNum in blockArray[rowNum]) {
                    if (blockArray[rowNum][colNum].stationaryCycleCount >= MAX_STATIONARY_CYCLES ||
                        blockArray[rowNum][colNum].x > tankGame.WIDTH || blockArray[rowNum][colNum].x < 0) {
                        // remove the block from the array, it is done.
                        blockArray[rowNum].splice(colNum, 1);
                        if (blockArray[rowNum].length == 0) {
                            blockArray.splice(rowNum);
                        }
                    } else {
                        blockArray[rowNum][colNum].render();
                    }
                }
            }
        };

        this.isDone = function () {
            return blockArray.length == 0;
        };

        this.explode = function () {
            exploding = true;
        };

        this.registerForCollisions = function (object, callback) {
            for(var i = 0; i < gridSize; i++){
                for(var j = 0; j < gridSize; j++){
                    blockArray[i][j].registerForCollisions(object, callback);
                }
            }
        };
    };

    tankGame.Target.prototype = new tankGame.Rect();
    tankGame.Target.prototype.constructor = tankGame.Target;

})(window.tankGame = window.tankGame || {});