// const bcrypt = require('bcryptjs'); - для хешування пароля
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = process.env.SECRET_KEY;
const TokenStore = require('./token-store');

class User {
  static #list = [];
  static #count = Math.floor(Math.random() * 90000) + 10000;

  constructor(email, password, verificationCode, passwordResetCode) {
    this.id = User.#count++;
    this.email = email;
    this.password = bcrypt.hashSync(password, 8); // Хешування пароля
    this.verificationCode = verificationCode;
    this.passwordResetCode = passwordResetCode;
    this.isVerified = false;
    this.date = new Date().getTime();
    this.token = jwt.sign({ id: this.id, email: this.email }, SECRET_KEY, { expiresIn: 86400 }); // Створення токену
    TokenStore.saveToken(this.email, this.token);
  }

  verifyPassword = (password) => bcrypt.compareSync(password, this.password); // Перевірка паролю

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

  static update = (user, { email, password }) => {
    if (email) {
      user.email = email;
    }
    if (password) {
      user.password = bcrypt.hashSync(password, 8); // Хешування нового пароля
    }
  };
}

module.exports = User;

