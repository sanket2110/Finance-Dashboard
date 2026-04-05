export default function CustomTooltip({ active, payload, label, theme }) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: theme === "dark" ? "#1e1e1e" : "#fff",
          color: theme === "dark" ? "#fff" : "#000",
          padding: "8px 12px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          fontSize: "13px"
        }}
      >
        <p style={{ margin: 0 }}><strong>{label}</strong></p>
        <p style={{ margin: 0 }}>
          ₹{payload[0].value}
        </p>
      </div>
    );
  }

  return null;
}