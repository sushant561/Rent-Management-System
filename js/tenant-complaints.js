(function () {
  "use strict";

  var currentTenant = null;

  document.addEventListener("DOMContentLoaded", function () {
    var session = RMSLayout.init("tenant", "complaints");
    if (!session) return;

    currentTenant = RMSStore.getTenantByLogin(session.username);
    if (!currentTenant) return;

    document.getElementById("tenant-complaint-form").addEventListener("submit", submitComplaint);
    renderComplaints();
  });

  function submitComplaint(event) {
    event.preventDefault();

    var subject = document.getElementById("complaint-subject").value.trim();
    var description = document.getElementById("complaint-description").value.trim();
    var error = RMSUtils.validateRequired(subject, "Subject") || RMSUtils.validateRequired(description, "Description");

    if (error) {
      RMSUtils.showToast(error, "error");
      return;
    }

    RMSStore.addComplaint({
      tenantId: currentTenant.id,
      subject: subject,
      description: description
    });

    event.target.reset();
    RMSUtils.showToast("Complaint submitted successfully.", "success");
    renderComplaints();
  }

  function renderComplaints() {
    var complaints = RMSStore.getComplaintsByTenant(currentTenant.id);
    var pendingCount = complaints.filter(function (complaint) { return complaint.status === "Pending"; }).length;
    var inProgressCount = complaints.filter(function (complaint) { return complaint.status === "In Progress"; }).length;
    var resolvedCount = complaints.filter(function (complaint) { return complaint.status === "Resolved"; }).length;

    document.getElementById("complaint-summary").innerHTML =
      infoRow("Total Complaints", complaints.length) +
      infoRow("Pending", pendingCount) +
      infoRow("In Progress", inProgressCount) +
      infoRow("Resolved", resolvedCount);

    document.getElementById("tenant-complaints-table").innerHTML = complaints.length
      ? complaints.map(function (complaint) {
          return "<tr>" +
            "<td>" + RMSUtils.escapeHtml(complaint.subject) + "</td>" +
            "<td>" + RMSUtils.escapeHtml(complaint.description) + "</td>" +
            "<td>" + RMSUtils.formatDate(complaint.date) + "</td>" +
            "<td>" + RMSUtils.getStatusBadge(complaint.status) + "</td>" +
            "<td>" + RMSUtils.escapeHtml(complaint.response || "Awaiting response") + "</td>" +
          "</tr>";
        }).join("")
      : '<tr><td colspan="5" class="empty-state">No complaints submitted yet.</td></tr>';
  }

  function infoRow(label, value) {
    return '<div class="info-list-item"><span class="info-list-label">' + RMSUtils.escapeHtml(label) + '</span><span class="info-list-value">' + RMSUtils.escapeHtml(String(value)) + "</span></div>";
  }
})();
