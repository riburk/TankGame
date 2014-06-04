/**
 * Created by richardburkhardt on 5/23/14.
 */

(function(tankGame) {
    tankGame.Rect = function () {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.dx = 0;
        this.dy = 0;
        this.strokeColor = "black";
        this.fillColor = "white";


        this.setValues = function (x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
        };

        this.draw = function () {
            tankGame.ctx.beginPath();
            tankGame.ctx.rect(this.x, this.y, this.width, this.height);
            tankGame.ctx.closePath();
            tankGame.ctx.fillStyle = this.fillColor;
            tankGame.ctx.fill();
            tankGame.ctx.lineWidth = .5;
            tankGame.ctx.strokeStyle = this.strokeColor;
            tankGame.ctx.stroke();
        };

        this.checkCollision = function (other, collisionFunction) {
            var otherX = other.x + other.dx;
            var otherY = other.y + other.dy;
            var collided = false;
            if (other instanceof tankGame.Rect) {
                collided = (otherX + other.width > this.x && otherX < this.x + this.width &&
                    otherY < this.y + this.height && otherY + other.height > this.y);
            }
            if (other instanceof tankGame.Circle) {
                collided = otherX + other.radius > this.x && otherX - other.radius < this.x + this.width &&
                    otherY - other.radius < this.y + this.height && otherY + other.radius > this.y;
            }
            if (collided && collisionFunction !== undefined) {
                collisionFunction.call(other, this);
            }
            return collided;
        };
    }
})(window.tankGame = window.tankGame || {});