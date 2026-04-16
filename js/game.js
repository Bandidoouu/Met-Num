// ============================================================
//  GAME ENGINE — Métodos Numéricos Quiz
// ============================================================

const Game = (() => {
  // ── Estado ─────────────────────────────────────────────────
  let state = {
    currentLevelIdx: 0,
    currentQuestionIdx: 0,
    levelScore: 0,
    levelQuestions: [],       // orden aleatorio del nivel actual
    answered: false,
    totalLevelScores: [],     // solo el mejor/último intento por nivel
    questionResults: [],      // historial de respuestas del nivel actual
    isRetry: false
  };

  // ── Utilidades ─────────────────────────────────────────────
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function near(a, b, tol) {
    return Math.abs(parseFloat(a) - parseFloat(b)) <= tol;
  }

  function $(id) { return document.getElementById(id); }

  // ── Pantallas (con animación fade) ────────────────────────
  function showScreen(id) {
    const next = $(id);
    const current = document.querySelector('.screen.active');
    if (current && current !== next) {
      current.classList.add('fade-out');
      setTimeout(() => {
        current.classList.remove('active', 'fade-out');
        next.classList.add('active', 'fade-in');
        setTimeout(() => next.classList.remove('fade-in'), 350);
        window.scrollTo(0, 0);
      }, 220);
    } else {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      next.classList.add('active');
      window.scrollTo(0, 0);
    }
  }

  // ── Inicio ─────────────────────────────────────────────────
  function startGame() {
    state.currentLevelIdx = 0;
    state.totalLevelScores = [];
    startLevel(0);
  }

  function startLevel(idx, retry = false) {
    const level = LEVELS[idx];
    state.currentLevelIdx = idx;
    state.currentQuestionIdx = 0;
    state.levelScore = 0;
    state.answered = false;
    state.isRetry = retry;
    state.questionResults = [];
    state.levelQuestions = shuffle(level.questions);

    // Pantalla de intro de nivel
    $('intro-badge').textContent = retry ? 'REINTENTO' : (idx === 0 ? 'INICIO' : 'NUEVO NIVEL');
    $('intro-level-name').textContent = level.name;
    $('intro-level-desc').textContent = level.description;
    $('intro-threshold').textContent = level.threshold
      ? `Necesitas ${level.threshold} de ${level.maxPoints} puntos para avanzar.`
      : `Nivel final — sin umbral. Tu puntaje total determina tu calificación.`;

    // Detalle de puntuación
    const s = level.scoring;
    $('intro-scoring').textContent =
      `Puntuación por pregunta: Método +${s.method} pt${s.method>1?'s':''} · ` +
      `Valor intermedio +${s.intermediate} pt${s.intermediate>1?'s':''} · ` +
      `Resultado final +${s.final} pt${s.final>1?'s':''}`;

    showScreen('screen-level-intro');
  }

  // ── Pregunta ───────────────────────────────────────────────
  function loadQuestion() {
    const level = LEVELS[state.currentLevelIdx];
    const q = state.levelQuestions[state.currentQuestionIdx];
    state.answered = false;

    // Header
    $('hdr-level').textContent = level.name;
    $('hdr-progress').textContent =
      `${state.currentQuestionIdx + 1} / ${state.levelQuestions.length}`;
    $('hdr-score').textContent = `Puntos: ${state.levelScore}`;
    $('hdr-threshold').textContent = level.threshold
      ? `Meta: ${level.threshold} pts`
      : 'Nivel final';

    // Barra de progreso hacia el umbral (o máximo si no hay umbral)
    const target = level.threshold ?? level.maxPoints;
    const pct = Math.min(100, (state.levelScore / target) * 100);
    $('progress-bar-fill').style.width = pct + '%';
    $('progress-label-txt').textContent = level.threshold
      ? `${state.levelScore} / ${level.threshold} pts requeridos para avanzar`
      : `${state.levelScore} / ${level.maxPoints} pts acumulados`;

    // Enunciado
    $('question-statement').innerHTML = q.statement;

    // Opciones de método (orden aleatorio)
    const optionsContainer = $('method-options');
    optionsContainer.innerHTML = '';
    const shuffled = shuffle(q.methodOptions);
    shuffled.forEach(key => {
      const info = METHOD_INFO[key];
      const div = document.createElement('div');
      div.className = 'method-option';
      div.innerHTML = `
        <label>
          <input type="radio" name="method" value="${key}">
          <span class="method-label">${info.label}</span>
          <span class="method-formula">${info.formula}</span>
        </label>`;
      optionsContainer.appendChild(div);
    });

    // Listener para etiqueta dinámica del valor intermedio
    optionsContainer.querySelectorAll('input[type=radio]').forEach(radio => {
      radio.addEventListener('change', () => {
        const info = METHOD_INFO[radio.value];
        $('intermediate-label').textContent = info ? info.intermediateLabel : 'Valor intermedio';
      });
    });

    // Reset campos
    $('intermediate-label').textContent = 'Selecciona el método para ver la etiqueta';
    $('input-intermediate').value = '';
    $('input-final').value = '';
    $('feedback-area').innerHTML = '';
    $('feedback-area').className = 'feedback-area';
    $('btn-verify').disabled = false;
    $('btn-next').style.display = 'none';

    showScreen('screen-question');
  }

  // ── Verificar ──────────────────────────────────────────────
  function verify() {
    if (state.answered) return;
    const level = LEVELS[state.currentLevelIdx];
    const q = state.levelQuestions[state.currentQuestionIdx];
    const scoring = level.scoring;

    const selectedMethod = document.querySelector('input[name="method"]:checked');
    const intermediateRaw = $('input-intermediate').value.trim();
    const finalRaw = $('input-final').value.trim();

    // Validaciones básicas de UI
    if (!selectedMethod) {
      showToast('Selecciona un método primero.');
      return;
    }
    if (intermediateRaw === '' || finalRaw === '') {
      showToast('Ingresa el valor intermedio y el resultado final.');
      return;
    }
    if (isNaN(parseFloat(intermediateRaw)) || isNaN(parseFloat(finalRaw))) {
      showToast('Ingresa valores numéricos válidos.');
      return;
    }

    state.answered = true;
    $('btn-verify').disabled = true;

    const methodOk = selectedMethod.value === q.correctMethod;
    const tolerance = q.tolerance ?? TOLERANCE;
    const intermediateOk = near(intermediateRaw, q.intermediateValue, tolerance);
    const finalOk = near(finalRaw, q.finalValue, tolerance);

    let earned = 0;
    if (methodOk) earned += scoring.method;
    if (intermediateOk) earned += scoring.intermediate;
    if (finalOk) earned += scoring.final;
    state.levelScore += earned;

    // Registro histórico del nivel
    state.questionResults.push({
      num: state.currentQuestionIdx + 1,
      methodOk, intermediateOk, finalOk,
      earned,
      maxPts: scoring.method + scoring.intermediate + scoring.final
    });

    // Feedback visual en opciones
    document.querySelectorAll('input[name="method"]').forEach(radio => {
      const opt = radio.closest('.method-option');
      if (radio.value === q.correctMethod) opt.classList.add('correct-option');
      if (radio.checked && radio.value !== q.correctMethod) opt.classList.add('wrong-option');
    });

    // Área de feedback
    const fb = $('feedback-area');
    fb.className = 'feedback-area ' + (earned > 0 ? 'has-feedback' : 'has-feedback wrong');
    fb.innerHTML = `
      <div class="feedback-row ${methodOk ? 'ok' : 'ko'}">
        ${methodOk ? '✔' : '✘'} <strong>Método</strong>:
        ${methodOk ? 'Correcto' : `Incorrecto — era <em>${METHOD_INFO[q.correctMethod].label}</em>`}
        (${methodOk ? '+' + scoring.method : '0'} pt${scoring.method > 1 ? 's' : ''})
      </div>
      <div class="feedback-row ${intermediateOk ? 'ok' : 'ko'}">
        ${intermediateOk ? '✔' : '✘'} <strong>Valor intermedio</strong>:
        ${intermediateOk ? 'Correcto' : `Incorrecto — esperado <em>${q.intermediateValue}</em> (tol. ±${tolerance})`}
        (${intermediateOk ? '+' + scoring.intermediate : '0'} pt${scoring.intermediate > 1 ? 's' : ''})
      </div>
      <div class="feedback-row ${finalOk ? 'ok' : 'ko'}">
        ${finalOk ? '✔' : '✘'} <strong>Resultado final</strong>:
        ${finalOk ? 'Correcto' : `Incorrecto — esperado <em>${q.finalValue}</em> (tol. ±${tolerance})`}
        (${finalOk ? '+' + scoring.final : '0'} pt${scoring.final > 1 ? 's' : ''})
      </div>
      <div class="feedback-earned">Puntos en esta pregunta: <strong>${earned}</strong> / ${scoring.method + scoring.intermediate + scoring.final}</div>
      <details class="explanation">
        <summary>Ver explicación del procedimiento</summary>
        <div class="explanation-body">${q.explanation}</div>
      </details>`;

    // Actualizar header y barra
    $('hdr-score').textContent = `Puntos: ${state.levelScore}`;
    const target = level.threshold ?? level.maxPoints;
    const newPct = Math.min(100, (state.levelScore / target) * 100);
    $('progress-bar-fill').style.width = newPct + '%';
    $('progress-label-txt').textContent = level.threshold
      ? `${state.levelScore} / ${level.threshold} pts requeridos para avanzar`
      : `${state.levelScore} / ${level.maxPoints} pts acumulados`;

    $('btn-next').style.display = 'inline-block';
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── Siguiente pregunta o fin de nivel ──────────────────────
  function nextQuestion() {
    state.currentQuestionIdx++;
    if (state.currentQuestionIdx < state.levelQuestions.length) {
      loadQuestion();
    } else {
      showLevelEnd();
    }
  }

  // ── Fin de nivel ───────────────────────────────────────────
  function showLevelEnd() {
    const level = LEVELS[state.currentLevelIdx];
    const score = state.levelScore;
    const passed = level.threshold === null || score >= level.threshold;

    // Guardar resultado: sustituir entrada anterior del mismo nivel si existe
    const existing = state.totalLevelScores.findIndex(e => e.level === level.id);
    const entry = { level: level.id, name: level.name, score, maxPoints: level.maxPoints, passed };
    if (existing >= 0) state.totalLevelScores[existing] = entry;
    else state.totalLevelScores.push(entry);

    $('end-level-name').textContent = level.name;
    $('end-score').textContent = score;
    $('end-max').textContent = level.maxPoints;

    // ── Desglose por pregunta ──
    const s = level.scoring;
    const desglose = state.questionResults.map(r => `
      <tr>
        <td class="td-center">P${r.num}</td>
        <td class="td-center ${r.methodOk ? 'ok-cell':'ko-cell'}">${r.methodOk ? '✔':'✘'}</td>
        <td class="td-center ${r.intermediateOk ? 'ok-cell':'ko-cell'}">${r.intermediateOk ? '✔':'✘'}</td>
        <td class="td-center ${r.finalOk ? 'ok-cell':'ko-cell'}">${r.finalOk ? '✔':'✘'}</td>
        <td class="td-center"><strong>${r.earned}</strong>/${r.maxPts}</td>
      </tr>`).join('');

    $('end-breakdown').innerHTML = `
      <table class="breakdown-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Método<br><small>±${s.method}pt</small></th>
            <th>Interm.<br><small>±${s.intermediate}pt</small></th>
            <th>Final<br><small>±${s.final}pt</small></th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>${desglose}</tbody>
      </table>`;

    const msgEl = $('end-message');
    const actionsEl = $('end-actions');

    if (level.threshold === null) {
      msgEl.innerHTML = `Nivel final completado. Puntaje: <strong>${score} / ${level.maxPoints}</strong>.`;
      msgEl.className = 'end-message final';
      actionsEl.innerHTML = `<button class="btn btn-primary" onclick="Game.showFinalResults()">Ver resultados finales</button>`;
    } else if (passed) {
      const extra = score - level.threshold;
      msgEl.innerHTML = `¡Superaste el nivel! <strong>${score} pts</strong> — ${extra} pt${extra!==1?'s':''} sobre el umbral.`;
      msgEl.className = 'end-message passed';
      if (state.currentLevelIdx < LEVELS.length - 1) {
        actionsEl.innerHTML = `
          <button class="btn btn-primary" onclick="Game.advanceLevel()">Avanzar al Nivel ${level.id + 1} →</button>
          <button class="btn btn-secondary" onclick="Game.retryLevel()">Repetir este nivel</button>`;
      } else {
        actionsEl.innerHTML = `<button class="btn btn-primary" onclick="Game.showFinalResults()">Ver resultados finales</button>`;
      }
    } else {
      const needed = level.threshold - score;
      msgEl.innerHTML = `No alcanzaste el umbral. Te faltaron <strong>${needed} pts</strong> (${score} / ${level.threshold} requeridos).`;
      msgEl.className = 'end-message failed';
      actionsEl.innerHTML = `
        <button class="btn btn-primary" onclick="Game.retryLevel()">Reintentar nivel</button>
        <button class="btn btn-secondary" onclick="Game.goToMenu()">Menú principal</button>`;
    }

    showScreen('screen-level-end');
  }

  // ── Avanzar / reintentar ───────────────────────────────────
  function advanceLevel() {
    startLevel(state.currentLevelIdx + 1);
  }

  function retryLevel() {
    startLevel(state.currentLevelIdx, true);
  }

  function goToMenu() {
    showScreen('screen-welcome');
  }

  // ── Resultados finales ─────────────────────────────────────
  function showFinalResults() {
    // Garantizar que todos los niveles completados aparecen en orden
    const rows = state.totalLevelScores
      .sort((a, b) => a.level - b.level)
      .map(s => {
        const pctNivel = Math.round((s.score / s.maxPoints) * 100);
        return `<tr>
          <td>${s.name}</td>
          <td class="td-center">${s.score} / ${s.maxPoints}<br>
            <small style="color:var(--text-muted)">(${pctNivel}%)</small></td>
          <td class="td-center ${s.passed ? 'passed-cell' : 'failed-cell'}">
            ${s.passed ? '✔ Aprobado' : '✘ No aprobado'}</td>
        </tr>`;
      }).join('');

    const totalEarned = state.totalLevelScores.reduce((a, s) => a + s.score, 0);
    const totalMax    = state.totalLevelScores.reduce((a, s) => a + s.maxPoints, 0);
    const pct = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;

    // Calificación sobre 100 basada en % de puntos totales
    let grade = 'F', gradeLabel = '';
    if (pct >= 90) { grade = 'A'; gradeLabel = 'Excelente'; }
    else if (pct >= 80) { grade = 'B'; gradeLabel = 'Muy bien'; }
    else if (pct >= 70) { grade = 'C'; gradeLabel = 'Bien'; }
    else if (pct >= 60) { grade = 'D'; gradeLabel = 'Suficiente'; }
    else { grade = 'F'; gradeLabel = 'Insuficiente'; }

    $('final-table-body').innerHTML = rows || '<tr><td colspan="3" style="text-align:center;color:var(--text-muted)">Sin niveles completados</td></tr>';
    $('final-total').textContent = `${totalEarned} / ${totalMax}  (${pct}%)`;
    $('final-grade').textContent = grade;
    $('final-grade').className = 'grade grade-' + grade.toLowerCase();
    $('final-grade-label').textContent = gradeLabel;

    showScreen('screen-final');
  }

  // ── Toast ──────────────────────────────────────────────────
  function showToast(msg) {
    let t = $('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }

  // ── Exponer API pública ────────────────────────────────────
  return { startGame, startLevel, loadQuestion, verify, nextQuestion, advanceLevel, retryLevel, goToMenu, showFinalResults };
})();

// ── Event listeners (se añaden tras DOMContentLoaded) ────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-start').addEventListener('click', Game.startGame);
  document.getElementById('btn-begin-level').addEventListener('click', Game.loadQuestion);
  document.getElementById('btn-verify').addEventListener('click', Game.verify);
  document.getElementById('btn-next').addEventListener('click', Game.nextQuestion);

  // Enter en campos numéricos → verificar
  ['input-intermediate', 'input-final'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') Game.verify();
    });
  });
});
