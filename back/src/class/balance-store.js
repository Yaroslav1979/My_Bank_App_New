class BalanceStore {
  constructor() {
    this.balance = 0.00; 
    this.transactions = [];
  }

  getBalance() {
    return this.balance.toFixed(2); // Форматуємо баланс
  }

  addTransaction(amount, type, address = '', system = '') {
    if (type !== 'debit' && type !== 'credit') {
      throw new Error('Некоректний тип транзакції');
    }

    if (type === 'debit' && this.balance < amount) {
      throw new Error('Недостатньо коштів');
    }

    // Визначаємо source на основі system або адреси
    let source = '';
    if (system === 'Stripe') {
      source = 'stripe';
    } else if (system === 'Coinbase') {
      source = 'coinbase';
    } else {
      source = 'human'; // Значення за замовчуванням для P2P транзакцій
    }

    const transaction = {
      id: Date.now().toString(),
      amount,
      type,
      date: new Date().toISOString(),
      address: address || '', // Значення за замовчуванням
      system: system || '',   // Значення за замовчуванням
      source,                 // Додали поле source
    };

    // Додаємо транзакцію на початок списку
    this.transactions.unshift(transaction);

    // Оновлюємо баланс
    if (type === 'credit') {
      this.balance += amount;
    } else if (type === 'debit') {
      this.balance -= amount;
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Додаємо провідний нуль
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Місяці починаються з 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0'); // Додаємо провідний нуль
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Додаємо провідний нуль

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  getTransactions() {
    return this.transactions.map(transaction => ({
      ...transaction,
      formattedDate: this.formatDate(transaction.date), // Додаємо відформатовану дату до транзакції
    }));
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

