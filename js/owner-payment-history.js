/**
 * owner-payment-history.js — Owner payment history page
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    RMSLayout.init("owner", "payment-history");
    populateFilters();
    document.getElementById("filter-tenant").addEventListener("change", renderPayments);
    document.getElementById("filter-property").addEventListener("change", renderPayments);
    document.getElementById("filter-month").addEventListener("change", renderPayments);
    document.getElementById("search-payment").addEventListener("input", renderPayments);
    renderPayments();
  });

  function populateFilters() {
    var tenantSelect = document.getElementById("filter-tenant");
    var propSelect = document.getElementById("filter-property");

    RMSStore.getTenants().forEach(function (t) {
      tenantSelect.innerHTML += '<option value="' + t.id + '">' + RMSUtils.escapeHtml(t.name) + "</option>";
    });
    RMSStore.getProperties().forEach(function (p) {
      propSelect.innerHTML += '<option value="' + p.id + '">' + RMSUtils.escapeHtml(p.name) + "</option>";
    });
  }

  function renderPayments() {
    var tenantFilter = document.getElementById("filter-tenant").value;
    var propFilter = document.getElementById("filter-property").value;
    var monthFilter = document.getElementById("filter-month").value;
    var search = document.getElementById("search-payment").value.toLowerCase();

    var payments = RMSStore.getPayments().filter(function (p) {
      var tenant = RMSStore.getTenantById(p.tenantId);
      var matchTenant = !tenantFilter || p.tenantId === tenantFilter;
      var matchProp = !propFilter || p.propertyId === propFilter;
      var matchMonth = !monthFilter || p.month === monthFilter;
      var matchSearch = !search || (tenant && tenant.name.toLowerCase().includes(search)) || p.receiptId.toLowerCase().includes(search);
      return matchTenant && matchProp && matchMonth && matchSearch;
    });

    var tbody = document.getElementById("payments-table");
    if (!payments.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No payment records found</td></tr>';
      return;
    }

    tbody.innerHTML = payments.map(function (p) {
      var tenant = RMSStore.getTenantById(p.tenantId);
      var prop = RMSStore.getPropertyById(p.propertyId);
      return "<tr>" +
        "<td>" + RMSUtils.escapeHtml(p.receiptId) + "</td>" +
        "<td>" + RMSUtils.escapeHtml(tenant ? tenant.name : "—") + "</td>" +
        "<td>" + RMSUtils.escapeHtml(prop ? prop.name : "—") + "</td>" +
        "<td>" + RMSUtils.formatCurrency(p.amount) + "</td>" +
        "<td>" + RMSUtils.formatDate(p.paymentDate) + "</td>" +
        "<td>" + RMSUtils.escapeHtml(p.method) + "</td>" +
        "<td>" + RMSUtils.getStatusBadge(p.status) + "</td>" +
        '<td><a href="../receipt.html?id=' + p.id + '" target="_blank" class="btn btn-sm btn-outline">View Receipt</a></td>' +
      "</tr>";
    }).join("");
  }
})();
