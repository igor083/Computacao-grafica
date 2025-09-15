// Multiplicação de ponto por matriz homogênea 3x3
// Considera ponto como coluna [x, y, 1]^T e aplica: res = M * ponto
function multiplicarMatriz(ponto, matriz) {
  let [x, y, w] = ponto;
  let res = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    res[i] = matriz[i][0] * x + matriz[i][1] * y + matriz[i][2] * w;
  }
  return res;
}
