const tokens = {}; 

class TokenStore {
  static saveToken(userId, token) {
    tokens[userId] = token; // Зберігаємо токен за userId
  }

  static getToken(userId) {
    return tokens[userId]; // Повертаємо токен за userId
  }

  static deleteToken(userId) {
    delete tokens[userId]; // Видаляємо токен за userId
  }

  static isValidToken(userId, token) {
    return tokens[userId] === token; // Перевіряємо токен для userId
  }
}

module.exports = TokenStore;

