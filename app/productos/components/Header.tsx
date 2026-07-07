export default function Header() {
  return (
    <div
      style={{
        background: "#2d2d2d",
        color: "white",
        borderRadius: 22,
        padding: 24,
        marginBottom: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 30,
            color: "#f1c400",
          }}
        >
          OneSupply Connect
        </h1>

        <p
          style={{
            marginTop: 8,
            color: "#ddd",
            fontSize: 16,
          }}
        >
          Gestión comercial conectada con Odoo
        </p>
      </div>

      <div
        style={{
          fontSize: 42,
        }}
      >
        📦
      </div>
    </div>
  );
}