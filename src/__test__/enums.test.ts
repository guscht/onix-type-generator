import { describe, it, expect } from 'vitest';
import { formatEnumKey } from '../enums.js'; // Replace with the actual path

describe('formatEnumKey', () => {
  it('should replace spaces with underscores', () => {
    const input = 'My Enum Key';
    const expected = 'MY_ENUM_KEY';
    expect(formatEnumKey(input)).toBe(expected);
  });

  it('should remove non-alphanumeric characters', () => {
    const input = 'Enum@Key!';
    const expected = 'ENUMKEY';
    expect(formatEnumKey(input)).toBe(expected);
  });

  it('should handle mixed cases and convert to uppercase', () => {
    const input = 'myMixedCaseKey';
    const expected = 'MYMIXEDCASEKEY';
    expect(formatEnumKey(input)).toBe(expected);
  });

  it('should handle empty strings', () => {
    const input = '';
    const expected = '';
    expect(formatEnumKey(input)).toBe(expected);
  });

  it('should handle strings with only non-alphanumeric characters', () => {
    const input = '!@#$%^&*()';
    const expected = '';
    expect(formatEnumKey(input)).toBe(expected);
  });
});
