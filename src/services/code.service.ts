/**
 * Code Explainer Service — API calls for AI Code Explainer and Debugger.
 */

import { api } from '@/lib/api';

export const codeService = {
    async explain(language: string, code: string): Promise<string> {
        const res = await api.post<{ explanation: string }>('/ai/code-explainer', { language, code });
        return res.explanation;
    },

    async debug(language: string, code: string): Promise<{ error: string; fixed_code: string }> {
        const res = await api.post<{ error: string; fixed_code: string }>('/ai/code-debugger', {
            language,
            code,
        });
        return res;
    },
};
