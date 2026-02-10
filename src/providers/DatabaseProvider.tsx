/**
 * Database Provider
 * Initialises the sql.js database on app mount and
 * provides it via React Context to the entire app.
 */

import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Database } from "sql.js";
import { getDatabase } from "@/db";

export interface DatabaseContextValue {
  db: Database | null;
  isReady: boolean;
  error: string | null;
}

export const DatabaseContext = createContext<DatabaseContextValue>({
  db: null,
  isReady: false,
  error: null,
});

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Database | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDatabase()
      .then((database) => {
        if (!cancelled) {
          setDb(database);
          setIsReady(true);
        }
      })
      .catch((err) => {
        console.error("[DatabaseProvider] Init failed:", err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to initialise database");
          setIsReady(true); // Mark ready so we can show error state
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isReady, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}

