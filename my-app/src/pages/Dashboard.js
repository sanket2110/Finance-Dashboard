import React from "react";
import SummaryCards from "../components/SummaryCards";
import TransactionsTable from "../components/TransactionsTable";
import RoleSwitcher from "../components/RoleSwitcher";
import Insights from "../components/Insights";
import AddTransaction from "../components/AddTransaction";
import ThemeToggle from "../components/ThemeToggle";
import { useEffect, useState } from "react";
import Charts from "../components/Charts";

export default function Dashboard({
  transactions,
  setTransactions,
  role,
  setRole,
  theme,
  setTheme,
  hideAmounts,
  setHideAmounts
}) {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <div className={`sticky-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-left">
          <h2 className="nav-title">💰 Finance Dashboard</h2>
        </div>
        <div className="nav-right">
          <RoleSwitcher role={role} setRole={setRole} />

          {role === "admin" && (
            <AddTransaction setTransactions={setTransactions} />
          )}
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button
            className="btn hide-btn fw-bold"
            onClick={() => setHideAmounts(!hideAmounts)}
          >
            {hideAmounts ? "👁️ Show" : "🙈 Hide"}
          </button>
        </div>
      </div>
      <div className="dashboard-content">

        <SummaryCards
          balance={balance}
          income={income}
          expense={expense}
          hideAmounts={hideAmounts}
        />

        <Charts transactions={transactions} theme={theme} />
        <Insights transactions={transactions} />

        <TransactionsTable
          transactions={transactions}
          setTransactions={setTransactions}
          role={role}
          hideAmounts={hideAmounts}
        />

      </div>
    </>
  );
}