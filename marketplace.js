let selectedReviewRating = 5;
let activeRecordingClassId = null;

function getFilteredClasses() {
  const topicVal = document.getElementById('class-topic-filter')?.value || 'all';
  const priceVal = document.getElementById('class-price-filter')?.value || 'all';

  return LIVE_CLASSES.filter((cls) => {
    const topicMatch = topicVal === 'all' || cls.topic === topicVal;
    let priceMatch = true;
    if (priceVal === 'free') priceMatch = cls.price === 0 || cls.isDemo;
    else if (priceVal === 'under100') priceMatch = cls.price > 0 && cls.price < 100;
    else if (priceVal === '100plus') priceMatch = cls.price >= 100;
    return topicMatch && priceMatch;
  });
}

function bookLiveSeat(classId) {
  const cls = LIVE_CLASSES.find((c) => c.id === classId);
  if (!cls) return;

  if (appState.bookedClassIds.includes(classId)) {
    switchTab('timetable');
    showToast(`Already booked: ${cls.title}`, 'info');
    return;
  }

  if (cls.price > 0) {
    if (appState.walletBalance < cls.price) {
      showToast(`Need ₹${cls.price} in Learning Wallet. Adding ₹200 top-up helper or open Wallet.`, 'error');
      openWalletModal();
      return;
    }
    appState.walletBalance -= cls.price;
    appState.walletTransactions.unshift({
      id: 'tx-' + Date.now(),
      title: `Seat Booked: ${cls.title}`,
      amount: -cls.price,
      type: 'payment',
      date: 'Just now'
    });
  }

  appState.bookedClassIds.push(classId);
  appState.reminders[classId] = true;
  saveAppState();

  renderMarketplace();
  renderTimetableAndRecordings();
  renderOverviewPreviews();
  updateTopKpis();

  showToast(
    cls.price === 0 ? `Joined Free Demo: ${cls.title}` : `Booked seat for ₹${cls.price}: ${cls.title}`,
    'success'
  );
}

function openClassRecording(classId) {
  const cls = LIVE_CLASSES.find((c) => c.id === classId);
  if (!cls || !cls.recordingAllowed) {
    showToast('Recording not permitted by trainer for this live-only session.', 'error');
    return;
  }
  activeRecordingClassId = activeRecordingClassId === classId ? null : classId;
  switchTab('timetable');
  renderTimetableAndRecordings();
}

