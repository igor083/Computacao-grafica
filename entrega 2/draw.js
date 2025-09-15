function retaDDA(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let steps = Math.max(Math.abs(dx), Math.abs(dy));
  let xInc = dx / steps;
  let yInc = dy / steps;

  let x = x1,
    y = y1;
  for (let i = 0; i <= steps; i++) {
    plotWorld(x, y);
    x += xInc;
    y += yInc;
  }
}

function retaPontoMedio(x1, y1, x2, y2) {
  let dx = Math.abs(x2 - x1);
  let dy = Math.abs(y2 - y1);
  let sx = x1 < x2 ? 1 : -1;
  let sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    plotWorld(x1, y1);
    if (x1 === x2 && y1 === y2) break;
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
  }
}

/* Circunferências*/

function circPontoMedio(xc, yc, r) {
  let x = 0,
    y = r;
  let d = 1 - r;
  while (x <= y) {
    simetriaCircWorld(xc, yc, x, y);
    if (d < 0) d += 2 * x + 3;
    else {
      d += 2 * (x - y) + 5;
      y--;
    }
    x++;
  }
}

function circPolinomial(xc, yc, r) {
  for (let x = -r; x <= r; x++) {
    let y = Math.round(Math.sqrt(r * r - x * x));
    plotWorld(xc + x, yc + y);
    plotWorld(xc + x, yc - y);
  }
}

function circTrigonometrico(xc, yc, r) {
  for (let t = 0; t < 2 * Math.PI; t += 0.01) {
    let x = xc + r * Math.cos(t);
    let y = yc + r * Math.sin(t);
    plotWorld(x, y);
  }
}
