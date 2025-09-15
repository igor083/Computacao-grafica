const canvas = document.getElementById("tela");
const ctx = canvas.getContext("2d"); // alpha=true → respeita CSS background
ctx.imageSmoothingEnabled = false;

// cor padrão dos pixels (preto)
ctx.fillStyle = "#000";

/* ---------- Conversão de coordenadas ---------- */
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

/* ---------- Plot ---------- */
function plotCanvas(X, Y) {
  if (X >= 0 && X < canvas.width && Y >= 0 && Y < canvas.height) {
    ctx.fillRect(X, Y, 1, 1);
  }
}
function plotWorld(x, y) {
  const { X, Y } = worldToCanvas(x, y);
  plotCanvas(X, Y);
}

/* ---------- Utilitários ---------- */
function clearCanvas() {
  // pinta fundo branco (independe de alpha)
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // volta cor dos pixels para preto
  ctx.fillStyle = "#000";

  // redesenha eixos
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

/* ---------- Eixos ---------- */
function drawAxes() {
  const { cx, cy } = getOrigin();
  ctx.save();
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 1;
  ctx.beginPath();
  // eixo X
  ctx.moveTo(0, cy);
  ctx.lineTo(canvas.width, cy);
  // eixo Y
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, canvas.height);
  ctx.stroke();
  ctx.restore();
}

/* ---------- Circunferência: simetria ---------- */
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
