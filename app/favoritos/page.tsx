"use client";

import { useEffect, useState } from "react";

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    setFavoritos(JSON.parse(localStorage.getItem("favoritos") || "[]"));
    setCart(JSON.parse(localStorage.getItem("carritoActual") || "[]"));
  }, []);

  function productImage(product: any) {
    if (!product.image_128) return null;
    return `data:image/png;base64,${product.image_128}`;
  }

  function addToCart(product: any) {
    setCart((current) => {
      const exists = current.find((item) => item.id === product.id);

      const updated = exists
        ? current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...current, { ...product, quantity: 1 }];

      localStorage.setItem("carritoActual", JSON.stringify(updated));
      return updated;
    });
  }

  function removeFavorite(productId: number) {
    const updated = favoritos.filter((p) => p.id !== productId);
    setFavoritos(updated);
    localStorage.setItem("favoritos", JSON.stringify(updated));
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
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            background: "#2d2d2d",
            color: "white",
            borderRadius: 24,
            padding: 26,
            marginBottom: 20,
          }}
        >
          <h1 style={{ margin: 0, color: "#f1c400" }}>Mis favoritos ❤️</h1>
          <p style={{ marginTop: 8, color: "#eee" }}>
            Tus productos favoritos para pedir rápidamente.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => (window.location.href = "/productos")}
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: 0,
              background: "#f1c400",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ← Ir a productos
          </button>
          {favoritos.length > 0 && (
  <button
    onClick={() => {
      const carritoActual = JSON.parse(
        localStorage.getItem("carritoActual") || "[]"
      );
{favoritos.length > 0 && (
  <button
    onClick={() => {
      if (confirm("¿Quieres borrar todos los favoritos?")) {
        localStorage.removeItem("favoritos");
        setFavoritos([]);
      }
    }}
    style={{
      padding: "12px 18px",
      borderRadius: 12,
      border: "1px solid #ddd",
      background: "white",
      fontWeight: "bold",
      cursor: "pointer",
    }}
  >
    🗑 Vaciar favoritos
  </button>
)}
      const combinado = [...carritoActual];

      favoritos.forEach((fav: any) => {
        const existente = combinado.find((p: any) => p.id === fav.id);

        if (existente) {
          existente.quantity += 1;
        } else {
          combinado.push({ ...fav, quantity: 1 });
        }
      });

      localStorage.setItem("carritoActual", JSON.stringify(combinado));
      setCart(combinado);
      alert("Favoritos añadidos al carrito");
      window.location.href = "/productos";
    }}
    style={{
      padding: "12px 18px",
      borderRadius: 12,
      border: 0,
      background: "#2d2d2d",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
    }}
  >
    Añadir favoritos al carrito
  </button>
)}

          {cart.length > 0 && (
            <button
              onClick={() => (window.location.href = "/productos")}
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                border: 0,
                background: "#2d2d2d",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🛒 Ver carrito ({cart.reduce((s, i) => s + i.quantity, 0)})
            </button>
          )}
        </div>

        {favoritos.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: 24,
              borderRadius: 20,
              border: "1px solid #e5e5e5",
            }}
          >
            <h2>❤️ Todavía no tienes productos favoritos</h2>
            <p style={{ color: "#666" }}>
              Añade productos a favoritos desde el catálogo.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 14,
            }}
          >
            {favoritos.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "white",
                  padding: 16,
                  borderRadius: 20,
                  border: "1px solid #e5e5e5",
                  display: "flex",
                  flexDirection: "column",
                  height: 390,
                }}
              >
                <div
                  style={{
                    height: 120,
                    background: "white",
                    borderRadius: 16,
                    marginBottom: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  {productImage(p) ? (
                    <img
                      src={productImage(p)!}
                      alt={p.name}
                      style={{
                        maxHeight: 110,
                        maxWidth: "100%",
                        objectFit: "contain",
                        mixBlendMode: "multiply",
                      }}
                    />
                  ) : (
                    <span style={{ color: "#aaa", fontSize: 34 }}>📦</span>
                  )}
                </div>

                <p style={{ margin: "0 0 8px", color: "#777", fontSize: 13 }}>
                  {p.categ_id?.[1] || "Sin categoría"}
                </p>

                <strong style={{ fontSize: 16, lineHeight: "21px" }}>
                  {p.name}
                </strong>

                <p style={{ fontSize: 22, fontWeight: "bold" }}>
                  {Number(p.list_price || 0).toFixed(2)} €
                </p>

                <button
                  onClick={() => addToCart(p)}
                  style={{
                    marginTop: "auto",
                    padding: "14px",
                    borderRadius: 12,
                    border: 0,
                    background: "#f1c400",
                    fontWeight: "bold",
                    width: "100%",
                    cursor: "pointer",
                  }}
                >
                  Añadir al carrito
                </button>

                <button
                  onClick={() => removeFavorite(p.id)}
                  style={{
                    marginTop: 8,
                    padding: "10px",
                    borderRadius: 12,
                    border: "1px solid #ddd",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  Quitar de favoritos
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}