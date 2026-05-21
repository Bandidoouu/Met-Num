
const TOLERANCE = 0.001;

// ── Información de cada método ──────────────────────────────
const METHOD_INFO = {
  interpolacion_lineal: {
    label: "Interpolación Lineal",
    formula: "g(x) = f(b) − f(a) / (b − a) · (x − a) + f(a)",
    intermediateLabel: "b − a"
  },
  newton_adelante: {
    label: "Newton hacia Adelante",
    formula: "g(x) = yᵢ + Δ'f(xᵢ)·S + Δ²f(xᵢ)·S(S−1)/2! + …",
    intermediateLabel: "S = (x − xᵢ) / h"
  },
  newton_atras: {
    label: "Newton hacia Atrás",
    formula: "g(x) = yᵢ + ∇'f(xᵢ)·S + ∇²f(xᵢ)·S(S+1)/2! + …",
    intermediateLabel: "S = (x − xᵢ) / h"
  },
  lagrange: {
    label: "Lagrange",
    formula: "g(x) = Σ yᵢ · Π (x − xⱼ) / (xᵢ − xⱼ)",
    intermediateLabel: "L₀(x) — primer término base evaluado en x"
  },
  biseccion: {
    label: "Bisectriz",
    formula: "x = (a + b) / 2",
    intermediateLabel: "x = (a + b) / 2  (1ª iteración)"
  },
  falsa_posicion: {
    label: "Falsa Posición",
    formula: "x = a − f(a)·(b−a) / (f(b)−f(a))",
    intermediateLabel: "x  (1ª iteración, Falsa Posición)"
  },
  newton_raphson: {
    label: "Newton – Raphson",
    formula: "xᵢ₊₁ = xᵢ − f(xᵢ) / f'(xᵢ)",
    intermediateLabel: "f'(xᵢ) — derivada evaluada en xᵢ"
  },
  secante: {
    label: "Secante",
    formula: "Xᵢ₊₁ = xᵢ₊₁ − f(xᵢ₊₁)·(xᵢ₊₁ − xᵢ) / (f(xᵢ₊₁) − f(xᵢ))",
    intermediateLabel: "f(x₁) − f(x₀)  (diferencia de evaluaciones)"
  },
  trapecio: {
    label: "Regla Trapezoidal",
    formula: "I = h/2·[f(a) + 2Σf(a+ih) + f(b)]",
    intermediateLabel: "h = (b − a) / n"
  },
  simpson13: {
    label: "Regla de 1/3 de Simpson",
    formula: "I = h/3·[f(a) + 4Σf(a+ih)|impar + 2Σf(a+ih)|par + f(b)]  (n par)",
    intermediateLabel: "h = (b − a) / n"
  },
  simpson38: {
    label: "Regla de 3/8 de Simpson",
    formula: "I = 3h/8·[f(a) + 3Σf(a+ih) + f(b)]  (n múlt. de 3)",
    intermediateLabel: "h = (b − a) / n"
  },
  gauss_eliminacion: {
    label: "Eliminación Gaussiana",
    formula: "m₂₁ = a₂₁/a₁₁  →  triangulación superior",
    intermediateLabel: "m₂₁ = a₂₁ / a₁₁  (multiplicador 1ª columna)"
  },
  gauss_jordan: {
    label: "Gauss – Jordán",
    formula: "m₂₁ = a₂₁/a₁₁  →  reducción a identidad",
    intermediateLabel: "m₂₁ = a₂₁ / a₁₁  (multiplicador 1ª operación)"
  },
  gauss_seidel: {
    label: "Gauss – Seidel",
    formula: "xᵢ⁽ᵏ⁺¹⁾ = (bᵢ − Σ aᵢⱼxⱼ) / aᵢᵢ  (valores más recientes)",
    intermediateLabel: "x₁⁽¹⁾ — primera actualización de x₁"
  },
  euler: {
    label: "Euler hacia Adelante",
    formula: "yₙ₊₁ = yₙ + h·f(yₙ, tₙ)",
    intermediateLabel: "h·f(xₙ, yₙ) — incremento"
  },
  runge_kutta: {
    label: "Runge – Kutta 4to. Orden",
    formula: "yₙ₊₁ = yₙ + 1/6·(k₁ + 2k₂ + 2k₃ + k₄)",
    intermediateLabel: "k₁ = h · f(x₀, y₀)"
  },
  metodo_grafico: {
    label: "Método Gráfico",
    formula: "Tabular f(x) y observar cambio de signo entre xᵢ y xᵢ₊₁",
    intermediateLabel: "x donde inicia el cambio de signo"
  },
  punto_fijo: {
    label: "Punto Fijo ó Sustituciones Sucesivas",
    formula: "xᵢ₊₁ = g(xᵢ)",
    intermediateLabel: "x₁ — primera iteración"
  },
  newton_divididas: {
    label: "Newton con Diferencias Divididas",
    formula: "g(x) = D⁰ + D¹(x−x₁) + D²(x−x₁)(x−x₂) + …",
    intermediateLabel: "D¹ — primera diferencia dividida"
  },
  montante: {
    label: "Método de Montante",
    formula: "N.E. = (E.P.·E.A. − E.C.F.P.·E.C.C.P.) / P.A.",
    intermediateLabel: "Nuevo elemento — pivoteo sin divisiones"
  },
  jacobi: {
    label: "Jacobi",
    formula: "xᵢ⁽ᵏ⁺¹⁾ = (bᵢ − Σ aᵢⱼxⱼ⁽ᵏ⁾) / aᵢᵢ  (valores del paso anterior)",
    intermediateLabel: "x₁⁽¹⁾ — primera actualización de x₁"
  },
  newton_cotes_cerrada: {
    label: "Newton–Cotes Cerradas",
    formula: "I = α·h·Σ wᵢ·f(a + i·h),  h = (b−a)/n",
    intermediateLabel: "h = (b − a) / n"
  },
  minimos_cuadrados: {
    label: "Mínimos Cuadrados — Línea Recta",
    formula: "g(x) = a₀ + a₁·x",
    intermediateLabel: "a₁ — pendiente de la recta ajustada"
  },
  euler_atras: {
    label: "Euler hacia Atrás",
    formula: "yₙ₊₁ = yₙ + h·f(yₙ₊₁, tₙ₊₁)",
    intermediateLabel: "h·f(xₙ₊₁, yₙ₊₁) — incremento implícito"
  },
  euler_modificado: {
    label: "Euler Modificado",
    formula: "yₙ₊₁ = yₙ + h/2·[f(yₙ,tₙ) + f(yₙ₊₁*,tₙ₊₁)]",
    intermediateLabel: "predictor yₙ₊₁* (Euler simple)"
  },
  runge_kutta2: {
    label: "Runge – Kutta 2do. Orden",
    formula: "yₙ₊₁ = yₙ + ½(k₁ + k₂)",
    intermediateLabel: "k₁ = h · f(x₀, y₀)"
  },
  runge_kutta_sup: {
    label: "Runge – Kutta Orden Superior",
    formula: "yₙ₊₁ = yₙ + ½(k₁+k₂),  y'ₙ₊₁ = y'ₙ + ½(m₁+m₂)",
    intermediateLabel: "k₁ = h · y'₀"
  }
};

// ── Niveles ─────────────────────────────────────────────────
const LEVELS = [
  {
    id: 1,
    name: "Nivel 1 — Introducción",
    description: "Interpolación Lineal, Newton diferencias divididas. Identifica el método y calcula el parámetro de interpolación.",
    threshold: 8,
    maxPoints: 18,
    timeLimit: 1440,            // 24 min — 4 min/problema
    scoring: { method: 1, intermediate: 1, final: 1 },
    questions: []   // se llena abajo
  },
  {
    id: 2,
    name: "Nivel 2 — Aprendiz",
    description: "Raíces de ecuaciones: Bisección, Newton-Raphson y Falsa Posición. Los distractores son más cercanos.",
    threshold: 10,
    maxPoints: 22,
    timeLimit: 1800,            // 30 min — 5 min/problema
    scoring: { method: 1, intermediate: 1, final: 1 },
    questions: []
  },
  {
    id: 3,
    name: "Nivel 3 — Intermedio",
    description: "Integración numérica (Trapecio, Simpson 1/3 y 3/8) y sistemas de ecuaciones (Gauss-Seidel, Eliminación Gaussiana).",
    threshold: 15,
    maxPoints: 32,
    timeLimit: 2700,            // 45 min — ~6.5 min/problema
    scoring: { method: 1, intermediate: 2, final: 2 },
    questions: []
  },
  {
    id: 4,
    name: "Nivel 4 — Avanzado",
    description: "EDO (Euler, Runge-Kutta) e interpolación avanzada (Newton Adelante/Atrás, Lagrange). Contextos de ingeniería.",
    threshold: 20,
    maxPoints: 38,
    timeLimit: 3600,            // 60 min — 7.5 min/problema
    scoring: { method: 1, intermediate: 2, final: 2 },
    questions: []
  },
  {
    id: 5,
    name: "Nivel 5 — Experto",
    description: "Todos los métodos. Problemas multietapa de alta complejidad. Tu puntaje total determina la calificación final.",
    threshold: null,
    maxPoints: 164,
    timeLimit: 5400,            // 90 min — 9 min/problema
    scoring: { method: 2, intermediate: 3, final: 3 },
    questions: []
  }
];

