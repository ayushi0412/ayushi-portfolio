// ===================================================================
// Ayushi Srivastava — Portfolio Interactive Logic
// Terminal Simulator, Animated Counters, Skills Filter & Contact Handlers
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTerminalSimulator();
  initStatsCounters();
  initSkillFilters();
  initCopyButtons();
  initMobileNav();
});

// -------------------------------------------------------------------
// 1. Interactive Terminal Simulator
// -------------------------------------------------------------------
const TERMINAL_SCRIPTS = {
  patching: [
    { text: 'PS C:\\Infra\\Automation> ./Invoke-FleetPatchingPipeline.ps1 -TargetGroup "All-Hybrid-Prod" -MaxConcurrency 64', type: 'cmd' },
    { text: '[01:14:02] [INFO] Initializing Hybrid Orchestration Engine (PowerShell Core + Ansible + Azure Arc)...', type: 'info' },
    { text: '[01:14:05] [INFO] Target Fleet Identified: 2,048 nodes (1,420 On-Premises Hyper-V / 628 Cloud VMs)', type: 'highlight' },
    { text: '[01:14:18] [STEP 1/4] Running automated pre-patch health checks (C: drive capacity > 15GB, service states)...', type: 'info' },
    { text: '[01:14:32] [PASS] 2,048/2,048 nodes passed pre-flight capacity and health gate.', type: 'success' },
    { text: '[01:15:02] [STEP 2/4] Triggering Ansible differential patch rollouts & Azure Update Manager staging...', type: 'info' },
    { text: '[04:22:15] [STEP 3/4] Staged node reboot sequencing initiated across Failover Clusters & CSV volumes...', type: 'highlight' },
    { text: '[07:42:30] [STEP 4/4] Post-reboot service validation & Nessus Agent vulnerability scan...', type: 'info' },
    { text: '[07:48:12] [COMPLETED] 2,048 nodes patched successfully. Zero unplanned downtime.', type: 'success' },
    { text: '[RESULT] Patch Cycle Duration: 7h 48m (Previous baseline: 48h 00m) | Compliance: N-0.5% [SOX Certified]', type: 'highlight' }
  ],
  arc: [
    { text: 'PS C:\\Infra\\Hybrid> ./Test-AzureArcConnectivity.ps1 -Subscription "Enterprise-Prod-Hybrid"', type: 'cmd' },
    { text: '[09:30:11] [INFO] Querying Azure Connected Machine Agent telemetry across SCVMM clusters...', type: 'info' },
    { text: '[09:30:15] [INFO] Arc-SCVMM Bridge Status: ONLINE (Latency: 12ms to Central India region)', type: 'highlight' },
    { text: '[09:30:22] [AUDIT] Checking 100+ Onboarded Bare-Metal and Legacy Hosts...', type: 'info' },
    { text: '[09:30:30] [STATUS] Agent Health: 100% Connected | Azure Monitor Extension: v1.28.4 Active', type: 'success' },
    { text: '[09:30:35] [POLICY] Azure Governance & Security Baseline Policy Compliance: 100% IN COMPLIANCE', type: 'success' },
    { text: '[09:30:40] [SUMMARY] Hybrid control plane synchronized. Zero drift detected across fleet.', type: 'highlight' }
  ],
  cluster: [
    { text: 'PS C:\\Infra\\Clusters> Get-ClusterSharedVolume | Test-ClusterResilience -VerifyS2D -ValidateNICs', type: 'cmd' },
    { text: '[14:12:05] [INFO] Validating Windows Server Failover Cluster "ERICSSON-HV-CLUSTER-01"...', type: 'info' },
    { text: '[14:12:08] [CHECK] Storage Spaces Direct (S2D) Pool Status: HEALTHY (OperationalStatus: OK)', type: 'success' },
    { text: '[14:12:12] [CHECK] Cluster Shared Volumes (CSV-01, CSV-02, CSV-03): Direct I/O Active, Latency < 1.2ms', type: 'success' },
    { text: '[14:12:16] [NETWORK] Physical NIC Teaming (Switch Embedded Teaming - SET): 4x 25Gbps Links Redundant', type: 'highlight' },
    { text: '[14:12:20] [HA-TEST] Failover quorum state: NodeMajority with Cloud Witness configured in Azure.', type: 'info' },
    { text: '[14:12:24] [SUMMARY] Cluster fully operational. High-availability SLAs guaranteed 99.999%.', type: 'success' }
  ]
};

