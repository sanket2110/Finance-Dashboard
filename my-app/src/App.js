import React, { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import { transactionsData } from "./data/data";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : transactionsData;
  });
  const [hideAmounts, setHideAmounts] = useState(false);
  const [role, setRole] = useState("viewer");
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="container py-4">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme={theme === "dark" ? "dark" : "light"} 
      />
      <Dashboard
        transactions={transactions}
        setTransactions={setTransactions}
        role={role}
        setRole={setRole}
        theme={theme}
        setTheme={setTheme}
        hideAmounts={hideAmounts}
        setHideAmounts={setHideAmounts}
      />
    </div>
  );
}

export default App;


