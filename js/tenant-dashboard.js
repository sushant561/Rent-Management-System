(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var session = RMSLayout.init("tenant", "dashboard");
    if (!session) return;

    var tenant = RMSStore.getTenantByLogin(session.username);
    if (!tenant) return;

    renderDashboard(tenant);
  });

  function renderDashboard(tenant) {
    var property = RMSStore.getPropertyById(tenant.propertyId);
    var currentRent = RMSStore.getCurrentRentRecordForTenant(tenant.id);
    var payments = RMSStore.getPaymentsByTenant(tenant.id).slice(0, 5);
    var alerts = RMSStore.getAlertsForTenant(tenant.id).slice(0, 3);
    var complaints = RMSStore.getComplaintsByTenant(tenant.id);
    var openComplaints = complaints.filter(function (complaint) {
      return complaint.status !== "Resolved";
    }).length;
    var dueAmount = currentRent && currentRent.status !== "Paid" ? currentRent.amount : 0;

    document.getElementById("tenant-hero").innerHTML =
      "<h2>Welcome, " + RMSUtils.escapeHtml(tenant.name) + "</h2>" +
      "<p>Manage your rent details, stay updated with owner alerts, and track complaint progress from one place.</p>" +
      '<div class="hero-meta">' +
        metaChip("Property", property ? property.name : "Not assigned") +
        metaChip("Room", tenant.roomNumber || "—") +
        metaChip("Monthly Rent", RMSUtils.formatCurrency(tenant.monthlyRent)) +
      "</div>";

    document.getElementById("tenant-stats").innerHTML =
      statCard("Monthly Rent", RMSUtils.formatCurrency(tenant.monthlyRent)) +
      statCard("Current Due", RMSUtils.formatCurrency(dueAmount)) +
      statCard("Rent Status", RMSUtils.getStatusBadge(currentRent ? currentRent.status : "Pending")) +
      statCard("Next Due Date", currentRent ? RMSUtils.formatDate(currentRent.dueDate) : "—") +
      statCard("Unread Alerts", RMSStore.getUnreadAlertCount(tenant.id)) +
      statCard("Open Complaints", openComplaints);

    document.getElementById("tenant-rental-info").innerHTML =
      infoRow("Tenant Name", tenant.name) +
      infoRow("Property", property ? property.name : "—") +
      infoRow("Room Number", tenant.roomNumber) +
      infoRow("Status", tenant.status) +
      infoRow("Joining Date", RMSUtils.formatDate(tenant.joiningDate)) +
      infoRow("Current Rent Status", currentRent ? currentRent.status : "Pending");

    document.getElementById("tenant-payments").innerHTML = payments.length
      ? payments.map(function (payment) {
          return "<tr>" +
            "<td>" + RMSUtils.escapeHtml(payment.receiptId) + "</td>" +
            "<td>" + RMSUtils.escapeHtml(RMSUtils.getMonthLabel(payment.month)) + "</td>" +
            "<td>" + RMSUtils.formatCurrency(payment.amount) + "</td>" +
            "<td>" + RMSUtils.formatDate(payment.paymentDate) + "</td>" +
            '<td><a href="../receipt.html?id=' + payment.id + '" target="_blank" class="btn btn-sm btn-outline">View Receipt</a></td>' +
          "</tr>";
        }).join("")
      : '<tr><td colspan="5" class="empty-state">No payment history available</td></tr>';

    document.getElementById("tenant-alert-summary").innerHTML = alerts.length
      ? alerts.map(function (alert) {
          var unreadClass = alert.readBy.indexOf(tenant.id) === -1 ? " unread" : "";
          return '<div class="alert-item' + unreadClass + '">' +
            '<div class="alert-item-date">' + RMSUtils.formatDate(alert.date) + "</div>" +
            "<p>" + RMSUtils.escapeHtml(alert.message) + "</p>" +
          "</div>";
        }).join("")
      : '<p class="empty-inline">No alerts available.</p>';

    document.getElementById("tenant-complaint-summary").innerHTML = complaints.length
      ? complaints.slice(0, 3).map(function (complaint) {
          return '<div class="stack-list-item">' +
            "<h4>" + RMSUtils.escapeHtml(complaint.subject) + "</h4>" +
            "<p>" + RMSUtils.escapeHtml(complaint.response || "No response from the owner yet.") + "</p>" +
            '<div class="item-meta"><span>' + RMSUtils.formatDate(complaint.date) + "</span><span>" + complaint.status + "</span></div>" +
          "</div>";
        }).join("")
      : '<p class="empty-inline">No complaints submitted yet.</p>';
  }

  function statCard(label, value) {
    return '<div class="stat-card"><div class="stat-card-label">' + label + '</div><div class="stat-card-value">' + value + "</div></div>";
  }

  function metaChip(label, value) {
    return '<span class="meta-chip"><strong>' + RMSUtils.escapeHtml(label) + ":</strong> " + RMSUtils.escapeHtml(String(value)) + "</span>";
  }

  function infoRow(label, value) {
    return '<div class="info-list-item"><span class="info-list-label">' + RMSUtils.escapeHtml(label) + '</span><span class="info-list-value">' + RMSUtils.escapeHtml(String(value || "—")) + "</span></div>";
  }
})();
