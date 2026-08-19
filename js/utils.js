/**
 * utils.js — Shared utility functions
 */
var RMSUtils = (function () {
  "use strict";

  function formatCurrency(amount) {
    return "₹" + Number(amount || 0).toLocaleString("en-IN");
  }

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    var d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }

  function formatDateTime(dateStr) {
    if (!dateStr) return "—";
    var d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function generateId(prefix) {
    return prefix + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
  }

  function getCurrentMonth() {
    var now = new Date();
    return now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
  }

  function getMonthLabel(monthStr) {
    if (!monthStr) return "";
    var parts = monthStr.split("-");
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[parseInt(parts[1], 10) - 1] + " " + parts[0];
  }

  function escapeHtml(str) {
    if (!str) return "";
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function showToast(message, type) {
    type = type || "info";
    var container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }
    var toast = document.createElement("div");
    toast.className = "toast toast-" + type;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function () {
      toast.remove();
    }, 3500);
  }

  function getStatusBadge(status) {
    var map = {
      paid: "badge-success",
      pending: "badge-warning",
      overdue: "badge-danger",
      active: "badge-success",
      inactive: "badge-neutral",
      resolved: "badge-success",
      "in progress": "badge-info",
      "in-progress": "badge-info"
    };
    var cls = map[(status || "").toLowerCase()] || "badge-neutral";
    return '<span class="badge ' + cls + '">' + escapeHtml(status) + "</span>";
  }

  function validateRequired(value, label) {
    if (!value || !String(value).trim()) {
      return label + " is required.";
    }
    return "";
  }

  function validateEmail(email) {
    if (!email) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Enter a valid email address.";
    }
    return "";
  }

  function validatePhone(phone) {
    if (!phone) return "Phone is required.";
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) {
      return "Enter a valid 10-digit phone number.";
    }
    return "";
  }

  return {
    formatCurrency: formatCurrency,
    formatDate: formatDate,
    formatDateTime: formatDateTime,
    generateId: generateId,
    getCurrentMonth: getCurrentMonth,
    getMonthLabel: getMonthLabel,
    escapeHtml: escapeHtml,
    showToast: showToast,
    getStatusBadge: getStatusBadge,
    validateRequired: validateRequired,
    validateEmail: validateEmail,
    validatePhone: validatePhone
  };
})();
