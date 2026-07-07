"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activating, setActivating] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [activatedClients, setActivatedClients] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("activatedClients");
    if (saved) setActivatedClients(JSON.parse(saved));
  }, []);

  async function buscarClientes() {
    if (!search.trim()) return;

    setLoading(true);
    setResults([]);
    setSelectedClient(null);

    const res = await fetch(`/api/odoo-customers?q=${encodeURIComponent(search)}`);
    const data = await res.json();

    setLoading(false);

    if (data.ok) {
      setResults(data.customers || []);
    } else {
      alert(data.error || "Error buscando clientes");
    }
  }

  async function activarCliente() {
    if (!selectedClient) return;

    setActivating(true);

    const res = await fetch("/api/odoo-activate-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: selectedClient.id }),
    });

    const data = await res.json();
    setActivating(false);

    if (!data.ok) {
      alert(data.error || "Error activando cliente");
      return;
    }

    const nuevoCliente = {
      ...selectedClient,
      token: data.token,
      link: data.link,
      active: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [
      ...activatedClients.filter((c) => c.id !== selectedClient.id),
      nuevoCliente,
    ];

    setActivatedClients(updated);
    localStorage.setItem("activatedClients", JSON.stringify(updated));

    setModalOpen(false);
    setSearch("");
    setResults([]);
    setSelectedClient(null);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f4f4f4", fontFamily: "Arial", padding: 20 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ background: "#2d2d2d", color: "white", borderRadius: 24, padding: 26, marginBottom: 20 }}>
          <h1 style={{ margin: 0, color: "#f1c400" }}>OneSupply Connect</h1>
          <p style={{ marginTop: 8, color: "#eee" }}>Panel de administración</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
          <Card title="👥 Clientes" value={String(activatedClients.length)} />
          <Card title="📦 Pedidos hoy" value="0" />
          <Card title="🚚 Entregas mañana" value="0" />
          <Card title="❤️ Favoritos" value="0" />
        </div>

        <div style={{ background: "white", borderRadius: 22, padding: 22, border: "1px solid #e5e5e5" }}>
          <h2 style={{ marginTop: 0 }}>Clientes activados</h2>

          {activatedClients.length === 0 ? (
            <p style={{ color: "#777" }}>Todavía no hay clientes activados en OneSupply Connect.</p>
          ) : (
            activatedClients.map((cliente) => (
              <div key={cliente.id} style={{ padding: 14, border: "1px solid #eee", borderRadius: 14, marginBottom: 10 }}>
                <strong>{cliente.name}</strong>
                <p style={{ margin: "6px 0", color: "#666", fontSize: 13 }}>
                  {cliente.city || "Sin ciudad"} · {cliente.phone || "Sin teléfono"}
                </p>
                <p style={{ margin: "6px 0", fontSize: 13 }}>🔗 {cliente.link}</p>
              </div>
            ))
          )}

          <button
            onClick={() => setModalOpen(true)}
            style={{ marginTop: 12, padding: "14px 18px", borderRadius: 14, border: 0, background: "#f1c400", fontWeight: "bold", cursor: "pointer" }}
          >
            + Nuevo cliente
          </button>
        </div>
      </div>

      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: 24, padding: 24, width: "100%", maxWidth: 560 }}>
            <h2 style={{ marginTop: 0 }}>Activar cliente</h2>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente en Odoo..."
              style={{ width: "100%", padding: 14, borderRadius: 14, border: "1px solid #ddd", fontSize: 15, boxSizing: "border-box", marginBottom: 16 }}
            />

            <p style={{ color: "#777" }}>Escribe el nombre del cliente para buscarlo en Odoo.</p>

            {results.map((cliente) => (
              <div
                key={cliente.id}
                onClick={() => setSelectedClient(cliente)}
                style={{
                  padding: 14,
                  borderRadius: 14,
                  marginTop: 10,
                  cursor: "pointer",
                  border: selectedClient?.id === cliente.id ? "2px solid #f1c400" : "1px solid #ddd",
                  background: selectedClient?.id === cliente.id ? "#fff8d9" : "white",
                }}
              >
                <strong>{cliente.name}</strong>
                <p style={{ margin: "6px 0 0", color: "#666", fontSize: 13 }}>
                  {cliente.city || "Sin ciudad"} · {cliente.phone || "Sin teléfono"}
                </p>
              </div>
            ))}

            {selectedClient && (
              <button
                onClick={activarCliente}
                disabled={activating}
                style={{
                  width: "100%",
                  padding: 15,
                  marginTop: 16,
                  borderRadius: 14,
                  border: 0,
                  background: "#2d2d2d",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  opacity: activating ? 0.6 : 1,
                }}
              >
                {activating ? "Activando..." : `✅ Activar ${selectedClient.name}`}
              </button>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setSearch("");
                  setResults([]);
                  setSelectedClient(null);
                }}
                style={{ flex: 1, padding: 14, borderRadius: 14, border: "1px solid #ddd", background: "white", fontWeight: "bold", cursor: "pointer" }}
              >
                Cancelar
              </button>

              <button
                onClick={buscarClientes}
                style={{ flex: 1, padding: 14, borderRadius: 14, border: 0, background: "#f1c400", fontWeight: "bold", cursor: "pointer" }}
              >
                {loading ? "Buscando..." : "Buscar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ background: "white", borderRadius: 20, padding: 20, border: "1px solid #e5e5e5" }}>
      <p style={{ margin: 0, color: "#777" }}>{title}</p>
      <h2 style={{ margin: "8px 0 0", fontSize: 32 }}>{value}</h2>
    </div>
  );
}