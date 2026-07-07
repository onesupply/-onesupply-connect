"use client";

import { useEffect, useState } from "react";
import { translations } from "./translations";

export default function ProductosPage(){

    const [products, setProducts] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Todas");
    const [cart, setCart] = useState<any[]>([]);
    const [cliente, setCliente] = useState<any>(null);
    const [sending, setSending] = useState(false);
    const [createdOrder, setCreatedOrder] = useState<any>(null);
    const [reviewOpen, setReviewOpen] = useState(false);
    const [notes, setNotes] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [toast, setToast] = useState(""); 
    const [language, setLanguage] = useState("es");
    
    const t = translations[language];
    
    useEffect(() => {
        const clienteGuardado = localStorage.getItem("cliente");
        if (clienteGuardado) setCliente(JSON.parse(clienteGuardado));

        const carritoGuardado = localStorage.getItem("carritoActual");
        if (carritoGuardado) setCart(JSON.parse(carritoGuardado));

        const favoritosGuardados = JSON.parse(
            localStorage.getItem("favoritos") || "[]"
        );
        setFavoriteCount(favoritosGuardados.length);
const hoy = new Date();
let primeraFecha = new Date(hoy);

primeraFecha.setDate(primeraFecha.getDate() + 1);

while (primeraFecha.getDay() === 0 || primeraFecha.getDay() === 6) {
  primeraFecha.setDate(primeraFecha.getDate() + 1);
}

setDeliveryDate(primeraFecha.toISOString().split("T")[0]);
        fetch("/api/odoo-products")
            .then((r) => r.json())
            .then((data) => setProducts(data.products || []))
            .catch(() => setProducts([]));
    }, []);
    useEffect(() => {
        localStorage.setItem("carritoActual", JSON.stringify(cart));
    }, [cart]);

    const categories = [
        "Todas",
        ...Array.from(
            new Set(
                products.map((p) =>
                    Array.isArray(p.categ_id) ? p.categ_id[1] : "Sin categoría"
                )
            )
        ),
    ];

    const filtered = products.filter((p) => {
        const categoryName = Array.isArray(p.categ_id) ? p.categ_id[1] : "";
        const text = `${p.name || ""} ${p.default_code || ""} ${categoryName}`
            .toLowerCase()
            .includes(search.toLowerCase());

        const cat = category === "Todas" || categoryName === category;

        return text && cat;
    });

    function productImage(product: any) {
        if (!product.image_128) return null;
        return `data:image/png;base64,${product.image_128}`;
    }

    function getQuantity(productId: number) {
        return cart.find((item) => item.id === productId)?.quantity || 0;
    }

    function addMultiple(product: any, quantity: number) {
        setCreatedOrder(null);

        setCart((current) => {
            const exists = current.find((item) => item.id === product.id);

            if (exists) {
                return current.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...current, { ...product, quantity }];
        });
    }

    function decreaseQuantity(productId: number) {
        setCart((current) =>
            current
                .map((item) =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    function removeFromCart(productId: number) {
        setCart((current) => current.filter((item) => item.id !== productId));
    }

    function addToCart(product: any) {
        setToast("✅ Producto añadido al pedido");
setTimeout(() => setToast(""), 2000);
        setCart((current: any[]) => {
            const exists = current.find((item) => item.id === product.id);

            if (exists) {
                return current.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...current, { ...product, quantity: 1 }];
        });
    }

    function toggleFavorito(product: any) {
        const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
        const existe = favoritos.find((p: any) => p.id === product.id);

        const nuevos = existe
            ? favoritos.filter((p: any) => p.id !== product.id)
            : [...favoritos, product];

        localStorage.setItem("favoritos", JSON.stringify(nuevos));
        setFavoriteCount(nuevos.length);
        setToast(existe ? "🤍 Quitado de favoritos" : "❤️ Añadido a favoritos");
setTimeout(() => setToast(""), 2000);
        }

        function isFavorito(productId: number) {
            const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
            return favoritos.some((p: any) => p.id === productId);
        }

        async function sendOrderToOdoo() {
            if (!cliente) {
                alert("No se ha podido identificar el cliente");
                window.location.href = "/";
                return;
            }

            if (cart.length === 0) {
                alert("Añade al menos un producto al carrito");
                return;
            }

            setSending(true);
            setCreatedOrder(null);

            const response = await fetch("/api/odoo-create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cliente, cart, notes }),
            });

            const data = await response.json();
            setSending(false);
            setReviewOpen(false);

            if (data.ok) {
                localStorage.setItem("ultimoPedido", JSON.stringify(cart));
                setCreatedOrder(data);
                setCart([]);
                setNotes("");
            } else {
                alert(`Error al enviar el pedido: ${data.error}`);
            }
        }

        const total = cart.reduce(
            (sum, item) => sum + Number(item.list_price || 0) * item.quantity,
            0
        );

        const totalUnits = cart.reduce((sum, item) => sum + item.quantity, 0);

        function ProductCard({ p }: { p: any }) {
            const quantity = getQuantity(p.id);
            const categoryName = Array.isArray(p.categ_id)
                ? p.categ_id[1]
                : "Sin categoría";
            const favorito = isFavorito(p.id);

            return (
                <div
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

                    <p
                        style={{
                            margin: "0 0 8px",
                            color: "#777",
                            fontSize: 13,
                            minHeight: 18,
                        }}
                    >
                        {categoryName}
                    </p>

                    <div style={{ minHeight: 58 }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: 8,
                            }}
                        >
                            <strong
                                style={{
                                    fontSize: 16,
                                    lineHeight: "21px",
                                    flex: 1,
                                }}
                            >
                                {p.name}
                            </strong>

                            <button
                                onClick={() => toggleFavorito(p)}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                    fontSize: 22,
                                }}
                            >
                                {favorito ? "❤️" : "🤍"}
                            </button>
                        </div>
                    </div>

                    <p style={{ fontSize: 22, fontWeight: "bold", margin: "10px 0" }}>
                        {Number(p.list_price || 0).toFixed(2)} €
                    </p>

                    {quantity === 0 ? (
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
                                fontSize: 15,
                                cursor: "pointer",
                            }}
                        >
                            Añadir al pedido
                        </button>
                    ) : (
                        <div style={{ marginTop: "auto" }}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    marginBottom: 8,
                                }}
                            >
                                <button onClick={() => decreaseQuantity(p.id)}>−</button>
                                <strong>{quantity}</strong>
                                <button onClick={() => addToCart(p)}>+</button>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    gap: 6,
                                    marginTop: 8,
                                }}
                            >
                                {[6, 12, 24].map((qty) => (
                                    <button
                                        key={qty}
                                        onClick={() => addMultiple(p, qty)}
                                        style={{
                                            flex: 1,
                                            padding: "7px",
                                            borderRadius: 8,
                                            border: "1px solid #ddd",
                                            background: "#fafafa",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            fontSize: 13,
                                        }}
                                    >
                                        +{qty}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <main
                style={{
                    padding: 20,
                    paddingBottom: cart.length > 0 ? 190 : 80,
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
                        <h1 style={{ margin: 0, fontSize: 32, color: "#f1c400" }}>
                            OneSupply
                        </h1>
                        <p style={{ marginTop: 8, color: "#eee", fontSize: 17 }}>
                            {t.subtitle}
                            <select
  value={language}
  onChange={(e) => {
    setLanguage(e.target.value);
    localStorage.setItem("idioma", e.target.value);
  }}
  style={{
    marginTop: 14,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #ddd",
    fontWeight: "bold",
  }}
>
  <option value="es">🇪🇸 Español</option>
  <option value="en">🇬🇧 English</option>
  <option value="zh">🇨🇳 中文</option>
  <option value="ur">🇵🇰 اردو</option>
</select>
                        </p>
                    </div>

                    {cliente && (
                        <div
                            style={{
                                background: "white",
                                padding: 22,
                                borderRadius: 22,
                                marginBottom: 20,
                                border: "1px solid #e5e5e5",
                            }}
                        >
                            <p style={{ margin: 0, color: "#777", fontSize: 14 }}>Hola</p>

                            <h2 style={{ margin: "8px 0 6px", fontSize: 26 }}>
                                {cliente.name}
                            </h2>

                            <p style={{ color: "#666", marginBottom: 20 }}>
                                Realiza tu pedido online de forma rápida y sencilla.
                            </p>

                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem("cliente");
                                        window.location.href = "/";
                                    }}
                                    style={{
                                        padding: "12px 18px",
                                        borderRadius: 12,
                                        border: 0,
                                        background: "#f1c400",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                    }}
                                >
                                    {t.changeCustomer}
                                </button>

                                <button
                                    onClick={() => (window.location.href = "/pedidos")}
                                    style={{
                                        padding: "12px 18px",
                                        borderRadius: 12,
                                        border: "1px solid #ddd",
                                        background: "white",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                    }}
                                >
                                    📋 {t.myOrders}
                                </button>

                                <button
                                    onClick={() => (window.location.href = "/favoritos")}
                                    style={{
                                        padding: "12px 18px",
                                        borderRadius: 12,
                                        border: "1px solid #ddd",
                                        background: "white",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                    }}
                                >
                                    ❤️ {t.favorites} ({favoriteCount})
                                </button>

                                <button
                                    onClick={() => {
                                        const ultimo = localStorage.getItem("ultimoPedido");

                                        if (!ultimo) {
                                            alert("No hay ningún pedido anterior.");
                                            return;
                                        }

                                        setCart(JSON.parse(ultimo));
                                        setCreatedOrder(null);
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
                                    🔄 {t.repeatOrder}
                                </button>
                            </div>
                        </div>
                    )}

                    {createdOrder && (
                        <div
                            style={{
                                background: "#eaf8ea",
                                padding: 20,
                                borderRadius: 22,
                                marginBottom: 20,
                                border: "1px solid #b7e4b7",
                            }}
                        >
                            <h2 style={{ marginTop: 0 }}>✅ ¡Pedido realizado correctamente!</h2>
                            <p>
                                Hemos recibido tu pedido y ya está registrado en nuestro sistema.
                                Comenzaremos su preparación lo antes posible.
                            </p>
                            <p style={{ color: "#666" }}>
                                N.º de pedido: <strong>{createdOrder.orderId}</strong>
                            </p>
                        </div>
                    )}

                    <input
                    
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar producto..."
                        style={{
                            width: "100%",
                            padding: 16,
                            borderRadius: 16,
                            border: "1px solid #ddd",
                            marginBottom: 14,
                            fontSize: 16,
                            boxSizing: "border-box",
                        }}
                    />

                    <div
                        style={{
                            display: "flex",
                            gap: 10,
                            overflowX: "auto",
                            marginBottom: 20,
                            paddingBottom: 8,
                        }}
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                style={{
                                    padding: "10px 18px",
                                    borderRadius: 30,
                                    border: 0,
                                    whiteSpace: "nowrap",
                                    background: category === cat ? "#f1c400" : "#e9e9e9",
                                    fontWeight: "bold",
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                            gap: 14,
                        }}
                    >
                        {filtered.map((p) => (
                            <ProductCard key={p.id} p={p} />
                        ))}
                    </div>
                </div>
                <div
                    style={{
                        position: "fixed",
                        left: 0,
                        right: 0,
                        bottom: cart.length > 0 ? 82 : 0,
                        background: "white",
                        borderTop: "1px solid #ddd",
                        padding: "10px 12px",
                        zIndex: 45,
                        display: "flex",
                        justifyContent: "space-around",
                        gap: 8,
                    }}
                >
                    <button onClick={() => (window.location.href = "/productos")} style={{ border: 0, background: "transparent", fontWeight: "bold" }}>
                        🏠 {t.products}
                    </button>
                    <button onClick={() => (window.location.href = "/favoritos")} style={{ border: 0, background: "transparent", fontWeight: "bold" }}>
                        ❤️ {t.favorites}
                    </button>
                    <button onClick={() => (window.location.href = "/pedidos")} style={{ border: 0, background: "transparent", fontWeight: "bold" }}>
                        📋 {t.myOrders}
                    </button>
                    <button onClick={() => setReviewOpen(true)} style={{ border: 0, background: "transparent", fontWeight: "bold" }}>
                        🛒 {totalUnits}
                    </button>
                </div>
{toast && (
  <div
    style={{
      position: "fixed",
      left: "50%",
      bottom: cart.length > 0 ? 150 : 70,
      transform: "translateX(-50%)",
      background: "#2d2d2d",
      color: "white",
      padding: "12px 18px",
      borderRadius: 999,
      zIndex: 200,
      fontWeight: "bold",
      boxShadow: "0 6px 20px rgba(0,0,0,.25)",
    }}
  >
    {toast}
  </div>
)}
                {cart.length > 0 && (
                    <div
                        style={{
                            position: "fixed",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "#2f2f2f",
                            color: "white",
                            padding: 16,
                            boxShadow: "0 -6px 20px rgba(0,0,0,.2)",
                            zIndex: 50,
                        }}
                    >
                        <div
                            style={{
                                maxWidth: 1180,
                                margin: "0 auto",
                                display: "flex",
                                gap: 16,
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                            }}
                        >
                            <div>
                                <strong>🛒 Tu pedido</strong>
                                <p style={{ margin: "4px 0 0", color: "#ddd" }}>
                                    {totalUnits} uds · {cart.length} productos ·{" "}
                                    {total.toFixed(2)} €
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    if (confirm("¿Vaciar todo el carrito?")) {
                                        setCart([]);
                                        setCreatedOrder(null);
                                    }
                                }}
                                style={{
                                    marginTop: 8,
                                    border: 0,
                                    background: "transparent",
                                    color: "#ffb3b3",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                }}
                            >
                                Vaciar carrito
                            </button>
                            <button
                                onClick={() => setReviewOpen(true)}
                                disabled={sending}
                                style={{
                                    padding: "15px 22px",
                                    borderRadius: 14,
                                    border: 0,
                                    background: "#f1c400",
                                    fontWeight: "bold",
                                    opacity: sending ? 0.6 : 1,
                                    fontSize: 16,
                                    cursor: "pointer",
                                }}
                            >
                                Revisar pedido
                            </button>
                        </div>
                    </div>
                )}

                {reviewOpen && (
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
                                maxWidth: 620,
                                maxHeight: "85vh",
                                overflowY: "auto",
                            }}
                        >
                            <h2 style={{ marginTop: 0 }}>Tu pedido</h2>
                            <p style={{ color: "#666" }}>
                                Cliente: <strong>{cliente?.name}</strong>
                            </p>

                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        borderBottom: "1px solid #eee",
                                        padding: "12px 0",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: 16,
                                    }}
                                >
                                    <div>
                                        <strong>{item.name}</strong>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 10,
                                                marginTop: 8,
                                            }}
                                        >
                                            <button
                                                onClick={() => decreaseQuantity(item.id)}
                                                style={{ width: 32, height: 32 }}
                                            >
                                                −
                                            </button>

                                            <strong>{item.quantity}</strong>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 8,
                                                    border: 0,
                                                    background: "#ff4d4f",
                                                    color: "white",
                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                🗑
                                            </button>

                                            <button
                                                onClick={() => addToCart(item)}
                                                style={{ width: 32, height: 32 }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <strong>
                                        {(Number(item.list_price || 0) * item.quantity).toFixed(2)} €
                                    </strong>
                                </div>
                            ))}

                            <div style={{ marginTop: 18 }}>
                                <label
                                    style={{
                                        display: "block",
                                        fontWeight: "bold",
                                        marginBottom: 8,
                                    }}
                                >
                                    Observaciones del pedido
                                </label>

                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Ej: entregar por la puerta trasera, llamar antes de venir..."
                                    rows={4}
                                    style={{
                                        width: "100%",
                                        padding: 14,
                                        borderRadius: 14,
                                        border: "1px solid #ddd",
                                        fontSize: 15,
                                        boxSizing: "border-box",
                                        resize: "vertical",
                                    }}
                                />
                                <div style={{ marginTop: 18 }}>
  <label
    style={{
      display: "block",
      fontWeight: "bold",
      marginBottom: 8,
    }}
  >
    🚚 Fecha de entrega
  </label>

  <input
    type="date"
    value={deliveryDate}
    min={new Date().toISOString().split("T")[0]}
    onChange={(e) => {
      const selected = new Date(e.target.value);
      const day = selected.getDay();

      if (day === 0 || day === 6) {
        alert("No hay reparto sábados ni domingos. Selecciona otro día.");
        return;
      }

      setDeliveryDate(e.target.value);
    }}
    style={{
      width: "100%",
      padding: 14,
      borderRadius: 14,
      border: "1px solid #ddd",
      fontSize: 15,
      boxSizing: "border-box",
    }}
  />

  <p style={{ color: "#666", fontSize: 13 }}>
    Selecciona el día en el que deseas recibir tu pedido.
  </p>
</div>
{deliveryDate && (
  <p
    style={{
      marginTop: 10,
      marginBottom: 6,
      fontWeight: "bold",
      color: "#333",
      fontSize: 15,
      textTransform: "capitalize",
    }}
  >
    {new Date(deliveryDate).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })}
  </p>
)}
                            </div>

                            <h3 style={{ textAlign: "right" }}>
                                Total estimado: {total.toFixed(2)} €
                            </h3>

                            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                                <button
                                    onClick={() => setReviewOpen(false)}
                                    style={{
                                        flex: 1,
                                        padding: 14,
                                        borderRadius: 14,
                                        border: "1px solid #ddd",
                                        background: "white",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                    }}
                                >
                                    Seguir comprando
                                </button>

                                <button
                                    onClick={sendOrderToOdoo}
                                    disabled={sending}
                                    style={{
                                        flex: 1,
                                        padding: 14,
                                        borderRadius: 14,
                                        border: 0,
                                        background: "#f1c400",
                                        fontWeight: "bold",
                                        opacity: sending ? 0.6 : 1,
                                        cursor: "pointer",
                                    }}
                                >
                                    {sending ? "Enviando..." : "Confirmar pedido"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        );
    }