/**
 * data-store.js — Temporary frontend data layer using localStorage
 *
 * IMPORTANT: This mock data store is for frontend demonstration only.
 * All data will be replaced with PHP/MySQL backend operations later.
 */
var RMSStore = (function () {
  "use strict";

  var STORAGE_KEY = "rms_data";

  function getDefaultData() {
    var currentMonth = RMSUtils.getCurrentMonth();
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
        { id: "rent_1", tenantId: "ten_1", propertyId: "prop_1", month: currentMonth, dueDate: currentMonth + "-05", amount: 12000, status: "Pending" },
        { id: "rent_2", tenantId: "ten_2", propertyId: "prop_1", month: currentMonth, dueDate: currentMonth + "-05", amount: 11500, status: "Paid", paidDate: currentMonth + "-03", method: "UPI" },
        { id: "rent_3", tenantId: "ten_3", propertyId: "prop_2", month: currentMonth, dueDate: currentMonth + "-05", amount: 11000, status: "Overdue" },
        { id: "rent_4", tenantId: "ten_4", propertyId: "prop_2", month: currentMonth, dueDate: currentMonth + "-05", amount: 11000, status: "Paid", paidDate: currentMonth + "-01", method: "Bank Transfer" }
      ],
      payments: [
        { id: "pay_1", receiptId: "RCP-2026-001", tenantId: "ten_2", propertyId: "prop_1", amount: 11500, paymentDate: "2026-02-03", method: "UPI", status: "Completed", month: currentMonth },
        { id: "pay_2", receiptId: "RCP-2026-002", tenantId: "ten_4", propertyId: "prop_2", amount: 11000, paymentDate: "2026-02-01", method: "Bank Transfer", status: "Completed", month: currentMonth },
        { id: "pay_3", receiptId: "RCP-2026-003", tenantId: "ten_1", propertyId: "prop_1", amount: 12000, paymentDate: "2026-01-05", method: "Cash", status: "Completed", month: "2026-01" }
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
          message: "Rent for February is due by the 5th. Please pay on time.",
          tenantId: null,
          date: "2026-02-01",
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
      return JSON.parse(stored);
    } catch (e) {
      var fallback = getDefaultData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function recalcProperty(property) {
    var tenants = getData().tenants.filter(function (t) {
      return t.propertyId === property.id && t.status === "Active";
    });
    property.occupiedRooms = tenants.length;
    property.vacantRooms = Math.max(0, property.totalRooms - property.occupiedRooms);
    property.monthlyIncome = tenants.reduce(function (sum, t) {
      return sum + Number(t.monthlyRent || 0);
    }, 0);
    return property;
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
    recalcProperty(data.properties[index]);
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
    var prop = data.properties.find(function (p) { return p.id === tenant.propertyId; });
    if (prop) recalcProperty(prop);
    saveData(data);
    return tenant;
  }

  function updateTenant(id, updates) {
    var data = getData();
    var index = data.tenants.findIndex(function (t) { return t.id === id; });
    if (index === -1) return null;
    Object.assign(data.tenants[index], updates);
    var prop = data.properties.find(function (p) { return p.id === data.tenants[index].propertyId; });
    if (prop) recalcProperty(prop);
    saveData(data);
    return data.tenants[index];
  }

  function deactivateTenant(id) {
    return updateTenant(id, { status: "Inactive" });
  }

  /* Rent Records */
  function getRentRecords() {
    return getData().rentRecords;
  }

  function getRentRecordById(id) {
    return getRentRecords().find(function (r) { return r.id === id; });
  }

  function recordRentPayment(rentId, method) {
    var data = getData();
    var rent = data.rentRecords.find(function (r) { return r.id === rentId; });
    if (!rent) return null;
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
    var currentMonth = RMSUtils.getCurrentMonth();
    var rent = data.rentRecords.find(function (r) {
      return r.tenantId === tenantId && r.month === currentMonth;
    });
    if (!rent) {
      var tenant = getTenantById(tenantId);
      rent = {
        id: RMSUtils.generateId("rent"),
        tenantId: tenantId,
        propertyId: tenant.propertyId,
        month: currentMonth,
        dueDate: currentMonth + "-05",
        amount: tenant.monthlyRent,
        status: "Pending"
      };
      data.rentRecords.push(rent);
    }
    if (rent.status === "Paid") return { error: "Rent already paid for this month." };
    return recordRentPayment(rent.id, method);
  }

  /* Payments */
  function getPayments() {
    return getData().payments;
  }

  function getPaymentById(id) {
    return getPayments().find(function (p) { return p.id === id; });
  }

  function getPaymentsByTenant(tenantId) {
    return getPayments().filter(function (p) { return p.tenantId === tenantId; });
  }

  /* Complaints */
  function getComplaints() {
    return getData().complaints;
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
    return getData().alerts;
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
