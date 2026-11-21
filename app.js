function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const styles = {
    success: 'bg-emerald-900 text-white border-emerald-700',
    error: 'bg-rose-900 text-white border-rose-700',
    info: 'bg-slate-900 text-white border-slate-700'
  };

  const toast = document.createElement('div');
  toast.className = `pointer-events-auto px-4 py-3 rounded-xl border shadow-lg text-xs sm:text-sm font-semibold animate-fade-up ${styles[type] || styles.info}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 2800);
}

function switchTab(tabName) {
  appState.activeTab = tabName;
  saveAppState();

  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('hidden', panel.id !== `tab-${tabName}`);
  });

  document.querySelectorAll('.nav-tab').forEach((btn) => {
    const active = btn.dataset.tab === tabName;
    btn.classList.toggle('bg-indigo-600', active);
    btn.classList.toggle('text-white', active);
    btn.classList.toggle('text-slate-600', !active);
    btn.classList.toggle('hover:bg-slate-100', !active);
  });
}

function changeLanguage(langCode) {
  appState.language = langCode;
  saveAppState();
  applyLanguageStrings();
  showToast('Language updated', 'info');
}

function applyLanguageStrings() {
  const copy = UI_STRINGS[appState.language] || UI_STRINGS.en;
  const brandEl = document.getElementById('ui-brand-name');
  const aiBtnEl = document.getElementById('ui-ai-btn');
  const sgHeading = document.getElementById('skillgap-heading');
  const sgDesc = document.getElementById('skillgap-desc');
  const langSel = document.getElementById('lang-select');

  if (brandEl) brandEl.textContent = copy.brandName;
  if (aiBtnEl) aiBtnEl.textContent = copy.aiBtn;
  if (sgHeading) sgHeading.textContent = copy.skillgapHeading;
  if (sgDesc) sgDesc.textContent = copy.skillgapDesc;
  if (langSel) langSel.value = appState.language;
}

function updateTopKpis() {
  const goal = getCurrentGoalData();
  const gapCount = goal.skills.filter((s) => s.required > s.current).length;
  const doneSteps = goal.roadmap.filter((r) => r.done).length;
  const pct = Math.round((doneSteps / (goal.roadmap.length || 1)) * 100);
  const doneProjects = appState.projects.filter((p) => p.done).length;
  const remStreak = 7 - (appState.streakDays % 7 || 7);

  const headerStreak = document.getElementById('header-streak-count');
  const headerWallet = document.getElementById('header-wallet-balance');
  const kpiGoalVal = document.getElementById('kpi-goal-val');
  const kpiGapSub = document.getElementById('kpi-gap-sub');
  const kpiBooked = document.getElementById('kpi-booked-count');
  const kpiStreakDays = document.getElementById('kpi-streak-days');
  const kpiStreakMile = document.getElementById('kpi-streak-milestone');
  const kpiRoadmapPct = document.getElementById('kpi-roadmap-pct');
  const kpiProjectsSub = document.getElementById('kpi-projects-sub');

  if (headerStreak) headerStreak.textContent = `${appState.streakDays}d`;
  if (headerWallet) headerWallet.textContent = `₹${appState.walletBalance.toLocaleString('en-IN')}`;
  if (kpiGoalVal) kpiGoalVal.textContent = goal.title;
  if (kpiGapSub) kpiGapSub.textContent = `${gapCount} skill gap(s) identified`;
  if (kpiBooked) kpiBooked.textContent = `${appState.bookedClassIds.length} Class${appState.bookedClassIds.length === 1 ? '' : 'es'}`;
  if (kpiStreakDays) kpiStreakDays.textContent = `${appState.streakDays} Days`;
  if (kpiStreakMile) kpiStreakMile.textContent = `Next: ${remStreak === 0 ? 7 : remStreak}d to streak reward`;
  if (kpiRoadmapPct) kpiRoadmapPct.textContent = `${pct}%`;
  if (kpiProjectsSub) kpiProjectsSub.textContent = `${doneProjects}/${appState.projects.length} Projects Completed`;
}

function renderOverviewPreviews() {
  const classesPrev = document.getElementById('overview-classes-preview');
  const roadmapPrev = document.getElementById('overview-roadmap-preview');
  const goal = getCurrentGoalData();

  if (classesPrev) {
    classesPrev.innerHTML = LIVE_CLASSES.slice(0, 3)
      .map(
        (c) => `
        <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div class="min-w-0">
            <p class="text-sm font-bold text-slate-900 truncate">${c.title}</p>
            <p class="text-xs text-slate-500">${c.trainerName} • ${c.schedule}</p>
          </div>
          <span class="shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg ${
            c.price === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-50 text-indigo-700'
          }">${c.price === 0 ? 'FREE' : '₹' + c.price}</span>
        </div>
      `
      )
      .join('');
  }

  if (roadmapPrev) {
    roadmapPrev.innerHTML = goal.roadmap
      .slice(0, 3)
      .map(
        (r, i) => `
        <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div class="min-w-0">
            <p class="text-sm font-bold text-slate-900 truncate">${i + 1}. ${r.title}</p>
            <p class="text-xs text-slate-500">${r.duration}</p>
          </div>
          <span class="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
            r.done ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }">${r.done ? 'Done' : 'Active'}</span>
        </div>
      `
      )
      .join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  applyLanguageStrings();
  switchTab(appState.activeTab || 'overview');
  updateTopKpis();
  renderSkillGapSection();
  renderOverviewPreviews();
  renderMarketplace();
  renderTrainerComparison();
  renderTimetableAndRecordings();
  renderReviewsSection();
  renderDoubtsAndNotes();
  renderRoadmapAndProgress();
  renderCommunitySection();
  renderAssistantMessages();
});
