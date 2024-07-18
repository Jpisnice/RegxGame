// utils/validateRegex.ts

/**
 * Validates an input string against a regular expression pattern.
 * @param input - The input string to validate.
 * @param pattern - The regular expression pattern to validate against.
 * @returns A boolean indicating whether the input matches the pattern.
 */
const validateRegex = (input: string, pattern: RegExp): boolean => {
  return pattern.test(input);
};

export default validateRegex;
