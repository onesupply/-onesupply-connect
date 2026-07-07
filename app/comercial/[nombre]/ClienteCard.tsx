"use client";

type Props = {
  cliente: any;
  onSelect: (cliente: any) => void;
};

export default function ClienteCard({ cliente, onSelect }: Props) {
  function abrirFicha(e: React.MouseEvent) {
    e.stopPropagation();
    onSelect(cliente);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function crearPedido(e: React.MouseEvent) {
    e.stopPropagation();
    localStorage.setItem("cliente", JSON.stringify(cliente));
    window.location.href = "/productos";
  }

  function llamar(e: React.MouseEvent) {
    e.stopPropagation();
    const telefono = cliente.mobile || cliente.phone;
    if (!telefono) return;
    window.location.href = `tel:${telefono}`;
  }

  function whatsapp(e: React.MouseEvent) {
    e.stopPropagation();
    const telefono = cliente.mobile || cliente.phone;
    if (!telefono) return;
    const limpio = String(telefono).replace(/\D/g, "");
    window.open(`https://wa.me/34${limpio}`, "_blank");
  }

  function email(e: React.MouseEvent) {
    e.stopPropagation();
    if (!cliente.email) return;
    window.location.href = `mailto:${cliente.email}`;
  }

  return (
    <div onClick={abrirFicha} style={card}>
      <div>
        <h3 style={title}>{cliente.name}</h3>

        <div style={info}>
          <div>📞 {cliente.mobile || cliente.phone || "Sin teléfono"}</div>
          <div>📍 {cliente.city || "Sin ciudad"}</div>
          <div>✉️ {cliente.email || "Sin email"}</div>
        </div>
      </div>

      <div>
        <div style={buttonGrid}>
          <button onClick={crearPedido} style={yellowBtn}>
            🛒 Pedido
          </button>

          <button onClick={abrirFicha} style={darkBtn}>
            🔗 Activar
          </button>

          <button onClick={llamar} style={iconButton}>📞</button>
          <button onClick={whatsapp} style={iconButton}>💬</button>
          <button onClick={email} style={iconButton}>📧</button>
        </div>

        <button onClick={abrirFicha} style={viewBtn}>
          👁️ Ver ficha
        </button>
      </div>
    </div>
  );
}

const card = {
  background: "white",
  borderRadius: 22,
  border: "1px solid #e8e8e8",
  padding: 18,
  cursor: "pointer",
  transition: ".2s",
  boxShadow: "0 5px 15px rgba(0,0,0,.05)",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "space-between",
  minHeight: 345,
};

const title = {
  marginTop: 0,
  marginBottom: 12,
  fontSize: 20,
  minHeight: 52,
};

const info = {
  color: "#666",
  lineHeight: "26px",
  fontSize: 15,
  minHeight: 86,
};

const buttonGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 46px 46px 46px",
  gap: 8,
  marginTop: 18,
  alignItems: "center",
};

const yellowBtn = {
  padding: "12px",
  border: 0,
  borderRadius: 12,
  background: "#f1c400",
  fontWeight: "bold",
  cursor: "pointer",
};

const darkBtn = {
  padding: "12px",
  border: 0,
  borderRadius: 12,
  background: "#2d2d2d",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const iconButton = {
  width: 46,
  height: 46,
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
  fontSize: 20,
};

const viewBtn = {
  marginTop: 14,
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #1677ff",
  background: "white",
  color: "#1677ff",
  fontWeight: "bold",
  cursor: "pointer",
  width: "100%",
};