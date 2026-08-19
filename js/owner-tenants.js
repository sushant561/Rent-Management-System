/**
 * owner-tenants.js — Owner tenant management
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    RMSLayout.init("owner", "tenants");
    renderTenants();
    document.getElementById("add-tenant-btn").addEventListener("click", function () {
      openTenantForm(null);
    });
    document.getElementById("search-tenant").addEventListener("input", renderTenants);
  });

  function renderTenants() {
    var search = document.getElementById("search-tenant").value.toLowerCase();
    var tenants = RMSStore.getTenants().filter(function (t) {
      return !search || t.name.toLowerCase().includes(search) || t.email.toLowerCase().includes(search);
    });

    var tbody = document.getElementById("tenants-table");
    if (!tenants.length) {
      tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No tenants found</td></tr>';
      return;
    }

    tbody.innerHTML = tenants.map(function (t) {
      var prop = RMSStore.getPropertyById(t.propertyId);
      return "<tr>" +
        "<td>" + RMSUtils.escapeHtml(t.name) + "</td>" +
        "<td>" + RMSUtils.escapeHtml(t.phone) + "</td>" +
        "<td>" + RMSUtils.escapeHtml(t.email) + "</td>" +
        "<td>" + RMSUtils.escapeHtml(prop ? prop.name : "—") + "</td>" +
        "<td>" + RMSUtils.escapeHtml(t.roomNumber) + "</td>" +
        "<td>" + RMSUtils.formatCurrency(t.monthlyRent) + "</td>" +
        "<td>" + RMSUtils.formatDate(t.joiningDate) + "</td>" +
        "<td>" + RMSUtils.getStatusBadge(t.status) + "</td>" +
        '<td class="actions">' +
          '<button type="button" class="btn btn-sm btn-outline view-btn" data-id="' + t.id + '">View</button> ' +
          '<button type="button" class="btn btn-sm btn-primary edit-btn" data-id="' + t.id + '">Edit</button> ' +
          (t.status === "Active"
            ? '<button type="button" class="btn btn-sm btn-danger deactivate-btn" data-id="' + t.id + '">Deactivate</button>'
            : "") +
        "</td>" +
      "</tr>";
    }).join("");

    bindActions(tbody);
  }

  function bindActions(container) {
    container.querySelectorAll(".view-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { viewTenant(btn.dataset.id); });
    });
    container.querySelectorAll(".edit-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { openTenantForm(btn.dataset.id); });
    });
    container.querySelectorAll(".deactivate-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (confirm("Deactivate this tenant?")) {
          RMSStore.deactivateTenant(btn.dataset.id);
          RMSUtils.showToast("Tenant deactivated.", "success");
          renderTenants();
        }
      });
    });
  }

  function viewTenant(id) {
    var t = RMSStore.getTenantById(id);
    var prop = RMSStore.getPropertyById(t.propertyId);
    RMSModal.open({
      title: t.name,
      body:
        '<div class="detail-list">' +
          detailRow("Phone", t.phone) +
          detailRow("Email", t.email) +
          detailRow("Property", prop ? prop.name : "—") +
          detailRow("Room", t.roomNumber) +
          detailRow("Monthly Rent", RMSUtils.formatCurrency(t.monthlyRent)) +
          detailRow("Joining Date", RMSUtils.formatDate(t.joiningDate)) +
          detailRow("Status", t.status) +
        "</div>",
      footer: '<button type="button" class="btn btn-outline" id="modal-close-btn">Close</button>',
      onOpen: function (close) {
        document.getElementById("modal-close-btn").addEventListener("click", close);
      }
    });
  }

  function detailRow(label, value) {
    return '<div class="detail-item"><span class="label">' + label + '</span><span class="value">' + RMSUtils.escapeHtml(String(value)) + "</span></div>";
  }

  function propertyOptions(selectedId) {
    return RMSStore.getProperties().map(function (p) {
      var sel = p.id === selectedId ? " selected" : "";
      return '<option value="' + p.id + '"' + sel + ">" + RMSUtils.escapeHtml(p.name) + "</option>";
    }).join("");
  }

  function openTenantForm(id) {
    var t = id ? RMSStore.getTenantById(id) : null;
    var isEdit = !!t;

    RMSModal.open({
      title: isEdit ? "Edit Tenant" : "Add Tenant",
      size: "lg",
      body:
        '<form id="tenant-form"><div class="form-grid">' +
          field("ten-name", "Full Name", t ? t.name : "") +
          field("ten-phone", "Phone", t ? t.phone : "") +
          field("ten-email", "Email", t ? t.email : "") +
          '<div class="form-group"><label for="ten-property">Property *</label><select id="ten-property" required>' +
            '<option value="">Select property</option>' + propertyOptions(t ? t.propertyId : "") +
          "</select></div>" +
          field("ten-room", "Room Number", t ? t.roomNumber : "") +
          field("ten-rent", "Monthly Rent (₹)", t ? t.monthlyRent : "", "number") +
          field("ten-join", "Joining Date", t ? t.joiningDate : "", "date") +
        "</div></form>",
      footer:
        '<button type="button" class="btn btn-outline" id="modal-cancel">Cancel</button>' +
        '<button type="button" class="btn btn-primary" id="modal-save">' + (isEdit ? "Update" : "Add") + " Tenant</button>",
      onOpen: function (close) {
        document.getElementById("modal-cancel").addEventListener("click", close);
        document.getElementById("modal-save").addEventListener("click", function () {
          var data = {
            name: document.getElementById("ten-name").value.trim(),
            phone: document.getElementById("ten-phone").value.trim(),
            email: document.getElementById("ten-email").value.trim(),
            propertyId: document.getElementById("ten-property").value,
            roomNumber: document.getElementById("ten-room").value.trim(),
            monthlyRent: parseInt(document.getElementById("ten-rent").value, 10),
            joiningDate: document.getElementById("ten-join").value
          };

          var err = RMSUtils.validateRequired(data.name, "Name") ||
            RMSUtils.validatePhone(data.phone) ||
            RMSUtils.validateEmail(data.email) ||
            RMSUtils.validateRequired(data.propertyId, "Property") ||
            RMSUtils.validateRequired(data.roomNumber, "Room number");

          if (err || !data.monthlyRent || !data.joiningDate) {
            RMSUtils.showToast(err || "Please fill all fields.", "error");
            return;
          }

          var selectedProperty = RMSStore.getPropertyById(data.propertyId);
          var otherActiveTenants = RMSStore.getTenants().filter(function (tenantItem) {
            return tenantItem.status === "Active" &&
              tenantItem.propertyId === data.propertyId &&
              tenantItem.id !== id;
          });
          var roomTaken = otherActiveTenants.some(function (tenantItem) {
            return String(tenantItem.roomNumber).toLowerCase() === data.roomNumber.toLowerCase();
          });

          if (!selectedProperty) {
            RMSUtils.showToast("Selected property was not found.", "error");
            return;
          }

          if (roomTaken) {
            RMSUtils.showToast("That room is already assigned to another active tenant.", "error");
            return;
          }

          if (!isEdit && otherActiveTenants.length >= selectedProperty.totalRooms) {
            RMSUtils.showToast("No vacant rooms are available in the selected property.", "error");
            return;
          }

          if (isEdit && t.propertyId !== data.propertyId && otherActiveTenants.length >= selectedProperty.totalRooms) {
            RMSUtils.showToast("No vacant rooms are available in the selected property.", "error");
            return;
          }

          if (isEdit) {
            RMSStore.updateTenant(id, data);
            RMSUtils.showToast("Tenant updated.", "success");
          } else {
            RMSStore.addTenant(data);
            RMSUtils.showToast("Tenant added.", "success");
          }
          close();
          renderTenants();
        });
      }
    });
  }

  function field(id, label, value, type) {
    type = type || "text";
    return '<div class="form-group"><label for="' + id + '">' + label + ' *</label>' +
      '<input type="' + type + '" id="' + id + '" value="' + RMSUtils.escapeHtml(String(value || "")) + '" required></div>';
  }
})();