// ============================================================
//  NIVEL 1 — 6 problemas (Interp. Lineal, Newton Adelante/Atrás, Dif. Divididas)
// ============================================================
LEVELS[0].questions = [
  {
    id: "1-1",
    statement: `
      <p>Se tienen únicamente <strong>2 puntos</strong> de datos:</p>
      <table class="data-table">
        <tr><th>x</th><th>f(x)</th></tr>
        <tr><td>1</td><td>2</td></tr>
        <tr><td>5</td><td>10</td></tr>
      </table>
      <p>Calcula el valor de <strong>x = 3</strong>.</p>`,
    correctMethod: "interpolacion_lineal",
    methodOptions: [
      "interpolacion_lineal",
      "newton_adelante",
      "newton_divididas",
      "lagrange"
    ],
    intermediateValue: 4,
    finalValue: 6,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Interpolación Lineal (solo 2 puntos — recta entre ellos).<br>
      b − a = 5 − 1 = <em>4</em>.<br>
      g(3) = f(b)−f(a)/(b−a)·(x−a)+f(a) = 2 + (10−2)/(5−1)·(3−1) = <em>6</em>.`
  },
  {
    id: "1-2",
    statement: `
      <p>Tabla de diferencias divididas con espaciado constante h = 1:</p>
      <table class="data-table">
        <tr><th>x</th><th>f(x)</th></tr>
        <tr><td>0</td><td>1</td></tr>
        <tr><td>1</td><td>3</td></tr>
        <tr><td>2</td><td>7</td></tr>
        <tr><td>3</td><td>13</td></tr>
      </table>
      <p>Calcula el valor de <strong>x = 0.5</strong>. El punto está cerca del <em>inicio</em> de la tabla.</p>`,
    correctMethod: "newton_adelante",
    methodOptions: [
      "interpolacion_lineal",
      "newton_adelante",
      "newton_atras",
      "newton_divididas"
    ],
    intermediateValue: 0.5,
    finalValue: 1.75,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Newton hacia Adelante (datos equidistantes, punto cerca del inicio).<br>
      Δ'f(x₀)=2, Δ²f(x₀)=2, Δ³f(x₀)=0.<br>
      <strong>S</strong> = (x−xᵢ)/h = (0.5−0)/1 = <em>0.5</em>.<br>
      g(0.5) = 1 + 0.5·2 + [0.5·(−0.5)/2]·2 = 1 + 1 − 0.25 = <em>1.75</em>.`
  },
  {
    id: "1-3",
    statement: `
      <p>Tabla de diferencias divididas con espaciado constante h = 1:</p>
      <table class="data-table">
        <tr><th>x</th><th>f(x)</th></tr>
        <tr><td>0</td><td>1</td></tr>
        <tr><td>1</td><td>3</td></tr>
        <tr><td>2</td><td>7</td></tr>
        <tr><td>3</td><td>13</td></tr>
      </table>
      <p>Calcula el valor de <strong>x = 2.5</strong>. El punto está cerca del <em>final</em> de la tabla.</p>`,
    correctMethod: "newton_atras",
    methodOptions: [
      "interpolacion_lineal",
      "newton_adelante",
      "newton_atras",
      "newton_divididas"
    ],
    intermediateValue: -0.5,
    finalValue: 9.75,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Newton hacia Atrás (datos equidistantes, punto cerca del final).<br>
      ∇'f(xᵢ)=6, ∇²f(xᵢ)=2, ∇³f(xᵢ)=0.<br>
      <strong>S</strong> = (x−xᵢ)/h = (2.5−3)/1 = <em>−0.5</em>.<br>
      g(2.5) = 13 + (−0.5)·6 + [(−0.5)·(0.5)/2]·2 = 13−3−0.25 = <em>9.75</em>.`
  },
  {
    id: "1-4",
    statement: `
      <p>Se tienen únicamente <strong>2 puntos</strong> de datos:</p>
      <table class="data-table">
        <tr><th>x</th><th>f(x)</th></tr>
        <tr><td>0</td><td>5</td></tr>
        <tr><td>2</td><td>9</td></tr>
      </table>
      <p>Calcula el valor de <strong>x = 1.5</strong>.</p>`,
    correctMethod: "interpolacion_lineal",
    methodOptions: [
      "interpolacion_lineal",
      "newton_adelante",
      "newton_divididas",
      "lagrange"
    ],
    intermediateValue: 2,
    finalValue: 8,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Interpolación Lineal (solo 2 puntos — recta entre ellos).<br>
      b − a = 2 − 0 = <em>2</em>.<br>
      g(1.5) = f(b)−f(a)/(b−a)·(x−a)+f(a) = 5 + [(9−5)/2]·1.5 = <em>8</em>.`
  },
  {
    id: "1-5",
    statement: `
      <p>Tabla de diferencias divididas con espaciado constante h = 1:</p>
      <table class="data-table">
        <tr><th>x</th><th>f(x)</th></tr>
        <tr><td>1</td><td>3</td></tr>
        <tr><td>2</td><td>7</td></tr>
        <tr><td>3</td><td>13</td></tr>
        <tr><td>4</td><td>21</td></tr>
      </table>
      <p>Calcula el valor de <strong>x = 1.5</strong>. El punto está cerca del <em>inicio</em> de la tabla.</p>`,
    correctMethod: "newton_adelante",
    methodOptions: [
      "interpolacion_lineal",
      "newton_adelante",
      "newton_atras",
      "newton_divididas"
    ],
    intermediateValue: 0.5,
    finalValue: 4.75,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Newton hacia Adelante (datos equidistantes, punto cerca del inicio).<br>
      Δ'f(x₀)=4, Δ²f(x₀)=2, Δ³f(x₀)=0.<br>
      S = (x−xᵢ)/h = (1.5−1)/1 = <em>0.5</em>.<br>
      g(1.5) = 3 + 0.5·4 + [0.5·(−0.5)/2]·2 = 3+2−0.25 = <em>4.75</em>.`
  },
  {
    id: "1-6",
    statement: `
      <p>Datos con <strong>espaciado irregular</strong> (no equidistante):</p>
      <table class="data-table">
        <tr><th>x</th><th>f(x)</th></tr>
        <tr><td>1</td><td>2</td></tr>
        <tr><td>2</td><td>5</td></tr>
        <tr><td>4</td><td>17</td></tr>
        <tr><td>6</td><td>37</td></tr>
      </table>
      <p>Construye la tabla de diferencias divididas y calcula el valor de <strong>x = 3</strong>.</p>`,
    correctMethod: "newton_divididas",
    methodOptions: [
      "interpolacion_lineal",
      "newton_adelante",
      "newton_divididas",
      "lagrange"
    ],
    intermediateValue: 3,
    finalValue: 10,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Newton con Diferencias Divididas (espaciado irregular — no se puede usar Newton Adelante/Atrás).<br>
      D⁰: 2, 5, 17, 37.<br>
      D¹: (5−2)/(2−1)=<em>3</em>; (17−5)/(4−2)=6; (37−17)/(6−4)=10.<br>
      D²: (6−3)/(4−1)=1; (10−6)/(6−2)=1. D³=0.<br>
      g(x) = 2 + 3(x−1) + 1·(x−1)(x−2).<br>
      g(3) = 2 + 3·(2) + 1·(2)·(1) = 2 + 6 + 2 = <em>10</em>.`
  }
];

