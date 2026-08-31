(() => {
  "use strict";

  const config = window.DASHBOARD_CONFIG || {};
  const dashboard = document.getElementById("dashboard");
  const nav = document.getElementById("session-nav");
  const status = document.getElementById("data-status");
  const updatedAt = document.getElementById("updated-at");
  const subtitle = document.getElementById("session-subtitle");
  let payload = null;
  let activeSession = getSessionFromUrl();
  let timer = null;
  let isLoading = false;

  const formatNumber = new Intl.NumberFormat("vi-VN");
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
      if (!config.apiUrl) throw new Error("API_URL_EMPTY");
      const response = await fetch(`${config.apiUrl}${config.apiUrl.includes("?") ? "&" : "?"}_=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      payload = await response.json();
      setStatus("live", "Dữ liệu trực tiếp");
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
    subtitle.textContent = `${session.name} · ${session.typeLabel}`;
    updatedAt.textContent = payload.updatedAt ? `Cập nhật: ${new Date(payload.updatedAt).toLocaleString("vi-VN")}` : "";
    dashboard.innerHTML = `
      <section class="section-head">
        <div><h2>${escapeHtml(session.name)}</h2><p>${escapeHtml(session.description || "Kết quả được tổng hợp độc lập cho phiên này")}</p></div>
        <span class="type-pill">${escapeHtml(session.typeLabel)}</span>
      </section>
      ${renderMetrics(session)}
      ${renderSessionContent(session)}
    `;
  }

  function renderNav(sessions) {
    nav.innerHTML = sessions.map(session => `
      <button class="session-tab ${Number(session.id) === activeSession ? "active" : ""}" data-session="${session.id}" type="button">
        Phiên ${session.id}
      </button>`).join("");
    nav.querySelectorAll("[data-session]").forEach(button => button.addEventListener("click", () => {
      activeSession = Number(button.dataset.session);
      history.replaceState({}, "", `${location.pathname}?phien=${activeSession}`);
      render();
      scrollTo({ top: 0, behavior: "smooth" });
    }));
  }

  function renderMetrics(session) {
    const metrics = [
      ["Lượt làm bài", formatNumber.format(session.totalResponses || 0), "Số dòng phản hồi hợp lệ"],
      ["Có điểm", formatNumber.format(session.scoreStats?.count || 0), session.scoreStats?.maxScore ? `Thang điểm ${session.scoreStats.maxScore}` : "Không áp dụng chấm điểm"],
      ["Điểm trung bình", session.scoreStats?.count ? formatScore(session.scoreStats.average) : "—", session.scoreStats?.count ? `${formatScore(session.scoreStats.averagePercent)}%` : "Chưa có dữ liệu"],
      [session.kind === "ordering" ? "Đúng hoàn toàn" : "Câu hỏi", session.kind === "ordering" ? formatNumber.format(session.ordering?.correctCount || 0) : formatNumber.format(session.questions?.length || 0), session.kind === "ordering" ? escapeHtml(session.ordering?.correctSequence || "") : "Nội dung được tổng hợp"]
    ];
    return `<section class="metrics">${metrics.map(([label,value,note]) => `<article class="metric"><span class="metric-label">${label}</span><strong class="metric-value">${value}</strong><span class="metric-note">${note}</span></article>`).join("")}</section>`;
  }

  function renderSessionContent(session) {
    const blocks = [];
    if (session.scoreStats?.distribution?.length) blocks.push(renderScorePanel(session.scoreStats));
    if (session.kind === "ordering") blocks.push(renderOrdering(session));
    if (session.questions?.length) blocks.push(renderQuestions(session.questions));
    if (session.responses?.length) blocks.push(renderResponses(session.responses));
    if (!blocks.length) blocks.push('<div class="empty">Chưa có bài làm. Dashboard sẽ tự cập nhật khi có dữ liệu.</div>');
    return `<section class="content-grid">${blocks.join("")}</section>`;
  }

  function renderScorePanel(stats) {
    const maxCount = Math.max(1, ...stats.distribution.map(item => item.count));
    return `<article class="panel"><h3>Phân bố điểm</h3>${stats.distribution.map(item => `
      <div class="score-row"><span>${escapeHtml(item.label)}</span><div class="bar-track"><div class="bar-fill gold" style="width:${item.count / maxCount * 100}%"></div></div><strong>${item.count}</strong></div>`).join("")}</article>`;
  }

  function renderQuestions(questions) {
    return `<article class="panel full"><h3>Kết quả theo từng câu hỏi</h3><div class="question-list">${questions.map((question, index) => {
      const total = Math.max(1, question.totalAnswers || 0);
      const options = (question.options || []).map(option => {
        const percent = option.count / total * 100;
        return `<div class="option"><span class="option-label">${escapeHtml(option.label)}</span><div class="bar-track"><div class="bar-fill" style="width:${percent}%"></div></div><span class="option-value">${option.count} · ${formatScore(percent)}%</span></div>`;
      }).join("");
      const explanations = question.explanations?.length ? `<div class="responses">${question.explanations.map((text, i) => `<div class="response-card"><span class="response-number">GIẢI THÍCH ${i + 1}</span><p>${escapeHtml(text)}</p></div>`).join("")}</div>` : "";
      return `<section class="question-card"><h3>Câu ${index + 1}. ${escapeHtml(question.title)}</h3>${options || '<div class="empty">Chưa có câu trả lời</div>'}${explanations}</section>`;
    }).join("")}</div></article>`;
  }

  function renderOrdering(session) {
    const ordering = session.ordering || {};
    const total = Math.max(1, session.totalResponses || 0);
    return `<article class="panel full"><h3>Kết quả sắp xếp thứ tự</h3><p>Đáp án chuẩn</p><div class="sequence">${escapeHtml(ordering.correctSequence || "3, 5, 1, 6, 4, 11, 9, 8, 10, 13, 2, 12, 7")}</div>
      <div class="option"><span class="option-label">Đúng hoàn toàn</span><div class="bar-track"><div class="bar-fill gold" style="width:${(ordering.correctCount || 0) / total * 100}%"></div></div><span class="option-value">${ordering.correctCount || 0} · ${formatScore((ordering.correctCount || 0) / total * 100)}%</span></div>
      ${(ordering.commonSequences || []).length ? `<h3 style="margin-top:22px">Các trình tự được nhập nhiều nhất</h3>${ordering.commonSequences.map(item => `<div class="score-row"><span>${item.count} bài</span><div class="sequence">${escapeHtml(item.value)}</div><span></span></div>`).join("")}` : ""}
    </article>`;
  }

  function renderResponses(responses) {
    return `<article class="panel full"><h3>Câu trả lời tình huống (${responses.length})</h3><div class="responses">${responses.map((text, index) => `<div class="response-card"><span class="response-number">BÀI ${index + 1}</span><p>${escapeHtml(text)}</p></div>`).join("")}</div></article>`;
  }

  function formatScore(value) {
    if (!Number.isFinite(Number(value))) return "—";
    return Number(value).toLocaleString("vi-VN", { maximumFractionDigits: 1 });
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
