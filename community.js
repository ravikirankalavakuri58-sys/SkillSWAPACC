function postDoubt(event) {
  event.preventDefault();
  const classSelect = document.getElementById('doubt-class-select');
  const timingSelect = document.getElementById('doubt-timing-select');
  const inputEl = document.getElementById('doubt-input');
  const question = inputEl?.value.trim();
  if (!question) return;

  const chosenClass = LIVE_CLASSES.find((c) => c.id === classSelect?.value) || LIVE_CLASSES[0];
  const timing = timingSelect?.value || 'During Live Class';

  appState.doubts.unshift({
    id: 'dbt-' + Date.now(),
    classTitle: chosenClass.title,
    timing,
    question,
    answer: `Instant Mentor Note for "${question.slice(0, 48)}${question.length > 48 ? '...' : ''}": Isolate one input case, verify expected output, and check boundary conditions step by step.`,
    author: `${chosenClass.trainerName} (Mentor Reply)`
  });

  inputEl.value = '';
  saveAppState();
  renderDoubtsAndNotes();
  showToast('Doubt posted and answered!', 'success');
}

function handleNoteInput(val) {
  appState.notesText = val;
  saveAppState();
  const statusEl = document.getElementById('notes-saved-status');
  if (statusEl) statusEl.textContent = 'Auto-saved';
}

function saveNotesNow() {
  const pad = document.getElementById('personal-notes-pad');
  if (pad) appState.notesText = pad.value;
  saveAppState();
  showToast('Personal notes saved', 'success');
}

function downloadNotesFile() {
  const content = appState.notesText || '';
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'SkillBridge-Notes.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Downloaded SkillBridge-Notes.txt', 'success');
}

function addResourceItem(event) {
  event.preventDefault();
  const titleInput = document.getElementById('resource-title-input');
  const typeSelect = document.getElementById('resource-type-input');
  const title = titleInput?.value.trim();
  if (!title) return;

  appState.resources.unshift({
    id: 'res-' + Date.now(),
    title,
    type: typeSelect?.value || 'Cheatsheet'
  });

  titleInput.value = '';
  saveAppState();
  renderDoubtsAndNotes();
  showToast('Added learning resource', 'success');
}

function renderDoubtsAndNotes() {
  const classSelect = document.getElementById('doubt-class-select');
  if (classSelect && classSelect.options.length === 0) {
    classSelect.innerHTML = LIVE_CLASSES.map((c) => `<option value="${c.id}">${c.title}</option>`).join('');
  }

  const doubtsList = document.getElementById('doubts-thread-list');
  if (doubtsList) {
    doubtsList.innerHTML = appState.doubts
      .map(
        (d) => `
        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xs font-bold text-indigo-700">${d.classTitle}</span>
            <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">${d.timing}</span>
          </div>
          <p class="text-sm font-bold text-slate-900">Q: ${d.question}</p>
          <div class="p-3 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
            <span class="font-bold text-emerald-700">✓ ${d.author}:</span> ${d.answer}
          </div>
        </div>
      `
      )
      .join('');
  }

  const notesPad = document.getElementById('personal-notes-pad');
  if (notesPad && notesPad.value !== appState.notesText) {
    notesPad.value = appState.notesText;
  }

  const resList = document.getElementById('resources-list');
  if (resList) {
    resList.innerHTML = appState.resources
      .map(
        (r) => `
        <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <span class="font-semibold text-slate-800 truncate pr-2">📄 ${r.title}</span>
          <span class="shrink-0 font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">${r.type}</span>
        </div>
      `
      )
      .join('');
  }
}

function rsvpOfflineWorkshop(workshopId) {
  const ws = OFFLINE_WORKSHOPS.find((w) => w.id === workshopId);
  if (!ws) return;
  if (appState.rsvpedOfflineIds.includes(workshopId)) {
    showToast(`Already RSVP'd for ${ws.title}`, 'info');
    return;
  }
  appState.rsvpedOfflineIds.push(workshopId);
  saveAppState();
  renderCommunitySection();
  showToast(`Seat reserved for ${ws.title} (${ws.city})`, 'success');
}

function togglePeerPod(podId) {
  const pod = appState.peerPods.find((p) => p.id === podId);
  if (!pod) return;
  pod.joined = !pod.joined;
  pod.members += pod.joined ? 1 : -1;
  saveAppState();
  renderCommunitySection();
  showToast(pod.joined ? `Joined pod: ${pod.topic}` : `Left pod: ${pod.topic}`, 'info');
}

function postSkillExchange(event) {
  event.preventDefault();
  const offerEl = document.getElementById('swap-offer-input');
  const wantEl = document.getElementById('swap-want-input');
  const offer = offerEl?.value.trim();
  const want = wantEl?.value.trim();
  if (!offer || !want) return;

  appState.exchanges.unshift({
    id: 'swp-' + Date.now(),
    offer,
    want,
    owner: 'You',
    status: 'Open'
  });

  offerEl.value = '';
  wantEl.value = '';
  saveAppState();
  renderCommunitySection();
  showToast('Posted skill exchange listing!', 'success');
}

function renderCommunitySection() {
  const offlineGrid = document.getElementById('offline-workshops-grid');
  if (offlineGrid) {
    offlineGrid.innerHTML = OFFLINE_WORKSHOPS.map((w) => {
      const rsvped = appState.rsvpedOfflineIds.includes(w.id);
      const remaining = Math.max(0, w.seatsLeft - (rsvped ? 1 : 0));
      return `
        <div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between gap-3">
          <div>
            <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">✓ Approved Hub</span>
            <h3 class="font-bold text-slate-900 text-sm mt-2">${w.title}</h3>
            <p class="text-xs text-slate-600 mt-1">📍 ${w.city}</p>
            <p class="text-xs text-slate-500 mt-0.5">🗓️ ${w.date} • ${remaining} spots left</p>
          </div>
          <button onclick="rsvpOfflineWorkshop('${w.id}')" class="w-full py-2 px-3 rounded-xl text-xs font-semibold transition ${
            rsvped
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }">
            ${rsvped ? '✓ Spot Reserved' : 'Reserve Offline Spot'}
          </button>
        </div>
      `;
    }).join('');
  }

  const podsList = document.getElementById('peer-pods-list');
  if (podsList) {
    podsList.innerHTML = appState.peerPods
      .map(
        (p) => `
        <div class="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
          <div>
            <p class="font-bold text-sm text-slate-900">${p.topic}</p>
            <p class="text-xs text-slate-500 mt-0.5">${p.schedule} • ${p.members} peers</p>
          </div>
          <button onclick="togglePeerPod('${p.id}')" class="px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
            p.joined
              ? 'bg-sky-100 text-sky-900 border-sky-300'
              : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
          }">
            ${p.joined ? 'Joined ✓' : 'Join Pod'}
          </button>
        </div>
      `
      )
      .join('');
  }

  const swapList = document.getElementById('skill-exchange-list');
  if (swapList) {
    swapList.innerHTML = appState.exchanges
      .map(
        (ex) => `
        <div class="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
          <div class="text-xs sm:text-sm">
            <span class="font-bold text-emerald-700">Teaches: ${ex.offer}</span>
            <span class="text-slate-400 mx-1.5">⇄</span>
            <span class="font-bold text-violet-700">Learns: ${ex.want}</span>
            <div class="text-xs text-slate-500 mt-0.5">Posted by ${ex.owner}</div>
          </div>
          <span class="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200">${ex.status}</span>
        </div>
      `
      )
      .join('');
  }
}
