"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function AccesoClientePage() {
  const params = useParams();

  useEffect(() => {
    async function validarAcceso() {
      const tokenUrl = String(params.token || "").trim().toUpperCase();

      const res = await fetch(`/api/odoo-customers?token=${encodeURIComponent(tokenUrl)}`);
      const data = await res.json();

      if (!data.ok || !data.cliente) {
        alert("Acceso no válido.");
        window.location.href = "/";
        return;
      }

      localStorage.setItem("cliente", JSON.stringify(data.cliente));
      window.location.href = "/productos";
    }

    validarAcceso();
  }, [params.token]);

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial", background: "#f4f4f4" }}>
      <div style={{ background: "white", padding: 30, borderRadius: 24, textAlign: "center" }}>
        <h1 style={{ color: "#f1c400" }}>OneSupply</h1>
        <p>Validando acceso...</p>
      </div>
    </main>
  );
}