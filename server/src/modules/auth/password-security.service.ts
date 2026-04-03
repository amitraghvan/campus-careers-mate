import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PasswordSecurityService {
  private readonly logger = new Logger(PasswordSecurityService.name);

  /**
   * Checks if a password has been compromised using the Have I Been Pwned API.
   * Only sends the first 5 characters of the SHA-1 hash (k-Anonymity).
   */
  async isPasswordPwned(password: string): Promise<boolean> {
    try {
      if (!password) return false;
      const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);

      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      if (!response.ok) {
        this.logger.warn(`HIBP API returned ${response.status}`);
        return false;
      }

      const text = await response.text();
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.startsWith(suffix)) {
          const countStr = line.split(':')[1]?.trim();
          if (countStr) {
            const count = parseInt(countStr, 10);
            return count > 0;
          }
        }
      }
      return false;
    } catch (e) {
      this.logger.error('Failed to check HIBP', e);
      return false; // Fail open to not block users if API is down
    }
  }
}
