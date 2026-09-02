(() => {
  "use strict";

  const config = window.DASHBOARD_CONFIG || {};
  const dashboard = document.getElementById("dashboard");
  const nav = document.getElementById("session-nav");
  const status = document.getElementById("data-status");
  const updatedAt = document.getElementById("updated-at");
  const subtitle = document.getElementById("session-subtitle");
  const sessionTitle = document.getElementById("session-title");
  const exportButton = document.getElementById("export-button");
  const adminButton = document.getElementById("admin-button");
  const formatNumber = new Intl.NumberFormat("vi-VN");
  const urlParams = new URLSearchParams(location.search);
  const fakeMode = urlParams.get("demo") === "1";
  const fakePhase = fakeMode && ["live", "closed"].includes(urlParams.get("trangthai"))
    ? urlParams.get("trangthai").toUpperCase()
    : "";

  let payload = null;
  let activeSession = getSessionFromUrl();
  let selectedQuestion = 0;
  let responseSearch = "";
  let closedLivePreview = false;
  let timer = null;
  let isLoading = false;
  const detailStates = new Map();
  const scrollStates = new Map();

  configureAdminLinks();

  const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function configureAdminLinks() {
    if (!config.adminUrl) {
      exportButton.hidden = true;
      adminButton.hidden = true;
      return;
    }
    const separator = config.adminUrl.includes("?") ? "&" : "?";
    adminButton.href = `${config.adminUrl}${separator}admin=1&view=control`;
    exportButton.addEventListener("click", event => {
      event.preventDefault();
      window.open(`${config.adminUrl}${separator}admin=1&view=export&session=${activeSession}`, "_blank", "noopener");
    });
  }

  function getSessionFromUrl() {
    const value = Number(urlParams.get("phien"));
    return value >= 1 && value <= 9 ? value : 1;
  }

  function phaseOf(session) {
    return fakePhase || (session.phase === "LIVE" ? "LIVE" : "CLOSED");
  }

  function setStatus(mode, text) {
    status.className = `status status-${mode}`;
    status.textContent = text;
  }

  async function loadData(forceRefresh = false) {
    if (isLoading) return;
    isLoading = true;
    if (!payload) setStatus("loading", "Đang tải dữ liệu…");
    try {
      const dataUrl = fakeMode ? (config.fakeDataUrl || "data/fake.json") : config.apiUrl;
      if (!dataUrl) throw new Error("DATA_URL_EMPTY");
      const separator = dataUrl.includes("?") ? "&" : "?";
      const force = !fakeMode && forceRefresh === true ? "&refresh=1" : "";
      const response = await fetch(`${dataUrl}${separator}_=${Date.now()}${force}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      payload = await response.json();
      setStatus(fakeMode ? "demo" : "live", fakeMode ? "Dữ liệu giả lập" : "Dữ liệu trực tiếp");
    } catch (error) {
      const response = await fetch(`${config.demoDataUrl || "data/demo.json"}?_=${Date.now()}`, { cache: "no-store" });
      payload = await response.json();
      setStatus(config.apiUrl ? "error" : "demo", config.apiUrl ? "Không kết nối được dữ liệu" : "Chế độ xem trước");
    } finally {
      isLoading = false;
    }
    render();
  }

  function render() {
    captureUiState();
    const sessions = payload?.sessions || [];
    renderNav(sessions);
    const session = sessions.find(item => Number(item.id) === activeSession) || sessions[0];
    if (!session) {
      dashboard.innerHTML = '<div class="empty">Chưa có cấu hình dữ liệu phiên.</div>';
      return;
    }
    selectedQuestion = Math.min(selectedQuestion, Math.max(0, (session.questions?.length || 1) - 1));
    sessionTitle.textContent = `Phiên ${session.id} – ${session.description || session.typeLabel}`;
    subtitle.textContent = session.typeLabel;
    updatedAt.textContent = payload.updatedAt ? `Cập nhật: ${new Date(payload.updatedAt).toLocaleString("vi-VN")}` : "";
    const phase = phaseOf(session);
    const showingClosedLivePreview = phase === "CLOSED" && closedLivePreview;
    const contentPhase = showingClosedLivePreview ? "LIVE" : phase;
    dashboard.dataset.kind = session.kind || "";
    dashboard.dataset.phase = phase;
    dashboard.dataset.view = showingClosedLivePreview ? "live-preview" : phase.toLowerCase();
    dashboard.innerHTML = `
      <section class="section-head">
        <div><p class="section-kicker">KẾT QUẢ PHIÊN ${session.id}</p><h2>${escapeHtml(session.description || session.name)}</h2></div>
        <div class="section-badges"><span class="phase-pill phase-${phase.toLowerCase()}">${phase === "LIVE" ? "Đang nhận bài" : "Đã chốt"}</span><span class="type-pill">${escapeHtml(session.typeLabel)}</span></div>
      </section>
      ${renderClosedViewSwitch(phase, showingClosedLivePreview)}
      ${renderPhaseNotice(session, phase, showingClosedLivePreview)}
      ${renderMetrics(session, contentPhase, showingClosedLivePreview)}
      ${renderSessionContent(session, contentPhase)}
    `;
    restoreUiState();
    bindSessionControls(session);
  }

  function captureUiState() {
    dashboard.querySelectorAll("details[data-ui-state]").forEach(element => {
      detailStates.set(element.dataset.uiState, element.open);
    });
    dashboard.querySelectorAll("[data-ui-scroll]").forEach(element => {
      scrollStates.set(element.dataset.uiScroll, { left: element.scrollLeft, top: element.scrollTop });
    });
  }

  function restoreUiState() {
    dashboard.querySelectorAll("details[data-ui-state]").forEach(element => {
      if (detailStates.has(element.dataset.uiState)) element.open = detailStates.get(element.dataset.uiState);
    });
    dashboard.querySelectorAll("[data-ui-scroll]").forEach(element => {
      const saved = scrollStates.get(element.dataset.uiScroll);
      if (saved) {
        element.scrollLeft = saved.left;
        element.scrollTop = saved.top;
      }
    });
  }

  function renderClosedViewSwitch(phase, showingLivePreview) {
    if (phase !== "CLOSED") return "";
    return `<section class="closed-view-switch"><div class="view-switch-copy"><span>CHẾ ĐỘ HIỂN THỊ</span><strong>${showingLivePreview ? "Màn hình lúc nhận bài" : "Kết quả tổng hợp sau khi chốt"}</strong></div><div class="view-switch-buttons" role="group" aria-label="Chọn chế độ hiển thị"><button type="button" class="${showingLivePreview ? "" : "active"}" data-closed-view="summary">Kết quả tổng hợp</button><button type="button" class="${showingLivePreview ? "active preview" : ""}" data-closed-view="live">Màn hình lúc nhận bài</button></div></section>`;
  }

  function renderPhaseNotice(session, phase, showingLivePreview) {
    if (phase === "LIVE") return "";
    const closedAt = session.closedAt ? new Date(session.closedAt).toLocaleString("vi-VN") : "theo dữ liệu mô phỏng";
    const late = Number(session.lateResponses || 0);
    if (showingLivePreview) return `<div class="phase-notice preview-notice"><strong>Đang xem lại giao diện lúc nhận bài</strong><span>Sử dụng ${formatNumber.format(session.totalResponses || 0)} bài tại thời điểm chốt ${escapeHtml(closedAt)}. Phiên vẫn đã chốt và không nhận thêm dữ liệu vào kết quả này.</span></div>`;
    return `<div class="phase-notice closed-notice"><strong>Số liệu đã chốt: ${formatNumber.format(session.totalResponses || 0)} bài</strong><span>Thời điểm chốt: ${escapeHtml(closedAt)}.${late ? ` Có ${formatNumber.format(late)} bài gửi sau thời điểm chốt và không được cộng vào kết quả.` : ""}</span></div>`;
  }

  function renderNav(sessions) {
    nav.innerHTML = sessions.map(session => {
      const phase = phaseOf(session);
      return `<button class="session-tab ${Number(session.id) === activeSession ? "active" : ""}" data-session="${session.id}" type="button" aria-label="Phiên ${session.id}"><span>${session.id}</span><i class="tab-phase ${phase.toLowerCase()}"></i></button>`;
    }).join("");
    nav.querySelectorAll("[data-session]").forEach(button => button.addEventListener("click", () => {
      activeSession = Number(button.dataset.session);
      selectedQuestion = 0;
      responseSearch = "";
      closedLivePreview = false;
      const params = new URLSearchParams(location.search);
      params.set("phien", activeSession);
      history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
      render();
      scrollTo({ top: 0, behavior: "smooth" });
    }));
  }

  function renderMetrics(session, phase, showingClosedLivePreview = false) {
    if (phase === "LIVE") {
      const responseCount = showingClosedLivePreview ? session.totalResponses : (session.currentResponses ?? session.totalResponses ?? 0);
      const responseNote = showingClosedLivePreview ? "Số bài tại thời điểm chốt" : "Cập nhật theo phản hồi mới";
      return `<section class="metrics metrics-2">${metric("Số bài đã nhận", formatNumber.format(responseCount || 0), responseNote)}${metric("Số đơn vị tham gia", formatNumber.format(session.participatingUnits || 0), "Chỉ tính đơn vị đã có bài")}</section>`;
    }
    const summary = session.quizSummary || {};
    let metrics;
    if (session.kind === "quiz") {
      metrics = [
        metric("Tổng số bài", formatNumber.format(session.totalResponses || 0), "Số bài tại thời điểm chốt"),
        metric("Điểm trung bình", session.scoreStats?.count ? score(session.scoreStats.average) : "—", session.scoreStats?.maxScore ? `Trên thang ${session.scoreStats.maxScore}` : "Chưa có dữ liệu"),
        metric("Tỷ lệ đúng trung bình", session.scoreStats?.count ? `${score(summary.averageCorrectPercent)}%` : "—", "Tính lại từ đáp án chuẩn"),
        Number(session.id) === 9
          ? metric("Đúng cả 2 câu", session.totalResponses ? formatNumber.format(summary.perfectCount || 0) : "—", session.totalResponses ? `${score(summary.perfectRate || 0)}% số bài` : "Chưa có dữ liệu")
          : metric("Số đơn vị tham gia", formatNumber.format(session.participatingUnits || 0), "Đơn vị đã có bài")
      ];
    } else if (session.kind === "ordering") {
      metrics = [metric("Tổng số bài", formatNumber.format(session.totalResponses || 0), "Số bài tại thời điểm chốt"), metric("Đúng hoàn toàn", formatNumber.format(session.ordering?.correctCount || 0), "Đúng toàn bộ 13 bước"), metric("Tỷ lệ đúng", `${score(session.ordering?.correctRate || 0)}%`, "Đúng hoàn toàn"), metric("Phương án khác nhau", formatNumber.format(session.ordering?.uniqueSequenceCount || 0), "Các chuỗi đã được gửi")];
    } else if (session.kind === "true_false") {
      metrics = [metric("Tổng số bài", formatNumber.format(session.totalResponses || 0), "Số bài tại thời điểm chốt"), metric("Tỷ lệ đúng trung bình", session.scoreStats?.count ? `${score(summary.averageCorrectPercent)}%` : "—", "Trên 7 nhận định"), metric("Có giải thích", session.totalResponses ? `${score(session.explanationStats?.rate || 0)}%` : "—", session.totalResponses ? `${formatNumber.format(session.explanationStats?.count || 0)} lượt giải thích` : "Chưa có dữ liệu"), metric("Số đơn vị tham gia", formatNumber.format(session.participatingUnits || 0), "Đơn vị đã có bài")];
    } else {
      metrics = [metric("Tổng phản hồi", formatNumber.format(session.totalResponses || 0), "Bài đã gửi trước khi chốt"), metric("Số đơn vị tham gia", formatNumber.format(session.participatingUnits || 0), "Chỉ tính đơn vị đã có bài")];
    }
    return `<section class="metrics metrics-${metrics.length}">${metrics.join("")}</section>`;
  }

  function metric(label, value, note) {
    return `<article class="metric"><span class="metric-label">${escapeHtml(label)}</span><strong class="metric-value">${escapeHtml(value)}</strong><span class="metric-note">${escapeHtml(note)}</span></article>`;
  }

  function renderSessionContent(session, phase) {
    if (session.error) return `<div class="empty">${escapeHtml(session.error)}</div>`;
    const live = phase === "LIVE";
    let content;
    if (session.kind === "quiz") content = live ? renderLiveQuiz(session) : renderQuizDashboard(session);
    else if (session.kind === "ordering") content = live ? renderLiveOrdering(session) : renderOrderingDashboard(session);
    else if (session.kind === "true_false") content = renderTrueFalseDashboard(session, live);
    else content = renderOpenDashboard(session, live);
    return content + (live ? "" : renderUnitBreakdown(session));
  }

  function renderLiveQuiz(session) {
    const questions = session.questions || [];
    return `<section class="content-grid"><article class="panel full panel-primary">${panelHeading("Tổng quan lựa chọn theo câu", "Chọn một câu để xem 4 phương án")}<div class="overview-legend"><span><i class="segment-0"></i> Phương án A</span><span><i class="segment-1"></i> Phương án B</span><span><i class="segment-2"></i> Phương án C</span><span><i class="segment-3"></i> Phương án D</span></div><div class="quiz-overview">${questions.length ? questions.map((question, index) => {
      const total = Number(question.totalAnswers || 0);
      const options = question.options || [];
      const summary = options.map((option, optionIndex) => `<span class="overview-segment segment-${optionIndex}" style="width:${total ? clampPercent(Number(option.count || 0) / total * 100) : 0}%" title="${escapeHtml(option.label)}: ${formatNumber.format(option.count || 0)} lượt"></span>`).join("");
      return `<details class="quiz-overview-item" data-ui-state="session-${session.id}-quiz-${index}"><summary><span class="overview-number">Câu ${index + 1}</span><span class="overview-title">${escapeHtml(question.title)}</span><span class="overview-total">${formatNumber.format(total)} lượt</span><span class="overview-strip">${summary || '<span class="overview-empty"></span>'}</span><span class="overview-chevron">⌄</span></summary><div class="overview-detail"><div class="expanded-question"><span>CÂU ${index + 1}</span><strong>${escapeHtml(question.title)}</strong></div>${options.length ? options.map((option, optionIndex) => { const percent = total ? Number(option.count || 0) / total * 100 : 0; return `<div class="overview-option option-${optionIndex}"><span class="option-dot segment-${optionIndex}"></span><span class="overview-option-label"><b class="option-letter">${String.fromCharCode(65 + optionIndex)}</b><span>${escapeHtml(option.label)}</span></span><strong>${formatNumber.format(option.count || 0)} <em>lượt</em><br><span>${score(percent)}%</span></strong><div class="overview-option-bar"><i class="segment-${optionIndex}" style="width:${clampPercent(percent)}%"></i></div></div>`; }).join("") : renderInlineEmpty("Chưa có dữ liệu lựa chọn.")}</div></details>`;
    }).join("") : renderInlineEmpty("Chưa có dữ liệu câu hỏi.")}</div></article></section>`;
  }

  function renderQuizDashboard(session) {
    const questions = session.questions || [];
    if (!session.totalResponses && !questions.length) return renderEmpty();
    return `<section class="content-grid">${renderAccuracyChart(questions, Number(session.id) === 4)}${Number(session.id) === 9 ? "" : renderCorrectDistribution(session)}${questions.length ? renderAnswerExplorer(questions) : renderEmpty("Chưa có dữ liệu câu hỏi.")}</section>`;
  }

  function renderAccuracyChart(questions, sortAscending) {
    const source = questions.map((question, index) => ({ ...question, number: index + 1 }));
    if (sortAscending) source.sort((a, b) => Number(a.correctPercent || 0) - Number(b.correctPercent || 0));
    return `<article class="panel ${sortAscending ? "" : "panel-primary"}">${panelHeading("Tỷ lệ trả lời đúng theo câu", "Tổng hợp sau khi chốt phiên")}<div class="horizontal-chart">${source.length ? source.map(question => `<div class="horizontal-row" title="${escapeHtml(question.title)}"><span class="axis-label">Câu ${question.number}</span><div class="bar-track"><div class="bar-fill ${Number(question.correctPercent || 0) < 50 ? "red" : ""}" style="width:${clampPercent(question.correctPercent)}%"></div></div><strong>${score(question.correctPercent || 0)}%</strong></div>`).join("") : renderInlineEmpty()}</div></article>`;
  }

  function renderCorrectDistribution(session) {
    const distribution = session.quizSummary?.correctDistribution || [];
    const maximum = Math.max(1, ...distribution.map(item => Number(item.count || 0)));
    const questionCount = session.questions?.length || 0;
    const map = new Map(distribution.map(item => [Number(item.label), Number(item.count || 0)]));
    const columns = Array.from({ length: questionCount + 1 }, (_, index) => ({ label: index, count: map.get(index) || 0 }));
    return `<article class="panel">${panelHeading("Số bài theo số câu trả lời đúng", `Từ 0 đến ${questionCount} câu đúng`)}<div class="column-chart">${columns.map(item => `<div class="column-item"><span class="column-value">${item.count}</span><div class="column-track"><div class="column-fill" style="height:${item.count / maximum * 100}%"></div></div><span class="column-label">${item.label} câu</span></div>`).join("")}</div></article>`;
  }

  function renderAnswerExplorer(questions) {
    const question = questions[selectedQuestion] || questions[0];
    if (!question) return "";
    const total = Math.max(1, Number(question.totalAnswers || 0));
    const options = question.options || [];
    return `<article class="panel full answer-explorer">${panelHeading("Phân bố đáp án của câu đang chọn", "Chọn một câu để xem chi tiết")}${questionSelector(questions)}<div class="question-focus"><span class="question-number">CÂU ${selectedQuestion + 1}</span><h3>${escapeHtml(question.title)}</h3></div><div class="answer-bars">${options.length ? options.map(option => {
      const percent = Number(option.count || 0) / total * 100;
      return `<div class="answer-row ${option.isCorrect ? "answer-correct" : ""}"><div class="answer-label">${escapeHtml(option.label)}${option.isCorrect ? '<span class="correct-badge">Đáp án đúng</span>' : ""}</div><div class="answer-measure"><div class="bar-track"><div class="bar-fill ${option.isCorrect ? "correct" : ""}" style="width:${clampPercent(percent)}%"></div></div><strong>${formatNumber.format(option.count || 0)} · ${score(percent)}%</strong></div></div>`;
    }).join("") : renderInlineEmpty("Chưa có người trả lời câu này.")}${question.correctAnswer && !options.some(option => option.isCorrect) ? `<div class="reference-inline"><strong>Đáp án đúng:</strong> ${escapeHtml(question.correctAnswer)} · chưa có người chọn</div>` : ""}</div></article>`;
  }

  function renderLiveOrdering(session) {
    const samples = session.ordering?.samples || [];
    return `<section class="content-grid">${renderPromptCard(session)}<article class="panel full panel-primary">${panelHeading("10 bài gửi đầu tiên", "Trình tự được đọc từ trái sang phải")}<div class="sample-stream">${samples.length ? samples.map(renderOrderingSample).join("") : renderInlineEmpty("Chưa có bài gửi.")}</div></article></section>`;
  }

  function renderOrderingDashboard(session) {
    const ordering = session.ordering || {};
    const positions = ordering.positionAccuracy || [];
    return `<section class="content-grid">${renderPromptCard(session)}<article class="panel full reference-panel">${panelHeading("Trình tự tham chiếu", "13 vị trí trên một hàng; đọc từ trái sang phải")}<div class="sequence-flow" data-ui-scroll="session-${session.id}-reference-sequence">${String(ordering.correctSequence || "").split(",").filter(Boolean).map((step, index) => `<div class="sequence-step"><span>Vị trí ${index + 1}</span><strong>Bước ${escapeHtml(step.trim())}</strong></div>`).join("")}</div></article><article class="panel full">${panelHeading("Tỷ lệ đặt đúng vị trí của từng bước", "Nhận diện bước thường bị đặt sai")}<div class="horizontal-chart position-chart">${positions.length ? positions.map(item => `<div class="horizontal-row"><span class="axis-label wide">Bước ${escapeHtml(item.step)} ở vị trí ${item.position}</span><div class="bar-track"><div class="bar-fill ${Number(item.percent || 0) < 50 ? "red" : ""}" style="width:${clampPercent(item.percent)}%"></div></div><strong>${score(item.percent || 0)}%</strong></div>`).join("") : renderInlineEmpty()}</div></article><article class="panel full">${panelHeading("Các phương án sai phổ biến", "Tối đa 5 trình tự được gửi nhiều nhất")}${renderWrongSequences(ordering.commonSequences || [])}</article></section>`;
  }

  function renderOrderingSample(value, index) {
    const steps = String(value || "").split(/[,;\-–—]+/).map(step => step.trim()).filter(Boolean);
    return `<article class="sample-card"><div class="sample-card-heading"><span>Bài ${index + 1}</span><small>${steps.length} bước</small></div><div class="sample-number-flow" data-ui-scroll="session-${activeSession}-ordering-sample-${index}" aria-label="Trình tự bài ${index + 1}">${steps.map((step, position) => `<span class="sample-number"><b>${escapeHtml(step)}</b>${position < steps.length - 1 ? '<i>—</i>' : ""}</span>`).join("")}</div></article>`;
  }

  function renderWrongSequences(sequences) {
    if (!sequences.length) return renderInlineEmpty("Chưa có phương án sai để tổng hợp.");
    return `<div class="table-wrap"><table><thead><tr><th>Số thứ tự</th><th>Chuỗi trả lời</th><th>Số người</th></tr></thead><tbody>${sequences.map((item, index) => `<tr><td>${index + 1}</td><td class="sequence-cell">${escapeHtml(formatStepSequence(item.value))}</td><td><strong>${formatNumber.format(item.count || 0)}</strong></td></tr>`).join("")}</tbody></table></div>`;
  }

  function renderTrueFalseDashboard(session, live) {
    const questions = session.questions || [];
    const question = questions[selectedQuestion] || questions[0];
    return `<section class="content-grid"><article class="panel full ${live ? "panel-primary" : ""}">${panelHeading("Phân bố lựa chọn Đúng / Sai", live ? "Theo dõi trực tiếp" : "Đáp án đúng được đánh dấu màu xanh lá")}<div class="tf-grid" data-ui-scroll="session-${session.id}-true-false-questions">${questions.map((item, index) => {
      const trueCount = optionCount(item, "Đúng");
      const falseCount = optionCount(item, "Sai");
      const total = Math.max(1, Number(session.totalResponses || 0));
      const correctAnswer = live ? "" : String(item.correctAnswer || "");
      const trueIsCorrect = normalizeText(correctAnswer) === normalizeText("Đúng");
      const falseIsCorrect = normalizeText(correctAnswer) === normalizeText("Sai");
      return `<button type="button" class="tf-card ${index === selectedQuestion ? "active" : ""}" data-question="${index}"><span class="tf-card-heading"><b>Câu ${index + 1}</b>${correctAnswer ? `<em>Đáp án: ${escapeHtml(correctAnswer)}</em>` : ""}</span><div class="${trueIsCorrect ? "correct-choice" : ""}"><strong>${formatNumber.format(trueCount)}</strong><small>Đúng · ${score(trueCount / total * 100)}%</small></div><div class="${falseIsCorrect ? "correct-choice" : ""}"><strong>${formatNumber.format(falseCount)}</strong><small>Sai · ${score(falseCount / total * 100)}%</small></div></button>`;
    }).join("")}</div></article>${question ? `<article class="panel full answer-explorer">${panelHeading("Chi tiết câu hỏi và phần giải thích", "Chọn câu để trao đổi tại lớp")}${questionSelector(questions)}<div class="question-focus"><span class="question-number">CÂU ${selectedQuestion + 1}</span><h3>${escapeHtml(question.title)}</h3></div>${live ? "" : `<div class="reference-inline"><strong>Đáp án và căn cứ tham chiếu:</strong> ${escapeHtml(question.referenceNote || question.correctAnswer || "Chưa có")}</div>`}<div class="choice-summary"><span><b>${formatNumber.format(optionCount(question, "Đúng"))}</b> chọn Đúng</span><span><b>${formatNumber.format(optionCount(question, "Sai"))}</b> chọn Sai</span></div>${renderExplanationList(session.id, selectedQuestion, question.explanations || [])}</article>` : ""}</section>`;
  }

  function renderExplanationList(sessionId, questionIndex, explanations) {
    if (!explanations.length) return renderInlineEmpty("Chưa có phần giải thích cho câu này.");
    const normalized = explanations.map(item => typeof item === "string"
      ? { selectedAnswer: "Chưa xác định", text: item }
      : { selectedAnswer: item.selectedAnswer || "Chưa xác định", text: item.text || "" }
    ).filter(item => item.text);
    const groups = [
      { key: "true", label: "Học viên chọn Đúng", tone: "true", items: normalized.filter(item => normalizeText(item.selectedAnswer) === normalizeText("Đúng")).slice(0, 5) },
      { key: "false", label: "Học viên chọn Sai", tone: "false", items: normalized.filter(item => normalizeText(item.selectedAnswer) === normalizeText("Sai")).slice(0, 5) }
    ];
    const knownCount = groups.reduce((sum, group) => sum + group.items.length, 0);
    const otherItems = normalized.filter(item => ![normalizeText("Đúng"), normalizeText("Sai")].includes(normalizeText(item.selectedAnswer))).slice(0, Math.max(0, 10 - knownCount));
    if (otherItems.length) groups.push({ key: "other", label: "Chưa xác định lựa chọn", tone: "other", items: otherItems });
    return `<div class="explanation-groups">${groups.map(group => `<section class="explanation-group explanation-${group.tone}"><header><span>${escapeHtml(group.label)}</span><strong>${group.items.length} giải thích</strong></header>${group.items.length ? `<div class="explanation-list">${group.items.map((item, index) => `<details class="response-card" data-ui-state="session-${sessionId}-explanation-${questionIndex}-${group.key}-${index}" open><summary><span>Giải thích ${index + 1}</span><b>Đã chọn: ${escapeHtml(item.selectedAnswer)}</b></summary><p>${escapeHtml(item.text)}</p></details>`).join("")}</div>` : renderInlineEmpty(`Chưa có giải thích của nhóm chọn ${group.tone === "true" ? "Đúng" : "Sai"}.`)}</section>`).join("")}</div>`;
  }

  function renderOpenDashboard(session, live) {
    const reference = session.referenceAnswer || [];
    const responses = live ? (session.liveResponses || (session.responses || []).slice(0, 10)) : (session.responses || []);
    const normalizedSearch = normalizeText(responseSearch);
    const filtered = live ? responses : responses.filter(text => normalizeText(text).includes(normalizedSearch));
    return `<section class="content-grid open-dashboard">${renderPromptCard(session)}${live ? "" : `<article class="panel full reference-panel">${panelHeading("Gợi ý / đáp án tham chiếu", "Dùng để đối chiếu và trao đổi tại lớp")}${reference.length ? `<ol class="reference-list">${reference.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ol>` : renderInlineEmpty("Chưa có nội dung tham chiếu.")}</article>`}<article class="panel full ${live ? "panel-primary" : ""}"><div class="panel-heading panel-heading-actions"><div><p class="panel-kicker">PHẢN HỒI HỌC VIÊN</p><h3>${live ? "10 phản hồi đầu tiên" : `Danh sách câu trả lời (${filtered.length}/${responses.length})`}</h3></div>${live ? '<span>Nội dung phản hồi được hiển thị ẩn danh</span>' : `<label class="search-box"><span class="sr-only">Tìm trong câu trả lời</span><input id="response-search" type="search" placeholder="Tìm trong nội dung phản hồi…" value="${escapeHtml(responseSearch)}"></label>`}</div><p class="privacy-note">Chỉ hiển thị nội dung phản hồi ẩn danh. Họ tên không được đưa lên API; đơn vị chỉ xuất hiện dưới dạng số liệu tổng hợp.</p>${filtered.length ? `<div class="response-list open-response-list">${filtered.map((text, index) => `<article class="open-response-card"><header><span>Phản hồi ${index + 1}</span></header><p>${escapeHtml(text)}</p></article>`).join("")}</div>` : renderInlineEmpty(responses.length ? "Không tìm thấy phản hồi phù hợp." : "Chưa có phản hồi. Dashboard sẽ tự cập nhật khi có dữ liệu.")}</article></section>`;
  }

  function renderPromptCard(session) {
    const prompt = session.prompt;
    if (!prompt) return "";
    const body = `${(prompt.paragraphs || []).map(text => `<p>${escapeHtml(text)}</p>`).join("")}${(prompt.items || []).length ? `<ol class="prompt-list">${prompt.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ol>` : ""}${prompt.question ? `<div class="prompt-question"><span>Câu hỏi</span><strong>${escapeHtml(prompt.question)}</strong></div>` : ""}${prompt.instruction ? `<p class="prompt-instruction"><strong>Cách nhập:</strong> ${escapeHtml(prompt.instruction)}</p>` : ""}`;
    return `<details class="panel full prompt-card" data-ui-state="session-${session.id}-prompt" open><summary><span class="prompt-label">${escapeHtml(prompt.label || "ĐỀ BÀI")}</span><strong>${escapeHtml(prompt.title || "")}</strong><span class="prompt-toggle"><span class="toggle-open">Thu gọn đề bài</span><span class="toggle-closed">Xem đầy đủ đề bài</span><i aria-hidden="true"></i></span></summary><div class="prompt-body">${body}</div></details>`;
  }

  function renderUnitBreakdown(session) {
    const units = session.unitBreakdown || [];
    if (!units.length) return "";
    const maximum = Math.max(1, ...units.map(item => Number(item.count || 0)));
    return `<section class="content-grid unit-section"><article class="panel full">${panelHeading("Số bài theo đơn vị", `${formatNumber.format(units.length)} đơn vị có bài trong phiên`)}<div class="unit-list ${units.length <= 8 ? "unit-list-compact" : ""}" data-ui-scroll="session-${session.id}-units">${units.map(item => `<div class="unit-row"><span class="unit-name">${escapeHtml(item.unit)}</span><div class="bar-track"><div class="bar-fill unit-fill" style="width:${Number(item.count || 0) / maximum * 100}%"></div></div><strong>${formatNumber.format(item.count || 0)}</strong></div>`).join("")}</div></article></section>`;
  }

  function questionSelector(questions) {
    return `<div class="question-selector" role="group" aria-label="Chọn câu hỏi">${questions.map((_, index) => `<button type="button" class="${index === selectedQuestion ? "active" : ""}" data-question="${index}">Câu ${index + 1}</button>`).join("")}</div>`;
  }
  function panelHeading(title, note) { return `<div class="panel-heading"><div><p class="panel-kicker">TRỰC QUAN</p><h3>${escapeHtml(title)}</h3></div>${note ? `<span>${escapeHtml(note)}</span>` : ""}</div>`; }
  function optionCount(question, expected) { const normalized = normalizeText(expected); return Number((question.options || []).find(option => normalizeText(option.label) === normalized)?.count || 0); }

  function bindSessionControls() {
    dashboard.querySelectorAll("[data-closed-view]").forEach(button => button.addEventListener("click", () => {
      closedLivePreview = button.dataset.closedView === "live";
      selectedQuestion = 0;
      responseSearch = "";
      render();
    }));
    dashboard.querySelectorAll("[data-question]").forEach(button => button.addEventListener("click", () => { selectedQuestion = Number(button.dataset.question); render(); }));
    const search = document.getElementById("response-search");
    if (search) search.addEventListener("input", event => { responseSearch = event.target.value; renderOpenResponseList(); });
  }
  function renderOpenResponseList() { const input = document.getElementById("response-search"); const start = input?.selectionStart || responseSearch.length; render(); const next = document.getElementById("response-search"); if (next) { next.focus(); next.setSelectionRange(start, start); } }
  function normalizeText(value) { return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi").trim(); }
  function formatStepSequence(value) { return String(value || "").split(",").map(step => step.trim()).filter(Boolean).map(step => `Bước ${step}`).join(" → "); }
  function score(value) { return Number.isFinite(Number(value)) ? Number(value).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) : "—"; }
  function clampPercent(value) { return Math.max(0, Math.min(100, Number(value || 0))); }
  function renderEmpty(text = "Chưa có bài làm. Dashboard sẽ tự cập nhật khi có dữ liệu.") { return `<div class="empty">${escapeHtml(text)}</div>`; }
  function renderInlineEmpty(text = "Chưa có dữ liệu.") { return `<div class="inline-empty">${escapeHtml(text)}</div>`; }

  document.getElementById("refresh-button").addEventListener("click", () => loadData(true));
  document.getElementById("fullscreen-button").addEventListener("click", () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); });
  loadData();
  if (Number(config.refreshSeconds) > 0) timer = setInterval(() => loadData(true), Number(config.refreshSeconds) * 1000);
  window.addEventListener("focus", () => loadData(true));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) loadData(true); });
  window.addEventListener("beforeunload", () => clearInterval(timer));
})();
