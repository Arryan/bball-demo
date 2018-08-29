/**
 * This source requires Phaser 2.6.2
 */

var game = new Phaser.Game(600, 400, Phaser.AUTO, "", {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  game.load.baseUrl = "./";
  game.load.crossOrigin = "anonymous";
  game.load.image("ball", "ball.png");
  game.load.image("hoop", "hoop.png");
  game.load.image("hoopoverlay", "hoopoverlay.png");
  game.load.image("blank", "platform.png");
}

var ball;
var dragPosition;
var dragging;
const [startX, startY] = [150, 200];
var line;
var graphics;
var space;
var hoopHitmark;
var text;
var hoopGraphic, hoopOverlay;
var hoopLeft, hoopRight, hoopHitmark;

function create() {
  game.stage.backgroundColor = 0xe8e8e8;
  game.physics.startSystem(Phaser.Physics.ARCADE);
  hoopGraphic = game.add.sprite(game.world.width - 185, 50, "hoop");
  ball = game.add.sprite(startX, startY, "ball", null /* frame */);
  hoopOverlay = game.add.sprite(game.world.width - 185, 50, "hoopoverlay");
  hoopHitmark = game.add.sprite(game.world.width - 140, 250, "blank");
  hoopLeft = game.add.sprite(game.world.width - 155, 175, "blank");
  hoopRight = game.add.sprite(game.world.width - 70, 175, "blank");
  hoopLeft.alpha = 0;
  hoopRight.alpha = 0;
  hoopHitmark.alpha = 0;

  game.physics.enable(ball, Phaser.Physics.ARCADE);
  game.physics.enable(hoopHitmark, Phaser.Physics.ARCADE);
  game.physics.enable(hoopLeft, Phaser.Physics.ARCADE);
  game.physics.enable(hoopRight, Phaser.Physics.ARCADE);

  hoopHitmark.body.immovable = true;
  hoopHitmark.body.checkCollision.up = true;
  hoopHitmark.body.checkCollision.left = false;
  hoopHitmark.body.checkCollision.right = false;
  hoopHitmark.body.checkCollision.down = false;
  hoopHitmark.scale.set(50 / hoopHitmark.width, 1 / hoopHitmark.width);

  hoopLeft.body.immovable = true;
  hoopRight.body.immovable = true;
  hoopLeft.scale.set(1 / hoopLeft.width, 60 / hoopLeft.height);
  hoopLeft.angle = -10;
  hoopRight.scale.set(1 / hoopRight.width, 60 / hoopRight.height);
  hoopRight.angle = 10;
  hoopGraphic.scale.set(200 / hoopGraphic.width, 200 / hoopGraphic.height);
  hoopOverlay.scale.set(200 / hoopOverlay.width, 200 / hoopOverlay.height);

  ball.anchor.setTo(0.5, 0.5);
  ball.scale.set(50 / ball.width, 50 / ball.height);
  ball.body.collideWorldBounds = true;
  ball.body.bounce.set(0.7);
  ball.body.drag.set(50, 0);

  ball.inputEnabled = true;
  ball.input.enableDrag();

  ball.events.onInputOver.add(onOver, this);
  ball.events.onInputOut.add(onOut, this);
  ball.events.onDragStart.add(onDragStart, this);
  ball.events.onDragStop.add(onDragStop, this);

  dragPosition = new Phaser.Point(ball.x, ball.y);
  draggin = false;

  graphics = game.add.graphics(0, 0);

  space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  dragging = false;

  resetGame("Pull back the ball");
}

function onOver(sprite, pointer) {
  sprite.tint = 0xff7777;
}

function onOut(sprite, pointer) {
  sprite.tint = 0xffffff;
}

function onDragStart(sprite, pointer) {
  if (text) text.destroy();
  dragging = true;
  dragPosition.set(sprite.x, sprite.y);
}

function onDragStop(sprite, pointer) {
  dragging = false;
  ball.inputEnabled = false;

  sprite.body.gravity.y = 800;
  sprite.body.velocity.set((startX - sprite.x) * 6, (startY - sprite.y) * 6);
  sprite.body.angularVelocity = 100;
}

function update() {
  graphics.destroy();
  game.physics.arcade.collide(ball, hoopHitmark, () => {
    if (!dragging) resetGame("You won 💪🍆💦");
  });
  game.physics.arcade.collide(ball, hoopLeft);
  game.physics.arcade.collide(ball, hoopRight);

  if (dragging) {
    dragPosition.set(ball.x, ball.y);
    graphics = game.add.graphics(0, 0);
    graphics.lineStyle(3, 0xee6124, 1);
    graphics.moveTo(startX, startY);
    graphics.lineTo(ball.x, ball.y);
    graphics.endFill();
  } else if (
    ball.body.gravity.y &&
    !dragging &&
    (space.isDown || Math.abs(ball.body.velocity.x) < 0.1)
  ) {
    resetGame("Loser 😂😂😂😂");
  }
  ball.body.angularVelocity = ball.body.velocity.x;
}

function resetGame(message = "") {
  ball.body.angularVelocity = 0;
  ball.inputEnabled = true;
  [ball.x, ball.y] = [startX, startY];
  ball.body.gravity.y = 0;
  ball.body.velocity.set(0, 0);
  if (text) text.destroy();
  text = game.add.text(
    game.world.width / 2 - 125,
    game.world.height - 100,
    message,
    { fontSize: "32px", fill: "#0472d5" }
  );
}
