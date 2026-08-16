"use client";

import { useState } from "react";

type Props = {
  cliente: any;
  onSelect: (cliente: any) => void;
};

export default function ClienteCard({ cliente, onSelect }: Props) {
  const [loading, setLoading] = useState(false);
  const [activationLink, setActivationLink] = useState("");
  const [toast, setToast] = useState("");

  function abrirFicha(e: React.MouseEvent) {
    e.stopPropagation();
    onSelect(cliente);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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

  function whatsappNormal(e: React.MouseEvent) {
    e.stopPropagation();

    const telefono =
      cliente.mobile || cliente.phone;

    if (!telefono) return;

    const limpio = String(telefono).replace(/\D/g, "");

    window.open(
      `https://wa.me/34${limpio}`,
      "_blank"
    );
  }

  function emailNormal(e: React.MouseEvent) {
    e.stopPropagation();

    if (!cliente.email) return;

    window.location.href = `mailto:${cliente.email}`;
  }

  function showToast(message: string) {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
  }

  async function activarCliente(e: React.MouseEvent) {
    e.stopPropagation();

    try {
      setLoading(true);
      setActivationLink("");

      const response = await fetch(
        "/api/odoo-activate-client",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientId: cliente.id,
          }),
        }
      );

      const data = await response.json();

      if (!data.ok) {
        alert(
          data.error ||
            "No se ha podido activar el cliente."
        );

        return;
      }

      setActivationLink(data.link);

      showToast("✅ Cliente activado");
    } catch (error) {
      alert(
        "Ha ocurrido un error activando el cliente."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copiarEnlace(
    e: React.MouseEvent
  ) {
    e.stopPropagation();

    if (!activationLink) return;

    await navigator.clipboard.writeText(
      activationLink
    );

    showToast("✅ Enlace copiado");
  }

  function enviarAccesoWhatsApp(
    e: React.MouseEvent
  ) {
    e.stopPropagation();

    if (!activationLink) return;

    const telefono =
      cliente.mobile || cliente.phone || "";

    const limpio = String(telefono).replace(
      /\D/g,
      ""
    );

    const message = `Hola 👋

Ya tienes disponible tu área personal de OneSupply para realizar tus pedidos online de forma rápida y cómoda.

Desde tu área personal podrás:

✅ Consultar el catálogo actualizado.
✅ Ver tus precios.
✅ Realizar pedidos.
✅ Consultar tus pedidos anteriores.
✅ Guardar tus productos favoritos.

🔗 Tu acceso personal:
${activationLink}

Puedes guardar este enlace en tu móvil y utilizarlo siempre que necesites hacer un pedido.

Si necesitas cualquier cosa, seguimos disponibles por WhatsApp como siempre 😊

Equipo OneSupply`;

    const url = limpio
      ? `https://wa.me/34${limpio}?text=${encodeURIComponent(
          message
        )}`
      : `https://wa.me/?text=${encodeURIComponent(
          message
        )}`;

    window.open(url, "_blank");
  }

  function enviarAccesoEmail(
    e: React.MouseEvent
  ) {
    e.stopPropagation();

    if (!activationLink) return;

    const subject =
      "Tu área personal de OneSupply";

    const body = `Hola,

Ya tienes disponible tu área personal de OneSupply para realizar tus pedidos online.

Desde tu área podrás consultar nuestro catálogo, ver tus precios, hacer pedidos, consultar pedidos anteriores y guardar productos favoritos.

Tu acceso personal:

${activationLink}

Gracias por confiar en OneSupply.

Equipo OneSupply`;

    window.location.href = `mailto:${
      cliente.email || ""
    }?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  function abrirAcceso(
    e: React.MouseEvent
  ) {
    e.stopPropagation();

    if (!activationLink) return;

    window.open(
      activationLink,
      "_blank"
    );
  }

  return (
    <div
      onClick={abrirFicha}
      style={card}
    >
      <div>
        <h3 style={title}>
          {cliente.name}
        </h3>

        <div style={info}>
          <div>
            📞{" "}
            {cliente.mobile ||
              cliente.phone ||
              "Sin teléfono"}
          </div>

          <div>
            📍{" "}
            {cliente.city ||
              "Sin ciudad"}
          </div>

          <div>
            ✉️{" "}
            {cliente.email ||
              "Sin email"}
          </div>
        </div>
      </div>

      <div>
        <div style={buttonGrid}>
          <button
            onClick={crearPedido}
            style={yellowBtn}
          >
            🛒 Pedido
          </button>

          <button
            onClick={activarCliente}
            style={{
              ...darkBtn,
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading
              ? "Activando..."
              : "🔗 Activar acceso"}
          </button>

          <button
            onClick={llamar}
            style={iconButton}
            title="Llamar"
          >
            📞
          </button>

          <button
            onClick={whatsappNormal}
            style={iconButton}
            title="WhatsApp"
          >
            💬
          </button>

          <button
            onClick={emailNormal}
            style={iconButton}
            title="Email"
          >
            📧
          </button>
        </div>

        {activationLink && (
          <div
            style={activationBox}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <p style={activationTitle}>
              ✅ Cliente activado
            </p>

            <div style={linkBox}>
              {activationLink}
            </div>

            <div style={activationButtons}>
              <button
                onClick={copiarEnlace}
                style={smallYellowBtn}
              >
                📋 Copiar
              </button>

              <button
                onClick={
                  enviarAccesoWhatsApp
                }
                style={smallGreenBtn}
              >
                💬 WhatsApp
              </button>

              <button
                onClick={
                  enviarAccesoEmail
                }
                style={smallBlueBtn}
              >
                📧 Email
              </button>

              <button
                onClick={abrirAcceso}
                style={smallWhiteBtn}
              >
                👁 Abrir acceso
              </button>
            </div>
          </div>
        )}

        <button
          onClick={abrirFicha}
          style={viewBtn}
        >
          👁️ Ver ficha
        </button>
      </div>

      {toast && (
        <div style={toastStyle}>
          {toast}
        </div>
      )}
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
  boxShadow:
    "0 5px 15px rgba(0,0,0,.05)",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "space-between",
  minHeight: 345,
  position: "relative" as const,
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
  gridTemplateColumns:
    "minmax(95px, 1fr) minmax(145px, 1.35fr) 46px 46px 46px",
  gap: 8,
  marginTop: 18,
  alignItems: "center",
};

const yellowBtn = {
  height: 46,
  padding: "0 12px",
  border: 0,
  borderRadius: 12,
  background: "#f1c400",
  color: "#111",
  fontWeight: "bold",
  fontSize: 14,
  cursor: "pointer",
  whiteSpace: "nowrap" as const,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const darkBtn = {
  height: 46,
  padding: "0 12px",
  border: 0,
  borderRadius: 12,
  background: "#2d2d2d",
  color: "white",
  fontWeight: "bold",
  fontSize: 13,
  cursor: "pointer",
  whiteSpace: "nowrap" as const,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const iconButton = {
  width: 46,
  height: 46,
  padding: 0,
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
  fontSize: 19,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const activationBox = {
  marginTop: 14,
  padding: 14,
  borderRadius: 14,
  background: "#f7f7f7",
  border: "1px solid #e5e5e5",
};

const activationTitle = {
  margin: "0 0 10px",
  fontWeight: "bold",
  color: "#222",
};

const linkBox = {
  background: "white",
  padding: 10,
  borderRadius: 10,
  border: "1px solid #ddd",
  fontSize: 13,
  wordBreak: "break-all" as const,
  color: "#555",
};

const activationButtons = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: 8,
  marginTop: 10,
};

const smallYellowBtn = {
  minHeight: 42,
  padding: "10px",
  border: 0,
  borderRadius: 10,
  background: "#f1c400",
  fontWeight: "bold",
  cursor: "pointer",
};

const smallGreenBtn = {
  minHeight: 42,
  padding: "10px",
  border: 0,
  borderRadius: 10,
  background: "#25D366",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const smallBlueBtn = {
  minHeight: 42,
  padding: "10px",
  border: 0,
  borderRadius: 10,
  background: "#1677ff",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const smallWhiteBtn = {
  minHeight: 42,
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: 10,
  background: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const viewBtn = {
  marginTop: 14,
  minHeight: 42,
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #1677ff",
  background: "white",
  color: "#1677ff",
  fontWeight: "bold",
  cursor: "pointer",
  width: "100%",
};

const toastStyle = {
  position: "fixed" as const,
  left: "50%",
  bottom: 30,
  transform: "translateX(-50%)",
  background: "#2d2d2d",
  color: "white",
  padding: "12px 18px",
  borderRadius: 999,
  zIndex: 9999,
  fontWeight: "bold",
};