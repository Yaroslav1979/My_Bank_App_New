require('dotenv').config();

// Підключаємо роутер до бек-енду
const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('../class/user');
const TokenStore = require('../class/token-store'); 
// const BalanceStore = require('../class/balance-store'); 
const router = express.Router();
// const notificationStore = require('../class/notification-store');

const SECRET_KEY = process.env.SECRET_KEY;

router.use(bodyParser.json());

// const fetch = require('node-fetch');
const nodemailer = require('nodemailer'); 

// Встановіть конфігурацію для nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

router.post('/user-create', function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Потрібно ввести email та пароль для створення аккаунту користувача'
      });
    }

    const existingUser = User.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: 'Користувач з таким email вже існує'
      });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000); 
    const newUser = new User(email, password, verificationCode); 
    
    User.add(newUser);

    // console.log('Новий користувач створений:', newUser, verificationCode);

    // Відправка коду верифікації електронною поштою
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Код верифікації',
      text: `Ваш код верифікації електронної пошти: ${verificationCode}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Помилка при відправці коду верифікації:', error);
        return res.status(500).json({
          message: 'Не вдалося відправити код верифікації'
        });
      } else {
        console.log('Код верифікації відправлено: ' + info.response);
        return res.status(201).json({
          message: 'На ваш email надісланий код верифікації аккаунту.',
          user: newUser,
          token: newUser.token,
        });
      }
    });
  }  catch (e) {
    console.error('Помилка при створенні аккаунту користувача:', e);
    return res.status(500).json({
      message: 'Не вдалося створити аккаунт користувача'
    });
  }
});

//--------------------------------------------------------
router.post('/verify-email', function (req, res) {
  try {
    const { email, verificationCode } = req.body;
    const user = User.getByEmail(email);

    if (user && user.verificationCode === parseInt(verificationCode)) {
      user.isVerified = true;

      // Отримуємо вже існуючий токен
      const token = TokenStore.getToken(user.email);
      // console.log("Token:", token);
//       
      return res.status(200).json({
        message: 'Електронну пошту успішно верифіковано',
        token: token,
        id: user.id,
      });
    } else {
      return res.status(400).json({
        message: 'Невірний код верифікації'
      });
    }
  } catch (e) {
    console.error('Помилка при верифікації електронної пошти:', e);
    return res.status(500).json({
      message: 'Не вдалося верифікувати електронну пошту'
    });
  }
});
// ---------------------------------------------

router.post('/user-enter', async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Потрібно ввести email та пароль, щоб увійти в аккаунт'
      });
    }

    const user = await User.getByEmail(email); // Асинхронний виклик
    if (!user) {
      return res.status(400).json({
        message: 'Користувача з таким email не знайдено'
      });
    }

    if (!user.verifyPassword(password)) {
      return res.status(401).json({
        message: 'Невірний пароль'
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: 'Користувач не верифікований'
      });
    }
    
    // Перевірка наявності токена користувача у сховищі
    const token = TokenStore.getToken(user.email);
    if (!token) {
      return res.status(500).json({
        message: 'Токен не знайдено',
      });
    }

    // Повертаємо токен, якщо користувач успішно увійшов
    return res.status(200).json({
      message: 'Ви успішно увійшли в аккаунт',
      token: token, // Повертаємо вже наявний токен
      id: user.id,
    });

  } catch (e) {
    console.error('Помилка при вході в аккаунт:', e);
    return res.status(500).json({
      message: 'Не вдалося увійти в аккаунт'
    });
  }
});

//--------------------------------------------

router.post('/recovery', async (req, res) => {
  const { email } = req.body;  

  console.log('Received email:', email);

  try {   
    const user = User.getByEmail(email);

    if (!user) {     
      console.log(`No user found for email: ${email}`);
      return res.status(404).json({ message: 'Email not found' });
    }

    const newResetCode = Math.floor(100000 + Math.random() * 900000); // Example code

    // Save the verification code in the user's record in the database
    user.passwordResetCode = newResetCode;
  
     // Виведення коду в консоль замість відправки на email:
    //  console.log(`Verification code for ${email}: ${newResetCode}`);

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Код відновлення парлю',
      text: `Ваш код для відновлення паролю: ${newResetCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Verification code sent to your email' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//------------------------------------------------

router.post('/recovery-confirm', async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;
 
  try {
    const user = User.getByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.passwordResetCode !== parseInt(verificationCode, 10)) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword; 
    user.passwordResetCode = null; 

    // Генерація JWT токена з балансом
    const tokenPayload = { 
      id: user.id, 
      email: user.email, 
      balance: user.balance // Додаємо баланс до токена
    };

    const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: 86400 });
    TokenStore.saveToken(email, token);

    res.json({ 
      message: 'Пароль успішно відновлено', 
      token, 
      user: { id: user.id, email: user.email, balance: user.balance } 
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// -------------------------------------------------

router.put('/settings-email', async (req, res) => {
  const { userId, newEmail, password } = req.body;
  const token = req.headers['authorization'];

  if (!newEmail || !password) {
    return res.status(400).json({ error: 'Заповніть усі поля' });
  }

  if (!token) {
    return res.status(401).json({ error: 'Токен не надано' });
  }

  try {
    const tokenValue = token.split(' ')[1];
    const decoded = jwt.verify(tokenValue, SECRET_KEY);

    if (decoded.id !== userId) {
      return res.status(401).json({ error: 'Недійсний токен для цього користувача' });
    }

    const user = User.getById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    if (!user.verifyPassword(password)) {
      return res.status(400).json({ error: 'Неправильний пароль' });
    }

    user.email = newEmail;
    const newToken = jwt.sign({ id: user.id, email: newEmail }, SECRET_KEY, { expiresIn: 86400 });

    TokenStore.deleteToken(user.email);
    TokenStore.saveToken(newEmail, newToken);

    res.status(200).json({
      message: 'Email успішно змінено',
      token: newToken,
      user: { id: user.id, email: newEmail },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Щось пішло не так' });
  }
});

//-------------------------------------------------------------

router.put('/settings-password', async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  const token = req.headers['authorization'];

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Заповніть усі поля' });
  }

  if (!token) {
    return res.status(401).json({ error: 'Токен не надано' });
  }

  try {
    const tokenValue = token.split(' ')[1];
    const decoded = jwt.verify(tokenValue, SECRET_KEY);

    if (decoded.id !== userId) {
      return res.status(401).json({ error: 'Недійсний токен для цього користувача' });
    }

    const user = User.getById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    if (!user.verifyPassword(oldPassword)) {
      return res.status(400).json({ error: 'Неправильний старий пароль' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    const newToken = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: 86400 });

    TokenStore.deleteToken(user.email);
    TokenStore.saveToken(user.email, newToken);

    res.status(200).json({
      message: 'Пароль успішно змінено',
      token: newToken,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Щось пішло не так' });
  }
});

//---------------------------------------------------------

   router.get('/balance/:userId', (req, res) => {
    const { userId } = req.params; // Отримуємо userId з параметрів URL
    console.log('User ID:', userId); // Логуємо отриманий userId
  
    try {
      const user = User.getById(parseInt(userId, 10)); // Отримуємо користувача за userId
      console.log('Found user:', user);
  
      if (!user) {
        throw new Error(`Користувач з ID ${userId} не знайдений`);
      }
  
      if (!user.balanceStore.getBalance(userId)) {
        console.log(`Баланс для користувача з ID ${userId} відсутній. Створюємо запис.`);
        user.balanceStore.resetBalance(userId, 0.00);
      }
  
      const balance = user.balanceStore.getBalance(userId); // Викликаємо getBalance через balanceStore
      const transactions = user.balanceStore.getTransactions(userId);
  
      res.json({
        balance,
        transactions,
      });
    } catch (error) {
      console.error('Error fetching balance:', error);
      res.status(500).json({ error: error.message });
    }
  });
//-------------------------------------------------------------------------
// Додавання нової транзакції для конкретного користувача

router.post('/balance-transaction/:userId', (req, res) => {
  const { amount, type, address, system } = req.body; // `address` — email отримувача
  const { userId } = req.params; // ID відправника

  if (!amount || amount <= 0 || !type) {
    return res.status(400).json({ success: false, error: 'Некоректні дані транзакції' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Відсутній токен авторизації' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (Number(decoded.id) !== Number(userId)) {
      return res.status(401).json({ success: false, error: 'Токен не відповідає користувачу' });
    }

    const sender = User.getById(Number(userId));
    if (!sender) {
      return res.status(404).json({ success: false, error: 'Відправник не знайдений' });
    }

    if (type === 'debit') {
      // Перевіряємо, чи існує отримувач
      const recipient = User.getByEmail(address);
      if (!recipient) {
        return res.status(404).json({ success: false, error: 'Отримувач не знайдений' });
      }

      // Перевіряємо, чи у відправника достатньо коштів
      const senderBalance = sender.balanceStore.getBalance(Number(userId));
      if (senderBalance < amount) {
        return res.status(400).json({ success: false, error: 'Недостатньо коштів для переказу' });
      }

      // Списуємо кошти у відправника
      sender.balanceStore.addTransaction(Number(userId), amount, 'debit', address, system);

      // Зараховуємо кошти отримувачу
      recipient.balanceStore.addTransaction(recipient.id, amount, 'credit', userId, system);

      return res.status(201).json({ success: true, message: 'Переказ виконано успішно' });
    } else if (type === 'credit') {
      // Обробка поповнення балансу (існуюча логіка)
      const newTransaction = sender.balanceStore.addTransaction(userId, amount, type, address, system);
      return res.status(201).json({ success: true, transaction: newTransaction });
    }

    return res.status(400).json({ success: false, error: 'Невідомий тип транзакції' });
  } catch (error) {
    console.error("Помилка:", error.message);
    return res.status(401).json({ success: false, error: 'Невалідний токен' });
  }
});


//------------------------------------------------------------
// Отримання транзакції за ID для конкретного користувача
router.get('/transaction/:transactionId', (req, res) => {
  const { userId } = req.query;
  const { transactionId } = req.params;

  console.log('Запит на транзакцію:', { userId, transactionId });

  const user = User.getById(Number(userId)); // Отримуємо користувача
    if (!user) {
      return res.status(404).json({ success: false, error: 'Користувач не знайдений' });
    }

  const transaction = user.balanceStore.getTransactionById(userId, transactionId);
  if (transaction) {
    return res.status(200).json(transaction);
  } else {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }
});
//-----------------------------------------------------------------
// Отримання всіх транзакцій для конкретного користувача
router.get('/transactions', (req, res) => {
  const { userId } = req.query;
  const transactions = balanceStore.getTransactions(userId);
  res.status(200).json({ success: true, transactions });
});

//------------------- Ендпоїнти сповіщень ---------------------

// Отримання всіх сповіщень для конкретного користувача

router.get('/notifications', (req, res) => {
  const { token } = req.headers;

  const user = User.getUserByToken(token);
  if (!user) {
    return res.status(404).json({ error: 'Користувача не знайдено' });
  }

  const notifications = user.notificationStore.getNotifications(user.id);

  if (notifications.length === 0) {
    // Додаємо перший запис про новий вхід
    const firstLoginNotification = {
      type: 'login',
      time: new Date().toISOString(),
      userId: user.id,
    };
    user.notificationStore.addNotification(user.id, firstLoginNotification.type, {});
    notifications.push(firstLoginNotification);
  }

  res.json({ notifications });
});
//-------------------------------------------------------------------
router.post('/notifications', (req, res) => {
  const { token, type, details } = req.body;

  const user = User.getUserByToken(token);
  if (!user) {
    return res.status(404).json({ error: 'Користувача не знайдено' });
  }

  console.log(`Adding notification for user: ${user.id}, type: ${type}`);
  const notification = user.notificationStore.addNotification(user.id, type, details); // Прив'язка до userId
  res.status(201).json({ notification });
});



// Експортуємо глобальний роутер
module.exports = router
