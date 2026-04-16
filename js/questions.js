// ============================================================
//  BANCO DE PREGUNTAS — Métodos Numéricos Quiz
//  Tolerancia global configurable (puede cambiarse por nivel)
// ============================================================

const TOLERANCE = 0.001;

// ── Información de cada método ──────────────────────────────
const METHOD_INFO = {
  interpolacion_lineal: {
    label: "Interpolación Lineal",
    formula: "f(x) = f(x₀) + [(f(x₁)−f(x₀))/(x₁−x₀)]·(x−x₀)",
    intermediateLabel: "h = x₁ − x₀"
  },
  newton_adelante: {
    label: "Newton hacia Adelante",
    formula: "f(x) = f₀ + s·Δf₀ + s(s−1)/2!·Δ²f₀ + …",
    intermediateLabel: "s = (x − x₀) / h"
  },
  newton_atras: {
    label: "Newton hacia Atrás",
    formula: "f(x) = fₙ + p·∇fₙ + p(p+1)/2!·∇²fₙ + …",
    intermediateLabel: "p = (x − xₙ) / h"
  },
  lagrange: {
    label: "Interpolación de Lagrange",
    formula: "f(x) = Σ Lᵢ(x)·f(xᵢ)",
    intermediateLabel: "L₀(x) — primer término base evaluado en x"
  },
  biseccion: {
    label: "Bisección",
    formula: "xᵣ = (a + b) / 2",
    intermediateLabel: "xᵣ = (a + b) / 2  (1ª iteración)"
  },
  falsa_posicion: {
    label: "Falsa Posición (Regula Falsi)",
    formula: "xᵣ = b − f(b)·(a−b) / (f(a)−f(b))",
    intermediateLabel: "xᵣ  (1ª iteración, fórmula Regula Falsi)"
  },
  newton_raphson: {
    label: "Newton-Raphson",
    formula: "x₁ = x₀ − f(x₀)/f'(x₀)",
    intermediateLabel: "f'(x₀) — derivada evaluada en x₀"
  },
  secante: {
    label: "Método de la Secante",
    formula: "x₂ = x₁ − f(x₁)·(x₀−x₁)/(f(x₀)−f(x₁))",
    intermediateLabel: "f(x₁) − f(x₀)  (diferencia de evaluaciones)"
  },
  trapecio: {
    label: "Regla del Trapecio",
    formula: "∫ ≈ h/2·[f(x₀) + 2f(x₁) + … + 2f(xₙ₋₁) + f(xₙ)]",
    intermediateLabel: "h = (b − a) / n"
  },
  simpson13: {
    label: "Regla de Simpson 1/3",
    formula: "∫ ≈ h/3·[f₀ + 4f₁ + 2f₂ + 4f₃ + … + fₙ]  (n par)",
    intermediateLabel: "h = (b − a) / n"
  },
  simpson38: {
    label: "Regla de Simpson 3/8",
    formula: "∫ ≈ 3h/8·[f₀ + 3f₁ + 3f₂ + 2f₃ + … + fₙ]  (n múlt. 3)",
    intermediateLabel: "h = (b − a) / n"
  },
  gauss_eliminacion: {
    label: "Eliminación Gaussiana",
    formula: "m₂₁ = a₂₁/a₁₁  →  triangulación superior",
    intermediateLabel: "m₂₁ = a₂₁ / a₁₁  (multiplicador 1ª columna)"
  },
  gauss_jordan: {
    label: "Gauss-Jordan",
    formula: "m₂₁ = a₂₁/a₁₁  →  reducción a identidad",
    intermediateLabel: "m₂₁ = a₂₁ / a₁₁  (multiplicador 1ª operación)"
  },
  gauss_seidel: {
    label: "Gauss-Seidel",
    formula: "xᵢ⁽ᵏ⁺¹⁾ = (bᵢ − Σ aᵢⱼxⱼ) / aᵢᵢ  (valores más recientes)",
    intermediateLabel: "x₁⁽¹⁾ — primera actualización de x₁"
  },
  euler: {
    label: "Método de Euler",
    formula: "y₁ = y₀ + k₁,  k₁ = h·f(x₀,y₀)",
    intermediateLabel: "k₁ = h · f(x₀, y₀)"
  },
  runge_kutta: {
    label: "Runge-Kutta 4º Orden",
    formula: "y₁ = y₀ + (k₁+2k₂+2k₃+k₄)/6",
    intermediateLabel: "k₁ = h · f(x₀, y₀)"
  }
};

