/**
 * owner-register.js — Temporary frontend-only owner registration
 */

(function () {
  "use strict";

  var STORAGE_KEY = "rms_registered_owners";

  function getOwners() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
      return [];
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("register-form");
    var errorEl = document.getElementById("auth-error");
    var successEl = document.getElementById("auth-success");

    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var fullname = document.getElementById("fullname").value.trim();
      var username = document.getElementById("username").value.trim().toLowerCase();
      var email = document.getElementById("email").value.trim().toLowerCase();
      var phone = document.getElementById("phone").value.trim();
      var password = document.getElementById("password").value;
      var confirmPassword = document.getElementById("confirm-password").value;
      var owners = getOwners();

      errorEl.classList.remove("visible");
      successEl.classList.remove("visible");

      if (!form.checkValidity()) {
        errorEl.textContent = "Please complete all fields correctly.";
        errorEl.classList.add("visible");
        return;
      }

      if (password !== confirmPassword) {
        errorEl.textContent = "Passwords do not match.";
        errorEl.classList.add("visible");
        return;
      }

      if (owners.some(function (owner) { return owner.username === username; })) {
        errorEl.textContent = "An owner account with this username already exists.";
        errorEl.classList.add("visible");
        return;
      }

      if (owners.some(function (owner) { return owner.email === email; })) {
        errorEl.textContent = "An owner account with this email already exists.";
        errorEl.classList.add("visible");
        return;
      }

      owners.push({ username: username, fullname: fullname, email: email, phone: phone, password: password });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(owners));
      form.reset();
      successEl.textContent = "Registration successful. You can now log in with your username.";
      successEl.classList.add("visible");
    });

    form.querySelectorAll("input").forEach(function (input) {
      input.addEventListener("input", function () {
        errorEl.classList.remove("visible");
        successEl.classList.remove("visible");
      });
    });
  });
})();