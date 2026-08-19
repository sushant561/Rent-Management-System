/**
 * layout.js — Shared dashboard layout (sidebar, topbar)
 */
var RMSLayout = (function () {
  "use strict";

  var OWNER_NAV = [
    { page: "dashboard", label: "Dashboard", icon: "📊", href: "dashboard.html" },
    { page: "properties", label: "Properties", icon: "🏠", href: "properties.html" },
    { page: "tenants", label: "Tenants", icon: "👥", href: "tenants.html" },
    { page: "rent-collection", label: "Rent Collection", icon: "💰", href: "rent-collection.html" },
    { page: "payment-history", label: "Payment History", icon: "📋", href: "payment-history.html" },
    { page: "reports", label: "Reports", icon: "📈", href: "reports.html" },
    { page: "complaints", label: "Complaints", icon: "💬", href: "complaints.html" },
    { page: "alerts", label: "Alerts", icon: "🔔", href: "alerts.html" },
    { page: "settings", label: "Settings", icon: "⚙️", href: "settings.html" }
  ];

  var TENANT_NAV = [
    { page: "dashboard", label: "Dashboard", icon: "📊", href: "dashboard.html" },
    { page: "rent-payment", label: "Rent Payment", icon: "💳", href: "rent-payment.html" },
    { page: "payment-history", label: "Payment History", icon: "📋", href: "payment-history.html" },
    { page: "complaints", label: "Complaints", icon: "💬", href: "complaints.html" },
    { page: "alerts", label: "Alerts", icon: "🔔", href: "alerts.html" },
    { page: "profile", label: "Profile", icon: "👤", href: "profile.html" }
  ];

  var PAGE_TITLES = {
    dashboard: "Dashboard",
    properties: "Properties",
    tenants: "Tenants",
    "rent-collection": "Rent Collection",
    "payment-history": "Payment History",
    reports: "Reports",
    complaints: "Complaints & Messages",
    alerts: "Alerts & Notifications",
    settings: "Settings",
    "rent-payment": "Rent Payment",
    profile: "Profile"
  };

  function renderSidebar(role, activePage) {
    var sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    var navItems = role === "owner" ? OWNER_NAV : TENANT_NAV;
    var roleLabel = role === "owner" ? "Owner Portal" : "Tenant Portal";

    var navHtml = navItems.map(function (item) {
      var active = item.page === activePage ? " active" : "";
      return '<a href="' + item.href + '" class="sidebar-link' + active + '">' +
        '<span class="sidebar-link-icon">' + item.icon + '</span>' +
        RMSUtils.escapeHtml(item.label) + "</a>";
    }).join("");

    sidebar.innerHTML =
      '<a href="../../index.html" class="sidebar-brand">' +
        '<span class="sidebar-brand-icon">RMS</span> Rent Management' +
      "</a>" +
      '<div class="sidebar-role">' + roleLabel + "</div>" +
      '<nav class="sidebar-nav" aria-label="' + roleLabel + ' navigation">' + navHtml + "</nav>" +
      '<div class="sidebar-footer">' +
        '<button type="button" class="sidebar-logout" id="logout-btn">' +
          '<span>🚪</span> Logout' +
        "</button>" +
      "</div>";

    document.getElementById("logout-btn").addEventListener("click", function () {
      RMSSession.logout();
    });
  }

  function renderTopbar(role, activePage, session) {
    var topbar = document.getElementById("topbar");
    if (!topbar) return;

    var title = PAGE_TITLES[activePage] || "Dashboard";
    var settings = RMSStore.getSettings(role);
    var userName = settings.name || session.username;
    var alertLink = role === "owner" ? "alerts.html" : "alerts.html";
    var alertCount = 0;

    if (role === "tenant") {
      var tenant = RMSStore.getTenantByLogin(session.username);
      if (tenant) {
        alertCount = RMSStore.getUnreadAlertCount(tenant.id);
      }
    } else {
      var pendingComplaints = RMSStore.getComplaints().filter(function (c) {
        return c.status === "Pending";
      }).length;
      alertCount = pendingComplaints;
    }

    var badgeHtml = alertCount > 0
      ? '<span class="badge-count">' + alertCount + "</span>"
      : "";

    topbar.innerHTML =
      '<div class="topbar-left">' +
        '<button type="button" class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle menu">☰</button>' +
        "<h1 class=\"topbar-title\">" + RMSUtils.escapeHtml(title) + "</h1>" +
      "</div>" +
      '<div class="topbar-right">' +
        '<a href="' + alertLink + '" class="notification-badge" aria-label="Notifications">' +
          "🔔" + badgeHtml +
        "</a>" +
        '<span class="topbar-user">' + RMSUtils.escapeHtml(userName) + "</span>" +
      "</div>";

    document.getElementById("sidebar-toggle").addEventListener("click", function () {
      document.getElementById("sidebar").classList.toggle("open");
    });
  }

  function init(role, activePage) {
    var session = RMSSession.requireAuth(role);
    if (!session) return null;

    renderSidebar(role, activePage);
    renderTopbar(role, activePage, session);
    return session;
  }

  return { init: init };
})();
