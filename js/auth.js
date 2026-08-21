/**
 * auth.js — Temporary frontend-only authentication
 *
 * IMPORTANT: This is temporary hard-coded authentication for demonstration
 * during the college project frontend phase. It will be replaced with proper
 * backend authentication (PHP + MySQL) in a later phase.
 * Do NOT use these credentials in a production environment.
 */

(function () {
  "use strict";

  /* Temporary credentials — for frontend demo only */
  var CREDENTIALS = {
    owner: {
      username: "owner",
      password: "owner123",
      redirect: "owner/dashboard.html"
    },
    tenant: {
      username: "tenant",
      password: "tenant123",
      redirect: "tenant/dashboard.html"
    }
  };

  function getRegisteredOwners() {
    try {
      return JSON.parse(localStorage.getItem("rms_registered_owners")) || [];
    } catch (error) {
      return [];
    }
  }

  function getRegisteredTenant(username, password) {
    if (typeof RMSStore === "undefined") return null;
    return RMSStore.getTenants().find(function (tenant) {
      return tenant.status === "Active" &&
        tenant.loginUsername === username.toLowerCase() &&
        tenant.password === password;
    });
  }

  /**
   * Initialize login form for the given role (owner or tenant)
   * @param {string} role - "owner" or "tenant"
   */
  function initLogin(role) {
    var form = document.getElementById("login-form");
    var errorEl = document.getElementById("auth-error");

    if (!form || !CREDENTIALS[role]) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var username = document.getElementById("username").value.trim();
      var password = document.getElementById("password").value;
      var creds = CREDENTIALS[role];
      var registeredOwner = role === "owner" && getRegisteredOwners().find(function (owner) {
        return owner.username === username.toLowerCase() && owner.password === password;
      });
      var registeredTenant = role === "tenant" && getRegisteredTenant(username, password);

      if ((username === creds.username && password === creds.password) || registeredOwner || registeredTenant) {
        /* Successful login — save temporary session and redirect */
        if (typeof RMSSession !== "undefined") {
          RMSSession.setSession(role, registeredOwner ? registeredOwner.fullname : username.toLowerCase());
        } else {
          localStorage.setItem("rms_session", JSON.stringify({ role: role, username: username }));
        }
        window.location.href = creds.redirect;
      } else {
        /* Show error message for incorrect credentials */
        if (errorEl) {
          errorEl.textContent = "Invalid username or password. Please try again.";
          errorEl.classList.add("visible");
        }
      }
    });

    /* Clear error when user starts typing again */
    var inputs = form.querySelectorAll("input");
    inputs.forEach(function (input) {
      input.addEventListener("input", function () {
        if (errorEl) {
          errorEl.classList.remove("visible");
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var body = document.body;
    var role = body && body.getAttribute("data-auth-role");

    if (role) {
      initLogin(role);
    }
  });
})();
