(function () {
  "use strict";

  var currentTenant = null;

  document.addEventListener("DOMContentLoaded", function () {
    var session = RMSLayout.init("tenant", "alerts");
    if (!session) return;

    currentTenant = RMSStore.getTenantByLogin(session.username);
    if (!currentTenant) return;

    renderAlerts();
  });

  function renderAlerts() {
    var container = document.getElementById("tenant-alert-list");
    var alerts = RMSStore.getAlertsForTenant(currentTenant.id);

    if (!alerts.length) {
      container.innerHTML = '<div class="empty-state"><p>No alerts available right now.</p></div>';
      return;
    }

    container.innerHTML = alerts.map(function (alert) {
      var isUnread = alert.readBy.indexOf(currentTenant.id) === -1;
      return '<div class="alert-item' + (isUnread ? " unread" : "") + '">' +
        '<div class="alert-item-date">' + RMSUtils.formatDate(alert.date) + "</div>" +
        "<p>" + RMSUtils.escapeHtml(alert.message) + "</p>" +
        '<div class="card-actions" style="margin-top:0.75rem">' +
          (isUnread
            ? '<button type="button" class="btn btn-sm btn-outline mark-read-btn" data-id="' + alert.id + '">Mark as Read</button>'
            : '<span class="badge badge-success">Read</span>') +
        "</div>" +
      "</div>";
    }).join("");

    container.querySelectorAll(".mark-read-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        RMSStore.markAlertRead(button.dataset.id, currentTenant.id);
        renderAlerts();
      });
    });
  }
})();
