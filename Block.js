/**
 * Created by richardburkhardt on 5/23/14.
 */
(function(tankGame) {
    tankGame.Block = function(x, y, size, dx, dy, strokeColor, fillColor) {
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
        this.collisionCheckArray = [];

        this.registerForCollisions = function (object, callback) {
            this.collisionCheckArray.push({obj: object, collisionFunction: callback});
        };

        this.render = function () {
            this.dy -= .2 * tankGame.scaleFactor;

            for (var item in this.collisionCheckArray) {
                this.collisionCheckArray[item].obj.checkCollision(this, this.collisionCheckArray[item].collisionFunction);
            }

            this.x += this.dx * tankGame.scaleFactor;
            this.y += this.dy * tankGame.scaleFactor;
            this.draw();

            if (Math.abs(this.dy) < 0.2) {
                this.stationaryCycleCount++;
            } else {
                this.stationaryCycleCount = 0;
            }
            this.drawCycleCount++;
        }
    };

    tankGame.Block.prototype = new tankGame.Rect();
    tankGame.Block.prototype.constructor = tankGame.Block;

})(window.tankGame = window.tankGame || {});
