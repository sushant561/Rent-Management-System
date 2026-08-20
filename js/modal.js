/**
 * modal.js — Reusable modal helpers
 */
var RMSModal = (function () {
  "use strict";

  function open(options) {
    var overlay = document.getElementById("modal-root");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "modal-root";
      document.body.appendChild(overlay);
    }

    var sizeClass = options.size === "lg" ? " modal-lg" : "";
    overlay.innerHTML =
      '<div class="modal-overlay open" id="modal-overlay">' +
        '<div class="modal' + sizeClass + '" role="dialog" aria-modal="true">' +
          '<div class="modal-header">' +
            "<h3>" + RMSUtils.escapeHtml(options.title || "") + "</h3>" +
            '<button type="button" class="modal-close" id="modal-close" aria-label="Close">&times;</button>' +
          "</div>" +
          '<div class="modal-body">' + (options.body || "") + "</div>" +
          (options.footer ? '<div class="modal-footer">' + options.footer + "</div>" : "") +
        "</div>" +
      "</div>";

    function closeModal() {
      overlay.innerHTML = "";
    }

    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("modal-overlay").addEventListener("click", function (e) {
      if (e.target.id === "modal-overlay") closeModal();
    });

    if (options.onOpen) options.onOpen(closeModal);
    return closeModal;
  }

  /**
   * Show a confirmation dialog (replaces browser confirm)
   * @param {Object} options
   * @param {string} options.title - Dialog title
   * @param {string} options.message - Confirmation message
   * @param {string} [options.confirmText] - Confirm button label
   * @param {string} [options.cancelText] - Cancel button label
   * @param {string} [options.confirmClass] - Confirm button CSS class
   * @param {Function} options.onConfirm - Called when user confirms
   * @param {Function} [options.onCancel] - Called when user cancels
   */
  function confirm(options) {
    open({
      title: options.title || "Confirm Action",
      body: '<p class="confirm-message">' + RMSUtils.escapeHtml(options.message || "Are you sure?") + "</p>",
      footer:
        '<button type="button" class="btn btn-outline" id="confirm-cancel">' +
          RMSUtils.escapeHtml(options.cancelText || "Cancel") +
        "</button>" +
        '<button type="button" class="btn ' + (options.confirmClass || "btn-danger") + '" id="confirm-action">' +
          RMSUtils.escapeHtml(options.confirmText || "Confirm") +
        "</button>",
      onOpen: function (closeModal) {
        document.getElementById("confirm-cancel").addEventListener("click", function () {
          closeModal();
          if (options.onCancel) options.onCancel();
        });
        document.getElementById("confirm-action").addEventListener("click", function () {
          closeModal();
          if (options.onConfirm) options.onConfirm();
        });
      }
    });
  }

  return { open: open, confirm: confirm };
})();
