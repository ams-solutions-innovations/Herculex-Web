// Herculex Smartwatch Showcase Interactive Engine
(function () {
  function initShowcase() {
    const showcases = document.querySelectorAll('.watch-showcase');

    showcases.forEach((showcase) => {
      // ── State ──
      let currentPlatform = 'apple';
      let currentScreen = 'set_logger';
      let currentWeight = 82.5;
      let currentReps = 6;
      let currentRpe = 8.5;
      let restSeconds = 75; // 01:15
      const totalRestDuration = 90; // 01:30 baseline
      let restInterval = null;
      let fastingElapsedSec = 14 * 3600 + 22 * 60 + 38; // 14h 22m 38s
      let fastingActive = true;
      let fastingInterval = null;

      // ── Selectors ──
      const platformBtns = showcase.querySelectorAll('[data-watch-platform-target]');
      const deviceContainers = showcase.querySelectorAll('[data-watch-device]');
      const platformDescriptions = showcase.querySelectorAll('[data-platform-desc]');
      const screenBtns = showcase.querySelectorAll('[data-watch-screen-target]');
      const allScreens = showcase.querySelectorAll('.apple-view, .wear-view');

      // ── Helper: Format Time MM:SS ──
      function formatMMSS(sec) {
        const s = Math.max(0, Math.floor(sec));
        const m = Math.floor(s / 60);
        const rem = s % 60;
        return (m < 10 ? '0' : '') + m + ':' + (rem < 10 ? '0' : '') + rem;
      }

      // ── Helper: Format Fasting Time HH:MM:SS or HH:MM ──
      function formatFasting(sec) {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + (sec % 2 === 0 ? ':' + (s < 10 ? '0' : '') + s : ':' + (s < 10 ? '0' : '') + s);
      }

      // ── Update Display Values ──
      function updateWeightsAndReps() {
        showcase.querySelectorAll('.js-wear-weight, .js-apple-weight').forEach((el) => {
          el.textContent = currentWeight % 1 === 0 ? currentWeight.toFixed(0) : currentWeight.toFixed(1);
        });

        showcase.querySelectorAll('.js-wear-reps, .js-apple-reps').forEach((el) => {
          el.textContent = currentReps.toString();
        });

        showcase.querySelectorAll('.js-rpe-summary-text').forEach((el) => {
          el.textContent = (currentWeight % 1 === 0 ? currentWeight.toFixed(0) : currentWeight.toFixed(1)) + ' kg × ' + currentReps + ' reps';
        });
      }

      function updateRpeDisplay() {
        showcase.querySelectorAll('.js-rpe-value').forEach((el) => {
          el.textContent = currentRpe % 1 === 0 ? currentRpe.toFixed(0) : currentRpe.toFixed(1);
        });

        const rpeDescs = {
          6.0: '4+ reps in reserve · Warmup / Light',
          6.5: '3–4 reps in reserve · Moderate',
          7.0: '3 reps in reserve · Moderate effort',
          7.5: '2–3 reps in reserve · Building load',
          8.0: '2 reps in reserve · Solid working set',
          8.5: '1–2 reps in reserve · High effort',
          9.0: '1 rep in reserve · Very tough',
          9.5: 'Could maybe do 1 more · Grinder',
          10.0: 'Maximal effort · 0 reps in reserve!',
        };

        const descText = rpeDescs[currentRpe] || (currentRpe >= 9 ? 'Near maximal effort' : 'Moderate effort');
        showcase.querySelectorAll('.js-rpe-desc').forEach((el) => {
          el.textContent = descText;
        });

        // Heat glow based on RPE
        const heat = Math.min(Math.max((currentRpe - 6) / 4, 0), 1);
        showcase.querySelectorAll('.wear-rpe-glow').forEach((el) => {
          el.style.opacity = (0.3 + heat * 0.7).toString();
          el.style.transform = 'scale(' + (0.9 + heat * 0.3) + ')';
        });
      }

      // ── Switch Screen Function ──
      function setScreen(screenTarget) {
        currentScreen = screenTarget;

        screenBtns.forEach((btn) => {
          const isActive = btn.getAttribute('data-watch-screen-target') === screenTarget;
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        allScreens.forEach((view) => {
          const matches = view.classList.contains('view-' + screenTarget);
          view.classList.toggle('active', matches);
        });

        // If entering rest timer, ensure timer is running
        if (screenTarget === 'rest_timer') {
          startRestTimer();
        }
      }

      // ── Rest Timer Tick ──
      function startRestTimer() {
        if (restInterval) return;
        restInterval = setInterval(() => {
          if (restSeconds > 0) {
            restSeconds--;
            const formatted = formatMMSS(restSeconds);

            showcase.querySelectorAll('.js-rest-countdown, .js-wear-rest-digits, .js-rest-countdown-mini').forEach((el) => {
              el.textContent = formatted;
            });

            // Update SVG dashoffset
            const frac = Math.max(0, restSeconds / totalRestDuration);
            showcase.querySelectorAll('.js-rest-circle').forEach((circle) => {
              const totalLen = 364.4;
              circle.style.strokeDashoffset = (totalLen * (1 - frac)).toFixed(1);
            });
          } else {
            // Reached zero: trigger Go-Time overlay
            showcase.querySelectorAll('.js-gotime-overlay').forEach((el) => el.classList.add('active'));
            clearInterval(restInterval);
            restInterval = null;
          }
        }, 1000);
      }

      function addRestSeconds(secondsToAdd) {
        restSeconds += secondsToAdd;
        const formatted = formatMMSS(restSeconds);
        showcase.querySelectorAll('.js-rest-countdown, .js-wear-rest-digits, .js-rest-countdown-mini').forEach((el) => {
          el.textContent = formatted;
        });
        startRestTimer();
      }

      // ── Fasting Timer Tick ──
      function startFastingTicker() {
        if (fastingInterval) clearInterval(fastingInterval);
        fastingInterval = setInterval(() => {
          if (!fastingActive) return;
          fastingElapsedSec++;
          const fmtFull = formatFasting(fastingElapsedSec);
          const fmtShort = Math.floor(fastingElapsedSec / 3600) + 'h ' + Math.floor((fastingElapsedSec % 3600) / 60) + 'm';

          showcase.querySelectorAll('.js-fast-elapsed').forEach((el) => {
            el.textContent = fmtFull;
          });
          showcase.querySelectorAll('.js-wear-fast-elapsed').forEach((el) => {
            el.textContent = Math.floor(fastingElapsedSec / 3600) + ':' + (Math.floor((fastingElapsedSec % 3600) / 60) < 10 ? '0' : '') + Math.floor((fastingElapsedSec % 3600) / 60);
          });
        }, 1000);
      }

      // ── Platform Switcher ──
      platformBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const target = btn.getAttribute('data-watch-platform-target');
          if (!target) return;
          currentPlatform = target;

          platformBtns.forEach((b) => {
            const isActive = b === btn;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-selected', isActive ? 'true' : 'false');
          });

          deviceContainers.forEach((container) => {
            const matches = container.getAttribute('data-watch-device') === target;
            container.classList.toggle('active', matches);
          });

          platformDescriptions.forEach((desc) => {
            const matches = desc.getAttribute('data-platform-desc') === target;
            desc.classList.toggle('active', matches);
          });
        });
      });

      // ── Screen Tabs ──
      screenBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const target = btn.getAttribute('data-watch-screen-target');
          if (target) setScreen(target);
        });
      });

      // ── Interactive Set Logger Buttons ──
      // Weight +/−
      showcase.querySelectorAll('.js-wear-w-plus, .js-step-weight-plus').forEach((btn) => {
        btn.addEventListener('click', () => {
          currentWeight = Math.min(400, +(currentWeight + 0.5).toFixed(1));
          updateWeightsAndReps();
        });
      });

      showcase.querySelectorAll('.js-wear-w-minus, .js-step-weight-minus').forEach((btn) => {
        btn.addEventListener('click', () => {
          currentWeight = Math.max(0, +(currentWeight - 0.5).toFixed(1));
          updateWeightsAndReps();
        });
      });

      // Reps +/−
      showcase.querySelectorAll('.js-wear-r-plus, .js-step-reps-plus').forEach((btn) => {
        btn.addEventListener('click', () => {
          currentReps = Math.min(50, currentReps + 1);
          updateWeightsAndReps();
        });
      });

      showcase.querySelectorAll('.js-wear-r-minus, .js-step-reps-minus').forEach((btn) => {
        btn.addEventListener('click', () => {
          currentReps = Math.max(1, currentReps - 1);
          updateWeightsAndReps();
        });
      });

      // Wear OS "OK" Button -> Open RPE Modal
      showcase.querySelectorAll('.js-wear-ok-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const modal = showcase.querySelector('.js-wear-rpe-modal');
          if (modal) {
            modal.classList.add('open');
            updateRpeDisplay();
          }
        });
      });

      // RPE Modal Controls
      showcase.querySelectorAll('.js-rpe-plus').forEach((btn) => {
        btn.addEventListener('click', () => {
          currentRpe = Math.min(10.0, +(currentRpe + 0.5).toFixed(1));
          updateRpeDisplay();
        });
      });

      showcase.querySelectorAll('.js-rpe-minus').forEach((btn) => {
        btn.addEventListener('click', () => {
          currentRpe = Math.max(6.0, +(currentRpe - 0.5).toFixed(1));
          updateRpeDisplay();
        });
      });

      showcase.querySelectorAll('.js-rpe-close').forEach((btn) => {
        btn.addEventListener('click', () => {
          const modal = showcase.querySelector('.js-wear-rpe-modal');
          if (modal) modal.classList.remove('open');
        });
      });

      showcase.querySelectorAll('.js-rpe-confirm').forEach((btn) => {
        btn.addEventListener('click', () => {
          const modal = showcase.querySelector('.js-wear-rpe-modal');
          if (modal) modal.classList.remove('open');
          // Switch to Rest Timer!
          setScreen('rest_timer');
        });
      });

      // Apple Watch "Complete Set" Button -> Switch to Rest Timer
      showcase.querySelectorAll('.js-apple-complete-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          setScreen('rest_timer');
        });
      });

      // ── Rest Timer Actions (+30s & Skip) ──
      showcase.querySelectorAll('.js-rest-add30, .js-wear-rest-add30').forEach((btn) => {
        btn.addEventListener('click', () => {
          addRestSeconds(30);
        });
      });

      showcase.querySelectorAll('.js-rest-skip, .js-wear-rest-skip').forEach((btn) => {
        btn.addEventListener('click', () => {
          const overlay = showcase.querySelector('.js-gotime-overlay');
          if (overlay && currentPlatform === 'android') {
            overlay.classList.add('active');
          } else {
            // Switch back to Set Logger
            restSeconds = 75;
            setScreen('set_logger');
          }
        });
      });

      showcase.querySelectorAll('.js-gotime-dismiss').forEach((btn) => {
        btn.addEventListener('click', () => {
          showcase.querySelectorAll('.js-gotime-overlay').forEach((el) => el.classList.remove('active'));
          restSeconds = 75;
          setScreen('set_logger');
        });
      });

      // ── Wear OS Sync with Phone simulation ──
      showcase.querySelectorAll('.js-wear-sync-pill').forEach((pill) => {
        pill.addEventListener('click', () => {
          const icon = pill.querySelector('.wear-sync-ico');
          const txt = pill.querySelector('.js-sync-status-txt');
          if (icon) icon.classList.add('wear-sync-spin');
          if (txt) txt.textContent = 'Syncing with phone…';

          setTimeout(() => {
            if (icon) icon.classList.remove('wear-sync-spin');
            if (txt) txt.textContent = 'Synced · just now';
          }, 1400);
        });
      });

      // ── Fasting Button Toggles ──
      showcase.querySelectorAll('.js-wear-fast-btn, .js-btn-apple-fast').forEach((btn) => {
        btn.addEventListener('click', () => {
          fastingActive = !fastingActive;
          showcase.querySelectorAll('.js-fast-btn-text').forEach((txt) => {
            txt.textContent = fastingActive ? 'Stop Fast' : 'Start Fast';
          });
          btn.style.background = fastingActive ? '#7a2434' : '#0b6e4f';
        });
      });

      // ── Initialize ──
      updateWeightsAndReps();
      updateRpeDisplay();
      startRestTimer();
      startFastingTicker();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShowcase);
  } else {
    initShowcase();
  }
})();
