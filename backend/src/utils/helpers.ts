export const generateRandomString = (radix: number = 36): string => {
  // radix cant be less than 2 or greater than 36
  if (radix < 2 || radix > 36) {
    radix = 36;
  }

  return Math.random().toString(radix).slice(2);
};
