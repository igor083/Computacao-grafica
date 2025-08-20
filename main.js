// --- CONFIGURAÇÃO INICIAL ---
const screen_width = 720;
const screen_height = 480;
const canvasElement = document.querySelector("#screen");
const ctx = canvasElement.getContext("2d");
const windowCoords = { x_min: -500, x_max: 500, y_min: -500, y_max: 500 };

// NDC[-1,1]

function user_to_ndc_centered(x, y, win) {
  const ndc_x = -1 + (2 * (x - win.x_min)) / (win.x_max - win.x_min);
  const ndc_y = -1 + (2 * (y - win.y_min)) / (win.y_max - win.y_min);
  return { ndc_x, ndc_y };
}

function ndc_to_user_centered(ndc_x, ndc_y, win) {
  const x = win.x_min + ((ndc_x + 1) / 2) * (win.x_max - win.x_min);
  const y = win.y_min + ((ndc_y + 1) / 2) * (win.y_max - win.y_min);
  return { x, y };
}

function ndc_to_dc_centered(ndc_x, ndc_y, width, height) {
  const dcx = Math.round(((ndc_x + 1) / 2) * (width - 1));
  const dcy = Math.round((1 - (ndc_y + 1) / 2) * (height - 1));
  return { dcx, dcy };
}

function inp_to_ndc_centered(dcx, dcy, width, height) {
  const prop_x = dcx / (width - 1);
  const prop_y = 1 - dcy / (height - 1);
  const ndc_x = -1 + 2 * prop_x;
  const ndc_y = -1 + 2 * prop_y;
  return { ndc_x, ndc_y };
}

//NDC [0,50]

function user_to_ndc_50(x, y, win) {
  const ndc_x = (50 * (x - win.x_min)) / (win.x_max - win.x_min);
  const ndc_y = (50 * (y - win.y_min)) / (win.y_max - win.y_min);
  return { ndc_x, ndc_y };
}

function ndc_to_user_50(ndc_x, ndc_y, win) {
  const x = win.x_min + (ndc_x / 50) * (win.x_max - win.x_min);
  const y = win.y_min + (ndc_y / 50) * (win.y_max - win.y_min);
  return { x, y };
}

function ndc_to_dc_50(ndc_x, ndc_y, width, height) {
  const dcx = Math.round((ndc_x / 50) * (width - 1));
  const dcy = Math.round((1 - ndc_y / 50) * (height - 1));
  return { dcx, dcy };
}

function inp_to_ndc_50(dcx, dcy, width, height) {
  const prop_x = dcx / (width - 1);
  const prop_y = 1 - dcy / (height - 1);
  const ndc_x = 50 * prop_x;
  const ndc_y = 50 * prop_y;
  return { ndc_x, ndc_y };
}

// CANVAS

function drawPixel(point) {
  const size = 1;
  const drawX = point.x - size / 2;
  const drawY = point.y - size / 2;
  ctx.fillStyle = "blue";
  ctx.fillRect(drawX, drawY, size, size);
}

function initializeCanvas() {
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, screen_width, screen_height);
  ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(screen_width / 2, 0);
  ctx.lineTo(screen_width / 2, screen_height);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, screen_height / 2);
  ctx.lineTo(screen_width, screen_height / 2);
  ctx.stroke();
}

// --- LÓGICA PRINCIPAL E EVENTOS ---

function handlePlot() {
  const selectedNdcSystem = document.querySelector(
    'input[name="ndc_system"]:checked'
  ).value;

  const user_x = Number(document.querySelector("#x").value);
  const user_y = Number(document.querySelector("#y").value);

  let ndc, dc, reverted_user;
  if (selectedNdcSystem === "centered") {
    ndc = user_to_ndc_centered(user_x, user_y, windowCoords);
    dc = ndc_to_dc_centered(ndc.ndc_x, ndc.ndc_y, screen_width, screen_height);
    reverted_user = ndc_to_user_centered(ndc.ndc_x, ndc.ndc_y, windowCoords);
  } else {
    ndc = user_to_ndc_50(user_x, user_y, windowCoords);
    dc = ndc_to_dc_50(ndc.ndc_x, ndc.ndc_y, screen_width, screen_height);
    reverted_user = ndc_to_user_50(ndc.ndc_x, ndc.ndc_y, windowCoords);
  }

  // ATUALIZA O PAINEL DE INFORMAÇÃO
  document.querySelector("#display-x").innerHTML = user_x;
  document.querySelector("#display-y").innerHTML = user_y;
  document.querySelector(
    "#user_to_ndc_display"
  ).innerHTML = `(${ndc.ndc_x.toFixed(3)}, ${ndc.ndc_y.toFixed(3)})`;
  document.querySelector(
    "#ndc_to_dc_display"
  ).innerHTML = `(${dc.dcx}, ${dc.dcy})`;
  document.querySelector(
    "#ndc_to_user_display"
  ).innerHTML = `(${reverted_user.x.toFixed(2)}, ${reverted_user.y.toFixed(
    2
  )})`;

  initializeCanvas();
  drawPixel({ x: dc.dcx, y: dc.dcy });
}

// --- INICIALIZAÇÃO ---
document.querySelector("#update-cord").addEventListener("click", handlePlot);

document.querySelectorAll('input[name="ndc_system"]').forEach((radio) => {
  radio.addEventListener("change", handlePlot);
});

initializeCanvas();
