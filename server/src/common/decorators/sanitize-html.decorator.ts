import DOMPurify from 'isomorphic-dompurify';
import { Transform, TransformFnParams } from 'class-transformer';

export function SanitizeHtml(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    if (typeof value !== 'string') return value;
    return DOMPurify.sanitize(value, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'target'],
      FORBID_ATTR: ['style', 'onerror', 'onload'],
    });
  });
}

export class SanitizedAiService {
  sanitizeOutput(text: string): string {
    return DOMPurify.sanitize(text, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  }
}
