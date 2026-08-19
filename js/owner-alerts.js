/**
 * owner-alerts.js — Owner alerts/notifications page
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    RMSLayout.init("owner", "alerts");
    populateTenantSelect();
    renderSentAlerts();
    document.getElementById("send-alert-form").addEventListener("submit", function (e) {
      e.preventDefault();
      sendAlert();
    });
  });

  function populateTenantSelect() {
    var select = document.getElementById("alert-tenant");
    RMSStore.getTenants().filter(function (t) { return t.status === "Active"; }).forEach(function (t) {
      select.innerHTML += '<option value="' + t.id + '">' + RMSUtils.escapeHtml(t.name) + "</option>";
    });
  }

  function sendAlert() {
    var message = document.getElementById("alert-message").value.trim();
    var tenantId = document.getElementById("alert-tenant").value;
    var recipient = document.querySelector('input[name="recipient"]:checked').value;

    if (!message) {
      RMSUtils.showToast("Please enter an alert message.", "error");
      return;
    }

    RMSStore.sendAlert(message, recipient === "all" ? null : tenantId);
    RMSUtils.showToast("Alert sent successfully.", "success");
    document.getElementById("alert-message").value = "";
    renderSentAlerts();
  }

  function renderSentAlerts() {
    var alerts = RMSStore.getAlerts();
    var container = document.getElementById("sent-alerts");

    if (!alerts.length) {
      container.innerHTML = '<div class="empty-state"><p>No alerts sent yet.</p></div>';
      return;
    }

    container.innerHTML = alerts.map(function (a) {
      var recipient = "All Tenants";
      if (a.tenantId) {
        var tenant = RMSStore.getTenantById(a.tenantId);
        recipient = tenant ? tenant.name : "Specific Tenant";
      }
      return '<div class="alert-item">' +
        '<div class="alert-item-date">' + RMSUtils.formatDate(a.date) + " — To: " + RMSUtils.escapeHtml(recipient) + "</div>" +
        "<p>" + RMSUtils.escapeHtml(a.message) + "</p>" +
      "</div>";
    }).join("");
  }
})();
