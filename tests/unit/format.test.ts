import { describe, expect, test } from 'vitest';
import { formatDate } from '../../src/lib/format';

describe('formatDate', () => {
  test('formats a date as D Mon YYYY in English', () => {
    expect(formatDate(new Date('2026-07-27T00:00:00Z'))).toBe('27 Jul 2026');
  });

  test('pads nothing and uses en-GB month abbreviation', () => {
    expect(formatDate(new Date('2026-01-02T00:00:00Z'))).toBe('2 Jan 2026');
  });
});
