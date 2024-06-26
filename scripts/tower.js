class Tower {
    constructor(col, row) {
        // Display
        this.baseOnTop = true;      // render base over barrel - рендерить базу поверх бочки
        this.border = [0, 0, 0];    // border color - цвет границы
        this.color = [0, 0, 0];     // main color - основной цвет
        this.drawLine = true;       // draw line to enemy on attack - подвести линию к противнику при атаке
        this.follow = true;         // follow target even when not firing - следовать за целью, даже когда не стреляешь
        this.hasBarrel = true;
        this.hasBase = true;
        this.length = 0.7;          // barrel length in tiles - длина ствола в тайлах
        this.radius = 1;            // radius in tiles - радиус в плитках
        this.secondary = [0, 0, 0]; // secondary color - вторичный цвет
        this.weight = 2;            // laser stroke weight - вес лазерного удара
        this.width = 0.3;           // barrel width in tiles - ширина ствола в тайлах
        this.rectangle = false;         // это просто квадрат 

        // Misc - Разное
        this.alive = true;
        this.name = 'tower';
        this.sound = null;          // sound to play on fire
        this.title = 'Башня';

        // Position
        this.angle = 0;
        this.gridPos = createVector(col, row);
        this.pos = createVector(col*ts + ts/2, row*ts + ts/2);
        
        // Stats
        this.cooldownMax = 0;
        this.cooldownMin = 0;
        this.cost = 0;
        this.damageMax = 20;
        this.damageMin = 1;
        this.range = 3;
        this.totalCost = 0;
        this.type = 'physical';     // damage type
        this.upgrades = [];
    }

    // Отрегулируйте угол, чтобы указать на положение пикселя
    aim(x, y) {
        this.angle = atan2(y - this.pos.y, x - this.pos.x);
    }

    // Нанести урон врагу
    attack(e) {
        var damage = round(random(this.damageMin, this.damageMax));
        e.dealDamage(damage, this.type);
        if (!muteSounds && sounds.hasOwnProperty(this.sound)) {
            sounds[this.sound].play();
        }
        this.onHit(e);
    }

    // Проверьте, завершено ли восстановление
    canFire() {
        return this.cd === 0;
    }

    draw() {
        // Draw turret base Нарисовать основание башни
        if (this.hasBase && !this.baseOnTop) this.drawBase();
        // Draw barrel Нарисовать бочку
        if (this.hasBarrel) {
            push();
            translate(this.pos.x, this.pos.y);
            rotate(this.angle);
            this.drawBarrel();
            pop();
        }
        // Draw turret base Нарисовать основание башни
        if (this.hasBase && this.baseOnTop) this.drawBase();
        // нарисовать квадрат
        if (this.rectangle) this.drawRectangle();
    }

    // Draw barrel of tower (moveable part) Рисуем ствол башни (подвижная часть)
    drawBarrel() {
        stroke(this.border);
        fill(this.secondary);
        rect(0, -this.width * ts / 2, this.length * ts, this.width * ts);
    }

    // Draw base of tower (stationary part) Нарисуйте основание башни (стационарную часть)
    drawBase() {
        stroke(this.border);
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.radius * ts, this.radius * ts);
    }
    // нарисовать забор
    drawRectangle() {
        // нарисовать векторный забор - рабочий код
        // stroke(this.border);
        // fill(this.color);
        // rect(this.pos.x - (this.width * ts)/2, this.pos.y - (this.length * ts)/2, this.length * ts, this.width * ts);
         // нарисовать забор из изображения
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = "textures/zabor.png";
        ctx.drawImage(img, this.pos.x - 10, this.pos.y - 10, 20,20); // img, x, y
    }

    // Returns damage range Возвращает диапазон урона
    getDamage() {
        return rangeText(this.damageMin, this.damageMax);
    }

    // Returns average cooldown in seconds Возвращает среднее время восстановления в секундах.
    getCooldown() {
        return (this.cooldownMin + this.cooldownMax) / 120;
    }

    kill() {
        this.alive = false;
    }

    isDead() {
        return !this.alive;
    }

    // Functionality once entity has been targeted Функциональность после того, как объект стал мишенью
    onAim(e) {
        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
        if (stopFiring) return;
        if (!this.canFire()) return;
        this.resetCooldown();
        this.attack(e);
        // Draw line to target
        if (!this.drawLine) return;
        stroke(this.color);
        strokeWeight(this.weight);
        line(this.pos.x, this.pos.y, e.pos.x, e.pos.y);
        strokeWeight(1);
    }

    onCreate() {
        this.cd = 0;                // current cooldown left осталось текущее время восстановления
    }

    onHit(e) {}

    resetCooldown() {
        var cooldown = round(random(this.cooldownMin, this.cooldownMax));
        this.cd = cooldown;
    }

    // Sell price Цена продажи
    sellPrice() {
        return floor(this.totalCost * sellConst);
    }

    // Target correct enemy Цельтесь в правильного врага
    target(entities) {
        entities = this.visible(entities);
        if (entities.length === 0) return;
        var t = getTaunting(entities);
        if (t.length > 0) entities = t;
        var e = getFirst(entities);
        if (typeof e === 'undefined') return;
        this.onAim(e);
    }

    update() {
        if (this.cd > 0) this.cd--;
    }

    // Use template to set attributes - Используйте шаблон для установки атрибутов
    upgrade(template) {
        template = typeof template === 'undefined' ? {} : template;
        var keys = Object.keys(template);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            this[key] = template[key];
        }
        if (template.cost) this.totalCost += template.cost;
    }

    // Returns array of visible entities out of passed array - Возвращает массив видимых объектов из переданного массива
    visible(entities) {
        return getInRange(this.pos.x, this.pos.y, this.range, entities);
    }
}