// ============================================================
//  NIVEL 2 — 6 problemas (Bisección, Newton-Raphson, Falsa Posición)
// ============================================================
LEVELS[1].questions = [
  {
    id: "2-1",
    statement: `
      <p>Encuentra la raíz de <strong>f(x) = x² − 2</strong> en el intervalo <strong>[1, 2]</strong> usando <strong>3 iteraciones</strong>.</p>
      <p>Verifica el cambio de signo: f(1) = −1 &lt; 0 y f(2) = 2 &gt; 0.</p>`,
    correctMethod: "biseccion",
    methodOptions: ["biseccion", "falsa_posicion", "newton_raphson", "secante"],
    intermediateValue: 1.5,      // xr₁ = (1+2)/2
    finalValue: 1.375,           // xr después de 3 iter
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Bisectriz (se da intervalo con cambio de signo).<br>
      It.1: x=(a+b)/2=(1+2)/2=<em>1.5</em>, f(1.5)=0.25>0 → [1,1.5].<br>
      It.2: x=1.25, f(1.25)=−0.4375<0 → [1.25,1.5].<br>
      It.3: x=<em>1.375</em>, f(1.375)=−0.109<0 → [1.375,1.5].`
  },
  {
    id: "2-2",
    statement: `
      <p>Aplica <strong>una iteración</strong> de Newton-Raphson a <strong>f(x) = x² − 3</strong>
      con punto inicial <strong>x₀ = 2</strong>.</p>`,
    correctMethod: "newton_raphson",
    noMethodSelection: true,
    scoring: { intermediate: 2, final: 2 },
    methodOptions: ["biseccion", "falsa_posicion", "newton_raphson", "secante"],
    intermediateValue: 4,        // f'(x₀) = 2x₀ = 4
    finalValue: 1.75,            // x₁ = 2 − 1/4
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Newton – Raphson (punto inicial y función diferenciable).<br>
      f'(xᵢ) = 2x → f'(x₀) = <em>4</em>.<br>
      xᵢ₊₁ = x₀ − f(x₀)/f'(x₀) = 2 − (4−3)/4 = <em>1.75</em>.`
  },
  {
    id: "2-3",
    statement: `
      <p>Aplica <strong>una iteración</strong> de Falsa Posición a <strong>f(x) = x² − 5</strong>
      en el intervalo <strong>[2, 3]</strong>.</p>
      <p>f(2) = −1,  f(3) = 4.</p>`,
    correctMethod: "falsa_posicion",
    noMethodSelection: true,
    scoring: { intermediate: 2, final: 2 },
    methodOptions: ["biseccion", "falsa_posicion", "newton_raphson", "secante"],
    intermediateValue: 2.2,      // xr = 3 − 4·(2−3)/(−1−4) = 2.2
    finalValue: 2.2,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Falsa Posición.<br>
      x = a − f(a)·(b−a)/(f(b)−f(a)) = 2 − (−1)·(3−2)/(4−(−1)) = 2 + 0.2 = <em>2.2</em>.`
  },
  {
    id: "2-4",
    statement: `
      <p>Aplica <strong>una iteración</strong> de Newton-Raphson a <strong>f(x) = x³ − 2x − 5</strong>
      con <strong>x₀ = 2</strong>.</p>`,
    correctMethod: "newton_raphson",
    noMethodSelection: true,
    scoring: { intermediate: 2, final: 2 },
    methodOptions: ["biseccion", "falsa_posicion", "newton_raphson", "secante"],
    intermediateValue: 10,       // f'(2) = 3(4)−2 = 10
    finalValue: 2.1,             // x₁ = 2 − (−1)/10
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Newton – Raphson.<br>
      f(x₀)=8−4−5=−1. f'(xᵢ)=3x²−2 → f'(x₀)=12−2=<em>10</em>.<br>
      xᵢ₊₁ = x₀ − f(x₀)/f'(x₀) = 2 − (−1)/10 = <em>2.1</em>.`
  },
  {
    id: "2-5",
    statement: `
      <p>Encuentra la raíz de <strong>f(x) = x³ − x − 2</strong> en <strong>[1, 2]</strong>
      realizando <strong>3 iteraciones</strong>.</p>
      <p>f(1) = −2,  f(2) = 4.</p>`,
    correctMethod: "biseccion",
    methodOptions: ["biseccion", "falsa_posicion", "newton_raphson", "secante"],
    intermediateValue: 1.5,      // xr₁
    finalValue: 1.625,           // xr después de 3 iter
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Bisectriz.<br>
      It.1: x=(a+b)/2=<em>1.5</em>, f(1.5)=−0.125<0 → [1.5,2].<br>
      It.2: x=1.75, f(1.75)=1.609>0 → [1.5,1.75].<br>
      It.3: x=<em>1.625</em>, f(1.625)=0.666>0 → [1.5,1.625].`
  },
  {
    id: "2-6",
    statement: `
      <p>Aplica <strong>una iteración</strong> de Falsa Posición a <strong>f(x) = x² − 6</strong>
      en el intervalo <strong>[2, 3]</strong>.</p>
      <p>f(2) = −2,  f(3) = 3.</p>`,
    correctMethod: "falsa_posicion",
    noMethodSelection: true,
    scoring: { intermediate: 2, final: 2 },
    methodOptions: ["biseccion", "falsa_posicion", "newton_raphson", "secante"],
    intermediateValue: 2.4,      // xr = 3 − 3·(2−3)/(−2−3) = 2.4
    finalValue: 2.4,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Falsa Posición.<br>
      x = a − f(a)·(b−a)/(f(b)−f(a)) = 2 − (−2)·(3−2)/(3−(−2)) = 2 + 0.4 = <em>2.4</em>.`
  }
];

// ============================================================
//  NIVEL 3 — 7 problemas (Trapecio, Simpson 1/3 y 3/8, Gauss, Seidel)
// ============================================================
LEVELS[2].questions = [
  {
    id: "3-1",
    statement: `
      <p>Aproxima <strong>∫₀² x² dx</strong> con <strong>n = 4</strong> subintervalos.</p>
      <p>Usa la regla de integración más simple (trapecios).</p>`,
    correctMethod: "trapecio",
    noMethodSelection: true,
    scoring: { intermediate: 2, final: 2 },
    methodOptions: ["trapecio", "simpson13", "simpson38", "gauss_eliminacion"],
    intermediateValue: 0.5,      // h = 2/4
    finalValue: 2.75,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método:</strong> Regla Trapezoidal. h=(b−a)/n=(2−0)/4=<em>0.5</em>.<br>
      f: 0, 0.25, 1, 2.25, 4.<br>
      T = 0.5/2·(0+2·0.25+2·1+2·2.25+4) = 0.25·11 = <em>2.75</em>.`
  },
  {
    id: "3-2",
    statement: `
      <p>Aproxima <strong>∫₀¹ x³ dx</strong> con <strong>n = 4</strong> subintervalos <em>(n par)</em>.</p>
      <p>Elige el método de mayor precisión para n par con polinomios de grado ≤ 3.</p>`,
    correctMethod: "simpson13",
    methodOptions: ["trapecio", "simpson13", "simpson38", "gauss_seidel"],
    intermediateValue: 0.25,     // h = 1/4
    finalValue: 0.25,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método:</strong> Regla de 1/3 de Simpson (n par). h=(b−a)/n=<em>0.25</em>.<br>
      f: 0, 0.015625, 0.125, 0.421875, 1.<br>
      I = h/3·[f(a)+4Σf|impar+2Σf|par+f(b)] = 0.25/3·(0+4·0.015625+2·0.125+4·0.421875+1) = <em>0.25</em>.`
  },
  {
    id: "3-3",
    statement: `
      <p>Aproxima <strong>∫₀³ x² dx</strong> con <strong>n = 3</strong> subintervalos <em>(múltiplo de 3)</em>.</p>`,
    correctMethod: "simpson38",
    methodOptions: ["trapecio", "simpson13", "simpson38", "gauss_seidel"],
    intermediateValue: 1,        // h = 3/3
    finalValue: 9,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método:</strong> Regla de 3/8 de Simpson (n múltiplo de 3). h=(b−a)/n=<em>1</em>.<br>
      f: 0, 1, 4, 9.<br>
      I = 3h/8·[f(a)+3Σf(a+ih)+f(b)] = 3·1/8·(0+3·1+3·4+9) = 0.375·24 = <em>9</em>.`
  },
  {
    id: "3-4",
    statement: `
      <p>Resuelve el sistema lineal:</p>
      <pre class="math-block">  2x + y = 5
   x + 3y = 7</pre>
      <p>Usa <strong>Eliminación Gaussiana</strong> (sin sustitución iterativa).</p>`,
    correctMethod: "gauss_eliminacion",
    noMethodSelection: true,
    scoring: { intermediate: 2, final: 2 },
    methodOptions: ["gauss_eliminacion", "gauss_jordan", "gauss_seidel", "trapecio"],
    intermediateValue: 0.5,      // m₂₁ = 1/2
    finalValue: 1.6,             // x₁ = 1.6
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método:</strong> Eliminación Gaussiana.<br>
      m₂₁ = 1/2 = <em>0.5</em>. Tras eliminar: 2.5y = 4.5 → y=1.8.<br>
      2x + 1.8 = 5 → x = <em>1.6</em>.`
  },
  {
    id: "3-5",
    statement: `
      <p>Resuelve el sistema lineal con el método iterativo:</p>
      <pre class="math-block">  4x + y = 9
   x + 3y = 8</pre>
      <p>Valor inicial (x,y) = (0,0). Realiza <strong>2 iteraciones</strong> de Gauss-Seidel.</p>`,
    correctMethod: "gauss_seidel",
    noMethodSelection: true,
    scoring: { intermediate: 2, final: 2 },
    methodOptions: ["gauss_eliminacion", "gauss_jordan", "gauss_seidel", "simpson13"],
    intermediateValue: 2.25,     // x₁⁽¹⁾ = 9/4
    finalValue: 1.7708,          // x₁ tras 2 iter (≈ 1.7708)
    tolerance: 0.001,
    explanation: `
      <strong>Método:</strong> Gauss – Seidel.<br>
      It.1: x₁⁽¹⁾=(9−0)/4=<em>2.25</em>; x₂⁽¹⁾=(8−2.25)/3=1.9167.<br>
      It.2: x₁⁽²⁾=(9−1.9167)/4=<em>1.7708</em>; x₂⁽²⁾=2.0764.`
  },
  {
    id: "3-6",
    statement: `
      <p>Aproxima <strong>∫₁³ (x²+1) dx</strong> con <strong>n = 4</strong> subintervalos.</p>`,
    correctMethod: "trapecio",
    methodOptions: ["trapecio", "simpson13", "simpson38", "gauss_seidel"],
    intermediateValue: 0.5,
    finalValue: 10.75,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método:</strong> Regla Trapezoidal. h=(b−a)/n=<em>0.5</em>.<br>
      f(x): 2, 3.25, 5, 7.25, 10.<br>
      T = 0.5/2·(2+2·3.25+2·5+2·7.25+10) = 0.25·43 = <em>10.75</em>.`
  },
  {
    id: "3-7",
    statement: `
      <p>Aproxima <strong>∫₀² x³ dx</strong> con <strong>n = 4</strong> <em>(n par)</em>.</p>`,
    correctMethod: "simpson13",
    methodOptions: ["trapecio", "simpson13", "simpson38", "gauss_eliminacion"],
    intermediateValue: 0.5,
    finalValue: 4.0,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método:</strong> Regla de 1/3 de Simpson (n par). h=(b−a)/n=<em>0.5</em>.<br>
      f: 0, 0.125, 1, 3.375, 8.<br>
      I = h/3·[f(a)+4Σf|impar+2Σf|par+f(b)] = 0.5/3·(0+4·0.125+2·1+4·3.375+8) = <em>4.0</em>.`
  }
];

