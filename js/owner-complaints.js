/**
 * owner-complaints.js — Owner complaints management
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    RMSLayout.init("owner", "complaints");
    document.getElementById("filter-status").addEventListener("change", renderComplaints);
    renderComplaints();
  });

  function renderComplaints() {
    var statusFilter = document.getElementById("filter-status").value;
    var complaints = RMSStore.getComplaints().filter(function (c) {
      return !statusFilter || c.status.toLowerCase().replace(" ", "-") === statusFilter.toLowerCase() ||
        c.status.toLowerCase() === statusFilter.toLowerCase();
    });

    var tbody = document.getElementById("complaints-table");
    if (!complaints.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No complaints found</td></tr>';
      return;
    }

    tbody.innerHTML = complaints.map(function (c) {
      var tenant = RMSStore.getTenantById(c.tenantId);
      return "<tr>" +
        "<td>" + RMSUtils.escapeHtml(tenant ? tenant.name : "—") + "</td>" +
        "<td>" + RMSUtils.escapeHtml(c.subject) + "</td>" +
        "<td>" + RMSUtils.escapeHtml(c.description.substring(0, 60)) + (c.description.length > 60 ? "…" : "") + "</td>" +
        "<td>" + RMSUtils.formatDate(c.date) + "</td>" +
        "<td>" + RMSUtils.getStatusBadge(c.status) + "</td>" +
        '<td><button type="button" class="btn btn-sm btn-outline manage-btn" data-id="' + c.id + '">Manage</button></td>' +
      "</tr>";
    }).join("");

    tbody.querySelectorAll(".manage-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { manageComplaint(btn.dataset.id); });
    });
  }

  function manageComplaint(id) {
    var c = RMSStore.getComplaintById(id);
    var tenant = RMSStore.getTenantById(c.tenantId);

    RMSModal.open({
      title: "Manage Complaint",
      size: "lg",
      body:
        '<div class="detail-list">' +
          detailRow("Tenant", tenant ? tenant.name : "—") +
          detailRow("Subject", c.subject) +
          detailRow("Date", RMSUtils.formatDate(c.date)) +
          detailRow("Description", c.description) +
        "</div>" +
        '<div class="form-group" style="margin-top:1rem"><label for="comp-status">Status</label>' +
        '<select id="comp-status">' +
          statusOption("Pending", c.status) +
          statusOption("In Progress", c.status) +
          statusOption("Resolved", c.status) +
        "</select></div>" +
        '<div class="form-group"><label for="comp-response">Response</label>' +
        '<textarea id="comp-response" placeholder="Add a response to the tenant">' + RMSUtils.escapeHtml(c.response || "") + "</textarea></div>",
      footer:
        '<button type="button" class="btn btn-outline" id="modal-cancel">Cancel</button>' +
        '<button type="button" class="btn btn-primary" id="modal-save">Update Complaint</button>',
      onOpen: function (close) {
        document.getElementById("modal-cancel").addEventListener("click", close);
        document.getElementById("modal-save").addEventListener("click", function () {
          RMSStore.updateComplaint(id, {
            status: document.getElementById("comp-status").value,
            response: document.getElementById("comp-response").value.trim()
          });
          RMSUtils.showToast("Complaint updated.", "success");
          close();
          renderComplaints();
        });
      }
    });
  }

  function detailRow(label, value) {
    return '<div class="detail-item"><span class="label">' + label + '</span><span class="value">' + RMSUtils.escapeHtml(String(value)) + "</span></div>";
  }

  function statusOption(val, current) {
    return '<option value="' + val + '"' + (current === val ? " selected" : "") + ">" + val + "</option>";
  }
})();
