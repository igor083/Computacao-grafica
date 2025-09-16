const canvas = document.getElementById("tela");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

ctx.fillStyle = "#000";

function getOrigin() {
  return {
    cx: Math.floor(canvas.width / 2),
    cy: Math.floor(canvas.height / 2),
  };
}

function worldToCanvas(x, y) {
  const { cx, cy } = getOrigin();
  return { X: cx + Math.round(x), Y: cy - Math.round(y) };
}

function plotCanvas(X, Y) {
  if (X >= 0 && X < canvas.width && Y >= 0 && Y < canvas.height) {
    ctx.fillRect(X, Y, 1, 1);
  }
}
function plotWorld(x, y) {
  const { X, Y } = worldToCanvas(x, y);
  plotCanvas(X, Y);
}

function clearCanvas() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000";

  drawAxes();
}

function moveToWorld(x, y) {
  const { X, Y } = worldToCanvas(x, y);
  ctx.moveTo(X, Y);
}
function lineToWorld(x, y) {
  const { X, Y } = worldToCanvas(x, y);
  ctx.lineTo(X, Y);
}

function drawAxes() {
  const { cx, cy } = getOrigin();
  ctx.save();
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 1;
  ctx.beginPath();

  ctx.moveTo(0, cy);
  ctx.lineTo(canvas.width, cy);

  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, canvas.height);
  ctx.stroke();
  ctx.restore();
}

function simetriaCircWorld(xc, yc, x, y) {
  plotWorld(xc + x, yc + y);
  plotWorld(xc - x, yc + y);
  plotWorld(xc + x, yc - y);
  plotWorld(xc - x, yc - y);
  plotWorld(xc + y, yc + x);
  plotWorld(xc - y, yc + x);
  plotWorld(xc + y, yc - x);
  plotWorld(xc - y, yc - x);
}
