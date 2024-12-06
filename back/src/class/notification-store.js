class NotificationStore {
  constructor() {
    this.notifications = [];
  }

  // Додаємо нове сповіщення у сховище
  addNotification(type, details = {}) {
    const notification = {
      id: Date.now().toString(),
      type,                // Тип події (login, emailChange, passwordChange, balanceCredit, balanceDebit)
      time: new Date().toISOString(),
      userId,
      ...details,          // Додаткові параметри: сума транзакції, email тощо
    };
    this.notifications.push(notification);
    return notification;
  }

  // Отримання всіх сповіщень користувача
  getNotifications(userId) {
    return this.notifications.filter(n => n.userId === userId); // Повертаємо сповіщення лише для конкретного користувача
  }

  // Очищення всіх сповіщень (наприклад, під час виходу користувача)
  clearNotifications(userId) {
    this.notifications = this.notifications.filter(n => n.userId !== userId);
  }
}

module.exports = NotificationStore;
