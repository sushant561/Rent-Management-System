(function () {
  "use strict";

  var currentTenant = null;

  document.addEventListener("DOMContentLoaded", function () {
    var session = RMSLayout.init("tenant", "profile");
    if (!session) return;

    currentTenant = RMSStore.getTenantByLogin(session.username);
    if (!currentTenant) return;

    document.getElementById("tenant-profile-form").addEventListener("submit", saveProfile);
    document.getElementById("tenant-logout-btn").addEventListener("click", function () {
      RMSSession.logout();
    });

    renderProfile();
  });

  function renderProfile() {
    var settings = RMSStore.getSettings("tenant");
    var property = RMSStore.getPropertyById(currentTenant.propertyId);

    document.getElementById("tenant-name").value = currentTenant.name || "";
    document.getElementById("tenant-email").value = currentTenant.email || "";
    document.getElementById("tenant-phone").value = currentTenant.phone || "";
    document.getElementById("tenant-notifications").checked = settings.notifications !== false;

    document.getElementById("tenant-profile-details").innerHTML =
      infoRow("Property", property ? property.name : "—") +
      infoRow("Room Number", currentTenant.roomNumber) +
      infoRow("Monthly Rent", RMSUtils.formatCurrency(currentTenant.monthlyRent)) +
      infoRow("Joining Date", RMSUtils.formatDate(currentTenant.joiningDate)) +
      infoRow("Status", currentTenant.status);
  }

  function saveProfile(event) {
    event.preventDefault();

    var name = document.getElementById("tenant-name").value.trim();
    var email = document.getElementById("tenant-email").value.trim();
    var phone = document.getElementById("tenant-phone").value.trim();
    var error = RMSUtils.validateRequired(name, "Name") || RMSUtils.validateEmail(email) || RMSUtils.validatePhone(phone);

    if (error) {
      RMSUtils.showToast(error, "error");
      return;
    }

    RMSStore.updateTenant(currentTenant.id, {
      name: name,
      email: email,
      phone: phone
    });

    RMSStore.updateSettings("tenant", {
      name: name,
      email: email,
      phone: phone,
      notifications: document.getElementById("tenant-notifications").checked
    });

    currentTenant = RMSStore.getTenantById(currentTenant.id);
    RMSUtils.showToast("Profile updated successfully.", "success");
    renderProfile();
  }

  function infoRow(label, value) {
    return '<div class="info-list-item"><span class="info-list-label">' + RMSUtils.escapeHtml(label) + '</span><span class="info-list-value">' + RMSUtils.escapeHtml(String(value || "—")) + "</span></div>";
  }
})();
