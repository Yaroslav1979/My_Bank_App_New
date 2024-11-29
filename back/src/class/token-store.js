const tokens = {}; // Простий об'єкт для збереження токенів

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





// const tokens = {}; // Простий об'єкт для збереження токенів

// class TokenStore {
//   static saveToken(email, token) {
//     tokens[email] = token;
//   }

//   static getToken(email) {
//     return tokens[email];
//   }

//   static deleteToken(email) {
//     delete tokens[email];
//   }

//   static isValidToken(email, token) {
//     return tokens[email] === token;
//   }
  
// }

// module.exports = TokenStore;