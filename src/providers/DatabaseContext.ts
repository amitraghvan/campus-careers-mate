/**
 * Database Context — shared context definition for the database.
 */

import { createContext } from "react";
import type { Database } from "sql.js";

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
