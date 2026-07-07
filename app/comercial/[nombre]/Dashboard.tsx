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
      <section style={hero}>
        <p style={label}>Área comercial</p>

        <h1 style={title}>Hola {nombre} 👋</h1>

        <p style={subtitle}>{saludo}, bienvenido a OneSupply Connect</p>
      </section>

      <div style={statsGrid}>
        <Card emoji="👥" titulo="Clientes" valor="--" color="#1677ff" />
        <Card emoji="📦" titulo="Pedidos" valor="--" color="#25D366" />
        <Card emoji="💶" titulo="Ventas" valor="-- €" color="#f1c400" />
        <Card emoji="🔗" titulo="Activos" valor="--" color="#ff6b00" />
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

function Card({ emoji, titulo, valor, color }: CardProps) {
  return (
    <div style={card}>
      <div style={{ ...icon, background: color }}>{emoji}</div>

      <div>
        <p style={cardTitle}>{titulo}</p>
        <strong style={cardValue}>{valor}</strong>
      </div>
    </div>
  );
}

const hero = {
  background: "linear-gradient(135deg,#2d2d2d,#1b1b1b)",
  color: "white",
  borderRadius: 24,
  padding: "20px 22px",
  marginBottom: 16,
  boxShadow: "0 8px 22px rgba(0,0,0,.16)",
};

const label = {
  margin: 0,
  color: "#f1c400",
  fontSize: 15,
  fontWeight: 700,
};

const title = {
  margin: "8px 0 4px",
  fontSize: 30,
  lineHeight: "34px",
};

const subtitle = {
  margin: 0,
  color: "#d8d8d8",
  fontSize: 15,
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 12,
  marginBottom: 18,
};

const card = {
  background: "white",
  borderRadius: 18,
  padding: 14,
  border: "1px solid #ececec",
  boxShadow: "0 4px 12px rgba(0,0,0,.04)",
  display: "flex",
  alignItems: "center",
  gap: 12,
  minHeight: 78,
};

const icon = {
  width: 42,
  height: 42,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 23,
  flexShrink: 0,
};

const cardTitle = {
  margin: 0,
  color: "#666",
  fontSize: 13,
};

const cardValue = {
  display: "block",
  marginTop: 4,
  fontSize: 22,
};