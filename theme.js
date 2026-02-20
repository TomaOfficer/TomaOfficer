/**
 * Theme Toggle with View Transitions API
 * Implements circular sweep animation from button position
 */
(function () {
  "use strict";

  const THEME_KEY = "theme-preference";
  const DARK_CLASS = "dark";

  /**
   * Get stored preference or system preference
   */
  function getThemePreference() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  /**
   * Apply theme without animation (for initial load)
   */
  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add(DARK_CLASS);
    } else {
      document.documentElement.classList.remove(DARK_CLASS);
    }
  }

  /**
   * Toggle theme with View Transitions API animation
   */
  async function toggleTheme() {
    const isDark = document.documentElement.classList.contains(DARK_CLASS);
    const newTheme = isDark ? "light" : "dark";

    // Store preference
    localStorage.setItem(THEME_KEY, newTheme);

    // Get button position for animation origin
    const button = document.getElementById("theme-toggle");
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Calculate the maximum radius needed to cover the entire viewport
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Check for View Transitions API support
    if (!document.startViewTransition) {
      // Fallback: simple toggle without animation
      applyTheme(newTheme);
      return;
    }

    // Use View Transitions API for animated toggle
    const transition = document.startViewTransition(() => {
      applyTheme(newTheme);
    });

    // Wait for the transition to be ready, then animate
    await transition.ready;

    // Always animate the new view expanding from button position
    // This creates a consistent "sweep in" effect for both directions
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }

  /**
   * Initialize theme system
   */
  function init() {
    // Apply stored/system preference immediately
    const theme = getThemePreference();
    applyTheme(theme);

    // Set up toggle button
    const button = document.getElementById("theme-toggle");
    if (button) {
      button.addEventListener("click", toggleTheme);
    }

    // Listen for system preference changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        // Only auto-switch if user hasn't manually set preference
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(e.matches ? "dark" : "light");
        }
      });
  }

  // Run init when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
