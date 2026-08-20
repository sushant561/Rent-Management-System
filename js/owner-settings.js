/**
 * owner-settings.js — Owner settings page
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    RMSLayout.init("owner", "settings");
    loadSettings();
    document.getElementById("settings-form").addEventListener("submit", function (e) {
      e.preventDefault();
      saveSettings();
    });
    document.getElementById("reset-data-btn").addEventListener("click", function () {
      RMSModal.confirm({
        title: "Reset Demo Data",
        message: "Are you sure you want to reset all mock data to defaults? This will restore sample properties, tenants, payments and other records. This action cannot be undone.",
        confirmText: "Reset Data",
        onConfirm: function () {
          RMSStore.resetData();
          RMSUtils.showToast("Data reset to defaults.", "success");
          loadSettings();
        }
      });
    });
  });

  function loadSettings() {
    var settings = RMSStore.getSettings("owner");
    document.getElementById("owner-name").value = settings.name || "";
    document.getElementById("owner-email").value = settings.email || "";
    document.getElementById("owner-phone").value = settings.phone || "";
    document.getElementById("owner-notifications").checked = settings.notifications !== false;
  }

  function saveSettings() {
    var name = document.getElementById("owner-name").value.trim();
    var email = document.getElementById("owner-email").value.trim();
    var phone = document.getElementById("owner-phone").value.trim();

    var err = RMSUtils.validateRequired(name, "Name") ||
      RMSUtils.validateEmail(email) ||
      RMSUtils.validatePhone(phone);

    if (err) {
      RMSUtils.showToast(err, "error");
      return;
    }

    RMSStore.updateSettings("owner", {
      name: name,
      email: email,
      phone: phone,
      notifications: document.getElementById("owner-notifications").checked
    });
    RMSUtils.showToast("Settings saved successfully.", "success");
  }
})();
