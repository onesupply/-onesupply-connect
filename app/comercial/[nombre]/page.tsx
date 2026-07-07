"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import Dashboard from "./Dashboard";
import Clientes from "./Clientes";
import ClienteFicha from "./ClienteFicha";
import Pedidos from "./Pedidos";

export default function ComercialPage() {
  const params = useParams();

  const nombre = String(params.nombre || "Comercial");

  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);

  return (
    <main
      style={{
        background: "#f4f4f4",
        minHeight: "100vh",
        padding: 20,
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <Dashboard nombre={nombre} />

        <Clientes
          onSelect={setClienteSeleccionado}
        />

        {clienteSeleccionado && (
          <ClienteFicha
            cliente={clienteSeleccionado}
          />
        )}

        <Pedidos />
      </div>
    </main>
  );
}