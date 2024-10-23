// BalanceStore.js
class BalanceStore {
  constructor() {
    this.balance = 1000.00; 
    this.transactions = [];
  }

  getBalance() {
    return this.balance;
  }

  addTransaction(amount, type) {
    if (type === 'debit' && this.balance < amount) {
      throw new Error('Недостатньо коштів');
    }

    const transaction = {
      id: Date.now().toString(),
      amount,
      type,
      date: new Date().toISOString(),
    };

    this.transactions.push(transaction);

    if (type === 'debit') {
      this.balance -= amount;
    } else if (type === 'credit') {
      this.balance += amount;
    }

    return transaction;
  }

  // Метод для отримання історії транзакцій
  getTransactions() {
    return this.transactions;
  }
}

// Створюємо екземпляр класу BalanceStore для використання в ендпоїнтах
const balanceStore = new BalanceStore();
module.exports = balanceStore;
