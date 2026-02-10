import * as React from "react";
import { APP_CONFIG } from "@/config";

/**
 * Responsive hook — returns true when viewport is below mobile breakpoint.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(max-width: ${APP_CONFIG.breakpoints.mobile - 1}px)`
    );
    const onChange = () => {
      setIsMobile(window.innerWidth < APP_CONFIG.breakpoints.mobile);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < APP_CONFIG.breakpoints.mobile);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
