/**
 * session.js — Temporary frontend session management
 *
 * IMPORTANT: Temporary session handling for the frontend demo phase.
 * Will be replaced with proper backend authentication later.
 */
var RMSSession = (function () {
  "use strict";

  var SESSION_KEY = "rms_session";

  function setSession(role, username) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ role: role, username: username }));
  }

  function getSession() {
    try {
      var data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function requireAuth(expectedRole) {
    var session = getSession();
    if (!session || session.role !== expectedRole) {
      var loginPage = expectedRole === "owner" ? "../owner-login.html" : "../tenant-login.html";
      window.location.href = loginPage;
      return null;
    }
    return session;
  }

  function logout() {
    clearSession();
    window.location.href = "../../index.html";
  }

  return {
    setSession: setSession,
    getSession: getSession,
    clearSession: clearSession,
    requireAuth: requireAuth,
    logout: logout
  };
})();
