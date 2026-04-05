import { useState } from "react";
import { toast } from "react-toastify";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { TbArrowsSort } from "react-icons/tb";
import { BiSortDown, BiSortUp } from "react-icons/bi";

export default function TransactionsTable({ transactions, setTransactions, role, hideAmounts }) {

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); 
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  let filtered = transactions.filter(t => {
    return (
      t.category.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter ? t.category === categoryFilter : true) &&
      (typeFilter ? t.type === typeFilter : true) &&
      (dateFilter ? t.date === dateFilter : true)
    );
  });
  if (sortField) {
    filtered.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === "amount") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      if (sortField === "date") {
        return sortOrder === "asc"
          ? new Date(valA) - new Date(valB)
          : new Date(valB) - new Date(valA);
      }
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));

    toast.error("Transaction deleted ❌");
  };

  const handleEdit = (t) => {
    setEditData({ ...t });
    setShowEdit(true);
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const saveEdit = () => {
    const updated = transactions.map(t =>
      t.id === editData.id
        ? { ...editData, amount: Number(editData.amount) }
        : t
    );

    setTransactions(updated);
    setShowEdit(false);
    toast.info("Transaction updated ✏️");
  };

  const categories = [...new Set(transactions.map(t => t.category))];
  const exportToCSV = () => {
    const headers = ["Date", "Category", "Amount", "Type"];

    const rows = transactions.map(t => [
      `="${t.date}"`,   
      t.category,
      t.amount,
      t.type
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map(e => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);

    link.click();
  };

  const exportToJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(transactions, null, 2));

    const link = document.createElement("a");

    link.setAttribute("href", dataStr);
    link.setAttribute("download", "transactions.json");
    document.body.appendChild(link);

    link.click();
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  return (
    <div className="card p-4 shadow mt-4 fade-in">

      <h4 className="mb-3 card-title">Transactions</h4>
      <div className="filter-bar mb-3">

        <div className="filter-item">
          <input
            className="form-control"
            placeholder="🔍 Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <select
            className="form-select"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <select
            className="form-select"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="filter-item">
          <input
            type="date"
            className="form-control"
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

      </div>
      <div className="export-actions mb-3">

        <button
          className="export-btn export-csv"
          onClick={exportToCSV}
        >
          ⬇️ CSV
        </button>

        <button
          className="export-btn export-json"
          onClick={exportToJSON}
        >
          ⬇️ JSON
        </button>

      </div>
    <div className="table-container">
      <table className="table custom-table">
        <thead>
          <tr>

            <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>
              Date{" "}
              {sortField === "date" ? (
                sortOrder === "asc" ? <BiSortUp /> : <BiSortDown />
              ) : (
               <TbArrowsSort/>
              )}
            </th>

            <th onClick={() => handleSort("category")} style={{ cursor: "pointer" }}>
              Category{" "}
              {sortField === "category" ? (
                sortOrder === "asc" ? <BiSortUp /> : <BiSortDown />
              ) : (
                <TbArrowsSort/>
              )}
            </th>

            <th onClick={() => handleSort("amount")} style={{ cursor: "pointer" }}>
              Amount{" "}
              {sortField === "amount" ? (
                sortOrder === "asc" ? <BiSortUp /> : <BiSortDown />
              ) : (
                <TbArrowsSort/>
              )}
            </th>

            <th>Type</th>

            {role === "admin" && <th>Action</th>}

          </tr>
        </thead>

        <tbody>
          {filtered.map(t => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.category}</td>
              <td>
                {hideAmounts ? "••••" : `₹${t.amount}`}
              </td>
              <td>{t.type}</td>

              {role === "admin" && (
                <td className="d-flex gap-2">

                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(t)}
                  >
                    ✏️
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteTransaction(t.id)}
                  >
                    ❌
                  </button>

                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      

      {filtered.length === 0 && (
        <p className="text-center mt-3">No transactions found</p>
      )}

      {showEdit && (
        <div className="custom-modal-backdrop">

          <div className="custom-modal">

            <h4 className="mb-3">Edit Transaction</h4>

            <input
              type="date"
              name="date"
              className="form-control mb-2"
              value={editData.date}
              onChange={handleChange}
            />

            <input
              type="number"
              name="amount"
              className="form-control mb-2"
              value={editData.amount}
              onChange={handleChange}
            />

            <input
              type="text"
              name="category"
              className="form-control mb-2"
              value={editData.category}
              onChange={handleChange}
            />

            <select
              name="type"
              className="form-control mb-3"
              value={editData.type}
              onChange={handleChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <div className="d-flex justify-content-between">

              <button className="btn btn-success" onClick={saveEdit}>
                Save
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setShowEdit(false)}
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}