"use client";

import { useState } from "react";

type Props = {
  cliente: any;
};

export default function ClienteFicha({ cliente }: Props) {
  const [activation, setActivation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  function crearPedido() {
    localStorage.setItem("cliente", JSON.stringify(cliente));
    window.location.href = "/productos";
  }

  async function activarCliente() {
    setLoading(true);
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

  function llamar() {
    const telefono = cliente.mobile || cliente.phone;
    if (!telefono) return;
    window.location.href = `tel:${telefono}`;
  }

  function whatsapp() {
    const telefono = cliente.mobile || cliente.phone;
    if (!telefono) return;

    const limpio = String(telefono).replace(/\D/g, "");
    window.open(`https://wa.me/34${limpio}`, "_blank");
  }

  function enviarAccesoWhatsApp() {
    if (!activation?.link) return;

    const telefono = cliente.mobile || cliente.phone || "";
    const limpio = String(telefono).replace(/\D/g, "");

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

    const url = limpio
      ? `https://wa.me/34${limpio}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  }

  function email() {
    if (!cliente.email) return;
    window.location.href = `mailto:${cliente.email}`;
  }

  function enviarAccesoEmail() {
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

    window.location.href = `mailto:${cliente.email || ""}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section
      style={{
        background: "white",
        borderRadius: 28,
        padding: 24,
        border: "1px solid #e5e5e5",
        marginBottom: 28,
        boxShadow: "0 8px 24px rgba(0,0,0,.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 18,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "#f1c400",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Ficha de cliente
          </p>

          <h2
            style={{
              margin: "8px 0 10px",
              fontSize: 28,
            }}
          >
            {cliente.name}
          </h2>

          <div
            style={{
              color: "#666",
              lineHeight: "28px",
              fontSize: 15,
            }}
          >
            <div>📞 {cliente.mobile || cliente.phone || "Sin teléfono"}</div>
            <div>✉️ {cliente.email || "Sin email"}</div>
            <div>📍 {cliente.street || cliente.city || "Sin dirección"}</div>
            {cliente.vat && <div>🧾 NIF/CIF: {cliente.vat}</div>}
          </div>
        </div>

        <button onClick={crearPedido} style={mainButton}>
          🛒 Crear pedido
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 12,
          marginTop: 24,
          marginBottom: 24,
        }}
      >
        <MiniCard title="📦 Pedidos" value="Próximamente" />
        <MiniCard title="💶 Comprado" value="Próximamente" />
        <MiniCard title="📅 Última compra" value="Próximamente" />
        <MiniCard title="⭐ Favoritos" value="Próximamente" />
      </div>

      <h3>Acciones rápidas</h3>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <button onClick={crearPedido} style={yellowBtn}>
          🛒 Crear pedido
        </button>

        <button onClick={activarCliente} style={yellowBtn} disabled={loading}>
          {loading ? "Activando..." : "🔗 Activar cliente"}
        </button>

        <button onClick={llamar} style={whiteBtn}>
          📞 Llamar
        </button>

        <button onClick={whatsapp} style={greenBtn}>
          💬 WhatsApp
        </button>

        <button onClick={email} style={blueBtn}>
          📧 Email
        </button>
      </div>

      {activation?.link && (
        <div
          style={{
            background: "#f7f7f7",
            padding: 18,
            borderRadius: 20,
            border: "1px solid #e5e5e5",
            marginTop: 18,
          }}
        >
          <h3 style={{ marginTop: 0 }}>✅ Cliente activado</h3>

          <div
            style={{
              background: "white",
              padding: 14,
              borderRadius: 14,
              wordBreak: "break-all",
              border: "1px solid #ddd",
              marginBottom: 14,
              color: "#333",
            }}
          >
            {activation.link}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={copiarEnlace} style={yellowBtn}>
              📋 Copiar enlace
            </button>

            <button onClick={enviarAccesoWhatsApp} style={greenBtn}>
              💬 Enviar por WhatsApp
            </button>

            <button onClick={enviarAccesoEmail} style={blueBtn}>
              📧 Enviar por email
            </button>

            <button
              onClick={() => window.open(activation.link, "_blank")}
              style={whiteBtn}
            >
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
                maxWidth: "100%",
              }}
            />

            <p style={{ color: "#666" }}>
              El cliente puede escanearlo con la cámara del móvil.
            </p>
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: 28,
          paddingTop: 20,
          borderTop: "1px solid #eee",
        }}
      >
        <h3>📋 Últimos pedidos</h3>
        <p style={{ color: "#777" }}>
          En el siguiente paso conectaremos aquí los últimos pedidos reales de este cliente.
        </p>
      </div>

      {toast && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: 30,
            transform: "translateX(-50%)",
            background: "#2d2d2d",
            color: "white",
            padding: "13px 20px",
            borderRadius: 999,
            zIndex: 300,
            fontWeight: "bold",
          }}
        >
          {toast}
        </div>
      )}
    </section>
  );
}

function MiniCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        background: "#fafafa",
        borderRadius: 18,
        padding: 16,
        border: "1px solid #eee",
      }}
    >
      <p style={{ margin: 0, color: "#666", fontSize: 14 }}>{title}</p>
      <strong style={{ display: "block", marginTop: 8 }}>{value}</strong>
    </div>
  );
}

const mainButton = {
  padding: "15px 22px",
  borderRadius: 15,
  border: 0,
  background: "#f1c400",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: 16,
};

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