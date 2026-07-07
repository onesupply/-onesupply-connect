export default function Cart({
  cart,
  total,
  sending,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  sendOrderToOdoo,
}: any) {
  if (cart.length === 0) return null;

  return (
    <div style={{ background: "#2f2f2f", color: "white", padding: 18, borderRadius: 22, marginBottom: 18 }}>
      <h2 style={{ marginTop: 0 }}>🛒 Carrito</h2>

      {cart.map((item: any) => (
        <div key={item.id} style={{ background: "#444", padding: 14, borderRadius: 16, marginBottom: 10 }}>
          <strong>{item.name}</strong>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
            <button onClick={() => decreaseQuantity(item.id)} style={{ width: 36, height: 36 }}>−</button>
            <strong style={{ fontSize: 18 }}>{item.quantity}</strong>
            <button onClick={() => increaseQuantity(item.id)} style={{ width: 36, height: 36 }}>+</button>
            <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: "auto" }}>Quitar</button>
          </div>

          <p style={{ marginBottom: 0 }}>
            {(Number(item.list_price || 0) * item.quantity).toFixed(2)} €
          </p>
        </div>
      ))}

      <h3>Total: {total.toFixed(2)} €</h3>

      <button
        onClick={sendOrderToOdoo}
        disabled={sending}
        style={{
          padding: "16px 18px",
          borderRadius: 14,
          border: 0,
          background: "#f1c400",
          fontWeight: "bold",
          width: "100%",
          marginTop: 8,
          opacity: sending ? 0.6 : 1,
          fontSize: 16,
        }}
      >
        {sending ? "Enviando pedido..." : "Enviar pedido a Odoo"}
      </button>
    </div>
  );
}