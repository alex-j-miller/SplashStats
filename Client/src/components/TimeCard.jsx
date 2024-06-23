export default function TimeCard({ swimmer }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        background: "#CDE8E5",
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
      }}
    >
      <strong style={{ marginLeft: 10, marginRight: 20, color: "#000" }}>
        {swimmer.swimmer_name}
      </strong>
      <p style={{ marginRight: 20, color: "#000" }}>{swimmer.event}</p>
      <strong style={{ marginRight: 20, color: "#000" }}>{swimmer.time}</strong>
    </div>
  );
}
