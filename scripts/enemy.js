//new p5();

class Enemy {
    constructor(x, y) {
        // Display
        this.color = [0, 0, 0];
        this.radius = 0.5;          // radius in tiles

        // Misc
        this.alive = true;
        this.effects = [];          // status effects
        this.name = 'enemy';
        this.sound = 'pop';         // death sound

        // Position
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        
        // Stats
        this.cash = 0;
        this.damage = 1;
        this.health = 1;
        this.immune = [];           // no damage from these damage types
        this.resistant = [];        // reduced damage from these damage types
        this.weak = [];             // increased damage from these damage types
        this.speed = 1;             // 4 is the max
        this.taunt = false;         // force towers to target
        //this.images = false;        // это картинка
        this.sourceimg = null;            // источник картинки


    }

    // Apply new status effect - Применить новый эффект статуса
    // Only one of each is allowed at a time - Одновременно допускается только один из каждого
    applyEffect(name, duration) {
        if (this.immune.includes(name)) return;
        if (getByName(this.effects, name).length > 0) return;
        var e = createEffect(duration, effects[name]);
        e.onStart(this);
        this.effects.push(e);
    }

    draw() {
        if (this.sourceimg !== null) {
            // рабочий код рисования картинки в canvas с помощью библиотеки p5
        //     let img; 
        //     let url = "https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?q=80&w=2565&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        //  //  url = "https://www.svgrepo.com/show/200362/zombie.svg";
        //     loadImage(url, img => { 
        //         image(img, 20, 40, 100, 100); 
        //       }
        //       ); 

        // рабочий код рисования картинки в canvas стандартным методом
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = "img/z1.png";
        img.onload = ()=> ctx.drawImage(img, this.pos.x, this.pos.y, 20,20); // img, x, y
        //  img.onload = function() { // дождаться загрузки img
        //     const pattern = context.createPattern(img, "repeat"); // фон 
        //     ctx.fillStyle = pattern; // стиль заполнения
        //     ctx.fillRect(10, 10, 400, 400); // рисует фон картинку
        //     ctx.strokeRect(10, 10, 390, 390); // рисует контур
        // }

        // <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        //     <circle cx="50" cy="50" r="40" fill="red" />
        // </svg>
        //var img;

// The URL of the image
//let imgUrl = "https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?q=80&w=2565&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    // Load the image from the URL
    //img = loadImage(imgUrl);

        //image(img, 0, 0, 250, 250); 
        // let img;
        // let imgUrl = "https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?q=80&w=2565&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";





            // var img = new Image();
            // img.onload = function() {
            //     image(img, 0, 0);
            // }
            // img.src = "http://upload.wikimedia.org/wikipedia/commons/d/d2/Svg_example_square.svg";
            
            // push()
            // stroke(0);
           // const pattern = createPattern(url, "repeat"); // фон 
           // fill = pattern; // стиль заполнения
            // ctx.fillRect(10, 10, 400, 400); // рисует фон картинку
            // ctx.strokeRect(10, 10, 390, 390); // рисует контур
            //ellipse(this.pos.x, this.pos.y, this.radius * ts, this.radius * ts);

            // fill(this.getColor());
            // ellipse(this.pos.x, this.pos.y, this.radius * ts, this.radius * ts);
            // pop()

            // push()
            // stroke(0);
            // fill(this.getColor());
            // ellipse(this.pos.x, this.pos.y, this.radius * ts, this.radius * ts);
            // pop()

        } 
        if (this.sourceimg === null) {
        push()
        stroke(0);
        fill(this.getColor());
        ellipse(this.pos.x, this.pos.y, this.radius * ts, this.radius * ts);
        pop()
    }
        
    }

    // Subtract damage amount from health, account for resistances, etc. - Вычтите количество урона из здоровья, учтите сопротивления и т. д.
    dealDamage(amt, type) {
        var mult;
        if (this.immune.includes(type)) {
            mult = 0;
        } else if (this.resistant.includes(type)) {
            mult = 1 - resistance;
        } else if (this.weak.includes(type)) {
            mult = 1 + weakness;
        } else {
            mult = 1;
        }

        if (this.health > 0) this.health -= amt * mult;
        if (this.health <= 0) this.onKilled();
    }

    // Draw health bar - Нарисовать полоску здоровья
    drawHealth() {
        var percent = 1 - this.health / this.maxHealth;
        if (percent === 0) return;
        
        push();
        translate(this.pos.x, this.pos.y);

        stroke(255);
        fill(207, 0, 15);
        var edge = 0.7 * ts / 2;
        var width = floor(edge * percent * 2);
        var top = 0.2 * ts;
        var height = 0.15 * ts;
        rect(-edge, top, edge * percent * 2, height);

        pop();
    }

    getColor() {
        var l = this.effects.length;
        if (l > 0) return this.effects[l - 1].color;
        return this.color;
    }

    isDead() {
        return !this.alive;
    }

    kill() {
        this.alive = false;
    }

    onCreate() {
        this.maxHealth = this.health;
    }

    onExit() {
        if (!godMode) health -= this.damage;
        this.kill();
    }

    onKilled() {
        if (this.alive) {
            cash += this.cash;
            this.kill();
            if (!muteSounds && sounds.hasOwnProperty(this.sound)) {
                sounds[this.sound].play();
            }
        }
    }

    onTick() {}

    // Return speed in pixels per tick - Скорость возврата в пикселях на тик
    // Adjusted to not be affected by zoom level - Скорректировано так, чтобы на него не влиял уровень масштабирования.
    pxSpeed() {
        return this.speed * ts / 24;
    }

    // Change direction based on pathfinding map - Изменение направления на основе карты поиска пути
    steer() {
        var t = gridPos(this.pos.x, this.pos.y);
        if (outsideRect(t.x, t.y, 0, 0, cols, rows)) return;
        var dir = paths[t.x][t.y];
        if (atTileCenter(this.pos.x, this.pos.y, t.x, t.y)) {
            if (dir === null) return;
            // Adjust velocity - Отрегулировать скорость
            var speed = this.pxSpeed();
            if (dir === 1) this.vel = createVector(-speed, 0);
            if (dir === 2) this.vel = createVector(0, -speed);
            if (dir === 3) this.vel = createVector(speed, 0);
            if (dir === 4) this.vel = createVector(0, speed);
        }
    }

    update() {
        // Apply status effects - Применить статусные эффекты
        for (let i = this.effects.length - 1; i >= 0; i--) {
            let e = this.effects[i];
            e.update(this);

            if (e.isDead()) this.effects.splice(i, 1);
        }
        
        // Movement - Движение
        this.vel.limit(96 / ts);
        this.vel.limit(this.pxSpeed());
        this.pos.add(this.vel);
    }
}
