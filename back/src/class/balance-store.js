class BalanceStore {
  constructor() {
    this.balance = 0.00; 
    this.transactions = [];
  }

  getBalance() {
    return this.balance;
  }

  addTransaction(amount, type, address = '', system = '') {
    if (type !== 'debit' && type !== 'credit') {
      throw new Error('Некоректний тип транзакції');
    }
    
    if (type === 'debit' && this.balance < amount) {
      throw new Error('Недостатньо коштів');
    }

    const transaction = {
      id: Date.now().toString(),
      amount,
      type,
      date: new Date().toISOString(),
      address: address || '', // Значення за замовчуванням
      system: system || '',     // Значення за замовчуванням
    };

    this.transactions.push(transaction);

    if (type === 'debit') {
      this.balance -= amount;
    } else if (type === 'credit') {
      this.balance += amount;
    }

    return transaction;
  }

  getTransactions() {
    return this.transactions;
  }
  
  getTransactionById(transactionId) {
    return this.transactions.find(t => t.id === transactionId);
  }

  clearTransactions() {
    this.transactions = [];
  }

  resetBalance(newBalance = 0.00) {
    this.balance = newBalance;
    this.clearTransactions();
  }
}

// Створюємо екземпляр класу BalanceStore для використання в ендпоїнтах
const balanceStore = new BalanceStore();
module.exports = balanceStore;
