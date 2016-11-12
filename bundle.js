System.register("common/drawable", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Drawable;
    return {
        setters:[],
        execute: function() {
            Drawable = class Drawable {
                constructor() {
                    this.controlState = this.baseControlState.bind(this)();
                    this.renderState = this.baseRenderState.bind(this)();
                }
                update(dt) {
                    let cur = this.controlState.next({ dt: dt });
                    if (cur.value != null) {
                        this.controlState = cur.value;
                    }
                    else if (cur.done) {
                        this.controlState = this.baseControlState.bind(this)();
                    }
                }
                render(dt, ctx) {
                    let cur = this.renderState.next({ dt: dt, ctx: ctx });
                    if (cur.value != null) {
                        this.renderState = cur.value;
                    }
                    else if (cur.done) {
                        this.renderState = this.baseRenderState.bind(this)();
                    }
                }
                *baseControlState() { while (true) {
                    yield null;
                } }
                *baseRenderState() { while (true) {
                    yield null;
                } }
            };
            exports_1("Drawable", Drawable);
        }
    }
});
System.register("common/mediaManager", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var ImageHandle, AudioHandle, MediaManager;
    return {
        setters:[],
        execute: function() {
            ImageHandle = class ImageHandle {
                constructor(img, setup) {
                    this.img = null;
                    this.x = 0;
                    this.y = 0;
                    this.width = 0;
                    this.height = 0;
                    this.img = img;
                    this.img.addEventListener('load', (img) => setup(this, img));
                }
                draw(ctx, x, y, sx = 1, sy = 1) {
                    ctx.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width * sx, this.height * sy);
                }
            };
            AudioHandle = class AudioHandle {
                constructor() {
                }
            };
            MediaManager = class MediaManager {
                constructor() {
                    this.pending = [];
                }
                loaded() {
                    return Promise.all(this.pending);
                }
                fetchSprite(url) {
                    let sprite = new Image();
                    let p = new Promise((resolve) => {
                        sprite.addEventListener('load', resolve);
                    });
                    this.pending.push(p);
                    sprite.src = url;
                    return new ImageHandle(sprite, (handle, event) => {
                        let img = event.target;
                        handle.x = 0;
                        handle.y = 0;
                        handle.height = img.naturalHeight;
                        handle.width = img.naturalWidth;
                    });
                }
            };
            exports_2("MediaManager", MediaManager);
        }
    }
});
System.register("common/events", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var EventListener;
    return {
        setters:[],
        execute: function() {
            EventListener = class EventListener {
                constructor() {
                    this.events = {};
                }
                addEventListener(name, func) {
                    let events = this.events[name] || [];
                    this.events[name] = events;
                    events.push(func);
                }
                emit(name, args) {
                    let events = this.events[name] || [];
                    for (let ev of events) {
                        ev(args);
                    }
                }
            };
            exports_3("EventListener", EventListener);
        }
    }
});
System.register("common/actor", ["common/events"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var events_1;
    var Actor;
    return {
        setters:[
            function (events_1_1) {
                events_1 = events_1_1;
            }],
        execute: function() {
            Actor = class Actor {
                constructor(world) {
                    this.events = new events_1.EventListener();
                    this.world = world;
                    this.x = 0;
                    this.y = 0;
                    this.width = 64;
                    this.height = 64;
                    this.controlState = this.baseControlState.bind(this)();
                    this.renderState = this.baseRenderState.bind(this)();
                }
                getHitBoxes() {
                    return [];
                }
                collect() {
                    return false;
                }
                update(dt) {
                    let cur = this.controlState.next({ dt: dt });
                    if (cur.value != null) {
                        this.controlState = cur.value;
                    }
                    else if (cur.done) {
                        this.controlState = this.baseControlState.bind(this)();
                    }
                }
                render(dt, ctx) {
                    let cur = this.renderState.next({ dt: dt, ctx: ctx });
                    if (cur.value != null) {
                        this.renderState = cur.value;
                    }
                    else if (cur.done) {
                        this.renderState = this.baseRenderState.bind(this)();
                    }
                }
                *baseControlState() { }
                *baseRenderState() { }
            };
            exports_4("Actor", Actor);
        }
    }
});
System.register("common/world", [], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var Scene, World;
    return {
        setters:[],
        execute: function() {
            Scene = class Scene {
                constructor() {
                }
            };
            exports_5("Scene", Scene);
            World = class World {
                constructor() {
                }
            };
            exports_5("World", World);
        }
    }
});
System.register("common/game", ["common/drawable"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var drawable_1;
    var Game;
    return {
        setters:[
            function (drawable_1_1) {
                drawable_1 = drawable_1_1;
            }],
        execute: function() {
            Game = class Game extends drawable_1.Drawable {
                constructor() {
                    super();
                    this.width = 620;
                    this.height = 480;
                    this.framerate = 60;
                }
                install(place) {
                    let canvas = document.createElement('canvas');
                    canvas.width = this.width;
                    canvas.height = this.height;
                    document.querySelector(place).appendChild(canvas);
                    let backCanvas = document.createElement('canvas');
                    backCanvas.width = this.width;
                    backCanvas.height = this.height;
                    this.buffer = canvas.getContext('2d');
                    this.backBuffer = backCanvas.getContext('2d');
                    this.canvas = canvas;
                    this.backCanvas = backCanvas;
                }
                start() {
                    this._lastTick = performance.now();
                    setInterval(this.tick.bind(this), 1000 / this.framerate);
                }
                tick() {
                    let now = performance.now();
                    let dt = now - this._lastTick;
                    this._lastTick = now;
                    this.update(dt);
                    this.render(dt, this.backBuffer);
                    this.buffer.drawImage(this.backCanvas, 0, 0);
                    return true;
                }
            };
            exports_6("Game", Game);
        }
    }
});
System.register("common/input", [], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var Controller;
    return {
        setters:[],
        execute: function() {
            Controller = class Controller {
                constructor() {
                    this.input = {
                        up: false,
                        down: false,
                        right: false,
                        left: false,
                        space: false,
                    };
                    this.clear();
                }
                isAnyPressed() {
                    return this.input.up |
                        this.input.down |
                        this.input.right |
                        this.input.left;
                }
                clear() {
                    this.savedInput = {
                        up: false,
                        down: false,
                        right: false,
                        left: false,
                        space: false,
                    };
                }
                attach() {
                    window.addEventListener('keydown', (event) => {
                        let preventDefault = false;
                        switch (event.key) {
                            case "ArrowUp":
                            case "w":
                                preventDefault = true;
                                this.input.up = true;
                                this.savedInput.up = true;
                                break;
                            case "ArrowLeft":
                            case "a":
                                preventDefault = true;
                                this.input.left = true;
                                this.savedInput.left = true;
                                break;
                            case "ArrowRight":
                            case "d":
                                preventDefault = true;
                                this.input.right = true;
                                this.savedInput.right = true;
                                break;
                            case "ArrowDown":
                            case "s":
                                preventDefault = true;
                                this.input.down = true;
                                this.savedInput.down = true;
                                break;
                            case " ":
                                preventDefault = true;
                                this.input.space = true;
                                this.savedInput.space = true;
                        }
                        if (preventDefault) {
                            event.preventDefault();
                        }
                    });
                    window.addEventListener('keyup', (event) => {
                        switch (event.key) {
                            case "ArrowUp":
                            case "w":
                                this.input.up = false;
                                break;
                            case "ArrowLeft":
                            case "a":
                                this.input.left = false;
                                break;
                            case "ArrowRight":
                            case "d":
                                this.input.right = false;
                                break;
                            case "ArrowDown":
                            case "s":
                                this.input.down = false;
                                break;
                            case " ":
                                this.input.space = false;
                        }
                    });
                }
            };
            exports_7("Controller", Controller);
        }
    }
});
System.register("bullet_pool", [], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    function BulletPool(maxSize) {
        this.pool = new Float32Array(4 * maxSize);
        this.end = 0;
        this.max = maxSize;
    }
    exports_8("BulletPool", BulletPool);
    return {
        setters:[],
        execute: function() {
            BulletPool.prototype.add = function (position, velocity) {
                if (this.end < this.max) {
                    this.pool[4 * this.end] = position.x;
                    this.pool[4 * this.end + 1] = position.y;
                    this.pool[4 * this.end + 2] = velocity.x;
                    this.pool[4 * this.end + 3] = velocity.y;
                    this.end++;
                }
            };
            BulletPool.prototype.update = function (elapsedTime, callback) {
                for (var i = 0; i < this.end; i++) {
                    this.pool[4 * i] += this.pool[4 * i + 2];
                    this.pool[4 * i + 1] += this.pool[4 * i + 3];
                    if (callback && callback({
                        x: this.pool[4 * i],
                        y: this.pool[4 * i + 1]
                    })) {
                        this.pool[4 * i] = this.pool[4 * (this.end - 1)];
                        this.pool[4 * i + 1] = this.pool[4 * (this.end - 1) + 1];
                        this.pool[4 * i + 2] = this.pool[4 * (this.end - 1) + 2];
                        this.pool[4 * i + 3] = this.pool[4 * (this.end - 1) + 3];
                        this.end--;
                        i--;
                    }
                }
            };
            BulletPool.prototype.render = function (elapsedTime, ctx) {
                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = "red";
                for (var i = 0; i < this.end; i++) {
                    ctx.moveTo(this.pool[4 * i], this.pool[4 * i + 1]);
                    ctx.arc(this.pool[4 * i], this.pool[4 * i + 1], 2, 0, 2 * Math.PI);
                }
                ctx.fill();
                ctx.restore();
            };
        }
    }
});
System.register("vector", [], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var Vector;
    return {
        setters:[],
        execute: function() {
            Vector = class Vector {
                static scale(a, scale) {
                    return { x: a.x * scale, y: a.y * scale };
                }
                static add(a, b) {
                    return { x: a.x + b.x, y: a.y + b.y };
                }
                static subtract(a, b) {
                    return { x: a.x - b.x, y: a.y - b.y };
                }
                static rotate(a, angle) {
                    return {
                        x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
                        y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
                    };
                }
                static dotProduct(a, b) {
                    return a.x * b.x + a.y * b.y;
                }
                static magnitude(a) {
                    return Math.sqrt(a.x * a.x + a.y * a.y);
                }
                static normalize(a) {
                    var mag = Vector.magnitude(a);
                    return { x: a.x / mag, y: a.y / mag };
                }
            };
            exports_9("Vector", Vector);
        }
    }
});
System.register("app", ["common/drawable", "common/mediaManager", "common/actor", "common/game", "common/input", "bullet_pool", "vector"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var drawable_2, mediaManager_1, actor_1, game_1, input_1, bullet_pool_1, vector_1;
    var controller, mediaManager, cloudSprites, shipSprite, Explosion, BackdropScene, PlayerShip, Hud, AlienShip, SSGame;
    return {
        setters:[
            function (drawable_2_1) {
                drawable_2 = drawable_2_1;
            },
            function (mediaManager_1_1) {
                mediaManager_1 = mediaManager_1_1;
            },
            function (actor_1_1) {
                actor_1 = actor_1_1;
            },
            function (game_1_1) {
                game_1 = game_1_1;
            },
            function (input_1_1) {
                input_1 = input_1_1;
            },
            function (bullet_pool_1_1) {
                bullet_pool_1 = bullet_pool_1_1;
            },
            function (vector_1_1) {
                vector_1 = vector_1_1;
            }],
        execute: function() {
            controller = new input_1.Controller();
            controller.attach();
            mediaManager = new mediaManager_1.MediaManager();
            cloudSprites = [
                mediaManager.fetchSprite('./assets/cloud.png'),
                mediaManager.fetchSprite('./assets/cloud2.png'),
                mediaManager.fetchSprite('./assets/sun1.png'),
            ];
            shipSprite = mediaManager.fetchSprite('./assets/ship.png');
            Explosion = class Explosion extends drawable_2.Drawable {
                constructor(color, position) {
                    super();
                    this.color = color;
                    this.particles = [];
                }
                *baseRenderState() {
                    for (let i = 0; i < 20; i++) {
                        this.particles.push({
                            x: 200,
                            y: 200,
                            vx: Math.cos(i) * 2 + Math.random(),
                            vy: Math.sin(i) * 2 + Math.random() });
                    }
                    while (true) {
                        let { dt, ctx } = yield null;
                        ctx.fillStyle = this.color;
                        for (let p of this.particles) {
                            if (p.vy < 6) {
                                p.vy += .05;
                            }
                            if (p.vx < 0) {
                                p.vx += .01;
                            }
                            else if (p.vx > 0) {
                                p.vx -= .01;
                            }
                            ctx.fillRect(p.x += p.vx, p.y += p.vy, 2, 2);
                        }
                    }
                }
            };
            BackdropScene = class BackdropScene extends drawable_2.Drawable {
                constructor(width, height) {
                    super();
                    this.width = width;
                    this.height = height;
                }
                *baseRenderState() {
                    let clouds = [];
                    let cities = [];
                    while (true) {
                        let { dt, ctx } = yield null;
                        clouds = clouds.filter((cloud) => cloud.y < this.height + 200);
                        cities = cities.filter((cloud) => cloud.y < this.height + 200);
                        ctx.fillStyle = 'black';
                        ctx.fillRect(0, 0, this.width, this.height);
                        for (let city of cities) {
                            city.y += dt / 6;
                            city.sprite.draw(ctx, city.x, city.y, city.scale, city.scale);
                        }
                        ctx.fillStyle = 'rgba(0, 0, 0, .5)';
                        ctx.fillRect(0, 0, this.width, this.height);
                        for (let cloud of clouds) {
                            cloud.y += dt / 3;
                            cloud.sprite.draw(ctx, cloud.x, cloud.y, cloud.scale, cloud.scale);
                        }
                        ctx.fillStyle = 'rgba(0, 0, 0, .7)';
                        ctx.fillRect(0, 0, this.width, this.height);
                        if (Math.random() > .9) {
                            clouds.push({
                                sprite: cloudSprites[(cloudSprites.length * Math.random()) | 0],
                                x: -200 + (this.width + 400) * Math.random(),
                                y: -400,
                                scale: .2
                            });
                        }
                        if (Math.random() > .9) {
                            cities.push({
                                sprite: cloudSprites[(cloudSprites.length * Math.random()) | 0],
                                x: -200 + (this.width + 400) * Math.random(),
                                y: -400,
                                scale: -.2
                            });
                        }
                    }
                }
                *baseControlState() { }
            };
            PlayerShip = class PlayerShip extends actor_1.Actor {
                constructor(world) {
                    super(world);
                    this.last_bullet = 0;
                    this.bullet_pool = new bullet_pool_1.BulletPool(1000);
                    this.health = 1;
                    this.width = shipSprite.width / 10;
                    this.height = shipSprite.height / 10;
                }
                *baseRenderState() {
                    while (true) {
                        let { dt, ctx } = yield null;
                        shipSprite.draw(ctx, this.x, this.y, .1, .1);
                        this.bullet_pool.render(dt, ctx);
                    }
                }
                *baseControlState() {
                    const mod = 1 / 3;
                    while (true) {
                        let { dt } = yield null;
                        if (controller.input.up) {
                            this.y -= dt * mod;
                        }
                        else if (controller.input.down) {
                            this.y += dt * mod;
                        }
                        if (controller.input.right) {
                            this.x += dt * mod;
                        }
                        else if (controller.input.left) {
                            this.x -= dt * mod;
                        }
                        this.y = Math.max(0, Math.min(this.world.height - this.height, this.y));
                        this.x = Math.max(0, Math.min(this.world.width - this.width, this.x));
                        if (controller.input.space) {
                            this.fire();
                        }
                        this.bullet_pool.update(dt, ({ x, y }) => y < 0);
                    }
                }
                fire() {
                    if (this.last_bullet < performance.now() - 40) {
                        this.bullet_pool.add({ x: this.x + this.width / 2, y: this.y }, { x: 0, y: -3 });
                        this.last_bullet = performance.now();
                    }
                }
            };
            Hud = class Hud extends drawable_2.Drawable {
                constructor(player, width, height) {
                    super();
                    this.player = player;
                    this.height = height;
                    this.padding = 8;
                }
                *baseRenderState() {
                    while (true) {
                        let { dt, ctx } = yield null;
                        let height = this.height - (this.padding * 2);
                        ctx.fillStyle = 'grey';
                        ctx.fillRect(this.padding, this.padding, 8, height);
                        ctx.fillStyle = 'red';
                        let missingLife = height - height * this.player.health;
                        ctx.fillRect(this.padding, this.padding + missingLife, 8, height - missingLife);
                    }
                }
            };
            AlienShip = class AlienShip extends actor_1.Actor {
                constructor(world) {
                    super(world);
                    this.clockwise = -1;
                    this.arcpos = 0;
                    this.radius = 60;
                    this.x = 200;
                    this.y = 200;
                }
                *baseRenderState() {
                    const size = 14;
                    while (true) {
                        let { dt, ctx } = yield null;
                        ctx.fillStyle = 'green';
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, size, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                }
                *baseControlState() {
                    let rate = 32;
                    while (true) {
                        let { dt } = yield null;
                        this.arcpos += this.clockwise * 1 / rate;
                        let p = this.arcpos;
                        let vec = {
                            x: Math.sin(p),
                            y: Math.cos(p)
                        };
                        vec = vector_1.Vector.normalize(vec);
                        vec = vector_1.Vector.scale(vec, 1 / rate);
                        if (Math.abs(this.arcpos) > Math.PI * 2 * Math.random() && Math.random() > .8) {
                            this.clockwise *= -1;
                        }
                        this.x = vec.x * this.radius + this.x;
                        this.y = vec.y * this.radius + this.y;
                        if (this.world.out_of_bounds(this)) {
                            this.collect = () => true;
                        }
                    }
                }
            };
            SSGame = class SSGame extends game_1.Game {
                constructor() {
                    super();
                    this.width = 1200;
                    this.height = 800;
                    this.player = new PlayerShip(this);
                    this.player.x = this.width / 2;
                    this.player.y = this.height - 200;
                    this.enemies = [new AlienShip(this)];
                }
                *baseRenderState() {
                    let backdrop = new BackdropScene(this.width, this.height);
                    let hud = new Hud(this.player, this.width, this.height);
                    let explosion = new Explosion('red', { x: 20, y: 20 });
                    while (true) {
                        let { dt, ctx } = yield null;
                        backdrop.render(dt, ctx);
                        explosion.render(dt, ctx);
                        this.player.render(dt, ctx);
                        hud.render(dt, ctx);
                        for (let enemy of this.enemies) {
                            enemy.render(dt, ctx);
                        }
                    }
                }
                *baseControlState() {
                    while (true) {
                        let { dt } = yield null;
                        this.player.update(dt);
                        this.enemies = this.enemies.filter((e) => !e.collect());
                        for (let enemy of this.enemies) {
                            enemy.update(dt);
                        }
                    }
                }
                out_of_bounds({ x, y }) {
                    return x < 0 || y < 0 || x >= this.width || y >= this.height;
                }
            };
            mediaManager.loaded().then(() => {
                let game = new SSGame();
                game.install('#game-window');
                game.start();
            });
        }
    }
});
System.register("game", [], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    function Game(screen, updateFunction, renderFunction) {
        this.update = updateFunction;
        this.render = renderFunction;
        this.frontBuffer = screen;
        this.frontCtx = screen.getContext('2d');
        this.backBuffer = document.createElement('canvas');
        this.backBuffer.width = screen.width;
        this.backBuffer.height = screen.height;
        this.backCtx = this.backBuffer.getContext('2d');
        this.oldTime = performance.now();
        this.paused = false;
    }
    exports_11("Game", Game);
    return {
        setters:[],
        execute: function() {
            Game.prototype.pause = function (flag) {
                this.paused = (flag == true);
            };
            Game.prototype.loop = function (newTime) {
                var game = this;
                var elapsedTime = newTime - this.oldTime;
                this.oldTime = newTime;
                if (!this.paused)
                    this.update(elapsedTime);
                this.render(elapsedTime, this.frontCtx);
                this.frontCtx.drawImage(this.backBuffer, 0, 0);
            };
        }
    }
});
System.register("camera", ["vector"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var vector_2;
    function Camera(screen) {
        this.x = 0;
        this.y = 0;
        this.width = screen.width;
        this.height = screen.height;
    }
    exports_12("Camera", Camera);
    return {
        setters:[
            function (vector_2_1) {
                vector_2 = vector_2_1;
            }],
        execute: function() {
            Camera.prototype.update = function (target) {
            };
            Camera.prototype.onScreen = function (target) {
                return (target.x > this.x &&
                    target.x < this.x + this.width &&
                    target.y > this.y &&
                    target.y < this.y + this.height);
            };
            Camera.prototype.toScreenCoordinates = function (worldCoordinates) {
                return vector_2.Vector.subtract(worldCoordinates, this);
            };
            Camera.prototype.toWorldCoordinates = function (screenCoordinates) {
                return vector_2.Vector.add(screenCoordinates, this);
            };
        }
    }
});
System.register("missile", [], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var Missile;
    return {
        setters:[],
        execute: function() {
            Missile = class Missile {
                constructor(position) {
                }
            };
            exports_13("Missile", Missile);
        }
    }
});
System.register("player", ["vector", "missile"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var vector_3, missile_1;
    var PLAYER_SPEED, BULLET_SPEED;
    function Player(bullets, missiles) {
        this.missiles = missiles;
        this.missileCount = 4;
        this.bullets = bullets;
        this.angle = 0;
        this.position = { x: 200, y: 200 };
        this.velocity = { x: 0, y: 0 };
        this.img = new Image();
        this.img.src = 'assets/tyrian.shp.007D3C.png';
    }
    exports_14("Player", Player);
    return {
        setters:[
            function (vector_3_1) {
                vector_3 = vector_3_1;
            },
            function (missile_1_1) {
                missile_1 = missile_1_1;
            }],
        execute: function() {
            PLAYER_SPEED = 5;
            BULLET_SPEED = 10;
            Player.prototype.update = function (elapsedTime, input) {
                this.velocity.x = 0;
                if (input.left)
                    this.velocity.x -= PLAYER_SPEED;
                if (input.right)
                    this.velocity.x += PLAYER_SPEED;
                this.velocity.y = 0;
                if (input.up)
                    this.velocity.y -= PLAYER_SPEED / 2;
                if (input.down)
                    this.velocity.y += PLAYER_SPEED / 2;
                this.angle = 0;
                if (this.velocity.x < 0)
                    this.angle = -1;
                if (this.velocity.x > 0)
                    this.angle = 1;
                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
                if (this.position.x < 0)
                    this.position.x = 0;
                if (this.position.x > 1024)
                    this.position.x = 1024;
                if (this.position.y > 786)
                    this.position.y = 786;
            };
            Player.prototype.render = function (elapasedTime, ctx) {
                var offset = this.angle * 23;
                ctx.save();
                ctx.translate(this.position.x, this.position.y);
                ctx.drawImage(this.img, 48 + offset, 57, 23, 27, -12.5, -12, 23, 27);
                ctx.restore();
            };
            Player.prototype.fireBullet = function (direction) {
                var position = vector_3.Vector.add(this.position, { x: 30, y: 30 });
                var velocity = vector_3.Vector.scale(vector_3.Vector.normalize(direction), BULLET_SPEED);
                this.bullets.add(position, velocity);
            };
            Player.prototype.fireMissile = function () {
                if (this.missileCount > 0) {
                    var position = vector_3.Vector.add(this.position, { x: 0, y: 30 });
                    var missile = new missile_1.Missile(position);
                    this.missiles.push(missile);
                    this.missileCount--;
                }
            };
        }
    }
});
System.register("app_", ["game", "camera", "player", "bullet_pool"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var game_2, camera_1, player_1, bullet_pool_2;
    var canvas, game, input, camera, bullets, missiles, player, masterLoop;
    function update(elapsedTime) {
        player.update(elapsedTime, input);
        camera.update(player.position);
        bullets.update(elapsedTime, function (bullet) {
            if (!camera.onScreen(bullet))
                return true;
            return false;
        });
        var markedForRemoval = [];
        missiles.forEach(function (missile, i) {
            missile.update(elapsedTime);
            if (Math.abs(missile.position.x - camera.x) > camera.width * 2)
                markedForRemoval.unshift(i);
        });
        markedForRemoval.forEach(function (index) {
            missiles.splice(index, 1);
        });
    }
    function render(elapsedTime, ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 1024, 786);
        ctx.save();
        ctx.translate(-camera.x, -camera.y);
        renderWorld(elapsedTime, ctx);
        ctx.restore();
        renderGUI(elapsedTime, ctx);
    }
    function renderWorld(elapsedTime, ctx) {
        bullets.render(elapsedTime, ctx);
        missiles.forEach(function (missile) {
            missile.render(elapsedTime, ctx);
        });
        player.render(elapsedTime, ctx);
    }
    function renderGUI(elapsedTime, ctx) {
    }
    return {
        setters:[
            function (game_2_1) {
                game_2 = game_2_1;
            },
            function (camera_1_1) {
                camera_1 = camera_1_1;
            },
            function (player_1_1) {
                player_1 = player_1_1;
            },
            function (bullet_pool_2_1) {
                bullet_pool_2 = bullet_pool_2_1;
            }],
        execute: function() {
            canvas = document.getElementById('screen');
            game = new game_2.Game(canvas, update, render);
            input = {
                up: false,
                down: false,
                left: false,
                right: false
            };
            camera = new camera_1.Camera(canvas);
            bullets = new bullet_pool_2.BulletPool(10);
            missiles = [];
            player = new player_1.Player(bullets, missiles);
            window.onkeydown = function (event) {
                switch (event.key) {
                    case "ArrowUp":
                    case "w":
                        input.up = true;
                        event.preventDefault();
                        break;
                    case "ArrowDown":
                    case "s":
                        input.down = true;
                        event.preventDefault();
                        break;
                    case "ArrowLeft":
                    case "a":
                        input.left = true;
                        event.preventDefault();
                        break;
                    case "ArrowRight":
                    case "d":
                        input.right = true;
                        event.preventDefault();
                        break;
                }
            };
            window.onkeyup = function (event) {
                switch (event.key) {
                    case "ArrowUp":
                    case "w":
                        input.up = false;
                        event.preventDefault();
                        break;
                    case "ArrowDown":
                    case "s":
                        input.down = false;
                        event.preventDefault();
                        break;
                    case "ArrowLeft":
                    case "a":
                        input.left = false;
                        event.preventDefault();
                        break;
                    case "ArrowRight":
                    case "d":
                        input.right = false;
                        event.preventDefault();
                        break;
                }
            };
            masterLoop = function (timestamp) {
                game.loop(timestamp);
                window.requestAnimationFrame(masterLoop);
            };
            masterLoop(performance.now());
            console.log('asdf');
        }
    }
});
System.register("smoke_particles", [], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    function SmokeParticles(maxSize) {
        this.pool = new Float32Array(3 * maxSize);
        this.start = 0;
        this.end = 0;
        this.wrapped = false;
        this.max = maxSize;
    }
    exports_16("SmokeParticles", SmokeParticles);
    return {
        setters:[],
        execute: function() {
            SmokeParticles.prototype.emit = function (position) {
                if (this.end != this.max) {
                    this.pool[3 * this.end] = position.x;
                    this.pool[3 * this.end + 1] = position.y;
                    this.pool[3 * this.end + 2] = 0.0;
                    this.end++;
                }
                else {
                    this.pool[3] = position.x;
                    this.pool[4] = position.y;
                    this.pool[5] = 0.0;
                    this.end = 1;
                }
            };
            SmokeParticles.prototype.update = function (elapsedTime) {
                function updateParticle(i) {
                    this.pool[3 * i + 2] += elapsedTime;
                    if (this.pool[3 * i + 2] > 2000)
                        this.start = i;
                }
                var i;
                if (this.wrapped) {
                    for (i = 0; i < this.end; i++) {
                        updateParticle.call(this, i);
                    }
                    for (i = this.start; i < this.max; i++) {
                        updateParticle.call(this, i);
                    }
                }
                else {
                    for (i = this.start; i < this.end; i++) {
                        updateParticle.call(this, i);
                    }
                }
            };
            SmokeParticles.prototype.render = function (elapsedTime, ctx) {
                function renderParticle(i) {
                    var alpha = 1 - (this.pool[3 * i + 2] / 1000);
                    var radius = 0.1 * this.pool[3 * i + 2];
                    if (radius > 5)
                        radius = 5;
                    ctx.beginPath();
                    ctx.arc(this.pool[3 * i], this.pool[3 * i + 1], radius, 0, 2 * Math.PI);
                    ctx.fillStyle = 'rgba(160, 160, 160,' + alpha + ')';
                    ctx.fill();
                }
                var i;
                if (this.wrapped) {
                    for (i = 0; i < this.end; i++) {
                        renderParticle.call(this, i);
                    }
                    for (i = this.start; i < this.max; i++) {
                        renderParticle.call(this, i);
                    }
                }
                else {
                    for (i = this.start; i < this.end; i++) {
                        renderParticle.call(this, i);
                    }
                }
            };
        }
    }
});
