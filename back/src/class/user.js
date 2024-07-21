// const bcrypt = require('bcryptjs'); - для хешування пароля
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';

class User {
  static #list = [];
  static #count = Math.floor(Math.random() * 90000) + 10000;

  constructor(email, password, verificationCode) {
    this.id = User.#count++;
    this.email = email;
    this.password = password;    //this.password = bcrypt.hashSync(password, 8); // Для випадку хешування пароля
    this.verificationCode = verificationCode;
    this.isVerified = false;
    this.date = new Date().getTime();
    this.token = jwt.sign({ id: this.email }, SECRET_KEY, { expiresIn: 86400 }); // Створення токену
  }
  verifyPassword = (password) => this.password === password;
  // verifyPassword = (password) => bcrypt.compareSync(password, this.password); // Перевірка паролю при хешуванні

  static add = (user) => {
    this.#list.push(user);
  };

  static getList = () => {
    return this.#list;
  };

  static getById = (id) => {
    return this.#list.find((user) => user.id === id);
  };

  static getByEmail = (email) => {
    return this.#list.find((user) => user.email === email);
  };

  static deleteById = (id) => {
    const index = this.#list.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.#list.splice(index, 1);
      return true;
    } else {
      return false;
    }
  };

  static updateById = (id, data) => {
    const user = this.getById(id);

    if (user) {
      this.update(user, data);
      return true;
    } else {
      return false;
    }
  };

  static update = (user, { email }) => {
    if (email) {
      user.email = email;
    }
  };
}
module.exports = User;

// class User {
//   static #list = [];
//   static #count = Math.floor(Math.random() * 90000) + 10000;

//   constructor(email, password, verificationCode) {
//     this.id = User.#count++;
//     this.email = email;
//     this.password = password;
//     this.verificationCode = verificationCode;
//     this.isVerified = false;
//     this.date = new Date().getTime();
//   }

//   verifyPassword = (password) => this.password === password;

//   static add = (user) => {
//     this.#list.push(user);
//   };

//   static getList = () => {
//     return this.#list;
//   };

//   static getById = (id) => {
//     return this.#list.find((user) => user.id === id);
//   };

//   static getByEmail = (email) => {
//     return this.#list.find((user) => user.email === email);
//   };

//   static deleteById = (id) => {
//     const index = this.#list.findIndex((user) => user.id === id);
//     if (index !== -1) {
//       this.#list.splice(index, 1);
//       return true;
//     } else {
//       return false;
//     }
//   };

//   static updateById = (id, data) => {
//     const user = this.getById(id);

//     if (user) {
//       this.update(user, data);
//       return true;
//     } else {
//       return false;
//     }
//   };

//   static update = (user, { email }) => {
//     if (email) {
//       user.email = email;
//     }
//   };
// }

// module.exports = User;