let currentScriptKey = 'patching';
let isTyping = false;

function initTerminalSimulator() {
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalTabs = document.querySelectorAll('.terminal-tab-btn');
  const rerunBtn = document.getElementById('rerunTerminalBtn');

  if (!terminalOutput) return;

  function runScript(key) {
    if (isTyping) return;
    isTyping = true;
    currentScriptKey = key;
    terminalOutput.innerHTML = '';

    const lines = TERMINAL_SCRIPTS[key] || TERMINAL_SCRIPTS.patching;
    let lineIndex = 0;

    function renderNextLine() {
      if (lineIndex < lines.length) {
        const item = lines[lineIndex];
        const lineElem = document.createElement('div');
        
        if (item.type === 'cmd') {
          lineElem.className = 'terminal-cmd-line';
          lineElem.innerHTML = `<span class="terminal-prompt">&gt; </span><span class="terminal-cmd">${item.text}</span>`;
        } else if (item.type === 'success') {
          lineElem.className = 'terminal-log-success';
          lineElem.textContent = item.text;
        } else if (item.type === 'highlight') {
          lineElem.className = 'terminal-log-highlight';
          lineElem.textContent = item.text;
        } else {
          lineElem.className = 'terminal-log-info';
          lineElem.textContent = item.text;
        }

        terminalOutput.appendChild(lineElem);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        lineIndex++;
        setTimeout(renderNextLine, 120);
      } else {
        isTyping = false;
      }
    }

    renderNextLine();
  }

  terminalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (isTyping) return;
      terminalTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const scriptKey = tab.dataset.script;
      runScript(scriptKey);
    });
  });

  if (rerunBtn) {
    rerunBtn.addEventListener('click', () => {
      runScript(currentScriptKey);
    });
  }

  // Initial render
  runScript('patching');
}

// -------------------------------------------------------------------
// 2. Animated Stats Counters
// -------------------------------------------------------------------
function initStatsCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
          const duration = 1600;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOut * target);

            stat.textContent = currentVal.toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              stat.textContent = target.toLocaleString();
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-counter-strip');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

// -------------------------------------------------------------------
// 3. Skills Interactive Filter
// -------------------------------------------------------------------
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.category;

      skillCards.forEach(card => {
        const cardCategory = card.dataset.category;
        if (filterVal === 'all' || cardCategory === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

// -------------------------------------------------------------------
// 4. Quick Email Copy & Toast Notification
// -------------------------------------------------------------------
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.dataset.email || 'ayushi.sri1009@gmail.com';
      navigator.clipboard.writeText(email)
        .then(() => {
          showToast(`✓ Copied ${email} to clipboard!`);
        })
        .catch(() => {
          showToast(`Email: ${email}`);
        });
    });
  });
}

// -------------------------------------------------------------------
// 5. Mobile Navigation Toggle
// -------------------------------------------------------------------
function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Close nav on click of link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

// -------------------------------------------------------------------
// 6. Direct Inquiry Form Handler
// -------------------------------------------------------------------
window.handleInquirySubmit = function() {
  const name = document.getElementById('inquirerName')?.value || 'Recruiter / Hiring Manager';
  const email = document.getElementById('inquirerEmail')?.value || '';
  const role = document.getElementById('roleInterest')?.value || 'Cloud / Infrastructure Role';
  const msg = document.getElementById('inquiryMessage')?.value || '';

  const subject = encodeURIComponent(`Inquiry for Ayushi Srivastava — ${role}`);
  const body = encodeURIComponent(
`Hi Ayushi,

My name is ${name} (${email}).

We have an opportunity regarding: ${role}

Message / Details:
${msg}

Looking forward to connecting with you.

Best regards,
${name}
${email}`
  );

  const successBanner = document.getElementById('formSuccessMessage');
  if (successBanner) {
    successBanner.style.display = 'block';
  }

  // Open default email client with populated fields
  setTimeout(() => {
    window.location.href = `mailto:ayushi.sri1009@gmail.com?subject=${subject}&body=${body}`;
  }, 400);
};
