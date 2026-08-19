/**
 * main.js — General website interactions
 * Used across all pages for shared functionality.
 */

(function () {
  "use strict";

  /**
   * Mobile navigation toggle
   */
  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".navbar-menu");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
      toggle.classList.toggle("active");
      menu.classList.toggle("open");
    });

    /* Close mobile menu when a nav link is clicked */
    var navLinks = menu.querySelectorAll("a");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.classList.remove("active");
        menu.classList.remove("open");
      });
    });
  }

  /**
   * Highlight active nav link based on scroll position (landing page)
   */
  function initScrollSpy() {
    var sections = document.querySelectorAll("section[id]");
    var navLinks = document.querySelectorAll(".navbar-nav a[href^='#']");

    if (sections.length === 0 || navLinks.length === 0) return;

    function updateActiveLink() {
      var scrollPos = window.scrollY + 100;

      sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute("id");

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(function (link) {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + id) {
              link.classList.add("active");
            }
          });
        }
      });
    }

    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initScrollSpy();
  });
})();
