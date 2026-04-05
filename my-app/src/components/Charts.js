import React, { useState } from "react";
import CustomTooltip from "./CustomTooltip";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function Charts({ transactions, theme }) {

  const [typeFilter, setTypeFilter] = useState("both"); 
  const [timeFilter, setTimeFilter] = useState("all"); 

  const filterByTime = (data) => {
    if (timeFilter === "all") return data;

    const days = Number(timeFilter);
    const today = new Date();

    return data.filter(t => {
      const tDate = new Date(t.date);
      const diff = (today - tDate) / (1000 * 60 * 60 * 24);
      return diff <= days;
    });
  };

  let filteredData = filterByTime(transactions);

  if (typeFilter !== "both") {
    filteredData = filteredData.filter(t => t.type === typeFilter);
  }

  const timeMap = {};

  filteredData.forEach(t => {
    if (!timeMap[t.date]) timeMap[t.date] = 0;

    if (t.type === "expense") {
      timeMap[t.date] -= t.amount;
    } else {
      timeMap[t.date] += t.amount;
    }
  });

  const lineData = Object.keys(timeMap)
    .sort()
    .map(date => ({
      date,
      amount: timeMap[date]
    }));

  const categoryMap = {};

  filteredData.forEach(t => {
    if (!categoryMap[t.category]) {
      categoryMap[t.category] = 0;
    }
    categoryMap[t.category] += t.amount;
  });

  const pieData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat]
  }));

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AA336A",
    "#8884d8"
  ];

  return (
    <div className="card p-4 mt-4 shadow">

      <h4 className="mb-3 card-title">📊 Analytics</h4>

      <div className="d-flex justify-content-between flex-wrap mb-3 gap-2">

        <div className="btn-group time-filter-group">
          <button
            className={`btn ${typeFilter === "both" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setTypeFilter("both")}
          >
            Both
          </button>

          <button
            className={`btn ${typeFilter === "income" ? "btn-success" : "btn-outline-success"}`}
            onClick={() => setTypeFilter("income")}
          >
            Income
          </button>

          <button
            className={`btn ${typeFilter === "expense" ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => setTypeFilter("expense")}
          >
            Expense
          </button>
        </div>

        <div className="btn-group time-filter-group">
          <button
            className={`btn ${timeFilter === "7" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setTimeFilter("7")}
          >
            7D
          </button>

          <button
            className={`btn ${timeFilter === "30" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setTimeFilter("30")}
          >
            30D
          </button>

          <button
            className={`btn ${timeFilter === "all" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setTimeFilter("all")}
          >
            All
          </button>
        </div>

      </div>

      <div className="row">

        <div className="col-md-6 mb-3">
          <h6>
            {typeFilter === "income"
              ? "Income trend"
              : typeFilter === "expense"
                ? "Expense trend"
                : "Balance trend"}
          </h6>
          {lineData.length === 0 ? (
            <p className="text-center">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip theme={theme} />} />
                <Line type="monotone" dataKey="amount" stroke="#007bff" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <h6>
            {typeFilter === "income"
              ? "Income Breakdown"
              : typeFilter === "expense"
                ? "Expense Breakdown"
                : "Category Breakdown"}
          </h6>

          {pieData.length === 0 ? (
            <p className="text-center">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip content={<CustomTooltip theme={theme} />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

    </div>
  );
}