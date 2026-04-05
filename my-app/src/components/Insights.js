export default function Insights({ transactions }) {

  if (!transactions || transactions.length === 0) {
    return (
      <div className="card p-4 mt-4 text-center shadow">
        <h4 className="card-title">💡 Insights</h4>
        <p>No data available. Add transactions to see insights.</p>
      </div>
    );
  }

  const expenses = transactions.filter(t => t.type === "expense");

  const categoryTotal = {};

  expenses.forEach(t => {
    categoryTotal[t.category] = (categoryTotal[t.category] || 0) + t.amount;
  });

  let highest = "None";
  let max = 0;

  for (let cat in categoryTotal) {
    if (categoryTotal[cat] > max) {
      max = categoryTotal[cat];
      highest = cat;
    }
  }

  const today = new Date();

  const currentWeek = [];
  const lastWeek = [];

  transactions.forEach(t => {
    const tDate = new Date(t.date);
    const diff = (today - tDate) / (1000 * 60 * 60 * 24);

    if (diff <= 7) currentWeek.push(t);
    else if (diff <= 14) lastWeek.push(t);
  });

  const getExpense = (arr) =>
    arr.reduce((sum, t) => {
      return t.type === "expense" ? sum + t.amount : sum;
    }, 0);

  const currentExpense = getExpense(currentWeek);
  const lastExpense = getExpense(lastWeek);

  let comparisonText = "No change compared to last week";

  if (currentExpense > lastExpense) {
    comparisonText = `You spent ₹${currentExpense - lastExpense} more than last week 📈`;
  } else if (currentExpense < lastExpense) {
    comparisonText = `You saved ₹${lastExpense - currentExpense} compared to last week 📉`;
  }

  const totalBalance = transactions.reduce((sum, t) => {
    return t.type === "income"
      ? sum + t.amount
      : sum - t.amount;
  }, 0);

  const trendText =
    totalBalance >= 0
      ? "Your balance is positive 💰"
      : "Expenses are higher than income ⚠️";

  return (
    <div className="card p-4 mt-4 shadow fade-in">

      <h4 className="mb-3 card-title">💡 Insights</h4>

      <ul className="list-group list-group-flush">

        <li className="list-group-item">
          🔝 Highest Spending Category: <strong>{highest}</strong>
        </li>

        <li className="list-group-item">
          📊 {comparisonText}
        </li>

        <li className="list-group-item">
          💰 {trendText}
        </li>

      </ul>

    </div>
  );
}