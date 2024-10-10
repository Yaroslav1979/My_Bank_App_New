const tokens = {}; // Простий об'єкт для збереження токенів

class TokenStore {
  static saveToken(email, token) {
    tokens[email] = token;
  }

  static getToken(email) {
    return tokens[email];
  }

  static deleteToken(email) {
    delete tokens[email];
  }

  static isValidToken(email, token) {
    return tokens[email] === token;
  }
}

module.exports = TokenStore;