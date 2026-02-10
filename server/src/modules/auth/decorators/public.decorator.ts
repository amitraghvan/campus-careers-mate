/**
 * Public Decorator — marks a route as publicly accessible (no JWT required).
 */

import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

