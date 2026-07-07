export default function ClienteCard({ cliente }: { cliente: any }) {
  if (!cliente) return null;

  return (
    <div
      style={{
        background: "white",
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        border: "1px solid #e5e5e5",
      }}
    >
      <p style={{ margin: 0, color: "#777", fontSize: 14 }}>
        Cliente seleccionado
      </p>

      <h2 style={{ margin: "8px 0 12px", fontSize: 22 }}>
        {cliente.name}
      </h2>

      <button
        onClick={() => {
          localStorage.removeItem("cliente");
          window.location.href = "/";
        }}
        style={{
          padding: "11px 16px",
          borderRadius: 12,
          border: 0,
          background: "#f1c400",
          fontWeight: "bold",
        }}
      >
        Cambiar cliente
      </button>
    </div>
  );
}