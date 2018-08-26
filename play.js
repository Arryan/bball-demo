var mousedownID = -1; //Global ID of mouse down interval
const canvas = document.getElementById("canvas");
const [CANVAS_HEIGHT, CANVAS_WIDTH] = [400, 600];
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;

const BALL_RADIUS = 50;

const ctx = canvas.getContext("2d");

const ball = new Image();
ball.src = "ball.png";
const hoop = new Image();
hoop.src = "hoop.png";

// helpers
const dFromBottom = dist => CANVAS_HEIGHT - dist;
const dFromRight = dist => CANVAS_WIDTH - dist;
const setIntervalX = (callback, delay, repetitions) => {
  var x = 0;
  var intervalID = window.setInterval(function() {
    callback();

    if (++x === repetitions) {
      window.clearInterval(intervalID);
    }
  }, delay);
};

var ballForce = 0;
ball.onload = function() {
  init();
  renderBall(0, 0);

  window.onkeydown = window.onkeyup = handleInput;
};

function mousedown(event) {
  if (mousedownID == -1)
    //Prevent multimple loops!
    mousedownID = setInterval(whilemousedown, 100 /*execute every 100ms*/);
}
function mouseup(event) {
  if (mousedownID != -1) {
    //Only stop if exists
    clearInterval(mousedownID);
    mousedownID = -1;
    handleInput({
      code: "Space",
      type: "keyup"
    });
  }
}
function whilemousedown() {
  handleInput({
    code: "Space",
    type: "keydown",
    repeat: true
  });
}
//Assign events
canvas.addEventListener("mousedown", mousedown);
canvas.addEventListener("mouseup", mouseup);
canvas.addEventListener("mouseout", mouseup);

function handleInput(e) {
  if (e.code === "Space") {
    switch (e.type) {
      case "keydown":
        if (e.repeat) {
          ballForce++;
          renderTrajectory(ballForce);
        }
        break;

      case "keyup":
        renderShoot(ballForce * 2);
        ballForce = 0;
        break;

      default:
        break;
    }
  }
}

function renderShoot(f = 0, x = 0) {
  if (x > 66) {
    if (f > 70 && f < 90) alert("ball went in");
    return;
  }

  setTimeout(() => {
    init();
    let [a, h, k] = [0.2, 25, -125];
    renderBall((f / 8) * x, a * (x - h) ** 2 + k);
    renderShoot(f, ++x);
  }, 20);
}

/**
 * Erase previous ball and draw one at new position
 * @param {*} x
 * @param {*} y
 */
function renderBall(x, y) {
  ctx.drawImage(
    ball,
    2 * BALL_RADIUS + x,
    dFromBottom(200) + y,
    BALL_RADIUS,
    BALL_RADIUS
  );
  // ctx.fillStyle = "black";
  // ctx.beginPath();
  // ctx.arc(2 * BALL_RADIUS, dFromBottom(200), BALL_RADIUS, 0, Math.PI * 2);
  // ctx.stroke();
}

/**
 * Erase previous trajectory and draw new one
 * @param {*} f
 */
function renderTrajectory(f, clear = false) {
  // if (clear) console.log("clearing");
  // if (!clear) renderTrajectory(f - 1, true);
  ctx.strokeStyle = clear ? "white" : "white";
  init();
  renderBall(0, 0);
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 15]);
  f **= 1.6;

  ctx.beginPath();
  ctx.moveTo(BALL_RADIUS * 2 + 25, dFromBottom(BALL_RADIUS * 4));
  ctx.quadraticCurveTo(
    BALL_RADIUS * 2 + 70 + f / 2,
    dFromBottom(BALL_RADIUS * 4 + 190),
    BALL_RADIUS * 2 + 70 + f,
    dFromBottom(BALL_RADIUS + 220)
  );
  ctx.stroke();
}

/**
 * render initial canvas
 */
function init() {
  ctx.fillStyle = "rgb(20,20,20)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.drawImage(
    hoop,
    dFromRight(BALL_RADIUS * 2),
    dFromBottom(200 + BALL_RADIUS),
    BALL_RADIUS * 1.5,
    BALL_RADIUS
  );
}