// ============================================================
//  NIVEL 4 — 8 problemas (Euler, RK4, Newton Adelante/Atrás, Lagrange)
// ============================================================
LEVELS[3].questions = [
  {
    id: "4-1",
    statement: `
      <p>Resuelve la EDO <strong>dy/dx = x + y</strong> con condición inicial <strong>y(0) = 1</strong>
      y paso <strong>h = 0.1</strong>. Calcula <strong>y(0.1)</strong>.</p>
      <p>Usa el método de un solo paso sin pendientes adicionales.</p>`,
    correctMethod: "euler",
    methodOptions: ["euler", "runge_kutta", "newton_adelante", "lagrange"],
    intermediateValue: 0.1,      // k₁ = h·f(0,1) = 0.1·1
    finalValue: 1.1,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método:</strong> Euler hacia Adelante (un paso, sin pendientes auxiliares).<br>
      h·f(xₙ,yₙ) = 0.1·f(0,1) = 0.1·(0+1) = <em>0.1</em>.<br>
      yₙ₊₁ = yₙ + h·f(yₙ,tₙ) = 1 + 0.1 = <em>1.1</em>.`
  },
  {
    id: "4-2",
    statement: `
      <p>Resuelve la EDO <strong>dy/dx = x + y</strong> con <strong>y(0) = 1</strong> y <strong>h = 0.1</strong>.</p>
      <p>Requiere la máxima precisión posible para un método de un paso. Calcula <strong>y(0.1)</strong>.</p>`,
    correctMethod: "runge_kutta",
    methodOptions: ["euler", "runge_kutta", "newton_adelante", "lagrange"],
    intermediateValue: 0.1,      // k₁ = h·f(0,1)
    finalValue: 1.1103,          // y₁ ≈ 1.110342
    tolerance: 0.001,
    explanation: `
      <strong>Método:</strong> Runge – Kutta 4to. Orden (mayor precisión).<br>
      k₁=h·f(x₀,y₀)=0.1·1=<em>0.1</em>, k₂=0.11, k₃=0.1105, k₄=0.12105.<br>
      yₙ₊₁ = yₙ + 1/6·(k₁+2k₂+2k₃+k₄) = 1+(0.1+0.22+0.221+0.12105)/6 ≈ <em>1.1103</em>.`
  },
  {
    id: "4-3",
    statement: `
      <p>Tabla de diferencias divididas con espaciado constante h = 1:</p>
      <table class="data-table">
        <tr><th>x</th><th>f(x)</th></tr>
        <tr><td>0</td><td>1</td></tr>
        <tr><td>1</td><td>2</td></tr>
        <tr><td>2</td><td>5</td></tr>
        <tr><td>3</td><td>10</td></tr>
        <tr><td>4</td><td>17</td></tr>
      </table>
      <p>Calcula el valor de <strong>x = 0.5</strong>. El punto está cerca del <em>inicio</em> de la tabla.</p>`,
    correctMethod: "newton_adelante",
    methodOptions: ["newton_adelante", "newton_atras", "lagrange", "euler"],
    intermediateValue: 0.5,      // s = 0.5
    finalValue: 1.25,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método:</strong> Newton hacia Adelante. Δ'f(x₀)=1, Δ²f(x₀)=2, Δ³f(x₀)=0.<br>
      S = (x−xᵢ)/h = (0.5−0)/1 = <em>0.5</em>.<br>
      g(0.5)=1+0.5·1+[0.5·(−0.5)/2]·2=1+0.5−0.25=<em>1.25</em>.`
  },
  {
    id: "4-4",
    statement: `
      <p>Tabla de diferencias divididas con espaciado constante h = 1:</p>
      <table class="data-table">
        <tr><th>x</th><th>f(x)</th></tr>
        <tr><td>0</td><td>1</td></tr>
        <tr><td>1</td><td>2</td></tr>
        <tr><td>2</td><td>5</td></tr>
        <tr><td>3</td><td>10</td></tr>
        <tr><td>4</td><td>17</td></tr>
      </table>
      <p>Calcula el valor de <strong>x = 3.5</strong>. El punto está cerca del <em>final</em> de la tabla.</p>`,
    correctMethod: "newton_atras",
    methodOptions: ["newton_adelante", "newton_atras", "lagrange", "runge_kutta"],
    intermediateValue: -0.5,     // p = (3.5−4)/1
    finalValue: 13.25,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método:</strong> Newton hacia Atrás. ∇'f(xᵢ)=7, ∇²f(xᵢ)=2, ∇³f(xᵢ)=0.<br>
      S = (x−xᵢ)/h = (3.5−4)/1 = <em>−0.5</em>.<br>
      g(3.5)=17+(−0.5)·7+[(−0.5)·(0.5)/2]·2=17−3.5−0.25=<em>13.25</em>.`
  },
  {
    id: "4-5",
    statement: `
      <p>Datos con <strong>espaciado irregular</strong> (no equidistante):</p>
      <table class="data-table">
        <tr><th>x</th><th>f(x)</th></tr>
        <tr><td>0</td><td>1</td></tr>
        <tr><td>1</td><td>2</td></tr>
        <tr><td>3</td><td>10</td></tr>
        <tr><td>4</td><td>17</td></tr>
      </table>
      <p>Usa los polinomios base de Lagrange para calcular el valor de <strong>x = 2</strong>.</p>`,
    correctMethod: "lagrange",
    noMethodSelection: true,
    scoring: { intermediate: 2, final: 2 },
    methodOptions: ["newton_adelante", "newton_atras", "lagrange", "newton_divididas"],
    intermediateValue: -0.1667,  // L₀(2) = (2−1)(2−3)(2−4)/((0−1)(0−3)(0−4)) = −1/6
    finalValue: 5,               // f(2) = 2²+1 = 5
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método:</strong> Lagrange (espaciado irregular — los polinomios base se construyen con todos los nodos).<br>
      L₀(2)=(2−1)(2−3)(2−4)/((0−1)(0−3)(0−4))=(1)(−1)(−2)/(−12)=−1/6≈<em>−0.1667</em>.<br>
      L₁(2)=2/3; L₂(2)=2/3; L₃(2)=−1/6.<br>
      g(2)=1·(−1/6)+2·(2/3)+10·(2/3)+17·(−1/6)=−3+8=<em>5</em>.`
  },
  {
    id: "4-6",
    statement: `
      <p>Un circuito eléctrico se modela como:</p>
      <pre class="math-block">  dI/dt = −2I + 4,   I(0) = 0</pre>
      <p>Con paso <strong>h = 0.5</strong>, calcula <strong>I(0.5)</strong>. Usa el método más simple de EDO.</p>`,
    correctMethod: "euler",
    methodOptions: ["euler", "runge_kutta", "newton_raphson", "biseccion"],
    intermediateValue: 2.0,      // k₁ = 0.5·(−2·0+4)
    finalValue: 2.0,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método:</strong> Euler hacia Adelante.<br>
      h·f(xₙ,yₙ) = 0.5·f(0,0) = 0.5·(−2·0+4) = <em>2.0</em>.<br>
      yₙ₊₁ = yₙ + h·f(yₙ,tₙ) = 0 + 2.0 = <em>2.0</em>.`
  },
  {
    id: "4-7",
    statement: `
      <p>Un cuerpo se enfría según:</p>
      <pre class="math-block">  dT/dt = −0.2(T−20),   T(0) = 100°C</pre>
      <p>Con <strong>h = 1 s</strong>, calcula <strong>T(1)</strong> con máxima precisión de un paso.</p>`,
    correctMethod: "runge_kutta",
    methodOptions: ["euler", "runge_kutta", "trapecio", "biseccion"],
    intermediateValue: -16,      // k₁ = 1·(−0.2·(100−20)) = −16
    finalValue: 85.499,
    tolerance: 0.01,
    explanation: `
      <strong>Método:</strong> Runge – Kutta 4to. Orden. k₁=h·f(x₀,y₀)=<em>−16</em>, k₂=−14.4, k₃=−14.56, k₄=−13.088.<br>
      yₙ₊₁=yₙ+1/6·(k₁+2k₂+2k₃+k₄)=100+(−16−28.8−29.12−13.088)/6 ≈ <em>85.499</em>.`
  },
  {
    id: "4-8",
    statement: `
      <p>Datos con <strong>espaciado irregular</strong> (no equidistante):</p>
      <table class="data-table">
        <tr><th>x</th><th>f(x)</th></tr>
        <tr><td>0</td><td>1</td></tr>
        <tr><td>1</td><td>2</td></tr>
        <tr><td>4</td><td>17</td></tr>
        <tr><td>6</td><td>37</td></tr>
      </table>
      <p>Usa los polinomios base de Lagrange para calcular el valor de <strong>x = 2</strong>.</p>`,
    correctMethod: "lagrange",
    noMethodSelection: true,
    scoring: { intermediate: 2, final: 2 },
    methodOptions: ["newton_adelante", "newton_atras", "lagrange", "newton_divididas"],
    intermediateValue: -0.3333,  // L₀(2) = (2−1)(2−4)(2−6)/((0−1)(0−4)(0−6)) = −1/3
    finalValue: 5,               // f(2) = 2²+1 = 5
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método:</strong> Lagrange (espaciado irregular — los polinomios base se construyen con todos los nodos).<br>
      L₀(2)=(2−1)(2−4)(2−6)/((0−1)(0−4)(0−6))=(1)(−2)(−4)/(−24)=−1/3≈<em>−0.3333</em>.<br>
      L₁(2)=16/15; L₂(2)=1/3; L₃(2)=−1/15.<br>
      g(2)=1·(−1/3)+2·(16/15)+17·(1/3)+37·(−1/15)=75/15=<em>5</em>.`
  }
];

