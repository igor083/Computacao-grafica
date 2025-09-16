document.addEventListener("DOMContentLoaded", () => {
  const inputDiv = document.getElementById("inputs");
  const selectAlg = document.getElementById("algoritmo");

  let ultimoObjeto = null;

  function gerarInputs() {
    inputDiv.innerHTML = "";
    const alg = selectAlg.value;

    if (alg === "dda" || alg === "pontoMedioReta") {
      inputDiv.innerHTML = `
        <label>x1:</label><input type="number" id="x1" value="50" step="1">
        <label>y1:</label><input type="number" id="y1" value="50" step="1">
        <label>x2:</label><input type="number" id="x2" value="250" step="1">
        <label>y2:</label><input type="number" id="y2" value="200" step="1">
      `;
    } else {
      inputDiv.innerHTML = `
        <label>xc:</label><input type="number" id="xc" value="0" step="1">
        <label>yc:</label><input type="number" id="yc" value="0" step="1">
        <label>r:</label><input type="number" id="r" value="100" step="1" min="1">
      `;
    }
  }

  selectAlg.onchange = gerarInputs;
  gerarInputs();

  function desenharCena() {
    clearCanvas();

    const alg = selectAlg.value;

    if (alg === "dda" || alg === "pontoMedioReta") {
      const x1 = parseFloat(document.getElementById("x1").value);
      const y1 = parseFloat(document.getElementById("y1").value);
      const x2 = parseFloat(document.getElementById("x2").value);
      const y2 = parseFloat(document.getElementById("y2").value);

      if (alg === "dda") retaDDA(x1, y1, x2, y2);
      else retaPontoMedio(x1, y1, x2, y2);

      ultimoObjeto = {
        tipo: "reta",
        pontos: [
          [x1, y1],
          [x2, y2],
        ],
      };
    } else {
      const xc = parseFloat(document.getElementById("xc").value);
      const yc = parseFloat(document.getElementById("yc").value);
      const r = parseInt(document.getElementById("r").value, 10);

      if (alg === "circPontoMedio") circPontoMedio(xc, yc, r);
      else if (alg === "circPolinomial") circPolinomial(xc, yc, r);
      else if (alg === "circTrigonometrico") circTrigonometrico(xc, yc, r);

      ultimoObjeto = {
        tipo: "circunferencia",
        pontos: [[xc, yc, r]],
      };
    }
  }

  function aplicarTransformacao(tipo) {
    if (!ultimoObjeto) {
      alert("Desenhe algo primeiro!");
      return;
    }

    let m;

    if (tipo === "translacao") {
      let dx = parseFloat(document.getElementById("dx").value);
      let dy = parseFloat(document.getElementById("dy").value);
      m = [
        [1, 0, dx],
        [0, 1, dy],
        [0, 0, 1],
      ];
    } else if (tipo === "escala") {
      let sx = parseFloat(document.getElementById("sx").value);
      let sy = parseFloat(document.getElementById("sy").value);
      // Para escala correta, precisamos escalar a partir da origem
      m = [
        [sx, 0, 0],
        [0, sy, 0],
        [0, 0, 1],
      ];
    } else if (tipo === "rotacao") {
      let ang =
        (parseFloat(document.getElementById("angulo").value) * Math.PI) / 180;
      m = [
        [Math.cos(ang), -Math.sin(ang), 0],
        [Math.sin(ang), Math.cos(ang), 0],
        [0, 0, 1],
      ];
    }

    clearCanvas();

    if (ultimoObjeto.tipo === "reta") {
      let [p1, p2] = ultimoObjeto.pontos;

      let t1 = multiplicarMatriz([p1[0], p1[1], 1], m);
      let t2 = multiplicarMatriz([p2[0], p2[1], 1], m);

      retaPontoMedio(t1[0], t1[1], t2[0], t2[1]);

      ultimoObjeto = {
        tipo: "reta",
        pontos: [
          [t1[0], t1[1]],
          [t2[0], t2[1]],
        ],
      };
    } else if (ultimoObjeto.tipo === "circunferencia") {
      let [centro] = ultimoObjeto.pontos;
      let [xc, yc, r] = centro;

      let novoCentro = multiplicarMatriz([xc, yc, 1], m);

      let novoRaio = r;
      if (tipo === "escala") {
        let sx = parseFloat(document.getElementById("sx").value);
        let sy = parseFloat(document.getElementById("sy").value);
        novoRaio = (r * Math.sqrt(sx * sx + sy * sy)) / Math.sqrt(2);
      }

      circPontoMedio(novoCentro[0], novoCentro[1], novoRaio);

      ultimoObjeto = {
        tipo: "circunferencia",
        pontos: [[novoCentro[0], novoCentro[1], novoRaio]],
      };
    }
  }

  window.aplicarTransformacao = aplicarTransformacao;

  document.getElementById("desenhar").onclick = desenharCena;

  document.getElementById("limpar").onclick = () => {
    clearCanvas();
    ultimoObjeto = null;
  };

  document.getElementById("redimensionar").onclick = () => {
    const largura = parseInt(document.getElementById("largura").value, 10);
    const altura = parseInt(document.getElementById("altura").value, 10);
    canvas.width = largura;
    canvas.height = altura;
    ultimoObjeto = null;
    clearCanvas();
  };

  clearCanvas();
});
