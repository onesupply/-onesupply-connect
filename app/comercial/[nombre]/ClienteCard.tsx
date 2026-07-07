"use client";

type Props = {
  cliente: any;
  onSelect: (cliente: any) => void;
};

export default function ClienteCard({
  cliente,
  onSelect,
}: Props) {

  function crearPedido(e: React.MouseEvent) {
    e.stopPropagation();

    localStorage.setItem(
      "cliente",
      JSON.stringify(cliente)
    );

    window.location.href = "/productos";
  }

  function llamar(e: React.MouseEvent) {
    e.stopPropagation();

    const telefono =
      cliente.mobile || cliente.phone;

    if (!telefono) return;

    window.location.href = `tel:${telefono}`;
  }

  function whatsapp(e: React.MouseEvent) {
    e.stopPropagation();

    const telefono =
      cliente.mobile || cliente.phone;

    if (!telefono) return;

    const limpio = telefono.replace(/\D/g, "");

    window.open(
      `https://wa.me/34${limpio}`,
      "_blank"
    );
  }

  function email(e: React.MouseEvent) {
    e.stopPropagation();

    if (!cliente.email) return;

    window.location.href = `mailto:${cliente.email}`;
  }

  return (
    <div
      onClick={() => onSelect(cliente)}
      style={{
        background: "white",
        borderRadius: 22,
        border: "1px solid #e8e8e8",
        padding: 18,
        cursor: "pointer",
        transition: ".2s",
        boxShadow:
          "0 5px 15px rgba(0,0,0,.05)",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: 12,
          fontSize: 20,
        }}
      >
        {cliente.name}
      </h3>

      <div
        style={{
          color: "#666",
          lineHeight: "26px",
          fontSize: 15,
        }}
      >
        {cliente.mobile || cliente.phone ? (
          <div>
            📞 {cliente.mobile || cliente.phone}
          </div>
        ) : null}

        {cliente.city ? (
          <div>
            📍 {cliente.city}
          </div>
        ) : null}

        {cliente.email ? (
          <div>
            ✉️ {cliente.email}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 18,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={crearPedido}
          style={{
            flex: 1,
            padding: "12px",
            border: 0,
            borderRadius: 12,
            background: "#f1c400",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🛒 Pedido
        </button>

        <button
          onClick={llamar}
          style={iconButton}
        >
          📞
        </button>

        <button
          onClick={whatsapp}
          style={iconButton}
        >
          💬
        </button>

        <button
          onClick={email}
          style={iconButton}
        >
          📧
        </button>
      </div>

      <div
        style={{
          marginTop: 16,
          color: "#1677ff",
          fontWeight: "bold",
          fontSize: 15,
        }}
      >
        Ver ficha →
      </div>
    </div>
  );
}

const iconButton = {
  width: 46,
  height: 46,
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
  fontSize: 20,
};