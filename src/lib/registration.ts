export interface Participant {
  position: number;
  role: "captain" | "member";
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
}

export interface RegistrationRecord {
  registrationId: string;
  teamName: string;
  teamFormat: "duo" | "trio" | string;
  groupSize: number;
  primaryContact: {
    name?: string;
    email?: string;
    phone?: string;
  };
  participants: Participant[];
  registeredAt?: string;
  status?: string;
}

export const REGISTRATION_API_URL =
  "https://script.google.com/macros/s/AKfycbxilr9ERAjiFEHoLvVZJl2q2gljZVXWPNagi9IhoxFLtcg8-N1PRDg_3UoI2qB48RkqIg/exec";

const STORAGE_KEY_ID = "bvbRegistrationId";
const STORAGE_KEY_DATA = "bvbRegistrationData";

/**
 * Retrieve saved registration from browser localStorage.
 */
export function getSavedRegistration(): RegistrationRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DATA);
    if (raw) {
      return JSON.parse(raw);
    }
    const id = localStorage.getItem(STORAGE_KEY_ID);
    if (id) {
      return {
        registrationId: id,
        teamName: "Registered Team",
        teamFormat: "duo",
        groupSize: 2,
        primaryContact: {},
        participants: [],
        status: "Confirmed",
      };
    }
  } catch (err) {
    console.warn("Could not read registration from localStorage:", err);
  }
  return null;
}

/**
 * Save registration record to browser localStorage.
 */
export function saveRegistration(record: RegistrationRecord): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_ID, record.registrationId);
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(record));
    window.dispatchEvent(new Event("bvb-registration-updated"));
  } catch (err) {
    console.warn("Could not save registration to localStorage:", err);
  }
}

/**
 * Clear saved registration record from browser localStorage.
 */
export function clearSavedRegistration(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_ID);
    localStorage.removeItem(STORAGE_KEY_DATA);
    window.dispatchEvent(new Event("bvb-registration-updated"));
  } catch (err) {
    console.warn("Could not clear registration from localStorage:", err);
  }
}

/**
 * Search the backend Google Apps Script Sheet for an existing registration by ID and phone number.
 */
export async function lookupRegistration(
  registrationId: string,
  phone: string
): Promise<{ success: boolean; data?: RegistrationRecord; message?: string }> {
  const cleanId = registrationId.trim().toUpperCase();
  const cleanPhone = phone.trim().replace(/\D/g, "");

  // Check if current cached item matches
  const local = getSavedRegistration();
  if (
    local &&
    local.registrationId.toUpperCase() === cleanId &&
    local.participants.some(
      (p) => p.phone.replace(/\D/g, "").slice(-10) === cleanPhone.slice(-10)
    )
  ) {
    return { success: true, data: local };
  }

  try {
    const response = await fetch(REGISTRATION_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "lookup",
        registrationId: cleanId,
        phone: cleanPhone,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const raw = await response.text();
    let result: any;
    try {
      result = JSON.parse(raw);
    } catch {
      throw new Error("Invalid response from registration server.");
    }

    if (!result?.success || !result?.data) {
      if (result?.message && result.message.includes("Registration received successfully")) {
        return {
          success: false,
          message:
            "Your Google Apps Script Web App has not been updated with the lookup code yet. In Google Apps Script, paste the updated Code.gs and click: Deploy > Manage Deployments > Edit (pencil) > Version: New Version > Deploy.",
        };
      }
      return {
        success: false,
        message:
          result?.message ||
          "No matching registration found. Please check your Registration ID and phone number.",
      };
    }

    const record: RegistrationRecord = {
      registrationId: result.data.registrationId || cleanId,
      teamName: result.data.teamName || "My Team",
      teamFormat: result.data.teamFormat || (result.data.groupSize === 3 ? "trio" : "duo"),
      groupSize: Number(result.data.groupSize) || (result.data.participants?.length || 2),
      primaryContact: result.data.primaryContact || {},
      participants: result.data.participants || [],
      registeredAt: result.data.createdAt || result.data.registeredAt || new Date().toISOString(),
      status: result.data.status || "Confirmed",
    };

    saveRegistration(record);
    return { success: true, data: record };
  } catch (err: any) {
    console.error("Lookup error:", err);
    return {
      success: false,
      message:
        err?.message ||
        "Could not verify registration details with the server. Please try again.",
    };
  }
}
