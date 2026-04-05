import React, { useState } from "react";
import { toast } from "react-toastify";

export default function AddTransaction({ setTransactions }) {

  const [form, setForm] = useState({
    date: "",
    amount: "",
    category: "",
    type: "expense"
  });

  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {

    if (!form.date || !form.amount || !form.category) {
      alert("Please fill all fields");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      ...form,
      amount: Number(form.amount)
    };

    setTransactions(prev => [...prev, newTransaction]);

    setForm({
      date: "",
      amount: "",
      category: "",
      type: "expense"
    });

    setShow(false); 
    toast.success("Transaction added ✅");
  };

  return (
    <>
     
      <button className="btn btn-primary fw-bold" onClick={() => setShow(true)}>
        ➕ Add
      </button>

      {show && (
        <div className="custom-modal-backdrop">

          <div className="custom-modal">

            <h4 className="mb-3">Add Transaction</h4>

            <input
              type="date"
              name="date"
              className="form-control mb-2"
              value={form.date}
              onChange={handleChange}
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              className="form-control mb-2"
              value={form.amount}
              onChange={handleChange}
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              className="form-control mb-2"
              value={form.category}
              onChange={handleChange}
            />

            <select
              name="type"
              className="form-control mb-3"
              value={form.type}
              onChange={handleChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <div className="d-flex justify-content-between">
              <button className="btn btn-success" onClick={handleSubmit}>
                Add
              </button>

              <button className="btn btn-secondary" onClick={() => setShow(false)}>
                Cancel
              </button>
            </div>

          </div>

        </div>
      )}
    </>
  );
}