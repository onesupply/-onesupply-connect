"use client";

import { useEffect, useState } from "react";

export default function PedidosPage() {
  const [cliente, setCliente] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const clienteGuardado = localStorage.getItem("cliente");

    if (!clienteGuardado) {
      window.location.href = "/";
      return;
    }

    const clienteParsed = JSON.parse(clienteGuardado);
    setCliente(clienteParsed);
    cargarPedidos(clienteParsed);
  }, []);

  async function cargarPedidos(clienteActual: any) {
    setLoading(true);

    const res = await fetch("/api/odoo-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cliente: clienteActual }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.ok) setOrders(data.orders || []);
    else alert(data.error || "Error cargando pedidos");
  }

  function repetirPedido(order: any) {
    const cart = (order.lines || []).map((line: any) => ({
      id: Array.isArray(line.product_id) ? line.product_id[0] : line.product_id,
      name: line.name,
      quantity: line.product_uom_qty,
      list_price: line.price_unit,
    }));

    localStorage.setItem("carritoActual", JSON.stringify(cart));
    window.location.href = "/productos";
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f4f4f4", fontFamily: "Arial", padding: 20 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ background: "#2d2d2d", color: "white", borderRadius: 24, padding: 26, marginBottom: 20 }}>
          <h1 style={{ margin: 0, color: "#f1c400" }}>Mis pedidos</h1>
          <p style={{ marginTop: 8, color: "#eee" }}>{cliente?.name}</p>
        </div>

        <button
          onClick={() => (window.location.href = "/productos")}
          style={{ padding: "12px 18px", borderRadius: 12, border: 0, background: "#f1c400", fontWeight: "bold", marginBottom: 20 }}
        >
          ← Volver a productos
        </button>

        {loading && <p>Cargando pedidos...</p>}

        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            style={{
              background: "white",
              padding: 18,
              borderRadius: 18,
              marginBottom: 12,
              border: "1px solid #e5e5e5",
              cursor: "pointer",
            }}
          >
            <strong>Pedido {order.name}</strong>
            <p style={{ margin: "8px 0", color: "#666" }}>Fecha: {order.date_order}</p>
            <p style={{ margin: "8px 0", color: "#666" }}>
              Estado: 🟢 {order.state === "sale" ? "Confirmado" : order.state}
            </p>
            <strong style={{ fontSize: 20 }}>{Number(order.amount_total || 0).toFixed(2)} €</strong>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.55)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 24,
              padding: 24,
              width: "100%",
              maxWidth: 720,
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Detalle {selectedOrder.name}</h2>

            {(selectedOrder.lines || []).map((line: any) => (
              <div key={line.id} style={{ borderBottom: "1px solid #eee", padding: "12px 0" }}>
                <strong>{line.name}</strong>
                <p style={{ margin: "6px 0 0", color: "#666" }}>
                  Cantidad: {line.product_uom_qty} · Precio: {Number(line.price_unit || 0).toFixed(2)} €
                </p>
                <strong>{Number(line.price_subtotal || 0).toFixed(2)} €</strong>
              </div>
            ))}

            <h3 style={{ textAlign: "right" }}>
              Total: {Number(selectedOrder.amount_total || 0).toFixed(2)} €
            </h3>

            <button
              onClick={() => repetirPedido(selectedOrder)}
              style={{ width: "100%", padding: 15, borderRadius: 14, border: 0, background: "#f1c400", fontWeight: "bold", cursor: "pointer", marginTop: 12 }}
            >
              🔄 Repetir este pedido
            </button>

            <button
              onClick={() => setSelectedOrder(null)}
              style={{ width: "100%", padding: 15, borderRadius: 14, border: "1px solid #ddd", background: "white", fontWeight: "bold", cursor: "pointer", marginTop: 10 }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}