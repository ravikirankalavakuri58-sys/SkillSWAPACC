function toggleAssistantDrawer(open) {
  const backdrop = document.getElementById('assistant-backdrop');
  const drawer = document.getElementById('assistant-drawer');
  if (!backdrop || !drawer) return;

  if (open) {
    backdrop.classList.remove('hidden');
    requestAnimationFrame(() => drawer.classList.remove('translate-x-full'));
    renderAssistantMessages();
  } else {
    drawer.classList.add('translate-x-full');
    setTimeout(() => backdrop.classList.add('hidden'), 250);
  }
}

function runAiExplain() {
  const input = document.getElementById('ai-topic-input');
  const topic = (input?.value || '').trim() || 'Core Programming Concept';

  appState.assistantMessages.unshift({
    role: 'assistant',
    title: `Concept Breakdown: ${topic}`,
    body: `• Core Idea: ${topic} organizes how data or behavior flows so you can reason about inputs, outputs, and failure cases clearly.\n• When to Use: Apply ${topic} when straightforward one-off logic becomes hard to maintain or test.\n• Watch Out For: Edge cases, empty/null inputs, and unclear boundaries.`
  });

  saveAppState();
  renderAssistantMessages();
}

function runAiPracticeQuiz() {
  const input = document.getElementById('ai-topic-input');
  const topic = (input?.value || '').trim() || 'Core Programming Concept';

  appState.assistantMessages.unshift({
    role: 'assistant',
    title: `Practice Questions: ${topic}`,
    body: `1. Explain ${topic} in two sentences to a peer without using jargon.\n2. Name one edge case or failure mode in ${topic} and how you would test it.\n3. Write a small example or step-by-step trace showing ${topic} in action.`
  });

  saveAppState();
  renderAssistantMessages();
}

function renderAssistantMessages() {
  const container = document.getElementById('ai-assistant-messages');
  if (!container) return;

  container.innerHTML = appState.assistantMessages
    .map(
      (msg) => `
      <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5">
        <p class="font-bold text-xs text-indigo-700">${msg.title}</p>
        <p class="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">${msg.body}</p>
      </div>
    `
    )
    .join('');
}

function openWalletModal() {
  const modal = document.getElementById('wallet-modal-backdrop');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  renderWalletModal();
}

function closeWalletModal() {
  const modal = document.getElementById('wallet-modal-backdrop');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function topUpWallet(amount) {
  appState.walletBalance += amount;
  appState.walletTransactions.unshift({
    id: 'tx-' + Date.now(),
    title: `Wallet Top-Up (+₹${amount})`,
    amount,
    type: 'topup',
    date: 'Just now'
  });
  saveAppState();
  renderWalletModal();
  updateTopKpis();
  showToast(`Added ₹${amount} to Learning Wallet`, 'success');
}

function renderWalletModal() {
  const balEl = document.getElementById('modal-wallet-balance');
  const listEl = document.getElementById('wallet-transactions-list');
  if (balEl) balEl.textContent = `₹${appState.walletBalance.toLocaleString('en-IN')}`;

  if (listEl) {
    listEl.innerHTML = appState.walletTransactions
      .map((tx) => {
        const isPos = tx.amount >= 0;
        return `
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm">
            <div>
              <p class="font-semibold text-slate-900">${tx.title}</p>
              <p class="text-[11px] text-slate-500">${tx.date}</p>
            </div>
            <span class="font-bold ${isPos ? 'text-emerald-700' : 'text-rose-700'}">${isPos ? '+' : '-'}₹${Math.abs(tx.amount)}</span>
          </div>
        `;
      })
      .join('');
  }
}
