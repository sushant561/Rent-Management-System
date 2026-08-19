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

  return { open: open };
})();
