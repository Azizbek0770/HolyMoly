// This is a browser-compatible replacement for bcrypt

// Simple hash function for browser environment
export async function hash(
  password: string,
  saltRounds: number,
): Promise<string> {
  // In a real app, you would use a proper browser-compatible hashing library
  // This is just a placeholder that mimics the API
  return `hashed_${password}_${saltRounds}`;
}

// Simple compare function for browser environment
export async function compare(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  // In a real app, you would use a proper browser-compatible hashing library
  // This is just a placeholder that mimics the API
  const expectedHash = `hashed_${password}_10`;
  return hashedPassword === expectedHash;
}
