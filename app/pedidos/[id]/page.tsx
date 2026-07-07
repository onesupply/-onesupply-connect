"use client";

import { useEffect, useState } from "react";

export default function PedidoDetallePage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = window.location.pathname.split("/").pop();

fetch("/api/odoo-orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    cliente: JSON.parse(localStorage.getItem("cliente") || "{}"),
  }),
})
      .then((r) => r.json())
      .then((data) => {
        console.log("DETALLE PEDIDO:", data);
const pedido = (data.orders || []).find((o: any) => String(o.id) === String(id));
setOrder(pedido || null);
        setLoading(false);
      })
      .catch(() => {
        setOrder(null);
        setLoading(false);
      });
  }, []);

  function traducirEstado(estado: string) {
    switch (estado) {
      case "draft":
        return "🟡 Pendiente";
      case "sent":
        return "📨 Enviado";
      case "sale":
        return "🟢 Confirmado";
      case "done":
        return "✅ Entregado";
      case "cancel":
        return "❌ Cancelado";
      default:
        return estado || "-";
    }
  }

  if (loading) {
    return <main style={{ padding: 20, fontFamily: "Arial" }}>Cargando pedido...</main>;
  }

  if (!order) {
    return <main style={{ padding: 20, fontFamily: "Arial" }}>Pedido no encontrado</main>;
  }

  return (
    <main style={{ padding: 20, fontFamily: "Arial", background: "#f4f4f4", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ background: "#2d2d2d", color: "white", borderRadius: 24, padding: 26, marginBottom: 20 }}>
          <h1 style={{ margin: 0, color: "#f1c400" }}>Pedido {order.name}</h1>
          <p style={{ marginTop: 8, color: "#eee" }}>{traducirEstado(order.state)}</p>
        </div>

        <button
          onClick={() => (window.location.href = "/pedidos")}
          style={{ padding: "12px 18px", borderRadius: 12, border: 0, background: "#f1c400", fontWeight: "bold", marginBottom: 20 }}
        >
          ← Volver a mis pedidos
        </button>
        <button
 onClick={() => {
  const nuevoCarrito = (order.lines || []).map((line: any) => ({
    id: Array.isArray(line.product_id) ? line.product_id[0] : line.product_id,
    name: line.name,
    list_price: line.price_unit,
    quantity: line.product_uom_qty || 1,
  }));

  const carritoActual = JSON.parse(
    localStorage.getItem("carritoActual") || "[]"
  );

  if (carritoActual.length === 0) {
    localStorage.setItem(
      "carritoActual",
      JSON.stringify(nuevoCarrito)
    );
    window.location.href = "/productos";
    return;
  }

  const sustituir = window.confirm(
    "Ya tienes productos en el carrito.\n\nAceptar = Sustituir carrito\nCancelar = Añadir productos al carrito"
  );

  if (sustituir) {
    localStorage.setItem(
      "carritoActual",
      JSON.stringify(nuevoCarrito)
    );
  } else {
    const combinado = [...carritoActual];

    nuevoCarrito.forEach((nuevo: any) => {
      const existente = combinado.find(
        (p: any) => p.id === nuevo.id
      );

      if (existente) {
        existente.quantity += nuevo.quantity;
      } else {
        combinado.push(nuevo);
      }
    });

    localStorage.setItem(
      "carritoActual",
      JSON.stringify(combinado)
    );
  }

  window.location.href = "/productos";
}}
>
  🔄 Volver a pedir este pedido
</button>

        <div style={{ background: "white", padding: 22, borderRadius: 20, border: "1px solid #e5e5e5" }}>
          <p>Fecha: {order.date_order}</p>

          {(order.lines || []).map((line: any) => (
            <div key={line.id} style={{ borderTop: "1px solid #eee", padding: "14px 0" }}>
              <strong>{line.name}</strong>
              <p style={{ margin: "6px 0", color: "#666" }}>
                Cantidad: {line.product_uom_qty || "-"}
              </p>
              <p style={{ margin: 0 }}>
                Precio: {Number(line.price_unit || 0).toFixed(2)} €
              </p>
            </div>
          ))}

          <h2 style={{ textAlign: "right" }}>
            Total: {Number(order.amount_total || 0).toFixed(2)} €
          </h2>
        </div>
      </div>
    </main>
  );
}