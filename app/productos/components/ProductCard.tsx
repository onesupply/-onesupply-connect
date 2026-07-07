export default function ProductCard({ product, addToCart }: any) {
  return (
    <div
      style={{
        background: "white",
        marginBottom: 12,
        padding: 16,
        borderRadius: 18,
        border: "1px solid #e5e5e5",
      }}
    >
      <strong>{product.name}</strong>
      <p>Ref: {product.default_code || "-"}</p>
      <p>Precio: {product.list_price} €</p>
      <p>Stock: {product.qty_available}</p>

      <button
        onClick={() => addToCart(product)}
        style={{
          padding: "12px 16px",
          borderRadius: 12,
          border: 0,
          background: "#f1c400",
          fontWeight: "bold",
        }}
      >
        Añadir
      </button>
    </div>
  );
}