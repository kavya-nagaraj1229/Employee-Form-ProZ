
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "formdb",
  dateStrings: true
});

db.connect((err) => {
  if (err) console.log("MySQL Connection Error 👉", err);
  else console.log("MySQL Connected");
});


app.post("/employees", (req, res) => {
  const {
    empId, firstName, lastName, gender, dob, email, mobile,
    state, city, address, designation, doj, skills, aadhar, pan
  } = req.body;

  const sql = `INSERT INTO employees
    (empId, firstName, lastName, gender, dob, email, mobile,
     state, city, address, designation, doj, skills, aadhar, pan)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  db.query(
    sql,
    [
      empId,
      firstName,
      lastName,
      gender || null,
      dob || null,
      email,
      mobile,
      state,
      city,
      address,
      designation,
      doj || null,
      JSON.stringify(skills || []),
      aadhar || null,
      pan || null
    ],
    (err) => {
      if (err) {
        console.log("MYSQL ERROR 👉", err);
        return res.status(500).json(err);
      }
      res.status(201).json({ message: "Employee Added Successfully" });
    }
  );
});

app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.put("/employees/:empId", (req, res) => {
  const { empId } = req.params;
  const data = req.body;

  const sql = `UPDATE employees SET 
    firstName=?, lastName=?, gender=?, dob=?, email=?, mobile=?,
    state=?, city=?, address=?, designation=?, doj=?, skills=?,
    aadhar=?, pan=? WHERE empId=?`;

  db.query(
    sql,
    [
      data.firstName,
      data.lastName,
      data.gender || null,
      data.dob || null,
      data.email,
      data.mobile,
      data.state,
      data.city,
      data.address,
      data.designation,
      data.doj || null,
      JSON.stringify(data.skills || []),
      data.aadhar || null,
      data.pan || null,
      empId
    ],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Employee Updated Successfully" });
    }
  );
});

app.delete("/employees/:empId", (req, res) => {
  const { empId } = req.params;
  db.query("DELETE FROM employees WHERE empId=?", [empId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Employee Not Found" });
    res.json({ message: "Employee Deleted Successfully" });
  });
});

app.get("/designations", (req, res) => {
  db.query("SELECT * FROM designations", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/designations", (req, res) => {
  const { name, description } = req.body;
  const sql = "INSERT INTO designations (name, description) VALUES (?, ?)";
  db.query(sql, [name, description], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Designation Added" });
  });
});

app.put("/designations/:id", (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const sql = "UPDATE designations SET name=?, description=? WHERE id=?";
  db.query(sql, [name, description, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Designation Updated" });
  });
});

app.delete("/designations/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM designations WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Designation Deleted" });
  });
});

app.get("/task", (req, res) => {
  db.query("SELECT * FROM task", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/task", (req, res) => {
  const { title, description, taskDate } = req.body;
  const sql = "INSERT INTO task (title, description, taskDate) VALUES (?, ?, ?)";
  db.query(sql, [title, description, taskDate || null], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Task Added" });
  });
});

app.put("/task/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, taskDate } = req.body;
  const sql = "UPDATE task SET title=?, description=?, taskDate=? WHERE id=?";
  db.query(sql, [title, description, taskDate || null, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Task Updated" });
  });
});

app.delete("/task/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM task WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Task Deleted" });
  });
});

app.get("/status", (req, res) => {
  db.query("SELECT * FROM status", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/status", (req, res) => {
  const { name, description } = req.body;
  const sql = "INSERT INTO status (name, description) VALUES (?, ?)";
  db.query(sql, [name, description], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Status Added" });
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "All fields required" });

  const sql = "SELECT * FROM users WHERE username=? AND password=?";
  db.query(sql, [username, password], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length > 0) res.json({ message: "Login successful" });
    else res.status(401).json({ message: "Invalid username or password" });
  });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
