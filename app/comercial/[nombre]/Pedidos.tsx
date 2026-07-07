"use client";

import { useEffect, useState } from "react";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/odoo-orders")
      .then((r) => r.json())
      .then((data) => {
        setPedidos(data.orders || data.pedidos || []);
      })
      .catch(() => setPedidos([]))
      .finally(() => setLoading(false));
  }, []);

  function estadoColor(state: string) {
    switch (state) {
      case "sale":
        return "#25D366";

      case "draft":
        return "#f1c400";

      case "cancel":
        return "#ff4d4f";

      default:
        return "#1677ff";
    }
  }

  return (
    <section
      style={{
        background: "white",
        borderRadius: 26,
        padding: 24,
        marginTop: 28,
        marginBottom: 40,
        border: "1px solid #e5e5e5",
        boxShadow: "0 8px 22px rgba(0,0,0,.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 22,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            📦 Últimos pedidos
          </h2>

          <p
            style={{
              color: "#666",
              marginTop: 6,
            }}
          >
            Últimos pedidos registrados en Odoo.
          </p>
        </div>

        <div
          style={{
            background: "#f1c400",
            padding: "10px 18px",
            borderRadius: 999,
            fontWeight: "bold",
          }}
        >
          {pedidos.length} pedidos
        </div>
      </div>

      {loading ? (
        <div
          style={{
            padding: 30,
            textAlign: "center",
            color: "#777",
          }}
        >
          Cargando pedidos...
        </div>
      ) : pedidos.length === 0 ? (
        <div
          style={{
            padding: 30,
            textAlign: "center",
            color: "#777",
          }}
        >
          No hay pedidos.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 14,
          }}
        >
          {pedidos.slice(0, 20).map((pedido) => (
            <div
              key={pedido.id}
              style={{
                border: "1px solid #ececec",
                borderRadius: 18,
                padding: 18,
                background: "#fafafa",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <strong
                    style={{
                      fontSize: 18,
                    }}
                  >
                    {pedido.name}
                  </strong>

                  <div
                    style={{
                      marginTop: 8,
                      color: "#666",
                      lineHeight: "26px",
                    }}
                  >
                    👤{" "}
                    {pedido.partner_id?.[1] ||
                      pedido.cliente ||
                      "-"}

                    <br />

                    📅{" "}
                    {pedido.date_order
                      ? new Date(
                          pedido.date_order
                        ).toLocaleDateString("es-ES")
                      : "-"}

                    <br />

                    💶{" "}
                    {Number(
                      pedido.amount_total || 0
                    ).toFixed(2)}{" "}
                    €
                  </div>
                </div>

                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: estadoColor(
                      pedido.state
                    ),
                    color: "white",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {pedido.state || "Pendiente"}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 18,
                  flexWrap: "wrap",
                }}
              >
                <button
                  style={yellowBtn}
                  onClick={() =>
                    window.open(
                      `/pedido/${pedido.name.replace(
                        "S00",
                        ""
                      )}`,
                      "_blank"
                    )
                  }
                >
                  👁️ Ver pedido
                </button>

                <button
                  style={whiteBtn}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      pedido.name
                    );

                    alert(
                      "Número de pedido copiado."
                    );
                  }}
                >
                  📋 Copiar nº
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const yellowBtn = {
  padding: "12px 18px",
  borderRadius: 13,
  border: 0,
  background: "#f1c400",
  fontWeight: "bold",
  cursor: "pointer",
};

const whiteBtn = {
  padding: "12px 18px",
  borderRadius: 13,
  border: "1px solid #ddd",
  background: "white",
  fontWeight: "bold",
  cursor: "pointer",
};