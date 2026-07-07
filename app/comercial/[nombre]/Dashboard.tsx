type DashboardProps = {
  nombre: string;
};

export default function Dashboard({ nombre }: DashboardProps) {
  const hora = new Date().getHours();

  let saludo = "Buenas noches";

  if (hora >= 6 && hora < 12) saludo = "Buenos días";
  else if (hora >= 12 && hora < 20) saludo = "Buenas tardes";

  return (
    <>
      <section
        style={{
          background: "linear-gradient(135deg,#2d2d2d,#1b1b1b)",
          color: "white",
          borderRadius: 28,
          padding: 30,
          marginBottom: 24,
          boxShadow: "0 12px 30px rgba(0,0,0,.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: "#f1c400",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              Área Comercial
            </p>

            <h1
              style={{
                margin: "12px 0 8px",
                fontSize: 38,
                lineHeight: "42px",
              }}
            >
              Hola {nombre} 👋
            </h1>

            <p
              style={{
                margin: 0,
                color: "#d8d8d8",
                fontSize: 18,
              }}
            >
              {saludo}, bienvenido a OneSupply Connect
            </p>
          </div>

          <div
            style={{
              background: "#f1c400",
              color: "#222",
              padding: "18px 24px",
              borderRadius: 18,
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            🚀 Listo para empezar
          </div>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <Card
          emoji="👥"
          titulo="Clientes"
          valor="--"
          color="#1677ff"
        />

        <Card
          emoji="📦"
          titulo="Pedidos hoy"
          valor="--"
          color="#25D366"
        />

        <Card
          emoji="💶"
          titulo="Ventas hoy"
          valor="-- €"
          color="#f1c400"
        />

        <Card
          emoji="🔗"
          titulo="Clientes activos"
          valor="--"
          color="#ff6b00"
        />
      </div>
    </>
  );
}

type CardProps = {
  emoji: string;
  titulo: string;
  valor: string;
  color: string;
};

function Card({
  emoji,
  titulo,
  valor,
  color,
}: CardProps) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 22,
        padding: 22,
        border: "1px solid #ececec",
        boxShadow: "0 5px 15px rgba(0,0,0,.05)",
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 14,
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          marginBottom: 18,
        }}
      >
        {emoji}
      </div>

      <div
        style={{
          color: "#666",
          fontSize: 15,
        }}
      >
        {titulo}
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        {valor}
      </div>
    </div>
  );
}