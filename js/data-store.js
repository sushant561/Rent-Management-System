/**
 * data-store.js — Temporary frontend data layer using localStorage
 *
 * IMPORTANT: This mock data store is for frontend demonstration only.
 * All data will be replaced with PHP/MySQL backend operations later.
 */
var RMSStore = (function () {
  "use strict";

  var STORAGE_KEY = "rms_data";

  function toDateString(date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  }

  function shiftMonth(monthStr, delta) {
    var parts = monthStr.split("-");
    var date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1 + delta, 1);
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");
  }

  function getRentStatusFromDueDate(dueDate) {
    var today = new Date();
    var due = new Date(dueDate + "T23:59:59");
    return today > due ? "Overdue" : "Pending";
  }

  function getDefaultData() {
    var currentMonth = RMSUtils.getCurrentMonth();
    var previousMonth = shiftMonth(currentMonth, -1);
    var currentDate = new Date();
    var currentMonthPaidDateA = currentMonth + "-03";
    var currentMonthPaidDateB = currentMonth + "-01";
    var previousMonthPaidDate = previousMonth + "-05";
    return {
      properties: [
        {
          id: "prop_1",
          name: "Sunrise Apartments",
          location: "MG Road, Bangalore",
          totalRooms: 8,
          occupiedRooms: 6,
          vacantRooms: 2,
          monthlyIncome: 72000
        },
        {
          id: "prop_2",
          name: "Green Valley Residency",
          location: "Koramangala, Bangalore",
          totalRooms: 6,
          occupiedRooms: 5,
          vacantRooms: 1,
          monthlyIncome: 55000
        },
        {
          id: "prop_3",
          name: "Lake View PG",
          location: "Indiranagar, Bangalore",
          totalRooms: 10,
          occupiedRooms: 8,
          vacantRooms: 2,
          monthlyIncome: 64000
        }
      ],
      tenants: [
        {
          id: "ten_1",
          loginUsername: "tenant",
          password: "tenant123",
          name: "Rahul Sharma",
          phone: "9876543210",
          email: "rahul.sharma@email.com",
          propertyId: "prop_1",
          roomNumber: "101",
          monthlyRent: 12000,
          joiningDate: "2024-06-01",
          status: "Active"
        },
        {
          id: "ten_2",
          name: "Priya Patel",
          phone: "9876543211",
          email: "priya.patel@email.com",
          propertyId: "prop_1",
          roomNumber: "102",
          monthlyRent: 11500,
          joiningDate: "2024-08-15",
          status: "Active"
        },
        {
          id: "ten_3",
          name: "Amit Kumar",
          phone: "9876543212",
          email: "amit.kumar@email.com",
          propertyId: "prop_2",
          roomNumber: "201",
          monthlyRent: 11000,
          joiningDate: "2025-01-10",
          status: "Active"
        },
        {
          id: "ten_4",
          name: "Sneha Reddy",
          phone: "9876543213",
          email: "sneha.reddy@email.com",
          propertyId: "prop_2",
          roomNumber: "202",
          monthlyRent: 11000,
          joiningDate: "2024-11-01",
          status: "Active"
        }
      ],
      rentRecords: [
        { id: "rent_1", tenantId: "ten_1", propertyId: "prop_1", month: currentMonth, dueDate: currentMonth + "-05", amount: 12000, status: getRentStatusFromDueDate(currentMonth + "-05") },
        { id: "rent_2", tenantId: "ten_2", propertyId: "prop_1", month: currentMonth, dueDate: currentMonth + "-05", amount: 11500, status: "Paid", paidDate: currentMonthPaidDateA, method: "UPI" },
        { id: "rent_3", tenantId: "ten_3", propertyId: "prop_2", month: currentMonth, dueDate: currentMonth + "-25", amount: 11000, status: getRentStatusFromDueDate(currentMonth + "-25") },
        { id: "rent_4", tenantId: "ten_4", propertyId: "prop_2", month: currentMonth, dueDate: currentMonth + "-05", amount: 11000, status: "Paid", paidDate: currentMonthPaidDateB, method: "Bank Transfer" }
      ],
      payments: [
        { id: "pay_1", receiptId: "RCP-" + currentDate.getFullYear() + "-001", tenantId: "ten_2", propertyId: "prop_1", amount: 11500, paymentDate: currentMonthPaidDateA, method: "UPI", status: "Completed", month: currentMonth },
        { id: "pay_2", receiptId: "RCP-" + currentDate.getFullYear() + "-002", tenantId: "ten_4", propertyId: "prop_2", amount: 11000, paymentDate: currentMonthPaidDateB, method: "Bank Transfer", status: "Completed", month: currentMonth },
        { id: "pay_3", receiptId: "RCP-" + currentDate.getFullYear() + "-003", tenantId: "ten_1", propertyId: "prop_1", amount: 12000, paymentDate: previousMonthPaidDate, method: "Cash", status: "Completed", month: previousMonth }
      ],
      complaints: [
        {
          id: "comp_1",
          tenantId: "ten_1",
          subject: "Water leakage in bathroom",
          description: "There is a water leakage near the bathroom tap in room 101. Please fix it soon.",
          date: "2026-02-10",
          status: "Pending",
          response: ""
        },
        {
          id: "comp_2",
          tenantId: "ten_3",
          subject: "Electricity issue",
          description: "Power socket in the bedroom is not working properly.",
          date: "2026-02-05",
          status: "In Progress",
          response: "Electrician has been contacted."
        }
      ],
      alerts: [
        {
          id: "alert_1",
          message: "Monthly rent is due by the 5th. Please complete the payment on time.",
          tenantId: null,
          date: currentMonth + "-01",
          sender: "owner",
          readBy: []
        }
      ],
      settings: {
        owner: {
          name: "Property Owner",
          email: "owner@rms.local",
          phone: "9123456780",
          notifications: true
        },
        tenant: {
          name: "Rahul Sharma",
          email: "rahul.sharma@email.com",
          phone: "9876543210",
          notifications: true
        }
      }
    };
  }

  function getData() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        var defaults = getDefaultData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
        return defaults;
      }
      var parsed = JSON.parse(stored);
      var normalized = normalizeData(parsed);
      saveData(normalized);
      return normalized;
    } catch (e) {
      var fallback = getDefaultData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function recalcProperty(data, property) {
    var tenants = data.tenants.filter(function (t) {
      return t.propertyId === property.id && t.status === "Active";
    });
    property.occupiedRooms = tenants.length;
    property.vacantRooms = Math.max(0, property.totalRooms - property.occupiedRooms);
    property.monthlyIncome = tenants.reduce(function (sum, t) {
      return sum + Number(t.monthlyRent || 0);
    }, 0);
    return property;
  }

  function syncProperties(data) {
    data.properties.forEach(function (property) {
      recalcProperty(data, property);
    });
  }

  function ensureCurrentRentRecord(data, tenant) {
    var currentMonth = RMSUtils.getCurrentMonth();
    var existing = data.rentRecords.find(function (record) {
      return record.tenantId === tenant.id && record.month === currentMonth;
    });

    if (!existing) {
      existing = {
        id: RMSUtils.generateId("rent"),
        tenantId: tenant.id,
        propertyId: tenant.propertyId,
        month: currentMonth,
        dueDate: currentMonth + "-05",
        amount: Number(tenant.monthlyRent || 0),
        status: getRentStatusFromDueDate(currentMonth + "-05")
      };
      data.rentRecords.push(existing);
      return existing;
    }

    existing.propertyId = tenant.propertyId;
    existing.amount = Number(tenant.monthlyRent || 0);
    existing.dueDate = existing.dueDate || currentMonth + "-05";
    if (existing.status !== "Paid") {
      existing.status = getRentStatusFromDueDate(existing.dueDate);
      delete existing.paidDate;
      delete existing.method;
    }
    return existing;
  }

  function syncCurrentRentRecords(data) {
    data.tenants.filter(function (tenant) {
      return tenant.status === "Active";
    }).forEach(function (tenant) {
      ensureCurrentRentRecord(data, tenant);
    });
  }

  function normalizeData(data) {
    var defaults = getDefaultData();
    data = data || {};
    data.properties = Array.isArray(data.properties) ? data.properties : defaults.properties;
    data.tenants = Array.isArray(data.tenants) ? data.tenants : defaults.tenants;
    data.tenants.forEach(function (tenant) {
      if (tenant.loginUsername === "tenant" && !tenant.password) {
        tenant.password = "tenant123";
      }
    });
    data.rentRecords = Array.isArray(data.rentRecords) ? data.rentRecords : defaults.rentRecords;
    data.payments = Array.isArray(data.payments) ? data.payments : defaults.payments;
    data.complaints = Array.isArray(data.complaints) ? data.complaints : defaults.complaints;
    data.alerts = Array.isArray(data.alerts) ? data.alerts : defaults.alerts;
    data.settings = data.settings || {};
    data.settings.owner = Object.assign({}, defaults.settings.owner, data.settings.owner || {});
    data.settings.tenant = Object.assign({}, defaults.settings.tenant, data.settings.tenant || {});
    syncTenantSettings(data);
    syncProperties(data);
    syncCurrentRentRecords(data);
    return data;
  }

  function syncTenantSettings(data) {
    var demoTenant = data.tenants.find(function (tenant) {
      return tenant.loginUsername === "tenant";
    });

    if (!demoTenant) return;

    data.settings.tenant.name = demoTenant.name || data.settings.tenant.name;
    data.settings.tenant.email = demoTenant.email || data.settings.tenant.email;
    data.settings.tenant.phone = demoTenant.phone || data.settings.tenant.phone;
  }

  /* Properties */
  function getProperties() {
    return getData().properties;
  }

  function getPropertyById(id) {
    return getProperties().find(function (p) { return p.id === id; });
  }

  function addProperty(property) {
    var data = getData();
    property.id = RMSUtils.generateId("prop");
    property.vacantRooms = property.totalRooms;
    property.occupiedRooms = 0;
    property.monthlyIncome = 0;
    data.properties.push(property);
    saveData(data);
    return property;
  }

  function updateProperty(id, updates) {
    var data = getData();
    var index = data.properties.findIndex(function (p) { return p.id === id; });
    if (index === -1) return null;
    Object.assign(data.properties[index], updates);
    recalcProperty(data, data.properties[index]);
    saveData(data);
    return data.properties[index];
  }

  function deleteProperty(id) {
    var data = getData();
    var hasTenants = data.tenants.some(function (t) { return t.propertyId === id && t.status === "Active"; });
    if (hasTenants) return { error: "Cannot delete property with active tenants." };
    data.properties = data.properties.filter(function (p) { return p.id !== id; });
    saveData(data);
    return { success: true };
  }

  /* Tenants */
  function getTenants() {
    return getData().tenants;
  }

  function getTenantById(id) {
    return getTenants().find(function (t) { return t.id === id; });
  }

  function getTenantByLogin(username) {
    return getTenants().find(function (t) { return t.loginUsername === username; });
  }

  function addTenant(tenant) {
    var data = getData();
    tenant.id = RMSUtils.generateId("ten");
    tenant.status = tenant.status || "Active";
    data.tenants.push(tenant);
    syncProperties(data);
    if (tenant.status === "Active") {
      ensureCurrentRentRecord(data, tenant);
    }
    syncTenantSettings(data);
    saveData(data);
    return tenant;
  }

  function updateTenant(id, updates) {
    var data = getData();
    var index = data.tenants.findIndex(function (t) { return t.id === id; });
    if (index === -1) return null;
    var previousPropertyId = data.tenants[index].propertyId;
    Object.assign(data.tenants[index], updates);
    syncProperties(data);
    if (data.tenants[index].status === "Active") {
      ensureCurrentRentRecord(data, data.tenants[index]);
    }
    if (previousPropertyId !== data.tenants[index].propertyId) {
      syncProperties(data);
    }
    syncTenantSettings(data);
    saveData(data);
    return data.tenants[index];
  }

  function deactivateTenant(id) {
    return updateTenant(id, { status: "Inactive" });
  }

  /* Rent Records */
  function getRentRecords() {
    return getData().rentRecords.slice().sort(function (a, b) {
      return new Date(b.dueDate) - new Date(a.dueDate);
    });
  }

  function getRentRecordById(id) {
    return getData().rentRecords.find(function (r) { return r.id === id; });
  }

  function getRentRecordsByTenant(tenantId) {
    return getRentRecords().filter(function (record) {
      return record.tenantId === tenantId;
    });
  }

  function getCurrentRentRecordForTenant(tenantId) {
    var currentMonth = RMSUtils.getCurrentMonth();
    return getData().rentRecords.find(function (record) {
      return record.tenantId === tenantId && record.month === currentMonth;
    });
  }

  function recordRentPayment(rentId, method) {
    var data = getData();
    var rent = data.rentRecords.find(function (r) { return r.id === rentId; });
    if (!rent) return null;
    if (rent.status === "Paid") {
      return { error: "Rent already paid for this month." };
    }
    rent.status = "Paid";
    rent.paidDate = new Date().toISOString().split("T")[0];
    rent.method = method || "Cash";

    var receiptId = "RCP-" + new Date().getFullYear() + "-" + String(data.payments.length + 1).padStart(3, "0");
    data.payments.push({
      id: RMSUtils.generateId("pay"),
      receiptId: receiptId,
      tenantId: rent.tenantId,
      propertyId: rent.propertyId,
      amount: rent.amount,
      paymentDate: rent.paidDate,
      method: rent.method,
      status: "Completed",
      month: rent.month
    });
    saveData(data);
    return rent;
  }

  function tenantPayRent(tenantId, method) {
    var data = getData();
    var tenant = data.tenants.find(function (item) {
      return item.id === tenantId;
    });
    if (!tenant) return { error: "Tenant not found." };
    var rent = ensureCurrentRentRecord(data, tenant);
    if (rent.status === "Paid") return { error: "Rent already paid for this month." };
    rent.status = "Paid";
    rent.paidDate = new Date().toISOString().split("T")[0];
    rent.method = method || "UPI";
    data.payments.unshift({
      id: RMSUtils.generateId("pay"),
      receiptId: "RCP-" + new Date().getFullYear() + "-" + String(data.payments.length + 1).padStart(3, "0"),
      tenantId: rent.tenantId,
      propertyId: rent.propertyId,
      amount: rent.amount,
      paymentDate: rent.paidDate,
      method: rent.method,
      status: "Completed",
      month: rent.month
    });
    saveData(data);
    return rent;
  }

  /* Payments */
  function getPayments() {
    return getData().payments.slice().sort(function (a, b) {
      return new Date(b.paymentDate) - new Date(a.paymentDate);
    });
  }

  function getPaymentById(id) {
    return getPayments().find(function (p) { return p.id === id; });
  }

  function getPaymentsByTenant(tenantId) {
    return getPayments().filter(function (p) { return p.tenantId === tenantId; });
  }

  /* Complaints */
  function getComplaints() {
    return getData().complaints.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  }

  function getComplaintById(id) {
    return getComplaints().find(function (c) { return c.id === id; });
  }

  function getComplaintsByTenant(tenantId) {
    return getComplaints().filter(function (c) { return c.tenantId === tenantId; });
  }

  function addComplaint(complaint) {
    var data = getData();
    complaint.id = RMSUtils.generateId("comp");
    complaint.date = new Date().toISOString().split("T")[0];
    complaint.status = "Pending";
    complaint.response = "";
    data.complaints.unshift(complaint);
    saveData(data);
    return complaint;
  }

  function updateComplaint(id, updates) {
    var data = getData();
    var index = data.complaints.findIndex(function (c) { return c.id === id; });
    if (index === -1) return null;
    Object.assign(data.complaints[index], updates);
    saveData(data);
    return data.complaints[index];
  }

  /* Alerts */
  function getAlerts() {
    return getData().alerts.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  }

  function getAlertsForTenant(tenantId) {
    return getAlerts().filter(function (a) {
      return a.tenantId === null || a.tenantId === tenantId;
    });
  }

  function sendAlert(message, tenantId) {
    var data = getData();
    var alert = {
      id: RMSUtils.generateId("alert"),
      message: message,
      tenantId: tenantId || null,
      date: new Date().toISOString().split("T")[0],
      sender: "owner",
      readBy: []
    };
    data.alerts.unshift(alert);
    saveData(data);
    return alert;
  }

  function markAlertRead(alertId, tenantId) {
    var data = getData();
    var alert = data.alerts.find(function (a) { return a.id === alertId; });
    if (alert && alert.readBy.indexOf(tenantId) === -1) {
      alert.readBy.push(tenantId);
      saveData(data);
    }
  }

  function getUnreadAlertCount(tenantId) {
    return getAlertsForTenant(tenantId).filter(function (a) {
      return a.readBy.indexOf(tenantId) === -1;
    }).length;
  }

  /* Settings */
  function getSettings(role) {
    return getData().settings[role] || {};
  }

  function updateSettings(role, updates) {
    var data = getData();
    Object.assign(data.settings[role], updates);
    saveData(data);
    return data.settings[role];
  }

  /* Dashboard stats */
  function getOwnerStats() {
    var data = getData();
    var properties = data.properties;
    var tenants = data.tenants.filter(function (t) { return t.status === "Active"; });
    var totalRooms = properties.reduce(function (s, p) { return s + p.totalRooms; }, 0);
    var occupiedRooms = properties.reduce(function (s, p) { return s + p.occupiedRooms; }, 0);
    var currentMonth = RMSUtils.getCurrentMonth();
    var monthRent = data.rentRecords.filter(function (r) { return r.month === currentMonth; });
    var collected = monthRent.filter(function (r) { return r.status === "Paid"; }).reduce(function (s, r) { return s + r.amount; }, 0);
    var pending = monthRent.filter(function (r) { return r.status !== "Paid"; }).reduce(function (s, r) { return s + r.amount; }, 0);

    return {
      totalProperties: properties.length,
      totalRooms: totalRooms,
      occupiedRooms: occupiedRooms,
      vacantRooms: totalRooms - occupiedRooms,
      activeTenants: tenants.length,
      totalRentCollection: collected,
      pendingRent: pending
    };
  }

  function resetData() {
    localStorage.removeItem(STORAGE_KEY);
    return getData();
  }

  return {
    getData: getData,
    getProperties: getProperties,
    getPropertyById: getPropertyById,
    addProperty: addProperty,
    updateProperty: updateProperty,
    deleteProperty: deleteProperty,
    getTenants: getTenants,
    getTenantById: getTenantById,
    getTenantByLogin: getTenantByLogin,
    addTenant: addTenant,
    updateTenant: updateTenant,
    deactivateTenant: deactivateTenant,
    getRentRecords: getRentRecords,
    getRentRecordById: getRentRecordById,
    getRentRecordsByTenant: getRentRecordsByTenant,
    getCurrentRentRecordForTenant: getCurrentRentRecordForTenant,
    recordRentPayment: recordRentPayment,
    tenantPayRent: tenantPayRent,
    getPayments: getPayments,
    getPaymentById: getPaymentById,
    getPaymentsByTenant: getPaymentsByTenant,
    getComplaints: getComplaints,
    getComplaintById: getComplaintById,
    getComplaintsByTenant: getComplaintsByTenant,
    addComplaint: addComplaint,
    updateComplaint: updateComplaint,
    getAlerts: getAlerts,
    getAlertsForTenant: getAlertsForTenant,
    sendAlert: sendAlert,
    markAlertRead: markAlertRead,
    getUnreadAlertCount: getUnreadAlertCount,
    getSettings: getSettings,
    updateSettings: updateSettings,
    getOwnerStats: getOwnerStats,
    resetData: resetData
  };
})();
