const tokens = {}; // Простий об'єкт для збереження токенів, замініть на реальну базу даних

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
}

module.exports = TokenStore;