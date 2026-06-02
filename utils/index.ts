import fs from 'fs';

export function hasUsableAuthState(filePath: string): boolean {
    if (!fs.existsSync(filePath)) {
      return false;
    }
  
    try {
      const state = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as {
        cookies?: Array<{ expires?: number }>;
        origins?: Array<unknown>;
      };
  
      const cookies = state.cookies ?? [];
      const origins = state.origins ?? [];
      const nowInSeconds = Date.now() / 1000;
  
      const hasValidCookie = cookies.some((cookie) => {
        if (cookie.expires === undefined) {
          return true;
        }
  
        // Session cookies use -1 and are still valid for current browser sessions.
        if (cookie.expires === -1) {
          return true;
        }
  
        return cookie.expires > nowInSeconds;
      });
  
      return hasValidCookie || origins.length > 0;
    } catch {
      return false;
    }
  }
  