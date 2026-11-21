function getCurrentGoalData() {
  return appState.goalSkills[appState.selectedGoal] || CAREER_GOALS['fullstack-ai'];
}

function onGoalChange(goalKey) {
  appState.selectedGoal = goalKey;
  saveAppState();
  renderSkillGapSection();
  renderRoadmapAndProgress();
  updateTopKpis();
}

function updateSkillProficiency(skillId, newValue) {
  const goal = getCurrentGoalData();
  const item = goal.skills.find((s) => s.id === skillId);
  if (!item) return;
  item.current = Math.max(0, Math.min(100, Number(newValue) || 0));
  saveAppState();
  renderSkillGapSection();
  updateTopKpis();
}

function recalculateSkillGap(showFeedback = false) {
  renderSkillGapSection();
  updateTopKpis();
  if (showFeedback) {
    showToast('Skill gap analysis recalculated for ' + getCurrentGoalData().title, 'info');
  }
}

function renderSkillGapSection() {
  const goal = getCurrentGoalData();
  const goalSelect = document.getElementById('goal-select');
  if (goalSelect) goalSelect.value = appState.selectedGoal;

  const listEl = document.getElementById('skill-gap-list');
  const gaps = goal.skills.map((s) => ({
    ...s,
    gap: Math.max(0, s.required - s.current)
  }));

  if (listEl) {
    listEl.innerHTML = gaps
      .map((s) => {
        const gapBadge =
          s.gap > 0
            ? `<span class="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">-${s.gap} pts gap</span>`
            : `<span class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Target Met</span>`;
        return `
          <div class="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-2">
            <div class="flex items-center justify-between gap-2">
              <div>
                <span class="text-sm font-bold text-slate-900">${s.name}</span>
                <span class="text-xs text-slate-500 ml-2">(Target: ${s.required}%)</span>
              </div>
              <div class="flex items-center gap-2">
                ${gapBadge}
                <span class="text-xs font-bold text-indigo-700 w-9 text-right">${s.current}%</span>
              </div>
            </div>
            <input type="range" min="0" max="100" value="${s.current}" oninput="updateSkillProficiency('${s.id}', this.value)" class="w-full accent-indigo-600 cursor-pointer" />
          </div>
        `;
      })
      .join('');
  }

  const missingOnly = gaps.filter((g) => g.gap > 0).sort((a, b) => b.gap - a.gap);
  const summaryEl = document.getElementById('gap-diagnosis-summary');
  const badgesEl = document.getElementById('missing-skills-badges');
  const actionEl = document.getElementById('recommended-action-text');

  if (summaryEl) {
    if (missingOnly.length === 0) {
      summaryEl.textContent = `You meet or exceed every benchmark for ${goal.title}. Focus on completing projects and helping peers in Skill Exchange.`;
    } else {
      const avgGap = Math.round(missingOnly.reduce((sum, g) => sum + g.gap, 0) / missingOnly.length);
      summaryEl.textContent = `For ${goal.title}, you have ${missingOnly.length} skill gap(s) with an average shortfall of ${avgGap} points.`;
    }
  }

  if (badgesEl) {
    badgesEl.innerHTML = missingOnly.length
      ? missingOnly
          .map(
            (m) =>
              `<span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white text-slate-800 border border-slate-300">${m.name} (-${m.gap})</span>`
          )
          .join('')
      : `<span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">All Target Skills Ready</span>`;
  }

  if (actionEl) {
    actionEl.textContent = missingOnly.length
      ? `Start with "${missingOnly[0].name}" — book a ₹49–₹199 live cohort or preview a free demo class.`
      : 'Check off your remaining roadmap milestones and portfolio project.';
  }
}

function toggleRoadmapStep(stepId) {
  const goal = getCurrentGoalData();
  const step = goal.roadmap.find((r) => r.id === stepId);
  if (!step) return;
  step.done = !step.done;
  saveAppState();
  renderRoadmapAndProgress();
  renderOverviewPreviews();
  updateTopKpis();
  showToast(step.done ? `Completed: ${step.title}` : `Marked pending: ${step.title}`, 'info');
}

