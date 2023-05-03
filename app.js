// Import library yang diperlukan
const express = require('express'); // Import library express
const bodyParser = require('body-parser'); // Import library body-parser
const jwt = require('jsonwebtoken'); // Import library jsonwebtoken

const secretKey = 'secret-key'; // Kunci rahasia untuk JWT


// Inisialisasi aplikasi Express
const app = express();

// Set middleware untuk meng-handle request body dalam bentuk JSON
app.use(bodyParser.json()); 

// Data sederhana sebagai contoh
let todos = [
  { id: 1, text: 'Belajar Express.js' },
  { id: 2, text: 'Buat REST API' },
  { id: 3, text: 'Testing API' }
];

// Route untuk login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'toni' && password === 'toni') {
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1m' });
        res.json({ 
            success: true,
            message: 'Successfully logged in',
            status_code: 200,
            data: token
         });
    } else {
        res.status(401).json({ 
            success: false,
            message: 'Invalid username or password',
            status_code: 401,
            data: null
         });
    }
});

// Middleware untuk memverifikasi token JWT (bearer token)
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.status(403).json({ 
                  success: false,
                  message: 'Invalid token',
                  status_code: 403,
                  data: null
              });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ 
            success: false,
            message: 'Unauthorized',
            status_code: 401,
            data: null
         });
    }
};

// Route untuk mengambil daftar todo
app.get('/todos', verifyToken, (req, res) => {
  res.json({ 
        success: true,
        message: 'Successfully get todo list',
        status_code: 200,
        data: todos
      });
  });

// Route untuk mengambil detail todo berdasarkan ID
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    res.json({ 
        success: true,
        message: 'Successfully get todo detail',
        status_code: 200,
        data: todo
      });
  } else {
    res.status(404).json({ 
        success: false,
        message: 'Todo not found',
        status_code: 404,
        data: null
      });
  }
});

// Route untuk menambahkan todo baru
app.post('/todos', (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    text: req.body.text
  };
  todos.push(newTodo);
  res.json({ 
        success: true,
        message: 'Todo added successfully',
        status_code: 201,
        data: newTodo
      });
});

// Route untuk mengubah todo berdasarkan ID
app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.text = req.body.text;
        res.json({ 
          success: true,
          message: 'Todo updated successfully',
          status_code: 200,
          data: todo
        });
    } else {
        res.status(404).json({ error: 'Todo not found' });
    }
});


// Route untuk menghapus todo berdasarkan ID
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  res.json({ 
        success: false,
        message: 'Todo deleted successfully',
        status_code: 200,
        data: todos
      });
});


// Port yang akan digunakan oleh aplikasi
const port = 3000;

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});


