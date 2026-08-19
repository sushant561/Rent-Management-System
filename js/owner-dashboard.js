/**
 * owner-dashboard.js — Owner dashboard page
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    RMSLayout.init("owner", "dashboard");
    renderDashboard();
  });

  function renderDashboard() {
    var stats = RMSStore.getOwnerStats();
    var properties = RMSStore.getProperties();
    var payments = RMSStore.getPayments().slice(0, 5);
    var complaints = RMSStore.getComplaints().slice(0, 5);

    document.getElementById("stats-grid").innerHTML =
      statCard("Total Properties", stats.totalProperties) +
      statCard("Total Rooms", stats.totalRooms) +
      statCard("Occupied Rooms", stats.occupiedRooms) +
      statCard("Vacant Rooms", stats.vacantRooms) +
      statCard("Active Tenants", stats.activeTenants) +
      statCard("Rent Collected", RMSUtils.formatCurrency(stats.totalRentCollection), true) +
      statCard("Pending Rent", RMSUtils.formatCurrency(stats.pendingRent), true);

    document.getElementById("property-overview").innerHTML = properties.map(function (p) {
      return '<tr>' +
        "<td>" + RMSUtils.escapeHtml(p.name) + "</td>" +
        "<td>" + RMSUtils.escapeHtml(p.location) + "</td>" +
        "<td>" + p.totalRooms + "</td>" +
        "<td>" + p.occupiedRooms + "</td>" +
        "<td>" + p.vacantRooms + "</td>" +
        "<td>" + RMSUtils.formatCurrency(p.monthlyIncome) + "</td>" +
        '<td><a href="properties.html" class="btn btn-sm btn-outline">View Details</a></td>' +
      "</tr>";
    }).join("");

    document.getElementById("recent-payments").innerHTML = payments.length
      ? payments.map(function (pay) {
          var tenant = RMSStore.getTenantById(pay.tenantId);
          return '<tr>' +
            "<td>" + RMSUtils.escapeHtml(tenant ? tenant.name : "—") + "</td>" +
            "<td>" + RMSUtils.formatCurrency(pay.amount) + "</td>" +
            "<td>" + RMSUtils.formatDate(pay.paymentDate) + "</td>" +
            "<td>" + RMSUtils.getStatusBadge(pay.status) + "</td>" +
          "</tr>";
        }).join("")
      : '<tr><td colspan="4" class="empty-state">No payments yet</td></tr>';

    document.getElementById("recent-complaints").innerHTML = complaints.length
      ? complaints.map(function (c) {
          var tenant = RMSStore.getTenantById(c.tenantId);
          return '<tr>' +
            "<td>" + RMSUtils.escapeHtml(tenant ? tenant.name : "—") + "</td>" +
            "<td>" + RMSUtils.escapeHtml(c.subject) + "</td>" +
            "<td>" + RMSUtils.formatDate(c.date) + "</td>" +
            "<td>" + RMSUtils.getStatusBadge(c.status) + "</td>" +
          "</tr>";
        }).join("")
      : '<tr><td colspan="4" class="empty-state">No complaints yet</td></tr>';
  }

  function statCard(label, value, isCurrency) {
    var valClass = isCurrency ? "" : "";
    return '<div class="stat-card">' +
      '<div class="stat-card-label">' + label + "</div>" +
      '<div class="stat-card-value' + valClass + '">' + value + "</div>" +
    "</div>";
  }
})();