function toggleProjectDone(projectId) {
  const proj = appState.projects.find((p) => p.id === projectId);
  if (!proj) return;
  proj.done = !proj.done;
  saveAppState();
  renderRoadmapAndProgress();
  updateTopKpis();
}

function logDailyCheckIn() {
  if (appState.checkedInToday) {
    showToast('Today’s learning check-in is already recorded!', 'info');
    return;
  }
  appState.checkedInToday = true;
  appState.streakDays += 1;
  const openIdx = appState.weekCheckins.findIndex((d) => !d);
  if (openIdx !== -1) appState.weekCheckins[openIdx] = true;

  if (appState.streakDays % 7 === 0) {
    appState.walletBalance += 50;
    appState.walletTransactions.unshift({
      id: 'tx-' + Date.now(),
      title: `${appState.streakDays}-Day Streak Bonus Reward`,
      amount: 50,
      type: 'reward',
      date: 'Just now'
    });
    showToast(`🔥 ${appState.streakDays}-Day Streak! Earned +₹50 in Learning Wallet.`, 'success');
  } else {
    showToast(`🔥 Streak increased to ${appState.streakDays} days!`, 'success');
  }

  saveAppState();
  renderRoadmapAndProgress();
  updateTopKpis();
}

function renderRoadmapAndProgress() {
  const goal = getCurrentGoalData();
  const totalSteps = goal.roadmap.length || 1;
  const doneSteps = goal.roadmap.filter((r) => r.done).length;
  const pct = Math.round((doneSteps / totalSteps) * 100);

  const subEl = document.getElementById('roadmap-goal-subtitle');
  const pillEl = document.getElementById('roadmap-completion-pill');
  const barEl = document.getElementById('roadmap-progress-bar');
  const listEl = document.getElementById('roadmap-steps-list');

  if (subEl) subEl.textContent = `Tailored step-by-step path for ${goal.title}.`;
  if (pillEl) pillEl.textContent = `${pct}% Done (${doneSteps}/${totalSteps})`;
  if (barEl) barEl.style.width = `${pct}%`;

  if (listEl) {
    listEl.innerHTML = goal.roadmap
      .map(
        (step, idx) => `
        <div onclick="toggleRoadmapStep('${step.id}')" class="p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
          step.done ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
        }">
          <input type="checkbox" ${step.done ? 'checked' : ''} onclick="event.stopPropagation(); toggleRoadmapStep('${step.id}')" class="mt-1 w-4 h-4 accent-indigo-600 rounded cursor-pointer" />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-bold ${step.done ? 'line-through text-slate-500' : 'text-slate-900'}">Step ${idx + 1}: ${step.title}</p>
            <p class="text-xs text-slate-500 mt-0.5">${step.duration}</p>
          </div>
        </div>
      `
      )
      .join('');
  }

  const streakBig = document.getElementById('streak-big-number');
  const streakNext = document.getElementById('streak-next-reward');
  const weekGrid = document.getElementById('streak-week-grid');
  const projList = document.getElementById('projects-checklist');

  if (streakBig) streakBig.textContent = `${appState.streakDays} Days`;
  if (streakNext) {
    const rem = 7 - (appState.streakDays % 7 || 7);
    streakNext.textContent = `${rem === 0 ? 7 : rem} day(s) until next +₹50 wallet milestone`;
  }

  if (weekGrid) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    weekGrid.innerHTML = days
      .map(
        (d, idx) => `
        <div class="py-2 px-1 rounded-xl border text-xs font-semibold ${
          appState.weekCheckins[idx]
            ? 'bg-amber-100 border-amber-300 text-amber-900'
            : 'bg-slate-50 border-slate-200 text-slate-400'
        }">
          <div>${d}</div>
          <div class="mt-0.5">${appState.weekCheckins[idx] ? '🔥' : '·'}</div>
        </div>
      `
      )
      .join('');
  }

  if (projList) {
    projList.innerHTML = appState.projects
      .map(
        (p) => `
        <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer text-sm">
          <input type="checkbox" ${p.done ? 'checked' : ''} onchange="toggleProjectDone('${p.id}')" class="w-4 h-4 accent-indigo-600 rounded" />
          <span class="${p.done ? 'line-through text-slate-500' : 'font-medium text-slate-800'}">${p.title}</span>
        </label>
      `
      )
      .join('');
  }
}