function renderMarketplace() {
  const grid = document.getElementById('live-classes-grid');
  if (!grid) return;

  const items = getFilteredClasses();
  if (!items.length) {
    grid.innerHTML = `<div class="col-span-full p-6 text-center rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-600">No classes match this filter combination.</div>`;
    return;
  }

  grid.innerHTML = items
    .map((cls) => {
      const isBooked = appState.bookedClassIds.includes(cls.id);
      const priceLabel = cls.price === 0 ? 'FREE DEMO' : `₹${cls.price} Seat`;
      const priceBadgeClass =
        cls.price === 0
          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
          : 'bg-indigo-50 text-indigo-700 border-indigo-200';

      return `
        <div class="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between gap-4 shadow-2xs hover:border-indigo-200 transition">
          <div class="space-y-2.5">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">${cls.topic}</span>
              <span class="text-xs font-bold px-2.5 py-0.5 rounded-full border ${priceBadgeClass}">${priceLabel}</span>
            </div>
            <h3 class="font-bold text-slate-900 text-base leading-snug">${cls.title}</h3>
            <p class="text-xs text-slate-600 leading-relaxed">${cls.summary}</p>
            <div class="text-xs text-slate-500 space-y-1 pt-1">
              <p>👩‍🏫 <strong class="text-slate-700">${cls.trainerName}</strong> • ${cls.language}</p>
              <p>🕒 ${cls.schedule}</p>
              <p>👥 Cohort: <strong class="text-slate-700">${cls.cohortSize}/${cls.maxSeats}</strong> learners (10–30 cap)</p>
              <p>🎥 Recording: <strong class="${cls.recordingAllowed ? 'text-emerald-700' : 'text-amber-700'}">${cls.recordingAllowed ? 'Permitted' : 'Not permitted'}</strong></p>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button onclick="bookLiveSeat('${cls.id}')" class="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition ${
              isBooked
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }">
              ${isBooked ? '✓ Seat Booked' : cls.price === 0 ? 'Join Free Demo' : `Book Seat (₹${cls.price})`}
            </button>
            <button onclick="openClassRecording('${cls.id}')" class="py-2 px-3 rounded-xl text-xs font-semibold border transition ${
              cls.recordingAllowed
                ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'
                : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
            }">
              ${cls.recordingAllowed ? 'Recording' : 'No Rec'}
            </button>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderTrainerComparison() {
  const styleFilter = document.getElementById('trainer-style-filter')?.value || 'all';
  const sortBy = document.getElementById('trainer-sort')?.value || 'rating';

  let list = TRAINERS.filter((t) => styleFilter === 'all' || t.style === styleFilter);
  if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'experience') list = [...list].sort((a, b) => b.experienceYears - a.experienceYears);
  else if (sortBy === 'price-low') list = [...list].sort((a, b) => a.seatPrice - b.seatPrice);

  const cardsGrid = document.getElementById('trainer-cards-grid');
  const tableBody = document.getElementById('trainer-table-body');

  if (cardsGrid) {
    cardsGrid.innerHTML = list
      .map((t) => {
        const trainerClass = LIVE_CLASSES.find((c) => c.trainerId === t.id);
        return `
          <div class="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 flex flex-col justify-between gap-4">
            <div>
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">${t.style}</span>
                <span class="text-xs font-bold text-amber-700">★ ${t.rating} (${t.reviewsCount})</span>
              </div>
              <h3 class="font-bold text-slate-900 text-base mt-2.5">${t.name}</h3>
              <p class="text-xs font-medium text-indigo-700">${t.role} • ${t.experienceYears} yrs exp</p>
              <p class="text-xs text-slate-600 mt-2 leading-relaxed">${t.bio}</p>
              <p class="text-xs text-slate-500 mt-2">🗣️ ${t.languages.join(', ')}</p>
            </div>
            <div class="flex items-center justify-between pt-3 border-t border-slate-200/80">
              <span class="text-sm font-extrabold text-slate-900">₹${t.seatPrice} / seat</span>
              ${
                trainerClass
                  ? `<button onclick="bookLiveSeat('${trainerClass.id}')" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">Book Class</button>`
                  : ''
              }
            </div>
          </div>
        `;
      })
      .join('');
  }

  if (tableBody) {
    tableBody.innerHTML = list
      .map((t) => {
        const trainerClass = LIVE_CLASSES.find((c) => c.trainerId === t.id);
        return `
          <tr class="hover:bg-slate-50/80">
            <td class="py-3 px-4 font-bold text-slate-900">${t.name}<div class="text-xs font-normal text-slate-500">${t.role}</div></td>
            <td class="py-3 px-4 text-slate-700">${t.experienceYears} yrs</td>
            <td class="py-3 px-4 font-semibold text-amber-700">★ ${t.rating}</td>
            <td class="py-3 px-4"><span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium">${t.style}</span></td>
            <td class="py-3 px-4 text-xs text-slate-600">${t.languages.join(', ')}</td>
            <td class="py-3 px-4 font-bold text-slate-900">₹${t.seatPrice}</td>
            <td class="py-3 px-4 text-right">
              ${
                trainerClass
                  ? `<button onclick="bookLiveSeat('${trainerClass.id}')" class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold">Book Seat</button>`
                  : '-'
              }
            </td>
          </tr>
        `;
      })
      .join('');
  }
}

function toggleReminder(classId) {
  appState.reminders[classId] = !appState.reminders[classId];
  saveAppState();
  renderTimetableAndRecordings();
  showToast(appState.reminders[classId] ? 'Class reminder enabled' : 'Class reminder muted', 'info');
}

function renderTimetableAndRecordings() {
  const listEl = document.getElementById('timetable-list');
  const badgeEl = document.getElementById('timetable-summary-badge');
  const recGrid = document.getElementById('recordings-grid');

  const bookedClasses = LIVE_CLASSES.filter((c) => appState.bookedClassIds.includes(c.id));
  if (badgeEl) {
    badgeEl.textContent = `${bookedClasses.length} Booked Session(s)`;
  }

  if (listEl) {
    if (!bookedClasses.length) {
      listEl.innerHTML = `<div class="p-5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">No booked sessions yet. Visit <button onclick="switchTab('marketplace')" class="text-indigo-600 font-semibold underline">Live Classes & Demos</button> to book a seat or join a free demo.</div>`;
    } else {
      listEl.innerHTML = bookedClasses
        .map((cls) => {
          const remOn = Boolean(appState.reminders[cls.id]);
          return `
            <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">${cls.schedule}</span>
                  <span class="text-xs text-slate-500">${cls.language}</span>
                </div>
                <h3 class="font-bold text-slate-900 text-base mt-1">${cls.title}</h3>
                <p class="text-xs text-slate-600">Trainer: ${cls.trainerName} • Cohort ${cls.cohortSize}/${cls.maxSeats}</p>
              </div>
              <button onclick="toggleReminder('${cls.id}')" class="px-3.5 py-2 rounded-xl text-xs font-semibold border transition self-start sm:self-center ${
                remOn
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
              }">
                ${remOn ? '🔔 Reminder ON' : '🔕 Reminder OFF'}
              </button>
            </div>
          `;
        })
        .join('');
    }
  }

  if (recGrid) {
    recGrid.innerHTML = LIVE_CLASSES.map((cls) => {
      const allowed = cls.recordingAllowed;
      const isPlaying = activeRecordingClassId === cls.id && allowed;
      return `
        <div class="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-between gap-3">
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-[11px] font-bold px-2 py-0.5 rounded-full ${
                allowed ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-500'
              }">${allowed ? 'Permitted' : 'Restricted by Trainer'}</span>
              <span class="text-xs text-slate-500">${cls.recordingDuration}</span>
            </div>
            <h3 class="font-bold text-slate-900 text-sm mt-2">${cls.title}</h3>
            <p class="text-xs text-slate-500 mt-0.5">${cls.trainerName}</p>
            ${
              isPlaying
                ? `<div class="mt-3 p-3 rounded-xl bg-slate-900 text-slate-100 text-xs space-y-1.5">
                    <div class="font-bold text-indigo-300">▶ Playing Session Recording</div>
                    <p class="text-slate-300">${cls.summary}</p>
                    <button onclick="activeRecordingClassId = null; renderTimetableAndRecordings();" class="mt-1 underline text-amber-300">Close Player</button>
                  </div>`
                : ''
            }
          </div>
          <button onclick="openClassRecording('${cls.id}')" class="w-full py-2 px-3 rounded-xl text-xs font-semibold border transition ${
            allowed
              ? 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'
              : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
          }">
            ${allowed ? (isPlaying ? 'Playing Recording' : '▶ Watch Recording') : '🔒 Live-Only Session'}
          </button>
        </div>
      `;
    }).join('');
  }
}

function setReviewRating(rating) {
  selectedReviewRating = rating;
  document.querySelectorAll('.star-btn').forEach((btn) => {
    const val = Number(btn.dataset.rating);
    btn.classList.toggle('text-amber-400', val <= rating);
    btn.classList.toggle('text-slate-300', val > rating);
  });
  const label = document.getElementById('review-rating-label');
  if (label) label.textContent = `${rating}.0 / 5.0`;
}

function toggleFeedbackTag(btn) {
  const isSelected = btn.classList.contains('bg-indigo-600');
  if (isSelected) {
    btn.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
    btn.classList.add('bg-white', 'text-slate-700', 'border-slate-300');
  } else {
    btn.classList.remove('bg-white', 'text-slate-700', 'border-slate-300');
    btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');
  }
}

function submitReview(event) {
  event.preventDefault();
  const selectEl = document.getElementById('review-class-select');
  const commentEl = document.getElementById('review-comment');
  const comment = commentEl?.value.trim();
  if (!comment) return;

  const chosenClass = LIVE_CLASSES.find((c) => c.id === selectEl?.value) || LIVE_CLASSES[0];
  const tags = [...document.querySelectorAll('.feedback-tag.bg-indigo-600')].map((b) => b.dataset.tag);

  appState.reviews.unshift({
    id: 'rev-' + Date.now(),
    classTitle: chosenClass.title,
    trainerName: chosenClass.trainerName,
    rating: selectedReviewRating,
    tags: tags.length ? tags : ['Helpful Session'],
    comment
  });

  commentEl.value = '';
  saveAppState();
  renderReviewsSection();
  showToast('Class review submitted!', 'success');
}

function renderReviewsSection() {
  const selectEl = document.getElementById('review-class-select');
  if (selectEl && selectEl.options.length === 0) {
    selectEl.innerHTML = LIVE_CLASSES.map(
      (c) => `<option value="${c.id}">${c.title} — ${c.trainerName}</option>`
    ).join('');
  }

  const badge = document.getElementById('reviews-count-badge');
  if (badge) badge.textContent = `${appState.reviews.length} Reviews`;

  const listEl = document.getElementById('reviews-list');
  if (!listEl) return;

  listEl.innerHTML = appState.reviews
    .map(
      (r) => `
      <div class="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/70 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <div>
            <span class="font-bold text-sm text-slate-900">${r.trainerName}</span>
            <span class="text-xs text-slate-500"> • ${r.classTitle}</span>
          </div>
          <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">${'★'.repeat(r.rating)} (${r.rating}.0)</span>
        </div>
        <div class="flex flex-wrap gap-1.5">
          ${r.tags.map((t) => `<span class="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white text-indigo-700 border border-indigo-200">${t}</span>`).join('')}
        </div>
        <p class="text-xs sm:text-sm text-slate-700">${r.comment}</p>
      </div>
    `
    )
    .join('');
}
