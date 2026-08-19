/**
 * owner-rent-collection.js — Owner rent collection page
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    RMSLayout.init("owner", "rent-collection");
    document.getElementById("filter-status").addEventListener("change", renderRentTable);
    document.getElementById("search-rent").addEventListener("input", renderRentTable);
    renderRentTable();
  });

  function renderRentTable() {
    var statusFilter = document.getElementById("filter-status").value;
    var search = document.getElementById("search-rent").value.toLowerCase();
    var records = RMSStore.getRentRecords();

    var filtered = records.filter(function (r) {
      var tenant = RMSStore.getTenantById(r.tenantId);
      var prop = RMSStore.getPropertyById(r.propertyId);
      var matchStatus = !statusFilter || r.status.toLowerCase() === statusFilter.toLowerCase();
      var matchSearch = !search ||
        (tenant && tenant.name.toLowerCase().includes(search)) ||
        (prop && prop.name.toLowerCase().includes(search));
      return matchStatus && matchSearch;
    });

    var tbody = document.getElementById("rent-table");
    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No rent records found</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(function (r) {
      var tenant = RMSStore.getTenantById(r.tenantId);
      var prop = RMSStore.getPropertyById(r.propertyId);
      var action = r.status !== "Paid"
        ? '<button type="button" class="btn btn-sm btn-primary record-btn" data-id="' + r.id + '">Record Payment</button>'
        : '<span class="badge badge-success">Paid</span>';

      return "<tr>" +
        "<td>" + RMSUtils.escapeHtml(tenant ? tenant.name : "—") + "</td>" +
        "<td>" + RMSUtils.escapeHtml(prop ? prop.name : "—") + "</td>" +
        "<td>" + RMSUtils.escapeHtml(tenant ? tenant.roomNumber : "—") + "</td>" +
        "<td>" + RMSUtils.formatCurrency(r.amount) + "</td>" +
        "<td>" + RMSUtils.formatDate(r.dueDate) + "</td>" +
        "<td>" + RMSUtils.getMonthLabel(r.month) + "</td>" +
        "<td>" + RMSUtils.getStatusBadge(r.status) + "</td>" +
        "<td>" + action + "</td>" +
      "</tr>";
    }).join("");

    tbody.querySelectorAll(".record-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { recordPayment(btn.dataset.id); });
    });
  }

  function recordPayment(rentId) {
    RMSModal.open({
      title: "Record Rent Payment",
      body:
        '<div class="form-group"><label for="pay-method">Payment Method *</label>' +
        '<select id="pay-method"><option value="Cash">Cash</option><option value="UPI">UPI</option><option value="Bank Transfer">Bank Transfer</option></select></div>',
      footer:
        '<button type="button" class="btn btn-outline" id="modal-cancel">Cancel</button>' +
        '<button type="button" class="btn btn-primary" id="modal-save">Confirm Payment</button>',
      onOpen: function (close) {
        document.getElementById("modal-cancel").addEventListener("click", close);
        document.getElementById("modal-save").addEventListener("click", function () {
          var method = document.getElementById("pay-method").value;
          RMSStore.recordRentPayment(rentId, method);
          RMSUtils.showToast("Payment recorded successfully.", "success");
          close();
          renderRentTable();
        });
      }
    });
  }
})();
