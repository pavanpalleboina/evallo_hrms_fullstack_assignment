const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const port = 4040;

app.use(cors());

app.use(bodyParser.json());

const JWT_SECRET = 'management_companies_employees_teams_info';

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Pavan@960",
  database: "ManagementDB",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Register User API
app.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO Users (name, email, phone, password) VALUES (?, ?, ?, ?)',
      [name, email, phone, hashedPassword]
    );
    res.status(201).json({ id: result.insertId, name, email, phone });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login API
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auth middleware to protect routes
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

app.use('/employees', authMiddleware);
app.use('/organizations', authMiddleware);
app.use('/teams', authMiddleware);

// Create organization
app.post('/organizations', async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await pool.query(`INSERT INTO organizations(name) VALUES (?);`, [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read all organizations
app.get('/organizations', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Organizations');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read organization by id
app.get('/organizations/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM Organizations WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Organization not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update organization
app.put('/organizations/:id', async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  try {
    const [result] = await pool.query('UPDATE Organizations SET name = ? WHERE id = ?', [name, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Organization not found' });
    res.json({ id, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete organization
app.delete('/organizations/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM Organizations WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Organization not found' });
    res.json({ message: 'Organization deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Create employee
app.post('/employees', async (req, res) => {
  const { name, email, organization_id } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO Employees (name, email, organization_id) VALUES (?, ?, ?)', [name, email, organization_id]);
    res.status(201).json({ id: result.insertId, name, email, organization_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read all employees
app.get('/employees', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Employees');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read employee by id
app.get('/employees/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM Employees WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Employee not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update employee
app.put('/employees/:id', async (req, res) => {
  const id = req.params.id;
  const { name, email, organization_id } = req.body;
  try {
    const [result] = await pool.query('UPDATE Employees SET name = ?, email = ?, organization_id = ? WHERE id = ?', [name, email, organization_id, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Employee not found' });
    res.json({ id, name, email, organization_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete employee
app.delete('/employees/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM Employees WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Create team
app.post('/teams', async (req, res) => {
  const { organization_id, name, description } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO Teams (organization_id, name, description) VALUES (?, ?, ?)', [organization_id, name, description]);
    res.status(201).json({ id: result.insertId, organization_id, name, description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read all teams
app.get('/teams', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Teams');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read team by id
app.get('/teams/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM Teams WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Team not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update team
app.put('/teams/:id', async (req, res) => {
  const id = req.params.id;
  const { organization_id, name, description } = req.body;
  try {
    const [result] = await pool.query('UPDATE Teams SET organization_id = ?, name = ?, description = ? WHERE id = ?', [organization_id, name, description, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Team not found' });
    res.json({ id, organization_id, name, description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete team
app.delete('/teams/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM Teams WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Team not found' });
    res.json({ message: 'Team deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create EmployeeTeams entry (assign employee to a team)
app.post('/employeeteams', async (req, res) => {
  const { employee_id, team_id } = req.body;
  if (!employee_id || !team_id) {
    return res.status(400).json({ error: 'employee_id and team_id are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO EmployeeTeams (employee_id, team_id) VALUES (?, ?)', 
      [employee_id, team_id]
    );
    res.status(201).json({ id: result.insertId, employee_id, team_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app; 
