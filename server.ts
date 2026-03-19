import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


console.log(process.env.DB_HOST)
console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)

// Configuração do Pool para MySQL (compatível com PHPMyAdmin)
const pool = mysql.createPool((process.env.DATABASE_URL ? process.env.DATABASE_URL : {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kixikila_db',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
}) as any);



async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Kixikila Digital Backend (MySQL) is running' });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { identifier, password } = req.body;
    try {
      const [rows]: any = await pool.query(
        'SELECT * FROM users WHERE email = ? OR phone = ?',
        [identifier, identifier]
      );

      if (rows.length === 0) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
      
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          balance: user.balance,
          type: user.type 
        } 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  });

  app.post('/api/auth/signup', async (req, res) => {
    const { 
      name, email, phone, password, pin, type,
      bi_number, birth_date, gender, nationality, emission_date,
      address, municipality, province,
      profession, workplace, service_time, monthly_income,
      bank, account_number, payment_method, company_type
    } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const hashedPin = await bcrypt.hash(pin, 10);

      const [result]: any = await pool.query(
        `INSERT INTO users (
          name, email, phone, password, pin, type,
          bi_number, birth_date, gender, nationality, emission_date,
          address, municipality, province,
          profession, workplace, service_time, monthly_income,
          bank, account_number, payment_method, company_type, balance
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
        [
          name, email, phone, hashedPassword, hashedPin, type,
          bi_number, birth_date, gender, nationality, emission_date,
          address, municipality, province,
          profession, workplace, service_time, monthly_income,
          bank, account_number, payment_method, company_type
        ]
      );

      res.status(201).json({ message: 'Usuário criado com sucesso', id: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  });

  app.post('/api/transactions/deposit', async (req, res) => {
    const { userId, amount, method } = req.body;
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      await connection.query(
        'UPDATE users SET balance = balance + ? WHERE id = ?',
        [amount, userId]
      );

      await connection.query(
        'INSERT INTO transactions (user_id, amount, type, method, status) VALUES (?, ?, ?, ?, ?)',
        [userId, amount, 'deposit', method, 'completed']
      );

      await connection.commit();
      res.json({ message: 'Depósito realizado com sucesso' });
    } catch (err) {
      await connection.rollback();
      console.error(err);
      res.status(500).json({ error: 'Erro ao processar depósito' });
    } finally {
      connection.release();
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kixikila Digital Server (MySQL) running on http://localhost:${PORT}`);
  });
}

async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        pin VARCHAR(255) NOT NULL,
        type VARCHAR(20) NOT NULL,
        bi_number VARCHAR(20),
        birth_date DATE,
        gender VARCHAR(20),
        nationality VARCHAR(50),
        emission_date DATE,
        address TEXT,
        municipality VARCHAR(100),
        province VARCHAR(100),
        profession VARCHAR(100),
        workplace VARCHAR(255),
        service_time INTEGER,
        monthly_income DECIMAL(15, 2),
        bank VARCHAR(100),
        account_number VARCHAR(50),
        payment_method VARCHAR(50),
        company_type VARCHAR(100),
        balance DECIMAL(15, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        amount DECIMAL(15, 2) NOT NULL,
        type VARCHAR(20) NOT NULL,
        method VARCHAR(50),
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('Database tables initialized (MySQL)');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

initDb().then(() => startServer());
