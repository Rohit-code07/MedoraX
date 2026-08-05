// Simple sanity check that API modules import correctly
import * as auth from "../src/api/auth.api.js";
import * as medicine from "../src/api/medicine.api.js";
import * as reminder from "../src/api/reminder.api.js";
import * as analytics from "../src/api/analytics.api.js";
import * as profile from "../src/api/profile.api.js";
import * as notification from "../src/api/notification.api.js";

console.log("Auth API functions:", Object.keys(auth));
console.log("Medicine API functions:", Object.keys(medicine));
console.log("Reminder API functions:", Object.keys(reminder));
console.log("Analytics API functions:", Object.keys(analytics));
console.log("Profile API functions:", Object.keys(profile));
console.log("Notification API functions:", Object.keys(notification));
