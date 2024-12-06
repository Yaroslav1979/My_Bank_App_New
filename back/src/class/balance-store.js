class BalanceStore {
  constructor() {
    this.balances = {}; // Об'єкт для збереження балансу кожного користувача за userId
    this.transactions = {}; // Об'єкт для збереження транзакцій кожного користувача за userId
  }

  // Отримати баланс користувача
  getBalance(userId) {
    return this.balances[userId] || 0; 
  }

  // Додати транзакцію для користувача
  addTransaction(userId, amount, type, address = '', system = '') {
    if (!this.transactions[userId]) {
      this.transactions[userId] = []; // Ініціалізуємо список транзакцій
    }

    if (type !== 'debit' && type !== 'credit') {
      throw new Error('Некоректний тип транзакції');
    }

    if (type === 'debit' && this.getBalance(userId) < amount) {
      throw new Error('Недостатньо коштів');
    }

    // Визначаємо джерело транзакції (Stripe, Coinbase або human)
    const source = this._determineSource(system, address);

    const transaction = {
      id: Date.now().toString(), // Унікальний id для транзакції
      userId,
      amount,
      type, // тип receive чи send
      date: new Date().toISOString(),
      address, // адреса відправлення коштів
      system, // платіжна система поповнення
      source, // Джерело транзакції
    };

    // Додаємо транзакцію до списку користувача
    this.transactions[userId].unshift(transaction);

    // Оновлюємо баланс
    this._updateBalance(userId, amount, type);

    return transaction; // Повертаємо створену транзакцію
  }

  // Визначити джерело транзакції
  _determineSource(system, address) {
    if (system === 'Stripe') {
      return 'stripe';
    } else if (system === 'Coinbase') {
      return 'coinbase';
    } else {
      return 'human'; //  транзакція персональна 
    }
  }

  // Оновити баланс користувача
  _updateBalance(userId, amount, type) {
    if (!this.balances[userId]) {
      this.balances[userId] = 0.00; // Ініціалізуємо баланс, якщо ще не існує
    }

    if (type === 'credit') {
      this.balances[userId] += amount; // Поповнення
    } else if (type === 'debit') {
      this.balances[userId] -= amount; // Зняття коштів
    }
  }

  // Форматування дати для транзакцій
  formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  // Отримати транзакції для користувача
  getTransactions(userId) {
    if (!this.transactions[userId]) {
      return []; 
    }
    return this.transactions[userId].map(transaction => ({
      ...transaction,
      formattedDate: this.formatDate(transaction.date), // Додаємо відформатовану дату
    }));
  }

  // Отримати транзакцію за ID
  getTransactionById(userId, transactionId) {
    if (!this.transactions[userId]) {
      return null; 
    }
    return this.transactions[userId].find(t => t.id === transactionId);
  }

  // Очистити всі транзакції для користувача
  clearTransactions(userId) {
    this.transactions[userId] = [];
  }

  // Скинути баланс користувача
  resetBalance(userId, newBalance = 0.00) {
    this.balances[userId] = newBalance;
    this.clearTransactions(userId);
  }
}

module.exports = BalanceStore;




