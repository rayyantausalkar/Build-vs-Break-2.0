"use client";

import { useEffect, useState } from "react";
import {
  getSavedRegistration,
  RegistrationRecord,
} from "./registration";

export function useRegistration() {
  const [registration, setRegistration] = useState<RegistrationRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sync = () => {
      setRegistration(getSavedRegistration());
      setLoaded(true);
    };

    sync();

    window.addEventListener("storage", sync);
    window.addEventListener("bvb-registration-updated", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("bvb-registration-updated", sync);
    };
  }, []);

  return { registration, isRegistered: Boolean(registration?.registrationId), loaded };
}