// ── Niveles ─────────────────────────────────────────────────
const LEVELS = [
  {
    id: 1,
    name: "Nivel 1 — Introducción",
    description: "Interpolación Lineal y Diferencias Finitas de Newton. Identifica el método y calcula el parámetro de interpolación.",
    threshold: 6,
    maxPoints: 15,
    scoring: { method: 1, intermediate: 1, final: 1 },
    questions: []   // se llena abajo
  },
  {
    id: 2,
    name: "Nivel 2 — Aprendiz",
    description: "Raíces de ecuaciones: Bisección, Newton-Raphson y Falsa Posición. Los distractores son más cercanos.",
    threshold: 10,
    maxPoints: 18,
    scoring: { method: 1, intermediate: 1, final: 1 },
    questions: []
  },
  {
    id: 3,
    name: "Nivel 3 — Intermedio",
    description: "Integración numérica (Trapecio, Simpson 1/3 y 3/8) y sistemas de ecuaciones (Gauss-Seidel, Eliminación Gaussiana).",
    threshold: 15,
    maxPoints: 35,
    scoring: { method: 1, intermediate: 2, final: 2 },
    questions: []
  },
  {
    id: 4,
    name: "Nivel 4 — Avanzado",
    description: "EDO (Euler, Runge-Kutta) e interpolación avanzada (Newton Adelante/Atrás, Lagrange). Contextos de ingeniería.",
    threshold: 20,
    maxPoints: 40,
    scoring: { method: 1, intermediate: 2, final: 2 },
    questions: []
  },
  {
    id: 5,
    name: "Nivel 5 — Experto",
    description: "Todos los métodos. Problemas multietapa de alta complejidad. Tu puntaje total determina la calificación final.",
    threshold: null,
    maxPoints: 80,
    scoring: { method: 2, intermediate: 3, final: 3 },
    questions: []
  }
];

