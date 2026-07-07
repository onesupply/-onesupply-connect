"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/odoo-customers")
      .then((r) => r.json())
      .then((data) => {
        setCustomers(data.customers || []);
        setLoading(false);
      });
  }, []);

  const filtered = customers.filter((c) => {
    const text = `${c.name || ""} ${c.phone || ""} ${c.city || ""} ${
      c.email || ""
    }`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <main
      style={{
        padding: 24,
        fontFamily: "Arial",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div
          style={{
            background: "#333",
            color: "white",
            padding: 20,
            borderRadius: 16,
            marginBottom: 20,
          }}
        >
          <h1 style={{ margin: 0 }}>OneSupply Connect</h1>
          <p style={{ margin: "8px 0 0", color: "#f1c400" }}>
            Clientes profesionales
          </p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente, teléfono, ciudad o email..."
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 14,
            border: "1px solid #ddd",
            marginBottom: 20,
            fontSize: 16,
          }}
        />

        {loading ? (
          <p>Cargando clientes...</p>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              style={{
                background: "white",
                marginBottom: 14,
                padding: 18,
                borderRadius: 14,
              }}
            >
              <h2 style={{ margin: "0 0 10px", fontSize: 18 }}>{c.name}</h2>
              <p>📞 {c.phone || "Sin teléfono"}</p>
              <p>📍 {c.city || "-"}</p>
              <p>✉️ {c.email || "-"}</p>

              <button
                onClick={() => {
                  localStorage.setItem("cliente", JSON.stringify(c));
                  window.location.href = "/productos";
                }}
                style={{
                  marginTop: 10,
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: 0,
                  background: "#f1c400",
                  fontWeight: "bold",
                }}
              >
                Crear pedido
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}