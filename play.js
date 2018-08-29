/**
 * Generated from the Phaser Sandbox
 *
 * //phaser.io/sandbox/gBewUZoP
 *
 * This source requires Phaser 2.6.2
 */

var game = new Phaser.Game(600, 400, Phaser.AUTO, "", {
  preload: preload,
  create: create,
  update: update,
  render: render
});

function preload() {
  game.load.baseUrl = "arry.xyz/bball-demo/";
  game.load.crossOrigin = "anonymous";
  game.load.image("ball", "ball.png");
  game.load.image("zone", "sprites/platform.png");
}

var card;
var dropZone;
var dragPosition;
var dragging;
const [startX, startY] = [150, 200];
var line;
var graphics;
var space;
var board;
var text;

function create() {
  game.stage.backgroundColor = 0xe8e8e8;
  game.physics.startSystem(Phaser.Physics.ARCADE);
  card = game.add.sprite(startX, startY, "eye", null /* frame */);
  board = game.add.sprite(game.world.width - 100, 200, "zone");
  board.alpha = 0;
  net1 = game.add.sprite(game.world.width - 100, 125, "zone");
  net2 = game.add.sprite(game.world.width - 25, 125, "zone");

  game.physics.enable(card, Phaser.Physics.ARCADE);
  game.physics.enable(board, Phaser.Physics.ARCADE);
  game.physics.enable(net1, Phaser.Physics.ARCADE);
  game.physics.enable(net2, Phaser.Physics.ARCADE);

  board.body.immovable = true;
  board.body.checkCollision.up = true;
  board.body.checkCollision.left = false;
  board.body.checkCollision.right = false;
  board.body.checkCollision.down = false;

  net1.body.immovable = true;
  net2.body.immovable = true;
  net1.scale.set(5 / net1.width, 50 / net1.height);
  net2.scale.set(5 / net2.width, 50 / net2.height);

  card.anchor.setTo(0.5, 0.5);
  card.scale.set(50 / card.width, 50 / card.height);
  card.body.collideWorldBounds = true;
  card.body.bounce.set(0.7);
  card.body.drag.set(50, 0);

  card.inputEnabled = true;
  card.input.enableDrag();

  card.events.onInputOver.add(onOver, this);
  card.events.onInputOut.add(onOut, this);
  card.events.onDragStart.add(onDragStart, this);
  card.events.onDragStop.add(onDragStop, this);

  dragPosition = new Phaser.Point(card.x, card.y);
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
  card.inputEnabled = false;

  sprite.body.gravity.y = 800;
  sprite.body.velocity.set((startX - sprite.x) * 6, (startY - sprite.y) * 6);
  sprite.body.angularVelocity = 100;
}

function update() {
  graphics.destroy();
  game.physics.arcade.collide(card, board, () => resetGame("You won 💪🍆💦"));
  game.physics.arcade.collide(card, net1);
  game.physics.arcade.collide(card, net2);

  if (dragging) {
    dragPosition.set(card.x, card.y);
    graphics = game.add.graphics(0, 0);
    graphics.lineStyle(3, 0xee6124, 1);
    graphics.moveTo(startX, startY);
    graphics.lineTo(card.x, card.y);
    graphics.endFill();
  } else if (
    card.body.gravity.y &&
    !dragging &&
    (space.isDown || Math.abs(card.body.velocity.x) < 0.1)
  ) {
    resetGame("Loser 😂😂😂😂");
  }
  card.body.angularVelocity = card.body.velocity.x;
}

function resetGame(message = "") {
  card.body.angularVelocity = 0;
  card.inputEnabled = true;
  [card.x, card.y] = [startX, startY];
  card.body.gravity.y = 0;
  card.body.velocity.set(0, 0);
  if (text) text.destroy();
  text = game.add.text(
    game.world.width / 2 - 100,
    game.world.height / 2 - 16,
    message,
    { fontSize: "32px", fill: "#0472d5" }
  );
}

function render() {}
