/**
 * Roles Decorator — restricts endpoint to specific roles.
 * Usage: @Roles('ADMIN')
 */

import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
