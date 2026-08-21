/**
 * layout.js — Shared dashboard layout (sidebar, topbar)
 */
var RMSLayout = (function () {
  "use strict";

  var OWNER_NAV = [
    { page: "dashboard", label: "Dashboard", icon: "dashboard", href: "dashboard.html" },
    { page: "properties", label: "Properties", icon: "properties", href: "properties.html" },
    { page: "tenants", label: "Tenants", icon: "tenants", href: "tenants.html" },
    { page: "rent-collection", label: "Rent Collection", icon: "rent-collection", href: "rent-collection.html" },
    { page: "payment-history", label: "Payment History", icon: "payment-history", href: "payment-history.html" },
    { page: "reports", label: "Reports", icon: "reports", href: "reports.html" },
    { page: "complaints", label: "Complaints", icon: "complaints", href: "complaints.html" },
    { page: "alerts", label: "Alerts", icon: "alerts", href: "alerts.html" },
    { page: "settings", label: "Settings", icon: "settings", href: "settings.html" }
  ];

  var TENANT_NAV = [
    { page: "dashboard", label: "Dashboard", icon: "dashboard", href: "dashboard.html" },
    { page: "rent-payment", label: "Rent Payment", icon: "rent-payment", href: "rent-payment.html" },
    { page: "payment-history", label: "Payment History", icon: "payment-history", href: "payment-history.html" },
    { page: "complaints", label: "Complaints", icon: "complaints", href: "complaints.html" },
    { page: "alerts", label: "Alerts", icon: "alerts", href: "alerts.html" },
    { page: "profile", label: "Profile", icon: "profile", href: "profile.html" }
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
        '<span class="sidebar-link-icon">' + RMSIcons.get(item.icon) + '</span>' +
        RMSUtils.escapeHtml(item.label) + "</a>";
    }).join("");

    sidebar.innerHTML =
      '<a href="../../index.html" class="sidebar-brand">' +
        '<img src="../../assets/rmslogo.png" class="sidebar-brand-logo" alt="Rent Management System logo"> Rent Management' +
      "</a>" +
      '<div class="sidebar-role">' + roleLabel + "</div>" +
      '<nav class="sidebar-nav" aria-label="' + roleLabel + ' navigation">' + navHtml + "</nav>" +
      '<div class="sidebar-footer">' +
        '<button type="button" class="sidebar-logout" id="logout-btn">' +
          RMSIcons.get("logout") + " Logout" +
        "</button>" +
      "</div>";

    document.getElementById("logout-btn").addEventListener("click", function () {
      RMSSession.logout();
    });
  }

  function ensureSidebarOverlay() {
    var layout = document.querySelector(".app-layout");
    if (!layout || document.getElementById("sidebar-overlay")) return;

    var overlay = document.createElement("div");
    overlay.id = "sidebar-overlay";
    overlay.className = "sidebar-overlay";
    overlay.setAttribute("aria-hidden", "true");
    layout.appendChild(overlay);
  }

  function initSidebarToggle() {
    var toggle = document.getElementById("sidebar-toggle");
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("sidebar-overlay");

    if (!toggle || !sidebar) return;

    function setSidebarOpen(open) {
      sidebar.classList.toggle("open", open);
      toggle.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("sidebar-open", open);

      if (overlay) {
        overlay.classList.toggle("open", open);
        overlay.setAttribute("aria-hidden", open ? "false" : "true");
      }
    }

    function closeSidebar() {
      setSidebarOpen(false);
    }

    toggle.addEventListener("click", function () {
      setSidebarOpen(!sidebar.classList.contains("open"));
    });

    if (overlay) {
      overlay.addEventListener("click", closeSidebar);
    }

    sidebar.querySelectorAll(".sidebar-link").forEach(function (link) {
      link.addEventListener("click", closeSidebar);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        closeSidebar();
      }
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
        '<button type="button" class="sidebar-toggle" id="sidebar-toggle" aria-label="Open menu" aria-expanded="false">' +
          "<span></span><span></span><span></span>" +
        "</button>" +
        "<h1 class=\"topbar-title\">" + RMSUtils.escapeHtml(title) + "</h1>" +
      "</div>" +
      '<div class="topbar-right">' +
        '<a href="' + alertLink + '" class="notification-badge" aria-label="Notifications">' +
          RMSIcons.get("alerts") + badgeHtml +
        "</a>" +
        '<span class="topbar-user">' + RMSUtils.escapeHtml(userName) + "</span>" +
      "</div>";
  }

  function init(role, activePage) {
    var session = RMSSession.requireAuth(role);
    if (!session) return null;

    ensureSidebarOverlay();
    renderSidebar(role, activePage);
    renderTopbar(role, activePage, session);
    initSidebarToggle();
    return session;
  }

  return { init: init };
})();
