"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ComercialPage() {
  const params = useParams();
  const nombre = String(params.nombre || "Comercial");

  const [clientes, setClientes] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [activation, setActivation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("/api/odoo-customers")
      .then((r) => r.json())
      .then((data) => setClientes(data.customers || data.clientes || []))
      .catch(() => setClientes([]));

    fetch("/api/odoo-orders")
      .then((r) => r.json())
      .then((data) => setPedidos(data.orders || data.pedidos || []))
      .catch(() => setPedidos([]));
  }, []);

  const filteredClientes = clientes.filter((c) => {
    const txt = `${c.name || ""} ${c.phone || ""} ${c.mobile || ""} ${c.email || ""} ${c.city || ""}`.toLowerCase();
    return txt.includes(search.toLowerCase());
  });

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  async function activarCliente(cliente: any) {
    setLoading(true);
    setSelected(cliente);
    setActivation(null);

    const response = await fetch("/api/odoo-activate-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: cliente.id }),
    });

    const data = await response.json();
    setLoading(false);

    if (data.ok) {
      setActivation(data);
      showToast("✅ Cliente activado");
    } else {
      alert(data.error || "Error activando cliente");
    }
  }

  async function copiarEnlace() {
    if (!activation?.link) return;
    await navigator.clipboard.writeText(activation.link);
    showToast("✅ Enlace copiado");
  }

  function abrirWhatsApp() {
    if (!activation?.link) return;

    const phone = selected?.mobile || selected?.phone || "";
    const cleanPhone = String(phone).replace(/\D/g, "");

    const message = `Hola 👋

Ya puedes realizar tus pedidos online en OneSupply desde tu área personal.

Accede desde este enlace:

${activation.link}

Desde tu área personal podrás:

✅ Consultar el catálogo actualizado.
✅ Ver tus precios.
✅ Realizar pedidos de forma rápida.
✅ Consultar tus pedidos anteriores.
✅ Guardar tus productos favoritos.

Si necesitas cualquier cosa, estaremos encantados de ayudarte.

Equipo OneSupply`;

    const url = cleanPhone
      ? `https://wa.me/34${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  }

  function abrirEmail() {
    if (!activation?.link) return;

    const subject = "Bienvenido a tu área personal de OneSupply";

    const body = `Hola,

Te damos la bienvenida a tu área personal de OneSupply Connect.

A partir de ahora podrás realizar tus pedidos online de una forma rápida, sencilla y disponible las 24 horas.

Accede desde el siguiente enlace:

${activation.link}

En tu área personal podrás:

• Consultar el catálogo completo.
• Ver tus pedidos anteriores.
• Guardar productos favoritos.
• Realizar nuevos pedidos en pocos segundos.

Gracias por confiar en OneSupply.

Equipo OneSupply`;

    window.location.href = `mailto:${selected?.email || ""}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  function abrirCliente() {
    if (!activation?.link) return;
    window.open(activation.link, "_blank");
  }

  return (
    <main
      style={{
        padding: 20,
        fontFamily: "Arial",
        background: "#f4f4f4",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <section
          style={{
            background: "#2d2d2d",
            color: "white",
            borderRadius: 26,
            padding: 28,
            marginBottom: 22,
          }}
        >
          <p style={{ margin: 0, color: "#f1c400", fontSize: 18 }}>
            Área comercial
          </p>
          <h1 style={{ margin: "10px 0 0", fontSize: 34 }}>
            Hola {nombre} 👋
          </h1>
          <p style={{ color: "#ddd", fontSize: 17 }}>
            Bienvenido a OneSupply Connect
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            marginBottom: 22,
          }}
        >
          <Card title="👥 Clientes" value={clientes.length} />
          <Card title="📦 Pedidos" value={pedidos.length} />
          <Card title="🔗 Activaciones" value="1 clic" />
        </section>

        <section
          style={{
            background: "white",
            borderRadius: 24,
            padding: 22,
            border: "1px solid #e5e5e5",
            marginBottom: 22,
          }}
        >
          <h2 style={{ marginTop: 0 }}>👥 Clientes</h2>

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
              marginBottom: 16,
            }}
          />

          <div style={{ display: "grid", gap: 12 }}>
            {filteredClientes.slice(0, 500).map((cliente) => (
              <div
                key={cliente.id}
                style={{
                  padding: 18,
                  borderRadius: 18,
                  background: "#fafafa",
                  border: "1px solid #eee",
                }}
              >
                <strong style={{ fontSize: 18 }}>{cliente.name}</strong>

                <p style={{ margin: "8px 0", color: "#666" }}>
                  📞 {cliente.mobile || cliente.phone || "Sin teléfono"}
                  <br />
                  📍 {cliente.city || "Sin ciudad"}
                  <br />
                  ✉️ {cliente.email || "Sin email"}
                </p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button style={yellowBtn} onClick={() => activarCliente(cliente)}>
                    <button
                  style={yellowBtn}
                  onClick={() => {
                  localStorage.setItem("cliente", JSON.stringify(cliente));
                  window.location.href = "/productos";
                 }}
                 >
                 🛒 Crear pedido
                 </button>
                    🔗 Activar cliente
                  </button>

                  {(cliente.mobile || cliente.phone) && (
                    <button
                      style={whiteBtn}
                      onClick={() =>
                        window.open(
                          `tel:${cliente.mobile || cliente.phone}`,
                          "_self"
                        )
                      }
                    >
                      📞 Llamar
                    </button>
                  )}

                  {(cliente.mobile || cliente.phone) && (
                    <button
                      style={whiteBtn}
                      onClick={() =>
                        window.open(
                          `https://wa.me/34${String(
                            cliente.mobile || cliente.phone
                          ).replace(/\D/g, "")}`,
                          "_blank"
                        )
                      }
                    >
                      💬 WhatsApp
                    </button>
                  )}

                  {cliente.email && (
                    <button
                      style={whiteBtn}
                      onClick={() =>
                        (window.location.href = `mailto:${cliente.email}`)
                      }
                    >
                      📧 Email
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {selected && (
          <section
            style={{
              background: "white",
              borderRadius: 24,
              padding: 22,
              border: "1px solid #e5e5e5",
              marginBottom: 22,
            }}
          >
            <h2 style={{ marginTop: 0 }}>🔗 Activación de cliente</h2>
            <h3>{selected.name}</h3>

            {loading && <p>Activando cliente...</p>}

            {activation?.link && (
              <>
                <div
                  style={{
                    background: "#f7f7f7",
                    padding: 14,
                    borderRadius: 14,
                    wordBreak: "break-all",
                    marginBottom: 16,
                  }}
                >
                  {activation.link}
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button style={yellowBtn} onClick={copiarEnlace}>
                    📋 Copiar enlace
                  </button>

                  <button style={greenBtn} onClick={abrirWhatsApp}>
                    💬 Enviar por WhatsApp
                  </button>

                  <button style={blueBtn} onClick={abrirEmail}>
                    📧 Enviar por email
                  </button>

                  <button style={whiteBtn} onClick={abrirCliente}>
                    👁️ Abrir área
                  </button>
                </div>

                <div style={{ marginTop: 24, textAlign: "center" }}>
                  <h3>📱 QR de acceso</h3>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
                      activation.link
                    )}`}
                    alt="QR de acceso"
                    style={{
                      background: "white",
                      padding: 12,
                      borderRadius: 18,
                      border: "1px solid #ddd",
                    }}
                  />
                  <p style={{ color: "#666" }}>
                    El cliente puede escanearlo con la cámara del móvil.
                  </p>
                </div>
              </>
            )}
          </section>
        )}

        <section
          style={{
            background: "white",
            borderRadius: 24,
            padding: 22,
            border: "1px solid #e5e5e5",
          }}
        >
          <h2 style={{ marginTop: 0 }}>📦 Últimos pedidos</h2>

          <div style={{ display: "grid", gap: 12 }}>
            {pedidos.slice(0, 20).map((pedido) => (
              <div
                key={pedido.id || pedido.name}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background: "#fafafa",
                  border: "1px solid #eee",
                }}
              >
                <strong>{pedido.name || "Pedido"}</strong>
                <p style={{ margin: "8px 0 0", color: "#666" }}>
                  Cliente: {pedido.partner_id?.[1] || pedido.cliente || "-"}
                  <br />
                  Estado: {pedido.state || "-"}
                  <br />
                  Total: {Number(pedido.amount_total || 0).toFixed(2)} €
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {toast && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: 28,
            transform: "translateX(-50%)",
            background: "#2d2d2d",
            color: "white",
            padding: "13px 20px",
            borderRadius: 999,
            zIndex: 100,
            fontWeight: "bold",
          }}
        >
          {toast}
        </div>
      )}
    </main>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div
      style={{
        background: "white",
        padding: 22,
        borderRadius: 22,
        border: "1px solid #e5e5e5",
      }}
    >
      <p style={{ margin: 0, color: "#777" }}>{title}</p>
      <h2 style={{ margin: "8px 0 0", fontSize: 30 }}>{value}</h2>
    </div>
  );
}

const yellowBtn = {
  padding: "12px 16px",
  borderRadius: 13,
  border: 0,
  background: "#f1c400",
  fontWeight: "bold",
  cursor: "pointer",
};

const whiteBtn = {
  padding: "12px 16px",
  borderRadius: 13,
  border: "1px solid #ddd",
  background: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const greenBtn = {
  padding: "12px 16px",
  borderRadius: 13,
  border: 0,
  background: "#25D366",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const blueBtn = {
  padding: "12px 16px",
  borderRadius: 13,
  border: 0,
  background: "#1677ff",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};