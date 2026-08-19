/**
 * owner-reports.js — Owner reports page
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    RMSLayout.init("owner", "reports");
    document.getElementById("filter-month").value = RMSUtils.getCurrentMonth();
    document.getElementById("filter-month").addEventListener("change", renderReports);
    renderReports();
  });

  function renderReports() {
    var month = document.getElementById("filter-month").value;
    var stats = RMSStore.getOwnerStats();
    var rentRecords = RMSStore.getRentRecords().filter(function (r) { return r.month === month; });
    var collected = rentRecords.filter(function (r) { return r.status === "Paid"; }).reduce(function (s, r) { return s + r.amount; }, 0);
    var pending = rentRecords.filter(function (r) { return r.status !== "Paid"; }).reduce(function (s, r) { return s + r.amount; }, 0);
    var properties = RMSStore.getProperties();
    var totalRooms = properties.reduce(function (s, p) { return s + p.totalRooms; }, 0);
    var occupied = properties.reduce(function (s, p) { return s + p.occupiedRooms; }, 0);
    var occupancyRate = totalRooms ? Math.round((occupied / totalRooms) * 100) : 0;

    document.getElementById("report-stats").innerHTML =
      reportCard("Rent Collected", RMSUtils.formatCurrency(collected)) +
      reportCard("Pending Rent", RMSUtils.formatCurrency(pending)) +
      reportCard("Occupancy Rate", occupancyRate + "%") +
      reportCard("Active Tenants", stats.activeTenants);

    renderChart(rentRecords);
    renderSummaryTable(rentRecords);
    renderPropertyTable(properties);
  }

  function reportCard(label, value) {
    return '<div class="stat-card"><div class="stat-card-label">' + label + '</div><div class="stat-card-value">' + value + "</div></div>";
  }

  function renderChart(records) {
    var paid = records.filter(function (r) { return r.status === "Paid"; }).length;
    var pending = records.filter(function (r) { return r.status === "Pending"; }).length;
    var overdue = records.filter(function (r) { return r.status === "Overdue"; }).length;
    var max = Math.max(paid, pending, overdue, 1);

    document.getElementById("payment-chart").innerHTML =
      barItem("Paid", paid, max, "#16a34a") +
      barItem("Pending", pending, max, "#d97706") +
      barItem("Overdue", overdue, max, "#dc2626");
  }

  function barItem(label, value, max, color) {
    var height = Math.round((value / max) * 100);
    return '<div class="bar-chart-item">' +
      '<span class="bar-chart-value">' + value + "</span>" +
      '<div class="bar-chart-bar" style="height:' + height + "%;background:" + color + '"></div>' +
      '<span class="bar-chart-label">' + label + "</span>" +
    "</div>";
  }

  function renderSummaryTable(records) {
    var tbody = document.getElementById("summary-table");
    if (!records.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No data for selected month</td></tr>';
      return;
    }
    tbody.innerHTML = records.map(function (r) {
      var tenant = RMSStore.getTenantById(r.tenantId);
      return "<tr>" +
        "<td>" + RMSUtils.escapeHtml(tenant ? tenant.name : "—") + "</td>" +
        "<td>" + RMSUtils.formatCurrency(r.amount) + "</td>" +
        "<td>" + RMSUtils.getStatusBadge(r.status) + "</td>" +
        "<td>" + (r.paidDate ? RMSUtils.formatDate(r.paidDate) : "—") + "</td>" +
      "</tr>";
    }).join("");
  }

  function renderPropertyTable(properties) {
    document.getElementById("property-report").innerHTML = properties.map(function (p) {
      var rate = p.totalRooms ? Math.round((p.occupiedRooms / p.totalRooms) * 100) : 0;
      return "<tr>" +
        "<td>" + RMSUtils.escapeHtml(p.name) + "</td>" +
        "<td>" + p.totalRooms + "</td>" +
        "<td>" + p.occupiedRooms + "</td>" +
        "<td>" + p.vacantRooms + "</td>" +
        "<td>" + rate + "%</td>" +
        "<td>" + RMSUtils.formatCurrency(p.monthlyIncome) + "</td>" +
      "</tr>";
    }).join("");
  }
})();
