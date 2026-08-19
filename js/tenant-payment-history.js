(function () {
  "use strict";

  var currentTenant = null;

  document.addEventListener("DOMContentLoaded", function () {
    var session = RMSLayout.init("tenant", "payment-history");
    if (!session) return;

    currentTenant = RMSStore.getTenantByLogin(session.username);
    if (!currentTenant) return;

    document.getElementById("tenant-history-month").addEventListener("change", renderPayments);
    document.getElementById("tenant-history-search").addEventListener("input", renderPayments);
    renderPayments();
  });

  function renderPayments() {
    var month = document.getElementById("tenant-history-month").value;
    var search = document.getElementById("tenant-history-search").value.toLowerCase();
    var payments = RMSStore.getPaymentsByTenant(currentTenant.id).filter(function (payment) {
      var matchesMonth = !month || payment.month === month;
      var method = String(payment.method || "").toLowerCase();
      var matchesSearch = !search ||
        payment.receiptId.toLowerCase().indexOf(search) !== -1 ||
        method.indexOf(search) !== -1;
      return matchesMonth && matchesSearch;
    });

    var tbody = document.getElementById("tenant-history-table");
    tbody.innerHTML = payments.length
      ? payments.map(function (payment) {
          var property = RMSStore.getPropertyById(payment.propertyId);
          return "<tr>" +
            "<td>" + RMSUtils.escapeHtml(payment.receiptId) + "</td>" +
            "<td>" + RMSUtils.escapeHtml(property ? property.name : "—") + "</td>" +
            "<td>" + RMSUtils.escapeHtml(RMSUtils.getMonthLabel(payment.month)) + "</td>" +
            "<td>" + RMSUtils.formatCurrency(payment.amount) + "</td>" +
            "<td>" + RMSUtils.formatDate(payment.paymentDate) + "</td>" +
            "<td>" + RMSUtils.escapeHtml(payment.method) + "</td>" +
            "<td>" + RMSUtils.getStatusBadge(payment.status) + "</td>" +
            '<td><a href="../receipt.html?id=' + payment.id + '" target="_blank" class="btn btn-sm btn-outline">View Receipt</a></td>' +
          "</tr>";
        }).join("")
      : '<tr><td colspan="8" class="empty-state">No payment records found.</td></tr>';
  }
})();
