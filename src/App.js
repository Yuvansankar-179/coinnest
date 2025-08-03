import React, { useState, useEffect } from "react";
import "./App.css";
import { auth, db } from "./firebase";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where
} from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ amount: "", notes: "", category: "food", id: null });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "expenses"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setExpenses(data);
    });
    return unsub;
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      amount: parseFloat(form.amount),
      notes: form.notes,
      category: form.category,
      uid: user.uid
    };

    if (form.id) {
      const ref = doc(db, "expenses", form.id);
      await updateDoc(ref, data);
    } else {
      await addDoc(collection(db, "expenses"), data);
    }

    setForm({ amount: "", notes: "", category: "food", id: null });
  };

  const handleEdit = (exp) => setForm(exp);
  const handleDelete = async (id) => await deleteDoc(doc(db, "expenses", id));
  const login = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  const COLORS = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#1A535C", "#FF9F1C", "#2E86AB"];

  if (!user) {
    return (
      <div className="container" style={{ textAlign: "center" }}>
        <h1>Spend Tracker</h1>
        <button onClick={login} className="login">Sign in with Google</button>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h2>Welcome, {user.displayName}</h2>
        <button onClick={logout} className="logout">Logout</button>
      </header>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="food">Food</option>
          <option value="entertainment">Entertainment</option>
          <option value="education">Education</option>
          <option value="debit">Debit</option>
        </select>
        <button type="submit">{form.id ? "Update" : "Add"} Expense</button>
      </form>

      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            <div>
              <p><strong>₹{exp.amount}</strong> - {exp.category}</p>
              <p>{exp.notes}</p>
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(exp)}>Edit</button>
              <button onClick={() => handleDelete(exp.id)} className="delete">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* 📱 Responsive Chart Section */}
      <div style={{
        marginTop: "40px",
        width: "100%",
        maxWidth: "700px",
        marginInline: "auto",
        padding: "0 10px",
      }}>
        <h3 style={{ fontSize: "1.5rem", textAlign: "center", marginBottom: "20px" }}>
          Expense Breakdown by Category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              paddingAngle={4}
              cornerRadius={10}
              label={({ name, value, percent }) =>
                `${name} ₹${value} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${value}`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