// ============================================================
//  NIVEL 5 — 10 problemas (todos los métodos, alta complejidad)
// ============================================================
LEVELS[4].questions = [
  {
    id: "5-1",
    statement: `
      <p>Encuentra la raíz de <strong>f(x) = x³ − 5</strong> en <strong>[1, 2]</strong>
      con <strong>3 iteraciones</strong>.</p>
      <p>f(1)=−4, f(2)=3. Se requiere solo el intervalo inicial.</p>`,
    correctMethod: "biseccion",
    methodOptions: ["biseccion", "falsa_posicion", "newton_raphson", "secante"],
    intermediateValue: 1.5,
    finalValue: 1.625,
    tolerance: TOLERANCE,
    explanation: `
      Bisectriz: It.1 x=(a+b)/2=<em>1.5</em> f=−1.625<0→[1.5,2]. It.2 x=1.75 f=0.359>0→[1.5,1.75]. It.3 x=<em>1.625</em>.`
  },
  {
    id: "5-2",
    statement: `
      <p>Aplica <strong>una iteración</strong> de Newton-Raphson a:</p>
      <pre class="math-block">  f(x) = x⁴ − 2x² − 3,   x₀ = 2</pre>`,
    correctMethod: "newton_raphson",
    noMethodSelection: true,
    scoring: { intermediate: 2, final: 2 },
    methodOptions: ["biseccion", "falsa_posicion", "newton_raphson", "secante"],
    intermediateValue: 24,       // f'(2) = 4·8−4·2 = 24
    finalValue: 1.7917,          // x₁ = 2 − 5/24
    tolerance: 0.001,
    explanation: `
      Newton – Raphson. f(x₀)=16−8−3=5. f'(xᵢ)=4x³−4x → f'(x₀)=32−8=<em>24</em>. xᵢ₊₁=x₀−f(x₀)/f'(x₀)=2−5/24≈<em>1.7917</em>.`
  },
  {
    id: "5-3",
    statement: `
      <p>Aproxima <strong>∫₀⁴ (x²+x) dx</strong> con <strong>n = 4</strong> subintervalos <em>(n par)</em>.</p>`,
    correctMethod: "simpson13",
    methodOptions: ["trapecio", "simpson13", "simpson38", "gauss_seidel"],
    intermediateValue: 1,        // h = 4/4
    finalValue: 29.333,
    tolerance: 0.01,
    explanation: `
      Regla de 1/3 de Simpson. h=(b−a)/n=<em>1</em>. f: 0,2,6,12,20. I=h/3·[f(a)+4Σf|impar+2Σf|par+f(b)]=1/3·(0+8+12+48+20)=88/3≈<em>29.333</em>.`
  },
  {
    id: "5-4",
    statement: `
      <p>Una partícula cae bajo: <strong>dv/dt = 9.8 − 0.2v</strong>, v(0)=0.</p>
      <p>Con <strong>h = 1 s</strong> calcula <strong>v(1)</strong> con máxima precisión de un paso.</p>`,
    correctMethod: "runge_kutta",
    methodOptions: ["euler", "runge_kutta", "simpson13", "biseccion"],
    intermediateValue: 9.8,      // k₁ = 1·9.8
    finalValue: 8.882,
    tolerance: 0.01,
    explanation: `
      Runge – Kutta 4to. Orden. k₁=h·f(x₀,y₀)=<em>9.8</em>, k₂=8.82, k₃=8.918, k₄=8.0164. yₙ₊₁=yₙ+1/6·(k₁+2k₂+2k₃+k₄)=(9.8+17.64+17.836+8.0164)/6≈<em>8.882</em>.`
  },
  {
    id: "5-5",
    statement: `
      <p>Resuelve el sistema por el método que <em>no requiere sustitución regresiva</em>:</p>
      <pre class="math-block">  3x + y = 7
   x + 2y = 4</pre>`,
    correctMethod: "gauss_jordan",
    methodOptions: ["gauss_eliminacion", "gauss_jordan", "gauss_seidel", "falsa_posicion"],
    intermediateValue: 0.3333,   // m₂₁ = 1/3
    finalValue: 2,               // x₁ = 2
    tolerance: TOLERANCE,
    explanation: `
      Gauss – Jordán (lleva a identidad, sin sustitución). m₂₁=a₂₁/a₁₁=1/3≈<em>0.3333</em>. Tras reducción a identidad: x=<em>2</em>, y=1.`
  },
  {
    id: "5-6",
    statement: `
      <p>Resuelve con el método iterativo (inicial x=y=0) en <strong>3 iteraciones</strong>:</p>
      <pre class="math-block">  5x + y = 12
   x + 4y = 9</pre>`,
    correctMethod: "gauss_seidel",
    methodOptions: ["gauss_eliminacion", "gauss_jordan", "gauss_seidel", "trapecio"],
    intermediateValue: 2.4,      // x₁⁽¹⁾
    finalValue: 2.0535,
    tolerance: 0.001,
    explanation: `
      Gauss – Seidel. It.1: x₁⁽¹⁾=12/5=<em>2.4</em>; x₂⁽¹⁾=1.65. It.2: x₁⁽²⁾=2.07; x₂⁽²⁾=1.7325. It.3: x₁⁽³⁾≈<em>2.0535</em>.`
  },
  {
    id: "5-7",
    statement: `
      <p>Resuelve el sistema mediante triangulación superior:</p>
      <pre class="math-block">  3x + 2y = 8
   6x + y = 10</pre>`,
    correctMethod: "gauss_eliminacion",
    methodOptions: ["gauss_eliminacion", "gauss_jordan", "gauss_seidel", "biseccion"],
    intermediateValue: 2,        // m₂₁ = 6/3
    finalValue: 1.333,
    tolerance: 0.001,
    explanation: `
      Eliminación Gaussiana. m₂₁=6/3=<em>2</em>. Tras R2−2·R1: −3y=−6→y=2. x=(8−4)/3=<em>1.333</em>.`
  },
  {
    id: "5-8",
    statement: `
      <p>Aplica <strong>2 iteraciones</strong> de Falsa Posición a:</p>
      <pre class="math-block">  f(x) = x³ + x − 1,   [0, 1]</pre>
      <p>f(0)=−1, f(1)=1.</p>`,
    correctMethod: "falsa_posicion",
    noMethodSelection: true,
    scoring: { intermediate: 2, final: 2 },
    methodOptions: ["biseccion", "falsa_posicion", "newton_raphson", "secante"],
    intermediateValue: 0.5,
    finalValue: 0.6364,
    tolerance: 0.001,
    explanation: `
      Falsa Posición. x = a−f(a)·(b−a)/(f(b)−f(a)).<br>
      It.1: x=0−(−1)·(1−0)/(1−(−1))=<em>0.5</em>; f(0.5)=−0.375→[0.5,1].<br>
      It.2: x=0.5−(−0.375)·(1−0.5)/(1−(−0.375))≈<em>0.6364</em>.`
  },
  {
    id: "5-9",
    statement: `
      <p>Datos conocidos (h = 2):</p>
      <table class="data-table">
        <tr><th>x</th><th>f(x)</th></tr>
        <tr><td>0</td><td>3</td></tr>
        <tr><td>2</td><td>11</td></tr>
        <tr><td>4</td><td>27</td></tr>
        <tr><td>6</td><td>51</td></tr>
        <tr><td>8</td><td>83</td></tr>
      </table>
      <p>Calcula el valor de <strong>x = 1</strong> usando el punto cercano al inicio de la tabla.</p>`,
    correctMethod: "newton_adelante",
    methodOptions: ["newton_adelante", "newton_atras", "lagrange", "euler"],
    intermediateValue: 0.5,      // s = (1−0)/2
    finalValue: 6,
    tolerance: TOLERANCE,
    explanation: `
      Newton hacia Adelante, h=2. Δ'f(x₀)=8, Δ²f(x₀)=8, Δ³f(x₀)=0. S=(x−xᵢ)/h=(1−0)/2=<em>0.5</em>.
      g(1)=3+0.5·8+[0.5·(−0.5)/2]·8=3+4−1=<em>6</em>.`
  },
  {
    id: "5-10",
    statement: `
      <p>Datos conocidos:</p>
      <table class="data-table">
        <tr><th>x</th><th>f(x)</th></tr>
        <tr><td>0</td><td>2</td></tr>
        <tr><td>1</td><td>4</td></tr>
        <tr><td>3</td><td>14</td></tr>
        <tr><td>4</td><td>22</td></tr>
      </table>
      <p>Usa los polinomios base de Lagrange para calcular el valor de <strong>x = 2</strong>.</p>`,
    correctMethod: "lagrange",
    noMethodSelection: true,
    scoring: { intermediate: 2, final: 2 },
    methodOptions: ["newton_adelante", "newton_atras", "lagrange", "runge_kutta"],
    intermediateValue: -0.1667,  // L₀(2) = −1/6
    finalValue: 8,
    tolerance: 0.001,
    explanation: `
      L₀(2)=(2−1)(2−3)(2−4)/((0−1)(0−3)(0−4))=(1)(−1)(−2)/(−12)=−1/6≈<em>−0.1667</em>.
      f(2)=2·(−1/6)+4·(2/3)+14·(2/3)+22·(−1/6)=−4+12=<em>8</em>.`
  },
{
  id: "2-X1",
  statement: `
    <p>Se evalúa <strong>f(x) = x³ − 6.5x + 2</strong> en varios puntos:</p>
    <table class="data-table">
      <tr><th>x</th><td>−2</td><td>−1</td><td>0</td><td>1</td><td>2</td><td>3</td></tr>
      <tr><th>f(x)</th><td>7</td><td>7.5</td><td>2</td><td>−3.5</td><td>−3</td><td>9.5</td></tr>
    </table>
    <p>¿Entre qué par de valores consecutivos de <em>x</em> existe una raíz
    (cambio de signo) empezando desde x = 0?</p>`,
  correctMethod: "metodo_grafico",
  methodOptions: [
    "metodo_grafico",
    "biseccion",
    "newton_raphson",
    "falsa_posicion"
  ],
  intermediateValue: 0,     // x donde inicia el cambio: f(0)=2 > 0, f(1)=−3.5 < 0
  finalValue: 1,            // x donde termina el cambio de signo detectado (entre x=0 y x=1)
  tolerance: TOLERANCE,
  explanation: `
    <strong>Método correcto:</strong> Gráfico (tabla de valores + cambio de signo).<br>
    f(0) = 2 &gt; 0 y f(1) = −3.5 &lt; 0, por lo que hay un cambio de signo entre
    <em>x = 0</em> y <em>x = 1</em>: el valor intermedio donde se detecta el cambio
    es <em>x = 0</em> (inicio del intervalo) y la raíz se ubica antes de <em>x = 1</em>.`
},

// ────────────────────────────────────────────────────────────
//  2. PUNTO FIJO / SUSTITUCIONES SUCESIVAS
//  Nivel sugerido: 2 (Raíces de ecuaciones)
// ────────────────────────────────────────────────────────────
// Agregar a METHOD_INFO:
/*
  punto_fijo: {
    label: "Punto Fijo ó Sustituciones Sucesivas",
    formula: "xᵢ₊₁ = g(xᵢ)",
    intermediateLabel: "x₁ — primera iteración"
  },
*/

{
  id: "2-X2",
  statement: `
    <p>Se desea encontrar la raíz de <strong>f(x) = x² − x − 2 = 0</strong>.</p>
    <p>La función se reescribe como <strong>x = g(x) = √(x + 2)</strong>.</p>
    <p>Aplica <strong>2 iteraciones</strong> de Punto Fijo con valor inicial <strong>x₀ = 2</strong>.</p>`,
  correctMethod: "punto_fijo",
  methodOptions: [
    "punto_fijo",
    "biseccion",
    "newton_raphson",
    "falsa_posicion"
  ],
  intermediateValue: 2,       // x₁ = √(2 + 2) = √4 = 2  (coincide con x₀, converge en 1 iter)
  finalValue: 2,              // x₂ = √(2 + 2) = 2
  tolerance: TOLERANCE,
  explanation: `
    <strong>Método correcto:</strong> Punto Fijo ó Sustituciones Sucesivas.<br>
    It.1: x₁ = g(x₀) = √(2 + 2) = √4 = <em>2</em>.<br>
    It.2: x₂ = g(x₁) = √(2 + 2) = <em>2</em>.<br>
    ε = |x₂ − x₁| = 0 → converge. La raíz es <em>x = 2</em>.`
},

// ────────────────────────────────────────────────────────────
//  3. NEWTON CON DIFERENCIAS DIVIDIDAS
//  Nivel sugerido: 1 (Interpolación)
// ────────────────────────────────────────────────────────────
// Agregar a METHOD_INFO:
/*
  newton_divididas: {
    label: "Newton con Diferencias Divididas",
    formula: "g(x) = D⁰ + D¹(x−x₁) + D²(x−x₁)(x−x₂) + …",
    intermediateLabel: "D¹ — primera diferencia dividida"
  },
*/

{
  id: "1-X1",
  statement: `
    <p>Los siguientes datos tienen intervalos <strong>no uniformes</strong>:</p>
    <table class="data-table">
      <tr><th>x</th><td>1</td><td>3</td><td>6</td></tr>
      <tr><th>f(x)</th><td>2</td><td>8</td><td>14</td></tr>
    </table>
    <p>Calcula <strong>f(4)</strong>. Los intervalos son h₁ = 2 y h₂ = 3,
    por lo que el método apropiado es el de diferencias divididas.</p>`,
  correctMethod: "newton_divididas",
  methodOptions: [
    "interpolacion_lineal",
    "newton_adelante",
    "newton_divididas",
    "lagrange"
  ],
  intermediateValue: 3,       // D¹₁ = (f(x₂)−f(x₁))/(x₂−x₁) = (8−2)/(3−1) = 3
  finalValue: 10.4,           // g(4) = 2 + 9 − 0.6 = 10.4
  tolerance: TOLERANCE,
  explanation: `
    <strong>Método correcto:</strong> Newton con Diferencias Divididas (intervalos no uniformes).<br>
    D¹₁ = (8 − 2) / (3 − 1) = <em>3</em>. D¹₂ = (14 − 8) / (6 − 3) = 2.<br>
    D² = (2 − 3) / (6 − 1) = −0.2.<br>
    g(4) = 2 + 3·(4−1) + (−0.2)·(4−1)·(4−3) = 2 + 9 − 0.6 = <em>10.4</em>.`
},

// ────────────────────────────────────────────────────────────
//  4. MÉTODO MONTANTE
//  Nivel sugerido: 3 (Sistemas de ecuaciones)
// ────────────────────────────────────────────────────────────
// Agregar a METHOD_INFO:
/*
  montante: {
    label: "Montante",
    formula: "N.E. = (E.P.·E.A. − E.C.F.P.·E.C.C.P.) / P.A.",
    intermediateLabel: "Nuevo elemento — fila 2, columna 2"
  },
*/

{
  id: "3-X1",
  statement: `
    <p>Resuelve el sistema usando el <strong>Método de Montante</strong>
    (pivoteo sin divisiones intermedias):</p>
    <pre class="math-block">  2x + y = 5
   x + 3y = 7</pre>
    <p>Toma como primer pivote el elemento <em>a₁₁ = 2</em>. El pivote anterior
    vale 1. Calcula el <strong>nuevo elemento a₂₂</strong> de la matriz transformada.</p>`,
  correctMethod: "montante",
  methodOptions: [
    "montante",
    "gauss_jordan",
    "gauss_eliminacion",
    "gauss_seidel"
  ],
  intermediateValue: 5,       // N.E. a₂₂ = (2·3 − 1·1) / 1 = 5
  finalValue: 1.6,            // sistema 2x+y=5; x+3y=7 → x=1.6
  tolerance: TOLERANCE,
  explanation: `
    <strong>Método correcto:</strong> Montante.<br>
    Pivote = 2, Pivote anterior = 1.<br>
    N.E.₂₂ = (E.P.·E.A. − E.C.F.P.·E.C.C.P.) / P.A.
            = (2·3 − 1·1) / 1 = <em>5</em>.<br>
    N.E.₂₄ = (2·7 − 5·1) / 1 = 9. Nuevo pivote = 5.<br>
    Columna x → N.E. = (5·5 − 1·9)/2 = (25−9)/2... → x = <em>1.6</em>, y = 1.8.`
},

// ────────────────────────────────────────────────────────────
//  5. JACOBI
//  Nivel sugerido: 3 (Sistemas de ecuaciones)
// ────────────────────────────────────────────────────────────
// Agregar a METHOD_INFO:
/*
  jacobi: {
    label: "Jacobi",
    formula: "xᵢ⁽ᵏ⁺¹⁾ = (bᵢ − Σ aᵢⱼxⱼ⁽ᵏ⁾) / aᵢᵢ  (valores del paso anterior)",
    intermediateLabel: "x₁⁽¹⁾ — primera actualización de x₁"
  },
*/

{
  id: "3-X2",
  statement: `
    <p>Resuelve el sistema con el método iterativo que usa solo valores del
    paso anterior (NO los más recientes):</p>
    <pre class="math-block">  4x + y = 9
   x + 3y = 8</pre>
    <p>Valor inicial <strong>x₀ = y₀ = 1</strong>. Realiza <strong>2 iteraciones</strong>.</p>`,
  correctMethod: "jacobi",
  methodOptions: [
    "gauss_eliminacion",
    "gauss_seidel",
    "jacobi",
    "montante"
  ],
  intermediateValue: 2,       // x₁⁽¹⁾ = (9 − 1·1) / 4 = 2
  finalValue: 1.6667,         // x₁⁽²⁾ = (9 − 1·2.333) / 4 ≈ 1.6667
  tolerance: TOLERANCE,
  explanation: `
    <strong>Método correcto:</strong> Jacobi (usa valores del paso anterior en cada ecuación).<br>
    It.1: x₁⁽¹⁾ = (9 − 1·1)/4 = <em>2</em>;  y₁⁽¹⁾ = (8 − 1·1)/3 = 2.333.<br>
    It.2: x₁⁽²⁾ = (9 − 1·2.333)/4 = <em>1.6667</em>;  y₁⁽²⁾ = (8 − 1·2)/3 = 2.<br>
    ε_x = |1.6667 − 2| = 0.3333 (continúa iterando hasta ε ≤ 0.001).`
},

// ────────────────────────────────────────────────────────────
//  6. NEWTON–COTES CERRADAS (uso generalizado con tabla α y wᵢ)
//  Nivel sugerido: 3 (Integración numérica)
// ────────────────────────────────────────────────────────────
// Agregar a METHOD_INFO:
/*
  newton_cotes_cerrada: {
    label: "Newton–Cotes Cerradas",
    formula: "I = α·h·Σ wᵢ·f(a + i·h),  h = (b−a)/n",
    intermediateLabel: "h = (b − a) / n"
  },
*/

{
  id: "3-X3",
  statement: `
    <p>Aproxima <strong>∫₀² (x² + 1) dx</strong> con <strong>n = 2</strong>
    usando la <strong>fórmula cerrada de Newton–Cotes</strong> con los pesos
    de la tabla: α = 1/3, w = [1, 4, 1].</p>`,
  correctMethod: "newton_cotes_cerrada",
  methodOptions: [
    "trapecio",
    "simpson13",
    "newton_cotes_cerrada",
    "simpson38"
  ],
  intermediateValue: 1,       // h = (2−0)/2 = 1
  finalValue: 4.6667,         // I = (1/3)·1·(f(0)+4·f(1)+f(2)) = (1/3)·(1+8+5) = 14/3
  tolerance: 0.001,
  explanation: `
    <strong>Método correcto:</strong> Newton–Cotes Cerradas (n = 2, pesos [1, 4, 1]).<br>
    h = (b − a) / n = (2 − 0) / 2 = <em>1</em>.<br>
    f(0) = 1, f(1) = 2, f(2) = 5.<br>
    I = (1/3)·1·(1 + 4·2 + 5) = (1/3)·14 = <em>4.6667</em>.`
},

// ────────────────────────────────────────────────────────────
//  7. MÍNIMOS CUADRADOS — LÍNEA RECTA
//  Nivel sugerido: 3 (Ajuste de curvas)
// ────────────────────────────────────────────────────────────
// Agregar a METHOD_INFO:
/*
  minimos_cuadrados: {
    label: "Mínimos Cuadrados — Línea Recta",
    formula: "g(x) = a₀ + a₁·x",
    intermediateLabel: "a₁ — pendiente de la recta ajustada"
  },
*/

{
  id: "3-X4",
  statement: `
    <p>Ajusta una <strong>línea recta</strong> a los siguientes datos
    usando Mínimos Cuadrados:</p>
    <table class="data-table">
      <tr><th>x</th><td>1</td><td>2</td><td>3</td></tr>
      <tr><th>y</th><td>2</td><td>4</td><td>6</td></tr>
    </table>
    <p>n = 3. Calcula la pendiente <strong>a₁</strong> y la ordenada al origen <strong>a₀</strong>.</p>`,
  correctMethod: "minimos_cuadrados",
  methodOptions: [
    "minimos_cuadrados",
    "interpolacion_lineal",
    "lagrange",
    "newton_divididas"
  ],
  intermediateValue: 2,       // a₁ = (n·Σxy − Σx·Σy) / (n·Σx² − (Σx)²) = (3·28−6·12)/(3·14−36) = (84−72)/(42−36) = 12/6 = 2
  finalValue: 0,              // a₀ = (Σy − a₁·Σx)/n = (12 − 2·6)/3 = 0
  tolerance: TOLERANCE,
  explanation: `
    <strong>Método correcto:</strong> Mínimos Cuadrados — Línea Recta.<br>
    Σx=6, Σy=12, Σx²=14, Σxy=2+8+18=28, n=3.<br>
    a₁ = (n·Σxy − Σx·Σy) / (n·Σx² − (Σx)²) = (84 − 72)/(42 − 36) = <em>2</em>.<br>
    a₀ = (Σy − a₁·Σx)/n = (12 − 12)/3 = <em>0</em>.<br>
    Recta: g(x) = 0 + 2x.`
},

// ────────────────────────────────────────────────────────────
//  8. EULER HACIA ATRÁS
//  Nivel sugerido: 4 (EDO)
// ────────────────────────────────────────────────────────────
// Agregar a METHOD_INFO:
/*
  euler_atras: {
    label: "Euler hacia Atrás",
    formula: "yₙ₊₁ = yₙ + h·f(yₙ₊₁, tₙ₊₁)",
    intermediateLabel: "h·f(xₙ₊₁, yₙ₊₁) — incremento implícito"
  },
*/

{
  id: "4-X1",
  statement: `
    <p>Resuelve la EDO <strong>y' = −y</strong> con <strong>y(0) = 1</strong>
    y paso <strong>h = 0.5</strong>. Calcula <strong>y(0.5)</strong>.</p>
    <p>La ecuación implícita queda: <strong>y₁ = y₀ + h·(−y₁)</strong>.<br>
    Usa el método de Euler que evalúa f en el punto <em>siguiente</em>
    (despejando y₁).</p>`,
  correctMethod: "euler_atras",
  methodOptions: [
    "euler",
    "euler_atras",
    "runge_kutta",
    "trapecio"
  ],
  intermediateValue: 0.5,     // h·(−y₁): para despejarlo: y₁(1 + h) = y₀ → y₁ = 1/(1+0.5) = 2/3
  finalValue: 0.6667,         // y₁ = 1 / (1 + 0.5) = 2/3 ≈ 0.6667
  tolerance: 0.001,
  explanation: `
    <strong>Método correcto:</strong> Euler hacia Atrás (implícito).<br>
    y₁ = y₀ + h·f(y₁, t₁) = 1 + 0.5·(−y₁).<br>
    Despejando: y₁ + 0.5·y₁ = 1 → y₁·(1 + 0.5) = 1 → y₁ = 1/1.5 = <em>0.6667</em>.<br>
    El incremento implícito h·f(y₁) = 0.5·(−0.6667) = <em>−0.3333</em>.`
},

// ────────────────────────────────────────────────────────────
//  9. EULER MODIFICADO (Regla del Trapecio / Heun)
//  Nivel sugerido: 4 (EDO)
// ────────────────────────────────────────────────────────────
// Agregar a METHOD_INFO:
/*
  euler_modificado: {
    label: "Euler Modificado",
    formula: "yₙ₊₁ = yₙ + h/2·[f(yₙ,tₙ) + f(yₙ₊₁*,tₙ₊₁)]",
    intermediateLabel: "predictor yₙ₊₁* (Euler simple)"
  },
*/

{
  id: "4-X2",
  statement: `
    <p>Resuelve la EDO <strong>y' = x + y</strong> con <strong>y(0) = 1</strong>
    y paso <strong>h = 0.2</strong>. Calcula <strong>y(0.2)</strong>.</p>
    <p>Usa el método que promedia las pendientes al inicio y al final del
    intervalo (paso predictor–corrector).</p>`,
  correctMethod: "euler_modificado",
  methodOptions: [
    "euler",
    "euler_modificado",
    "runge_kutta",
    "euler_atras"
  ],
  intermediateValue: 1.2,     // predictor: y* = y₀ + h·f(0,1) = 1 + 0.2·1 = 1.2
  finalValue: 1.24,           // corrector: y₁ = 1 + 0.2/2·(f(0,1)+f(0.2,1.2)) = 1+0.1·(1+1.4)=1.24
  tolerance: 0.001,
  explanation: `
    <strong>Método correcto:</strong> Euler Modificado (predictor–corrector).<br>
    Predictor: y* = y₀ + h·f(x₀,y₀) = 1 + 0.2·(0+1) = <em>1.2</em>.<br>
    f(x₁,y*) = f(0.2, 1.2) = 0.2 + 1.2 = 1.42.<br>
    Corrector: y₁ = y₀ + h/2·[f(x₀,y₀) + f(x₁,y*)] = 1 + 0.1·(1 + 1.42) = <em>1.242</em>.`
},

// ────────────────────────────────────────────────────────────
//  10. RUNGE–KUTTA 2do. ORDEN
//  Nivel sugerido: 4 (EDO)
// ────────────────────────────────────────────────────────────
// Agregar a METHOD_INFO:
/*
  runge_kutta2: {
    label: "Runge – Kutta 2do. Orden",
    formula: "yₙ₊₁ = yₙ + ½(k₁ + k₂)",
    intermediateLabel: "k₁ = h · f(x₀, y₀)"
  },
*/

{
  id: "4-X3",
  statement: `
    <p>Resuelve la EDO <strong>y' = 2y</strong> con <strong>y(0) = 1</strong>
    y paso <strong>h = 0.5</strong>. Calcula <strong>y(0.5)</strong>.</p>
    <p>Usa Runge–Kutta de <strong>2do. orden</strong>
    (dos evaluaciones de la función por paso).</p>`,
  correctMethod: "runge_kutta2",
  methodOptions: [
    "euler",
    "euler_modificado",
    "runge_kutta2",
    "runge_kutta"
  ],
  intermediateValue: 1,       // k₁ = h·f(y₀,t₀) = 0.5·2·1 = 1
  finalValue: 2.5,            // k₁=1; k₂=0.5·2·(1+1)=2; y₁=1+½(1+2)=2.5
  tolerance: 0.001,
  explanation: `
    <strong>Método correcto:</strong> Runge–Kutta 2do. Orden.<br>
    k₁ = h·f(y₀,t₀) = 0.5·2·1 = <em>1</em>.<br>
    k₂ = h·f(y₀+k₁, t₀+h) = 0.5·2·(1+1) = 2.<br>
    y₁ = y₀ + ½(k₁+k₂) = 1 + ½·(1+2) = <em>2.5</em>.`
},

// ────────────────────────────────────────────────────────────
//  11. RUNGE–KUTTA DE ORDEN SUPERIOR (EDO de 2do. orden)
//  Nivel sugerido: 5 (Experto)
// ────────────────────────────────────────────────────────────
// Agregar a METHOD_INFO:
/*
  runge_kutta_sup: {
    label: "Runge – Kutta Orden Superior",
    formula: "yₙ₊₁ = yₙ + ½(k₁+k₂),  y'ₙ₊₁ = y'ₙ + ½(m₁+m₂)",
    intermediateLabel: "k₁ = h · y'₀"
  },
*/

{
  id: "5-X1",
  statement: `
    <p>Resuelve la EDO de <strong>segundo orden</strong>:</p>
    <pre class="math-block">  y'' − 2y' + y = 0,   y(0) = 1,   y'(0) = 1,   h = 0.5</pre>
    <p>Reescribe como sistema: <strong>V = y'</strong> (velocidad),
    <strong>y'' = 2V − y</strong>. Calcula <strong>y(0.5)</strong>
    usando Runge–Kutta de Orden Superior.</p>`,
  correctMethod: "runge_kutta_sup",
  methodOptions: [
    "euler",
    "runge_kutta",
    "runge_kutta_sup",
    "euler_modificado"
  ],
  intermediateValue: 0.5,     // k₁ = h·V₀ = 0.5·1 = 0.5
  finalValue: 1.625,          // y₁ = U₀ + ½(k₁+k₂) = 1 + ½·1.25 = 1.625
  tolerance: 0.01,
  explanation: `
    <strong>Método correcto:</strong> Runge–Kutta Orden Superior.<br>
    Vₙ = y', Uₙ = y, a = 2, b = 1.<br>
    k₁ = h·V₀ = 0.5·1 = <em>0.5</em>.<br>
    m₁ = h·(2·V₀ − U₀) = 0.5·(2·1 − 1) = 0.5.<br>
    k₂ = h·(V₀+m₁) = 0.5·1.5 = 0.75.<br>
    m₂ = h·(2·(V₀+m₁) − (U₀+k₁)) = 0.5·(3−1.5) = 0.75.<br>
    y₁ = U₀ + ½(k₁+k₂) = 1 + ½·1.25 = <em>1.625</em>.`
}
];
