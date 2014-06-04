
(function(tankGame) {

    tankGame.Circle = function()  {
        this.x = 0;
        this.y = 0;
        this.radius = 0;
        this.dx = 0;
        this.dy = 0;
        this.strokeColor = "black";
        this.fillColor = "white";
        this.bounceCount = 0;

        this.draw = function() {
            tankGame.ctx.beginPath();
            tankGame.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            tankGame.ctx.fillStyle = this.fillColor;
            tankGame.ctx.fill();
            tankGame.ctx.lineWidth = .5;
            tankGame.ctx.strokeStyle = this.strokeColor;
            tankGame.ctx.stroke();
        }
    };

    tankGame.Projectile = function(x, y, radius, strokeColor, fillColor ) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
        var initialVelocity = 15;
        var dx = 0, dy = 0;
        var collisionCheckArray = [];
        this.firing = false;

        this.registerForCollisions = function(object, callback){
            collisionCheckArray.push({obj:object, collisionFunction:callback});
        };

        this.fire = function(angle) {
            this.dx = initialVelocity * Math.cos(angle * Math.PI / 180);
            this.dy = initialVelocity * Math.sin(angle * Math.PI / 180);
            this.firing = true;
        };

        this.reset = function() {
            this.dx = this.dy = 0;
            this.firing = false;
        };


        this.render = function() {
            if(!this.firing){
                this.draw();
                return;
            }

            if (this.x + this.radius > tankGame.WIDTH || this.x + this.dx - this.radius < 0) {
                this.dx = -this.dx;
            }
            var oldDy = this.dy;
            this.dy -= .2 * tankGame.scaleFactor;
            if(oldDy >= 0 && this.dy < 0){
                tankGame.sound.playSound(tankGame.sound.whistleBuffer);
            }

            for(var item in collisionCheckArray){
                collisionCheckArray[item].obj.checkCollision(this, collisionCheckArray[item].collisionFunction);
            }
            this.x += this.dx * tankGame.scaleFactor;
            this.y += this.dy * tankGame.scaleFactor;
            this.draw();
        }
    };
    tankGame.Projectile.prototype = new tankGame.Circle();
    tankGame.Projectile.prototype.constructor = tankGame.Projectile;


})(window.tankGame = window.tankGame || {});
