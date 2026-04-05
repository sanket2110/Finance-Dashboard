export default function SummaryCards({ balance, income, expense, hideAmounts }) {
  return (
    <div className="row summary-row my-4">
      <div className="col-4 col-sm-4 col-md-4">
        <div className="card summary-card p-3 shadow">
          <h5>Balance</h5>
          <h3>
            {hideAmounts ? "••••" : `₹${balance}`}
          </h3>
        </div>
      </div>
      <div className="col-4 col-sm-4 col-md-4">
        <div className="card summary-card p-3 shadow">
          <h5>Income</h5>
          <h3 className="text-success">
            {hideAmounts ? "••••" : `₹${income}`}
          </h3>
        </div>
      </div>
      <div className="col-4 col-sm-4 col-md-4">
        <div className="card summary-card p-3 shadow">
          <h5>Expenses</h5>
          <h3 className="text-danger">
            {hideAmounts ? "••••" : `₹${expense}`}
          </h3>
        </div>
      </div>

    </div>
  );
}