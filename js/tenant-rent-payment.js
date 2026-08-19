(function () {
  "use strict";

  var currentTenant = null;

  document.addEventListener("DOMContentLoaded", function () {
    var session = RMSLayout.init("tenant", "rent-payment");
    if (!session) return;

    currentTenant = RMSStore.getTenantByLogin(session.username);
    if (!currentTenant) return;

    document.getElementById("rent-payment-form").addEventListener("submit", handlePayment);
    renderPage();
  });

  function renderPage() {
    var property = RMSStore.getPropertyById(currentTenant.propertyId);
    var rent = RMSStore.getCurrentRentRecordForTenant(currentTenant.id);
    var latestPayment = RMSStore.getPaymentsByTenant(currentTenant.id)[0];
    var isPaid = rent && rent.status === "Paid";

    document.getElementById("rent-status-card").innerHTML =
      '<div class="status-summary">' +
        '<div class="stat-card"><div class="stat-card-label">Amount</div><div class="stat-card-value">' + RMSUtils.formatCurrency(rent ? rent.amount : currentTenant.monthlyRent) + "</div></div>" +
        infoRow("Property", property ? property.name : "—") +
        infoRow("Room Number", currentTenant.roomNumber) +
        infoRow("Due Date", rent ? RMSUtils.formatDate(rent.dueDate) : "—") +
        infoRow("Status", rent ? rent.status : "Pending") +
        infoRow("Last Updated", rent && rent.paidDate ? RMSUtils.formatDate(rent.paidDate) : "Not paid yet") +
      "</div>" +
      (isPaid && latestPayment
        ? '<div class="receipt-actions" style="margin-top:1rem">' +
            '<a href="../receipt.html?id=' + latestPayment.id + '" target="_blank" class="btn btn-outline">View Latest Receipt</a>' +
          "</div>"
        : '<p class="status-note">This is a frontend-only simulated payment. No real payment gateway is used.</p>');

    document.getElementById("pay-now-btn").disabled = !!isPaid;
    document.getElementById("pay-now-btn").textContent = isPaid ? "Already Paid" : "Pay Now";

    renderRecentPayments();
  }

  function renderRecentPayments() {
    var tbody = document.getElementById("recent-payment-records");
    var payments = RMSStore.getPaymentsByTenant(currentTenant.id).slice(0, 5);

    tbody.innerHTML = payments.length
      ? payments.map(function (payment) {
          return "<tr>" +
            "<td>" + RMSUtils.escapeHtml(payment.receiptId) + "</td>" +
            "<td>" + RMSUtils.escapeHtml(RMSUtils.getMonthLabel(payment.month)) + "</td>" +
            "<td>" + RMSUtils.formatCurrency(payment.amount) + "</td>" +
            "<td>" + RMSUtils.formatDate(payment.paymentDate) + "</td>" +
            "<td>" + RMSUtils.escapeHtml(payment.method) + "</td>" +
            '<td><a href="../receipt.html?id=' + payment.id + '" target="_blank" class="btn btn-sm btn-outline">View Receipt</a></td>' +
          "</tr>";
        }).join("")
      : '<tr><td colspan="6" class="empty-state">No payments recorded yet.</td></tr>';
  }

  function handlePayment(event) {
    event.preventDefault();

    var method = document.getElementById("payment-method").value;
    var result = RMSStore.tenantPayRent(currentTenant.id, method);

    if (result && result.error) {
      RMSUtils.showToast(result.error, "error");
      return;
    }

    RMSUtils.showToast("Rent payment recorded successfully.", "success");
    renderPage();
  }

  function infoRow(label, value) {
    return '<div class="info-list-item"><span class="info-list-label">' + RMSUtils.escapeHtml(label) + '</span><span class="info-list-value">' + RMSUtils.escapeHtml(String(value || "—")) + "</span></div>";
  }
})();
