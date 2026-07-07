"use client";

import { useEffect, useState } from "react";
import ClienteCard from "./ClienteCard";

type ClientesProps = {
  onSelect: (cliente: any) => void;
};

export default function Clientes({ onSelect }: ClientesProps) {
  const [clientes, setClientes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/odoo-customers")
      .then((r) => r.json())
      .then((data) => {
        setClientes(data.customers || data.clientes || []);
      })
      .catch(() => setClientes([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = clientes.filter((cliente) => {
    const text = `
      ${cliente.name || ""}
      ${cliente.phone || ""}
      ${cliente.mobile || ""}
      ${cliente.email || ""}
      ${cliente.city || ""}
      ${cliente.street || ""}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <section
      style={{
        background: "white",
        borderRadius: 26,
        padding: 24,
        border: "1px solid #e5e5e5",
        marginBottom: 26,
        boxShadow: "0 6px 18px rgba(0,0,0,.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
          marginBottom: 18,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>👥 Clientes</h2>
          <p style={{ margin: "6px 0 0", color: "#666" }}>
            Busca, abre la ficha o crea un pedido para cualquier cliente.
          </p>
        </div>

        <div
          style={{
            background: "#f1c400",
            padding: "10px 16px",
            borderRadius: 999,
            fontWeight: "bold",
          }}
        >
          {filtered.length} clientes
        </div>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar cliente, teléfono, ciudad o email..."
        style={{
          width: "100%",
          padding: 16,
          borderRadius: 16,
          border: "1px solid #ddd",
          fontSize: 16,
          boxSizing: "border-box",
          marginBottom: 18,
        }}
      />

      {loading ? (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            color: "#777",
          }}
        >
          Cargando clientes...
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            color: "#777",
          }}
        >
          No se han encontrado clientes.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 14,
          }}
        >
          {filtered.slice(0, 500).map((cliente) => (
            <ClienteCard
              key={cliente.id}
              cliente={cliente}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </section>
  );
}