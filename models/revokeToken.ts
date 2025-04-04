const RevokedToken: Set<string> = new Set();

/**
 * Adds a token to the revoked tokens list.
 *
 * @param {string} token - The token to be revoked.
 * @returns {void}
 */
export const addRevokeToken = (token: string): void => {
  RevokedToken.add(token);
}

/**
 * Checks if a given token has been revoked.
 *
 * @param {string} token - The token to check for revocation.
 * @returns {boolean} A boolean indicating whether the token has been revoked.
 */
export const isTokenRevoked = (token: string): boolean => {
  console.log("Checking revoked tokens list:", RevokedToken);
  console.log("Is token revoked?", RevokedToken.has(token));
  return RevokedToken.has(token);
}