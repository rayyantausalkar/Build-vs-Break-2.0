# BvB Google Apps Script (Code.gs)

> [!IMPORTANT]
> ### Why you saw "Registration received successfully" instead of details:
> In Google Apps Script, editing `Code.gs` does **not** update the live Web App automatically.
> You must deploy a **New Version**:
> 1. In your Google Apps Script editor, replace all code with the script below.
> 2. Click **Save** (disk icon).
> 3. Click **Deploy > Manage deployments**.
> 4. Click the **Edit (pencil icon)** next to your active deployment.
> 5. In the **Version** dropdown, select **"New version"**.
> 6. Click **Deploy**.

---

### Complete `Code.gs` Code

```javascript
/**
 * BvB Hackathon — Registration & Lookup Backend
 * Google Apps Script Web App
 */

const ID_PREFIX = "BVB26-";

function getTargetSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Registrations");
  if (sheet) return sheet;
  return ss.getSheets()[0];
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, message: "No data received." });
    }

    const payload = JSON.parse(e.postData.contents);

    // ==========================================
    // ACTION: LOOKUP REGISTRATION
    // ==========================================
    if (payload.action === "lookup") {
      return handleLookup(payload.registrationId, payload.phone);
    }

    // ==========================================
    // ACTION: NEW REGISTRATION (FREE ENTRY)
    // ==========================================
    return handleNewRegistration(payload);

  } catch (err) {
    return jsonResponse({
      success: false,
      message: "Server error: " + err.toString()
    });
  }
}

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    if (params.action === "lookup") {
      return handleLookup(params.id || params.registrationId, params.phone);
    }
    return jsonResponse({
      success: true,
      message: "BvB Registration API is running."
    });
  } catch (err) {
    return jsonResponse({
      success: false,
      message: err.toString()
    });
  }
}

function handleLookup(lookupId, lookupPhone) {
  if (!lookupId || !lookupPhone) {
    return jsonResponse({
      success: false,
      message: "Registration ID and Phone Number are required."
    });
  }

  const cleanId = String(lookupId).trim().toUpperCase();
  const cleanPhone = String(lookupPhone).replace(/\D/g, "").slice(-10);

  const sheet = getTargetSheet();
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return jsonResponse({
      success: false,
      message: "No registrations found in the sheet."
    });
  }

  const headers = data[0].map(function (h) {
    return String(h).trim().toLowerCase();
  });

  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    // Check if cleanId matches ANY cell in this row
    let idMatched = false;
    for (let c = 0; c < row.length; c++) {
      const cellStr = String(row[c]).trim().toUpperCase();
      if (cellStr === cleanId || cellStr.indexOf(cleanId) !== -1) {
        idMatched = true;
        break;
      }
    }

    if (!idMatched) continue;

    // Check if cleanPhone matches ANY cell in this row (last 10 digits)
    let phoneMatched = false;
    for (let c = 0; c < row.length; c++) {
      const cellDigits = String(row[c]).replace(/\D/g, "");
      if (cellDigits.length >= 10 && cellDigits.slice(-10) === cleanPhone) {
        phoneMatched = true;
        break;
      }
    }

    if (idMatched && phoneMatched) {
      let participants = [];
      let teamName = "";
      let teamFormat = "duo";
      let groupSize = 2;

      // 1. Try to find raw JSON string stored in row
      for (let c = 0; c < row.length; c++) {
        const str = String(row[c]).trim();
        if (str.startsWith("{") && str.endsWith("}")) {
          try {
            const parsed = JSON.parse(str);
            if (parsed.participants && parsed.participants.length) {
              participants = parsed.participants;
            }
            if (parsed.teamName) teamName = parsed.teamName;
            if (parsed.teamFormat) teamFormat = parsed.teamFormat;
            if (parsed.groupSize) groupSize = parsed.groupSize;
          } catch (e) {}
        }
      }

      // 2. Fallback to column header extraction
      if (!participants.length) {
        const teamNameIdx = headers.findIndex(function(h) { return h.indexOf("team") !== -1; });
        if (teamNameIdx !== -1) teamName = String(row[teamNameIdx]);

        const formatIdx = headers.findIndex(function(h) { return h.indexOf("format") !== -1 || h.indexOf("type") !== -1; });
        if (formatIdx !== -1) teamFormat = String(row[formatIdx]).toLowerCase();

        const captainNameIdx = headers.findIndex(function(h) { return h.indexOf("captain") !== -1 || h === "name" || h.indexOf("member 1") !== -1; });
        const captainEmailIdx = headers.findIndex(function(h) { return h.indexOf("captain email") !== -1 || h === "email" || h.indexOf("member 1 email") !== -1; });
        const captainPhoneIdx = headers.findIndex(function(h) { return h.indexOf("captain phone") !== -1 || h === "phone" || h.indexOf("member 1 phone") !== -1; });
        const captainCollegeIdx = headers.findIndex(function(h) { return h.indexOf("college") !== -1; });
        const captainBranchIdx = headers.findIndex(function(h) { return h.indexOf("branch") !== -1; });
        const captainYearIdx = headers.findIndex(function(h) { return h.indexOf("year") !== -1; });

        participants.push({
          position: 1,
          role: "captain",
          name: captainNameIdx !== -1 ? String(row[captainNameIdx]) : String(row[5] || ""),
          email: captainEmailIdx !== -1 ? String(row[captainEmailIdx]) : String(row[6] || ""),
          phone: captainPhoneIdx !== -1 ? String(row[captainPhoneIdx]) : String(row[7] || ""),
          college: captainCollegeIdx !== -1 ? String(row[captainCollegeIdx]) : String(row[8] || ""),
          branch: captainBranchIdx !== -1 ? String(row[captainBranchIdx]) : String(row[9] || ""),
          year: captainYearIdx !== -1 ? String(row[captainYearIdx]) : String(row[10] || "")
        });

        const m2Idx = headers.findIndex(function(h) { return h.indexOf("member 2") !== -1; });
        if (m2Idx !== -1 && row[m2Idx]) {
          participants.push({
            position: 2,
            role: "member",
            name: String(row[m2Idx]),
            email: String(row[m2Idx + 1] || ""),
            phone: String(row[m2Idx + 2] || ""),
            college: String(row[m2Idx + 3] || ""),
            branch: String(row[m2Idx + 4] || ""),
            year: String(row[m2Idx + 5] || "")
          });
        }

        const m3Idx = headers.findIndex(function(h) { return h.indexOf("member 3") !== -1; });
        if (m3Idx !== -1 && row[m3Idx]) {
          participants.push({
            position: 3,
            role: "member",
            name: String(row[m3Idx]),
            email: String(row[m3Idx + 1] || ""),
            phone: String(row[m3Idx + 2] || ""),
            college: String(row[m3Idx + 3] || ""),
            branch: String(row[m3Idx + 4] || ""),
            year: String(row[m3Idx + 5] || "")
          });
        }
      }

      return jsonResponse({
        success: true,
        data: {
          registrationId: cleanId,
          teamName: teamName || "Registered Team",
          teamFormat: teamFormat || (participants.length === 3 ? "trio" : "duo"),
          groupSize: participants.length || groupSize || 2,
          primaryContact: {
            name: participants[0]?.name || "",
            email: participants[0]?.email || "",
            phone: participants[0]?.phone || ""
          },
          participants: participants,
          status: "Confirmed"
        }
      });
    }
  }

  return jsonResponse({
    success: false,
    message: "No registration found matching ID " + cleanId + " and phone number ending in " + cleanPhone + "."
  });
}

function handleNewRegistration(payload) {
  const sheet = getTargetSheet();
  const lastRow = sheet.getLastRow();

  const nextNumber = lastRow;
  const registrationId = ID_PREFIX + ("0000" + nextNumber).slice(-4);

  const participants = payload.participants || [];
  const p1 = participants[0] || {};
  const p2 = participants[1] || {};
  const p3 = participants[2] || {};

  sheet.appendRow([
    registrationId,
    new Date().toISOString(),
    payload.teamFormat || "duo",
    payload.groupSize || participants.length,
    payload.teamName || "",
    p1.name || "",
    p1.email || "",
    p1.phone || "",
    p1.college || "",
    p1.branch || "",
    p1.year || "",
    p2.name || "",
    p2.email || "",
    p2.phone || "",
    p2.college || "",
    p2.branch || "",
    p2.year || "",
    p3.name || "",
    p3.email || "",
    p3.phone || "",
    p3.college || "",
    p3.branch || "",
    p3.year || "",
    "Confirmed",
    JSON.stringify(payload)
  ]);

  return jsonResponse({
    success: true,
    registrationId: registrationId,
    message: "Registration successful"
  });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```
