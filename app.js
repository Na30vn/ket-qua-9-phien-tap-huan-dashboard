(() => {
  "use strict";

  const config = window.DASHBOARD_CONFIG || {};
  const dashboard = document.getElementById("dashboard");
  const nav = document.getElementById("session-nav");
  const status = document.getElementById("data-status");
  const updatedAt = document.getElementById("updated-at");
  const subtitle = document.getElementById("session-subtitle");
  const sessionTitle = document.getElementById("session-title");
  const formatNumber = new Intl.NumberFormat("vi-VN");
  const fakeMode = new URLSearchParams(location.search).get("demo") === "1";

  let payload = null;
  let activeSession = getSessionFromUrl();
  let selectedQuestion = 0;
  let responseSearch = "";
  let timer = null;
  let isLoading = false;

  const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function getSessionFromUrl() {
    const value = Number(new URLSearchParams(location.search).get("phien"));
    return value >= 1 && value <= 9 ? value : 1;
  }

  function setStatus(mode, text) {
    status.className = `status status-${mode}`;
    status.textContent = text;
  }

  async function loadData() {
    if (isLoading) return;
    isLoading = true;
    if (!payload) setStatus("loading", "Đang tải dữ liệu…");
    try {
      const dataUrl = fakeMode ? (config.fakeDataUrl || "data/fake.json") : config.apiUrl;
      if (!dataUrl) throw new Error("DATA_URL_EMPTY");
      const separator = dataUrl.includes("?") ? "&" : "?";
      const response = await fetch(`${dataUrl}${separator}_=${Date.now()}`, { cache: "no-store" });
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
    updatedAt.textContent = payload.updatedAt
      ? `Cập nhật: ${new Date(payload.updatedAt).toLocaleString("vi-VN")}`
      : "";

    dashboard.innerHTML = `
      <section class="section-head">
        <div>
          <p class="section-kicker">KẾT QUẢ PHIÊN ${session.id}</p>
          <h2>${escapeHtml(session.description || session.name)}</h2>
        </div>
        <span class="type-pill">${escapeHtml(session.typeLabel)}</span>
      </section>
      ${renderMetrics(session)}
      ${renderSessionContent(session)}
    `;
    bindSessionControls(session);
  }

  function renderNav(sessions) {
    nav.innerHTML = sessions.map(session => `
      <button class="session-tab ${Number(session.id) === activeSession ? "active" : ""}" data-session="${session.id}" type="button" aria-label="Phiên ${session.id}">
        ${session.id}
      </button>`).join("");
    nav.querySelectorAll("[data-session]").forEach(button => button.addEventListener("click", () => {
      activeSession = Number(button.dataset.session);
      selectedQuestion = 0;
      responseSearch = "";
      const params = new URLSearchParams(location.search);
      params.set("phien", activeSession);
      history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
      render();
      scrollTo({ top: 0, behavior: "smooth" });
    }));
  }

  function renderMetrics(session) {
    let metrics;
    const summary = session.quizSummary || {};

    if (session.kind === "quiz") {
      metrics = [
        metric("Tổng số bài", formatNumber.format(session.totalResponses || 0), "Phản hồi đã ghi nhận"),
        metric("Điểm trung bình", session.scoreStats?.count ? score(session.scoreStats.average) : "—", session.scoreStats?.maxScore ? `Trên thang ${session.scoreStats.maxScore}` : "Chưa có dữ liệu"),
        metric("Tỷ lệ đúng TB", session.scoreStats?.count ? `${score(summary.averageCorrectPercent)}%` : "—", "Tính lại từ đáp án chuẩn")
      ];
      if (Number(session.id) === 9) {
        metrics.push(metric("Đúng cả 2 câu", session.totalResponses ? formatNumber.format(summary.perfectCount || 0) : "—", session.totalResponses ? `${score(summary.perfectRate || 0)}% số bài` : "Chưa có dữ liệu"));
      } else {
        const hardest = summary.hardestQuestion;
        metrics.push(metric("Câu khó nhất", hardest ? `C${hardest.number}` : "—", hardest ? `${score(hardest.correctPercent)}% trả lời đúng` : "Chưa có dữ liệu"));
      }
    } else if (session.kind === "ordering") {
      metrics = [
        metric("Tổng số bài", formatNumber.format(session.totalResponses || 0), "Phản hồi đã ghi nhận"),
        metric("Đúng hoàn toàn", formatNumber.format(session.ordering?.correctCount || 0), "Đúng toàn bộ 13 bước"),
        metric("Tỷ lệ đúng", `${score(session.ordering?.correctRate || 0)}%`, "Đúng hoàn toàn"),
        metric("Phương án khác nhau", formatNumber.format(session.ordering?.uniqueSequenceCount || 0), "Các chuỗi đã được gửi")
      ];
    } else if (session.kind === "true_false") {
      const hardest = session.totalResponses ? summary.hardestQuestion : null;
      metrics = [
        metric("Tổng số bài", formatNumber.format(session.totalResponses || 0), "Phản hồi đã ghi nhận"),
        metric("Tỷ lệ đúng TB", session.scoreStats?.count ? `${score(summary.averageCorrectPercent)}%` : "—", "Trên 7 nhận định"),
        metric("Câu khó nhất", hardest ? `C${hardest.number}` : "—", hardest ? `${score(hardest.correctPercent)}% trả lời đúng` : "Chưa có dữ liệu"),
        metric("Có giải thích", session.totalResponses ? `${score(session.explanationStats?.rate || 0)}%` : "—", session.totalResponses ? `${formatNumber.format(session.explanationStats?.count || 0)} lượt giải thích` : "Chưa có dữ liệu")
      ];
    } else {
      metrics = [
        metric("Tổng phản hồi", formatNumber.format(session.totalResponses || 0), "Bài đã gửi"),
        metric("Số đơn vị", session.participatingUnits ? formatNumber.format(session.participatingUnits) : "—", session.participatingUnits ? "Đơn vị có phản hồi" : "Chưa có dữ liệu đơn vị")
      ];
    }

    return `<section class="metrics metrics-${metrics.length}">${metrics.join("")}</section>`;
  }

  function metric(label, value, note) {
    return `<article class="metric"><span class="metric-label">${escapeHtml(label)}</span><strong class="metric-value">${escapeHtml(value)}</strong><span class="metric-note">${escapeHtml(note)}</span></article>`;
  }

  function renderSessionContent(session) {
    if (session.error) return `<div class="empty">${escapeHtml(session.error)}</div>`;
    let content;
    if (session.kind === "quiz") content = renderQuizDashboard(session);
    else if (session.kind === "ordering") content = renderOrderingDashboard(session);
    else if (session.kind === "true_false") content = renderTrueFalseDashboard(session);
    else content = renderOpenDashboard(session);
    return content + renderUnitBreakdown(session);
  }

  function renderUnitBreakdown(session) {
    const units = session.unitBreakdown || [];
    if (!units.length) return "";
    const maximum = Math.max(1, ...units.map(item => Number(item.count || 0)));
    return `
      <section class="content-grid unit-section">
        <article class="panel full">
          ${panelHeading("Số bài theo đơn vị", `${formatNumber.format(units.length)} đơn vị có bài trong phiên`)}
          <div class="unit-list">
            ${units.map(item => `
              <div class="unit-row">
                <span class="unit-name">${escapeHtml(item.unit)}</span>
                <div class="bar-track"><div class="bar-fill unit-fill" style="width:${Number(item.count || 0) / maximum * 100}%"></div></div>
                <strong>${formatNumber.format(item.count || 0)}</strong>
              </div>
            `).join("")}
          </div>
        </article>
      </section>
    `;
  }

  function renderQuizDashboard(session) {
    const questions = session.questions || [];
    if (!session.totalResponses && !questions.length) return renderEmpty();
    const answerExplorer = questions.length ? renderAnswerExplorer(questions) : renderEmpty("Chưa có dữ liệu câu hỏi.");
    const scoreDistribution = Number(session.id) === 9 ? "" : renderCorrectDistribution(session);
    return `
      <section class="content-grid">
        ${renderAccuracyChart(questions, Number(session.id) === 4)}
        ${scoreDistribution}
        ${answerExplorer}
      </section>
    `;
  }

  function renderAccuracyChart(questions, sortAscending) {
    const source = questions.map((question, index) => ({ ...question, number: index + 1 }));
    if (sortAscending) source.sort((a, b) => Number(a.correctPercent || 0) - Number(b.correctPercent || 0));
    return `
      <article class="panel ${sortAscending ? "" : "panel-primary"}">
        ${panelHeading("Tỷ lệ trả lời đúng theo câu", "Nhìn nhanh nội dung học viên còn vướng")}
        <div class="horizontal-chart">
          ${source.length ? source.map(question => `
            <div class="horizontal-row" title="${escapeHtml(question.title)}">
              <span class="axis-label">C${question.number}</span>
              <div class="bar-track"><div class="bar-fill ${Number(question.correctPercent || 0) < 50 ? "red" : ""}" style="width:${clampPercent(question.correctPercent)}%"></div></div>
              <strong>${score(question.correctPercent || 0)}%</strong>
            </div>
          `).join("") : renderInlineEmpty()}
        </div>
      </article>
    `;
  }

  function renderCorrectDistribution(session) {
    const distribution = session.quizSummary?.correctDistribution || [];
    const maximum = Math.max(1, ...distribution.map(item => Number(item.count || 0)));
    const questionCount = session.questions?.length || 0;
    const map = new Map(distribution.map(item => [Number(item.label), Number(item.count || 0)]));
    const columns = Array.from({ length: questionCount + 1 }, (_, index) => ({ label: index, count: map.get(index) || 0 }));
    return `
      <article class="panel">
        ${panelHeading("Phân bố số câu trả lời đúng", `Từ 0 đến ${questionCount} câu`)}
        <div class="column-chart">
          ${columns.map(item => `
            <div class="column-item">
              <span class="column-value">${item.count}</span>
              <div class="column-track"><div class="column-fill" style="height:${item.count / maximum * 100}%"></div></div>
              <span class="column-label">${item.label}</span>
            </div>
          `).join("")}
        </div>
      </article>
    `;
  }

  function renderAnswerExplorer(questions) {
    const question = questions[selectedQuestion] || questions[0];
    if (!question) return "";
    const total = Math.max(1, Number(question.totalAnswers || 0));
    const options = question.options || [];
    return `
      <article class="panel full answer-explorer">
        ${panelHeading("Phân bố đáp án của câu đang chọn", "Chọn một câu để xem chi tiết")}
        ${questionSelector(questions)}
        <div class="question-focus">
          <span class="question-number">CÂU ${selectedQuestion + 1}</span>
          <h3>${escapeHtml(question.title)}</h3>
        </div>
        <div class="answer-bars">
          ${options.length ? options.map(option => {
            const percent = Number(option.count || 0) / total * 100;
            return `
              <div class="answer-row ${option.isCorrect ? "answer-correct" : ""}">
                <div class="answer-label">${escapeHtml(option.label)}${option.isCorrect ? '<span class="correct-badge">Đáp án đúng</span>' : ""}</div>
                <div class="answer-measure"><div class="bar-track"><div class="bar-fill ${option.isCorrect ? "correct" : ""}" style="width:${clampPercent(percent)}%"></div></div><strong>${formatNumber.format(option.count || 0)} · ${score(percent)}%</strong></div>
              </div>
            `;
          }).join("") : renderInlineEmpty("Chưa có người trả lời câu này.")}
          ${question.correctAnswer && !options.some(option => option.isCorrect) ? `<div class="reference-inline"><strong>Đáp án đúng:</strong> ${escapeHtml(question.correctAnswer)} · chưa có người chọn</div>` : ""}
        </div>
      </article>
    `;
  }

  function renderOrderingDashboard(session) {
    const ordering = session.ordering || {};
    const positions = ordering.positionAccuracy || [];
    return `
      <section class="content-grid">
        <article class="panel full reference-panel">
          ${panelHeading("Trình tự tham chiếu", "13 bước theo thứ tự đúng")}
          <div class="sequence-flow">${String(ordering.correctSequence || "").split(",").filter(Boolean).map((step, index) => `<span><b>${index + 1}</b>Bước ${escapeHtml(step.trim())}</span>`).join('<i aria-hidden="true">→</i>')}</div>
        </article>
        <article class="panel full">
          ${panelHeading("Tỷ lệ đặt đúng vị trí của từng bước", "Nhận diện bước thường bị đặt sai")}
          <div class="horizontal-chart position-chart">
            ${positions.length ? positions.map(item => `
              <div class="horizontal-row">
                <span class="axis-label wide">Bước ${escapeHtml(item.step)} · vị trí ${item.position}</span>
                <div class="bar-track"><div class="bar-fill ${Number(item.percent || 0) < 50 ? "red" : ""}" style="width:${clampPercent(item.percent)}%"></div></div>
                <strong>${score(item.percent || 0)}%</strong>
              </div>
            `).join("") : renderInlineEmpty()}
          </div>
        </article>
        <article class="panel full">
          ${panelHeading("Top phương án sai phổ biến", "Tối đa 5 trình tự được gửi nhiều nhất")}
          ${renderWrongSequences(ordering.commonSequences || [])}
        </article>
      </section>
    `;
  }

  function renderWrongSequences(sequences) {
    if (!sequences.length) return renderInlineEmpty("Chưa có phương án sai để tổng hợp.");
    return `
      <div class="table-wrap">
        <table>
          <thead><tr><th>STT</th><th>Chuỗi trả lời</th><th>Số người</th></tr></thead>
          <tbody>${sequences.map((item, index) => `<tr><td>${index + 1}</td><td class="sequence-cell">${escapeHtml(String(item.value || "").replaceAll(",", " → "))}</td><td><strong>${formatNumber.format(item.count || 0)}</strong></td></tr>`).join("")}</tbody>
        </table>
      </div>
    `;
  }

  function renderTrueFalseDashboard(session) {
    const questions = session.questions || [];
    const question = questions[selectedQuestion] || questions[0];
    return `
      <section class="content-grid">
        <article class="panel full">
          ${panelHeading("Phân bố lựa chọn Đúng / Sai", "Mỗi thanh biểu diễn 100% số người trả lời")}
          <div class="legend"><span><i class="legend-true"></i>Đúng</span><span><i class="legend-false"></i>Sai</span><span><i class="legend-empty"></i>Không trả lời</span></div>
          <div class="stacked-chart">
            ${questions.length ? questions.map((item, index) => {
              const trueCount = optionCount(item, "Đúng");
              const falseCount = optionCount(item, "Sai");
              const total = Math.max(1, Number(session.totalResponses || 0));
              return `
                <div class="stacked-row">
                  <span class="axis-label">C${index + 1}</span>
                  <div class="stacked-track" title="Đúng: ${trueCount}; Sai: ${falseCount}">
                    <span class="stack-true" style="width:${trueCount / total * 100}%"></span>
                    <span class="stack-false" style="width:${falseCount / total * 100}%"></span>
                    <span class="stack-empty" style="width:${Math.max(0, total - trueCount - falseCount) / total * 100}%"></span>
                  </div>
                  <strong>Đáp án: ${escapeHtml(item.correctAnswer || "—")}</strong>
                </div>
              `;
            }).join("") : renderInlineEmpty()}
          </div>
        </article>
        ${question ? `
          <article class="panel full answer-explorer">
            ${panelHeading("Chi tiết câu hỏi và phần giải thích", "Chọn câu để trao đổi tại lớp")}
            ${questionSelector(questions)}
            <div class="question-focus">
              <span class="question-number">CÂU ${selectedQuestion + 1}</span>
              <h3>${escapeHtml(question.title)}</h3>
            </div>
            <div class="reference-inline"><strong>Đáp án và căn cứ tham chiếu:</strong> ${escapeHtml(question.referenceNote || question.correctAnswer || "Chưa có")}</div>
            <div class="choice-summary">
              <span><b>${formatNumber.format(optionCount(question, "Đúng"))}</b> chọn Đúng</span>
              <span><b>${formatNumber.format(optionCount(question, "Sai"))}</b> chọn Sai</span>
            </div>
            ${renderExplanationList(question.explanations || [])}
          </article>
        ` : ""}
      </section>
    `;
  }

  function renderExplanationList(explanations) {
    if (!explanations.length) return renderInlineEmpty("Chưa có phần giải thích cho câu này.");
    return `
      <div class="response-list">
        ${explanations.map((text, index) => `
          <details class="response-card" ${index < 2 ? "open" : ""}>
            <summary>Giải thích ${index + 1}</summary>
            <p>${escapeHtml(text)}</p>
          </details>
        `).join("")}
      </div>
    `;
  }

  function renderOpenDashboard(session) {
    const reference = session.referenceAnswer || [];
    const responses = session.responses || [];
    const normalizedSearch = normalizeText(responseSearch);
    const filtered = responses.filter(text => normalizeText(text).includes(normalizedSearch));
    return `
      <section class="content-grid open-dashboard">
        <article class="panel full reference-panel">
          ${panelHeading("Gợi ý / đáp án tham chiếu", "Dùng để đối chiếu và trao đổi tại lớp")}
          ${reference.length ? `<ol class="reference-list">${reference.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ol>` : renderInlineEmpty("Chưa có nội dung tham chiếu.")}
        </article>
        <article class="panel full">
          <div class="panel-heading panel-heading-actions">
            <div><p class="panel-kicker">PHẢN HỒI HỌC VIÊN</p><h3>Danh sách câu trả lời (${filtered.length}/${responses.length})</h3></div>
            <label class="search-box"><span class="sr-only">Tìm trong câu trả lời</span><input id="response-search" type="search" placeholder="Tìm trong nội dung phản hồi…" value="${escapeHtml(responseSearch)}"></label>
          </div>
          <p class="privacy-note">Danh sách công khai chỉ hiển thị nội dung phản hồi ẩn danh. Họ tên không được đưa lên API; đơn vị chỉ xuất hiện dưới dạng số liệu tổng hợp.</p>
          ${filtered.length ? `
            <div class="response-list">
              ${filtered.map((text, index) => `
                <details class="response-card" ${index < 3 ? "open" : ""}>
                  <summary>Phản hồi ${index + 1}</summary>
                  <p>${escapeHtml(text)}</p>
                </details>
              `).join("")}
            </div>
          ` : renderInlineEmpty(responses.length ? "Không tìm thấy phản hồi phù hợp." : "Chưa có phản hồi. Dashboard sẽ tự cập nhật khi có dữ liệu.")}
        </article>
      </section>
    `;
  }

  function questionSelector(questions) {
    return `
      <div class="question-selector" role="group" aria-label="Chọn câu hỏi">
        ${questions.map((_, index) => `<button type="button" class="${index === selectedQuestion ? "active" : ""}" data-question="${index}">C${index + 1}</button>`).join("")}
      </div>
    `;
  }

  function panelHeading(title, note) {
    return `<div class="panel-heading"><div><p class="panel-kicker">TRỰC QUAN</p><h3>${escapeHtml(title)}</h3></div><span>${escapeHtml(note)}</span></div>`;
  }

  function optionCount(question, expected) {
    const normalized = normalizeText(expected);
    return Number((question.options || []).find(option => normalizeText(option.label) === normalized)?.count || 0);
  }

  function bindSessionControls(session) {
    dashboard.querySelectorAll("[data-question]").forEach(button => button.addEventListener("click", () => {
      selectedQuestion = Number(button.dataset.question);
      render();
    }));
    const search = document.getElementById("response-search");
    if (search) {
      search.addEventListener("input", event => {
        responseSearch = event.target.value;
        renderOpenResponseList(session);
      });
    }
  }

  function renderOpenResponseList(session) {
    const input = document.getElementById("response-search");
    const start = input?.selectionStart || responseSearch.length;
    render();
    const next = document.getElementById("response-search");
    if (next) {
      next.focus();
      next.setSelectionRange(start, start);
    }
  }

  function normalizeText(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi").trim();
  }

  function score(value) {
    if (!Number.isFinite(Number(value))) return "—";
    return Number(value).toLocaleString("vi-VN", { maximumFractionDigits: 1 });
  }

  function clampPercent(value) {
    return Math.max(0, Math.min(100, Number(value || 0)));
  }

  function renderEmpty(text = "Chưa có bài làm. Dashboard sẽ tự cập nhật khi có dữ liệu.") {
    return `<div class="empty">${escapeHtml(text)}</div>`;
  }

  function renderInlineEmpty(text = "Chưa có dữ liệu.") {
    return `<div class="inline-empty">${escapeHtml(text)}</div>`;
  }

  document.getElementById("refresh-button").addEventListener("click", loadData);
  document.getElementById("fullscreen-button").addEventListener("click", () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  });

  loadData();
  if (Number(config.refreshSeconds) > 0) timer = setInterval(loadData, Number(config.refreshSeconds) * 1000);
  window.addEventListener("beforeunload", () => clearInterval(timer));
})();