// ============================================================
//  NIVEL 1 — 5 preguntas (Interp. Lineal, Newton Adelante/Atrás)
// ============================================================
LEVELS[0].questions = [
  {
    id: "1-1",
    statement: `
      <p>Se tienen los datos:</p>
      <table class="data-table">
        <tr><th>x</th><td>1</td><td>5</td></tr>
        <tr><th>f(x)</th><td>2</td><td>10</td></tr>
      </table>
      <p>Calcula <strong>f(3)</strong> usando el método apropiado.</p>`,
    correctMethod: "interpolacion_lineal",
    methodOptions: [
      "interpolacion_lineal",
      "newton_adelante",
      "newton_atras",
      "lagrange"
    ],
    intermediateValue: 4,        // h = 5−1
    finalValue: 6,               // f(3) = 2 + (10−2)/(5−1)·(3−1) = 6
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Interpolación Lineal.<br>
      <strong>Valor intermedio:</strong> h = x₁ − x₀ = 5 − 1 = <em>4</em>.<br>
      <strong>Resultado:</strong> f(3) = 2 + (10−2)/(5−1)·(3−1) = 2 + 2·2 = <em>6</em>.`
  },
  {
    id: "1-2",
    statement: `
      <p>Tabla de diferencias finitas con h = 1:</p>
      <table class="data-table">
        <tr><th>x</th><td>0</td><td>1</td><td>2</td><td>3</td></tr>
        <tr><th>f(x)</th><td>1</td><td>3</td><td>7</td><td>13</td></tr>
      </table>
      <p>Interpola <strong>f(0.5)</strong>. El punto de interés está cerca del <em>inicio</em> de la tabla.</p>`,
    correctMethod: "newton_adelante",
    methodOptions: [
      "interpolacion_lineal",
      "newton_adelante",
      "newton_atras",
      "lagrange"
    ],
    intermediateValue: 0.5,      // s = (0.5−0)/1
    finalValue: 1.75,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Newton hacia Adelante (punto cerca del inicio).<br>
      Δf₀=2, Δ²f₀=2, Δ³f₀=0.<br>
      <strong>s</strong> = (0.5−0)/1 = <em>0.5</em>.<br>
      f(0.5) = 1 + 0.5·2 + [0.5·(−0.5)/2]·2 = 1 + 1 − 0.25 = <em>1.75</em>.`
  },
  {
    id: "1-3",
    statement: `
      <p>Misma tabla con h = 1:</p>
      <table class="data-table">
        <tr><th>x</th><td>0</td><td>1</td><td>2</td><td>3</td></tr>
        <tr><th>f(x)</th><td>1</td><td>3</td><td>7</td><td>13</td></tr>
      </table>
      <p>Interpola <strong>f(2.5)</strong>. El punto de interés está cerca del <em>final</em> de la tabla.</p>`,
    correctMethod: "newton_atras",
    methodOptions: [
      "interpolacion_lineal",
      "newton_adelante",
      "newton_atras",
      "lagrange"
    ],
    intermediateValue: -0.5,     // p = (2.5−3)/1
    finalValue: 9.75,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Newton hacia Atrás (punto cerca del final).<br>
      ∇f₃=6, ∇²f₃=2, ∇³f₃=0.<br>
      <strong>p</strong> = (2.5−3)/1 = <em>−0.5</em>.<br>
      f(2.5) = 13 + (−0.5)·6 + [(−0.5)·(0.5)/2]·2 = 13−3−0.25 = <em>9.75</em>.`
  },
  {
    id: "1-4",
    statement: `
      <p>Datos conocidos:</p>
      <table class="data-table">
        <tr><th>x</th><td>0</td><td>2</td></tr>
        <tr><th>f(x)</th><td>5</td><td>9</td></tr>
      </table>
      <p>Calcula <strong>f(1.5)</strong>.</p>`,
    correctMethod: "interpolacion_lineal",
    methodOptions: [
      "interpolacion_lineal",
      "newton_adelante",
      "newton_atras",
      "lagrange"
    ],
    intermediateValue: 2,        // h = 2−0
    finalValue: 8,               // f(1.5) = 5 + (9−5)/2·1.5 = 8
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Interpolación Lineal (solo 2 puntos dados).<br>
      h = 2 − 0 = <em>2</em>.<br>
      f(1.5) = 5 + [(9−5)/2]·1.5 = 5 + 2·1.5 = <em>8</em>.`
  },
  {
    id: "1-5",
    statement: `
      <p>Tabla equidistante con h = 1:</p>
      <table class="data-table">
        <tr><th>x</th><td>1</td><td>2</td><td>3</td><td>4</td></tr>
        <tr><th>f(x)</th><td>3</td><td>7</td><td>13</td><td>21</td></tr>
      </table>
      <p>Interpola <strong>f(1.5)</strong>. Elige el método más adecuado para un punto cercano al <em>inicio</em>.</p>`,
    correctMethod: "newton_adelante",
    methodOptions: [
      "interpolacion_lineal",
      "newton_adelante",
      "newton_atras",
      "lagrange"
    ],
    intermediateValue: 0.5,      // s = (1.5−1)/1
    finalValue: 4.75,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Newton hacia Adelante.<br>
      Δf₀=4, Δ²f₀=2, Δ³f₀=0.<br>
      s = (1.5−1)/1 = <em>0.5</em>.<br>
      f(1.5) = 3 + 0.5·4 + [0.5·(−0.5)/2]·2 = 3+2−0.25 = <em>4.75</em>.`
  }
];

// ============================================================
//  NIVEL 2 — 6 preguntas (Bisección, Newton-Raphson, Falsa Posición)
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
      <strong>Método correcto:</strong> Bisección (se da intervalo con cambio de signo).<br>
      It.1: xᵣ=(1+2)/2=<em>1.5</em>, f(1.5)=0.25>0 → [1,1.5].<br>
      It.2: xᵣ=1.25, f(1.25)=−0.4375<0 → [1.25,1.5].<br>
      It.3: xᵣ=<em>1.375</em>, f(1.375)=−0.109<0 → [1.375,1.5].`
  },
  {
    id: "2-2",
    statement: `
      <p>Aplica <strong>una iteración</strong> de Newton-Raphson a <strong>f(x) = x² − 3</strong>
      con punto inicial <strong>x₀ = 2</strong>.</p>`,
    correctMethod: "newton_raphson",
    methodOptions: ["biseccion", "falsa_posicion", "newton_raphson", "secante"],
    intermediateValue: 4,        // f'(x₀) = 2x₀ = 4
    finalValue: 1.75,            // x₁ = 2 − 1/4
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Newton-Raphson (punto inicial y función diferenciable).<br>
      f'(x) = 2x → f'(2) = <em>4</em>.<br>
      x₁ = 2 − (4−3)/4 = 2 − 0.25 = <em>1.75</em>.`
  },
  {
    id: "2-3",
    statement: `
      <p>Aplica <strong>una iteración</strong> de Falsa Posición a <strong>f(x) = x² − 5</strong>
      en el intervalo <strong>[2, 3]</strong>.</p>
      <p>f(2) = −1,  f(3) = 4.</p>`,
    correctMethod: "falsa_posicion",
    methodOptions: ["biseccion", "falsa_posicion", "newton_raphson", "secante"],
    intermediateValue: 2.2,      // xr = 3 − 4·(2−3)/(−1−4) = 2.2
    finalValue: 2.2,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Falsa Posición (usa los valores de f para ponderar).<br>
      xᵣ = 3 − 4·(2−3)/(−1−4) = 3 − 4·(−1)/(−5) = 3 − 0.8 = <em>2.2</em>.`
  },
  {
    id: "2-4",
    statement: `
      <p>Aplica <strong>una iteración</strong> de Newton-Raphson a <strong>f(x) = x³ − 2x − 5</strong>
      con <strong>x₀ = 2</strong>.</p>`,
    correctMethod: "newton_raphson",
    methodOptions: ["biseccion", "falsa_posicion", "newton_raphson", "secante"],
    intermediateValue: 10,       // f'(2) = 3(4)−2 = 10
    finalValue: 2.1,             // x₁ = 2 − (−1)/10
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Newton-Raphson.<br>
      f(2)=8−4−5=−1. f'(x)=3x²−2 → f'(2)=12−2=<em>10</em>.<br>
      x₁ = 2 − (−1)/10 = <em>2.1</em>.`
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
      <strong>Método correcto:</strong> Bisección.<br>
      It.1: xᵣ=<em>1.5</em>, f(1.5)=−0.125<0 → [1.5,2].<br>
      It.2: xᵣ=1.75, f(1.75)=1.609>0 → [1.5,1.75].<br>
      It.3: xᵣ=<em>1.625</em>, f(1.625)=0.666>0 → [1.5,1.625].`
  },
  {
    id: "2-6",
    statement: `
      <p>Aplica <strong>una iteración</strong> de Falsa Posición a <strong>f(x) = x² − 6</strong>
      en el intervalo <strong>[2, 3]</strong>.</p>
      <p>f(2) = −2,  f(3) = 3.</p>`,
    correctMethod: "falsa_posicion",
    methodOptions: ["biseccion", "falsa_posicion", "newton_raphson", "secante"],
    intermediateValue: 2.4,      // xr = 3 − 3·(2−3)/(−2−3) = 2.4
    finalValue: 2.4,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método correcto:</strong> Falsa Posición.<br>
      xᵣ = 3 − 3·(2−3)/(−2−3) = 3 − 3·(−1)/(−5) = 3 − 0.6 = <em>2.4</em>.`
  }
];

// ============================================================
//  NIVEL 3 — 7 preguntas (Trapecio, Simpson 1/3 y 3/8, Gauss, Seidel)
// ============================================================
LEVELS[2].questions = [
  {
    id: "3-1",
    statement: `
      <p>Aproxima <strong>∫₀² x² dx</strong> con <strong>n = 4</strong> subintervalos.</p>
      <p>Usa la regla de integración más simple (trapecios).</p>`,
    correctMethod: "trapecio",
    methodOptions: ["trapecio", "simpson13", "simpson38", "gauss_eliminacion"],
    intermediateValue: 0.5,      // h = 2/4
    finalValue: 2.75,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método:</strong> Trapecio. h=(2−0)/4=<em>0.5</em>.<br>
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
      <strong>Método:</strong> Simpson 1/3 (n par, máxima precisión para cúbicas). h=<em>0.25</em>.<br>
      f: 0, 0.015625, 0.125, 0.421875, 1.<br>
      S = 0.25/3·(0+4·0.015625+2·0.125+4·0.421875+1) = 0.0833·3 = <em>0.25</em>.`
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
      <strong>Método:</strong> Simpson 3/8 (n múltiplo de 3). h=<em>1</em>.<br>
      f: 0, 1, 4, 9.<br>
      S = 3·1/8·(0+3·1+3·4+9) = 0.375·24 = <em>9</em>.`
  },
  {
    id: "3-4",
    statement: `
      <p>Resuelve el sistema lineal:</p>
      <pre class="math-block">  2x + y = 5
   x + 3y = 7</pre>
      <p>Usa <strong>Eliminación Gaussiana</strong> (sin sustitución iterativa).</p>`,
    correctMethod: "gauss_eliminacion",
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
    methodOptions: ["gauss_eliminacion", "gauss_jordan", "gauss_seidel", "simpson13"],
    intermediateValue: 2.25,     // x₁⁽¹⁾ = 9/4
    finalValue: 1.7708,          // x₁ tras 2 iter (≈ 1.7708)
    tolerance: 0.001,
    explanation: `
      <strong>Método:</strong> Gauss-Seidel.<br>
      It.1: x=(9−0)/4=<em>2.25</em>; y=(8−2.25)/3=1.9167.<br>
      It.2: x=(9−1.9167)/4=<em>1.7708</em>; y=2.0764.`
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
      <strong>Método:</strong> Trapecio. h=<em>0.5</em>.<br>
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
      <strong>Método:</strong> Simpson 1/3. h=<em>0.5</em>.<br>
      f: 0, 0.125, 1, 3.375, 8.<br>
      S = 0.5/3·(0+4·0.125+2·1+4·3.375+8) = 0.1667·24 = <em>4.0</em>.`
  }
];

