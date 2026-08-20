/**
 * owner-properties.js — Owner properties management
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    RMSLayout.init("owner", "properties");
    renderProperties();
    document.getElementById("add-property-btn").addEventListener("click", function () {
      openPropertyForm(null);
    });
  });

  function renderProperties() {
    var properties = RMSStore.getProperties();
    var grid = document.getElementById("property-grid");

    if (!properties.length) {
      grid.innerHTML = '<div class="empty-state"><p>No properties added yet.</p></div>';
      return;
    }

    grid.innerHTML = properties.map(function (p) {
      return '<article class="property-card">' +
        "<h3>" + RMSUtils.escapeHtml(p.name) + "</h3>" +
        '<p class="location">' + RMSUtils.escapeHtml(p.location) + "</p>" +
        '<div class="property-stats">' +
          statBlock(p.totalRooms, "Total") +
          statBlock(p.occupiedRooms, "Occupied") +
          statBlock(p.vacantRooms, "Vacant") +
        "</div>" +
        "<p><strong>Monthly Income:</strong> " + RMSUtils.formatCurrency(p.monthlyIncome) + "</p>" +
        '<div class="property-card-actions">' +
          '<button type="button" class="btn btn-sm btn-outline view-btn" data-id="' + p.id + '">View</button>' +
          '<button type="button" class="btn btn-sm btn-primary edit-btn" data-id="' + p.id + '">Edit</button>' +
          '<button type="button" class="btn btn-sm btn-danger delete-btn" data-id="' + p.id + '">Delete</button>' +
        "</div>" +
      "</article>";
    }).join("");

    grid.querySelectorAll(".view-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { viewProperty(btn.dataset.id); });
    });
    grid.querySelectorAll(".edit-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { openPropertyForm(btn.dataset.id); });
    });
    grid.querySelectorAll(".delete-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { deleteProperty(btn.dataset.id); });
    });
  }

  function statBlock(value, label) {
    return '<div class="property-stat"><div class="value">' + value + '</div><div class="label">' + label + "</div></div>";
  }

  function viewProperty(id) {
    var p = RMSStore.getPropertyById(id);
    if (!p) return;
    var tenants = RMSStore.getTenants().filter(function (t) {
      return t.propertyId === id && t.status === "Active";
    });

    RMSModal.open({
      title: p.name,
      size: "lg",
      body:
        '<div class="detail-list">' +
          detailRow("Location", p.location) +
          detailRow("Total Rooms", p.totalRooms) +
          detailRow("Occupied Rooms", p.occupiedRooms) +
          detailRow("Vacant Rooms", p.vacantRooms) +
          detailRow("Monthly Income", RMSUtils.formatCurrency(p.monthlyIncome)) +
        "</div>" +
        "<h4 style=\"margin:1rem 0 0.5rem\">Active Tenants (" + tenants.length + ")</h4>" +
        (tenants.length
          ? '<ul style="font-size:0.875rem;color:#64748b">' + tenants.map(function (t) {
              return "<li>" + RMSUtils.escapeHtml(t.name) + " — Room " + RMSUtils.escapeHtml(t.roomNumber) + "</li>";
            }).join("") + "</ul>"
          : "<p>No active tenants.</p>"),
      footer: '<button type="button" class="btn btn-outline" id="modal-close-btn">Close</button>',
      onOpen: function (close) {
        document.getElementById("modal-close-btn").addEventListener("click", close);
      }
    });
  }

  function detailRow(label, value) {
    return '<div class="detail-item"><span class="label">' + label + '</span><span class="value">' + RMSUtils.escapeHtml(String(value)) + "</span></div>";
  }

  function openPropertyForm(id) {
    var p = id ? RMSStore.getPropertyById(id) : null;
    var isEdit = !!p;

    RMSModal.open({
      title: isEdit ? "Edit Property" : "Add Property",
      body:
        '<form id="property-form">' +
          '<div class="form-grid">' +
            formField("prop-name", "Property Name", "text", p ? p.name : "", true) +
            formField("prop-location", "Location", "text", p ? p.location : "", true) +
            formField("prop-rooms", "Total Rooms", "number", p ? p.totalRooms : "", true) +
          "</div>" +
        "</form>",
      footer:
        '<button type="button" class="btn btn-outline" id="modal-cancel">Cancel</button>' +
        '<button type="button" class="btn btn-primary" id="modal-save">' + (isEdit ? "Update" : "Add") + " Property</button>",
      onOpen: function (close) {
        document.getElementById("modal-cancel").addEventListener("click", close);
        document.getElementById("modal-save").addEventListener("click", function () {
          var name = document.getElementById("prop-name").value.trim();
          var location = document.getElementById("prop-location").value.trim();
          var totalRooms = parseInt(document.getElementById("prop-rooms").value, 10);

          if (!name || !location || !totalRooms || totalRooms < 1) {
            RMSUtils.showToast("Please fill all fields correctly.", "error");
            return;
          }

          if (isEdit) {
            if (totalRooms < p.occupiedRooms) {
              RMSUtils.showToast("Total rooms cannot be less than occupied rooms.", "error");
              return;
            }
            RMSStore.updateProperty(id, { name: name, location: location, totalRooms: totalRooms });
            RMSUtils.showToast("Property updated successfully.", "success");
          } else {
            RMSStore.addProperty({ name: name, location: location, totalRooms: totalRooms });
            RMSUtils.showToast("Property added successfully.", "success");
          }
          close();
          renderProperties();
        });
      }
    });
  }

  function formField(id, label, type, value, required) {
    return '<div class="form-group">' +
      '<label for="' + id + '">' + label + (required ? " *" : "") + "</label>" +
      '<input type="' + type + '" id="' + id + '" value="' + RMSUtils.escapeHtml(String(value)) + '"' + (required ? " required" : "") + ">" +
    "</div>";
  }

  function deleteProperty(id) {
    var property = RMSStore.getPropertyById(id);
    if (!property) return;

    RMSModal.confirm({
      title: "Delete Property",
      message: "Are you sure you want to delete \"" + property.name + "\"? This action cannot be undone.",
      confirmText: "Delete Property",
      onConfirm: function () {
        var result = RMSStore.deleteProperty(id);
        if (result.error) {
          RMSUtils.showToast(result.error, "error");
          return;
        }
        RMSUtils.showToast("Property deleted.", "success");
        renderProperties();
      }
    });
  }
})();