// ============================================================
//  NIVEL 4 — 8 preguntas (Euler, RK4, Newton Adelante/Atrás, Lagrange)
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
      <strong>Método:</strong> Euler (un paso, sin pendientes auxiliares).<br>
      k₁ = 0.1·f(0,1) = 0.1·(0+1) = <em>0.1</em>.<br>
      y₁ = 1 + 0.1 = <em>1.1</em>.`
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
      <strong>Método:</strong> Runge-Kutta 4º orden (mayor precisión).<br>
      k₁=0.1·1=<em>0.1</em>, k₂=0.11, k₃=0.1105, k₄=0.12105.<br>
      y₁ = 1+(0.1+2·0.11+2·0.1105+0.12105)/6 ≈ <em>1.1103</em>.`
  },
  {
    id: "4-3",
    statement: `
      <p>Tabla equidistante con h = 1:</p>
      <table class="data-table">
        <tr><th>x</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
        <tr><th>f(x)</th><td>1</td><td>2</td><td>5</td><td>10</td><td>17</td></tr>
      </table>
      <p>Interpola <strong>f(0.5)</strong>. El punto está cerca del <em>inicio</em> de la tabla.</p>`,
    correctMethod: "newton_adelante",
    methodOptions: ["newton_adelante", "newton_atras", "lagrange", "euler"],
    intermediateValue: 0.5,      // s = 0.5
    finalValue: 1.25,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método:</strong> Newton Adelante. Δf₀=1, Δ²f₀=2, Δ³f₀=0.<br>
      s = (0.5−0)/1 = <em>0.5</em>.<br>
      f(0.5)=1+0.5·1+[0.5·(−0.5)/2]·2=1+0.5−0.25=<em>1.25</em>.`
  },
  {
    id: "4-4",
    statement: `
      <p>Misma tabla de 5 puntos con h = 1:</p>
      <table class="data-table">
        <tr><th>x</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
        <tr><th>f(x)</th><td>1</td><td>2</td><td>5</td><td>10</td><td>17</td></tr>
      </table>
      <p>Interpola <strong>f(3.5)</strong>. El punto está cerca del <em>final</em> de la tabla.</p>`,
    correctMethod: "newton_atras",
    methodOptions: ["newton_adelante", "newton_atras", "lagrange", "runge_kutta"],
    intermediateValue: -0.5,     // p = (3.5−4)/1
    finalValue: 13.25,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método:</strong> Newton Atrás. ∇f₄=7, ∇²f₄=2, ∇³f₄=0.<br>
      p = (3.5−4)/1 = <em>−0.5</em>.<br>
      f(3.5)=17+(−0.5)·7+[(−0.5)·(0.5)/2]·2=17−3.5−0.25=<em>13.25</em>.`
  },
  {
    id: "4-5",
    statement: `
      <p>Dado el conjunto de puntos:</p>
      <table class="data-table">
        <tr><th>x</th><td>0</td><td>1</td><td>2</td></tr>
        <tr><th>f(x)</th><td>1</td><td>3</td><td>7</td></tr>
      </table>
      <p>Interpola <strong>f(0.5)</strong> usando polinomios base. La tabla no es equidistante en la interpretación del método.</p>`,
    correctMethod: "lagrange",
    methodOptions: ["newton_adelante", "newton_atras", "lagrange", "euler"],
    intermediateValue: 0.375,    // L₀(0.5) = (0.5−1)(0.5−2)/((0−1)(0−2)) = 0.375
    finalValue: 1.75,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método:</strong> Lagrange (uso explícito de polinomios base).<br>
      L₀(0.5)=(−0.5)(−1.5)/(2)=<em>0.375</em>; L₁=0.75; L₂=−0.125.<br>
      f(0.5)=1·0.375+3·0.75+7·(−0.125)=0.375+2.25−0.875=<em>1.75</em>.`
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
      <strong>Método:</strong> Euler.<br>
      k₁ = 0.5·f(0,0) = 0.5·(−2·0+4) = 0.5·4 = <em>2.0</em>.<br>
      I(0.5) = 0 + 2.0 = <em>2.0</em>.`
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
      <strong>Método:</strong> Runge-Kutta 4°. k₁=<em>−16</em>, k₂=−14.4, k₃=−14.56, k₄=−13.088.<br>
      T₁=100+(−16+2·(−14.4)+2·(−14.56)+(−13.088))/6 ≈ <em>85.499</em>.`
  },
  {
    id: "4-8",
    statement: `
      <p>Puntos de datos:</p>
      <table class="data-table">
        <tr><th>x</th><td>0</td><td>2</td><td>4</td></tr>
        <tr><th>f(x)</th><td>1</td><td>5</td><td>17</td></tr>
      </table>
      <p>Interpola <strong>f(1)</strong> usando el método de polinomios base de Lagrange.</p>`,
    correctMethod: "lagrange",
    methodOptions: ["newton_adelante", "newton_atras", "lagrange", "runge_kutta"],
    intermediateValue: 0.375,    // L₀(1) = (1−2)(1−4)/((0−2)(0−4))
    finalValue: 2.0,
    tolerance: TOLERANCE,
    explanation: `
      <strong>Método:</strong> Lagrange.<br>
      L₀(1)=(−1)(−3)/8=3/8=<em>0.375</em>; L₁(1)=3/4; L₂(1)=−1/8.<br>
      f(1)=1·0.375+5·0.75+17·(−0.125)=0.375+3.75−2.125=<em>2.0</em>.`
  }
];

// ============================================================
//  NIVEL 5 — 10 preguntas (todos los métodos, alta complejidad)
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
      Bisección: It.1 xᵣ=<em>1.5</em> f=−1.625<0→[1.5,2]. It.2 xᵣ=1.75 f=0.359>0→[1.5,1.75]. It.3 xᵣ=<em>1.625</em>.`
  },
  {
    id: "5-2",
    statement: `
      <p>Aplica <strong>una iteración</strong> de Newton-Raphson a:</p>
      <pre class="math-block">  f(x) = x⁴ − 2x² − 3,   x₀ = 2</pre>`,
    correctMethod: "newton_raphson",
    methodOptions: ["biseccion", "falsa_posicion", "newton_raphson", "secante"],
    intermediateValue: 24,       // f'(2) = 4·8−4·2 = 24
    finalValue: 1.7917,          // x₁ = 2 − 5/24
    tolerance: 0.001,
    explanation: `
      f(2)=16−8−3=5. f'(x)=4x³−4x → f'(2)=32−8=<em>24</em>. x₁=2−5/24≈<em>1.7917</em>.`
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
      Simpson 1/3. h=<em>1</em>. f: 0,2,6,12,20. S=1/3·(0+8+12+48+20)=88/3≈<em>29.333</em>.`
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
      RK4. k₁=<em>9.8</em>, k₂=8.82, k₃=8.918, k₄=8.0164. v₁=(9.8+17.64+17.836+8.0164)/6≈<em>8.882</em>.`
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
      Gauss-Jordan (lleva a identidad, sin sustitución). m₂₁=1/3≈<em>0.3333</em>. Tras reducción: x=<em>2</em>, y=1.`
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
      Gauss-Seidel. It.1: x=12/5=<em>2.4</em>; y=1.65. It.2: x=2.07; y=1.7325. It.3: x≈<em>2.0535</em>.`
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
    methodOptions: ["biseccion", "falsa_posicion", "newton_raphson", "secante"],
    intermediateValue: 0.5,
    finalValue: 0.6364,
    tolerance: 0.001,
    explanation: `
      It.1: xᵣ=1−1·(0−1)/(−1−1)=<em>0.5</em>; f(0.5)=−0.375→[0.5,1].
      It.2: xᵣ=1−1·(0.5−1)/(−0.375−1)≈<em>0.6364</em>.`
  },
  {
    id: "5-9",
    statement: `
      <p>Tabla equidistante con h = 2:</p>
      <table class="data-table">
        <tr><th>x</th><td>0</td><td>2</td><td>4</td><td>6</td><td>8</td></tr>
        <tr><th>f(x)</th><td>3</td><td>11</td><td>27</td><td>51</td><td>83</td></tr>
      </table>
      <p>Interpola <strong>f(1)</strong> (punto cercano al inicio).</p>`,
    correctMethod: "newton_adelante",
    methodOptions: ["newton_adelante", "newton_atras", "lagrange", "euler"],
    intermediateValue: 0.5,      // s = (1−0)/2
    finalValue: 6,
    tolerance: TOLERANCE,
    explanation: `
      Newton Adelante, h=2. Δ¹f₀=8, Δ²f₀=8, Δ³=0. s=(1−0)/2=<em>0.5</em>.
      f(1)=3+0.5·8+[0.5·(−0.5)/2]·8=3+4−1=<em>6</em>.`
  },
  {
    id: "5-10",
    statement: `
      <p>Puntos (tabla no equidistante):</p>
      <table class="data-table">
        <tr><th>x</th><td>0</td><td>1</td><td>3</td><td>4</td></tr>
        <tr><th>f(x)</th><td>2</td><td>4</td><td>14</td><td>22</td></tr>
      </table>
      <p>Interpola <strong>f(2)</strong> usando Lagrange.</p>`,
    correctMethod: "lagrange",
    methodOptions: ["newton_adelante", "newton_atras", "lagrange", "runge_kutta"],
    intermediateValue: -0.1667,  // L₀(2) = −1/6
    finalValue: 8,
    tolerance: 0.001,
    explanation: `
      L₀(2)=(2−1)(2−3)(2−4)/((0−1)(0−3)(0−4))=(1)(−1)(−2)/(−12)=−1/6≈<em>−0.1667</em>.
      f(2)=2·(−1/6)+4·(2/3)+14·(2/3)+22·(−1/6)=−4+12=<em>8</em>.`
  }
];
