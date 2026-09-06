import { NextResponse } from "next/server";
import xmlrpc from "xmlrpc";

function callXmlRpc(client: any, method: string, params: any[]) {
  return new Promise((resolve, reject) => {
    client.methodCall(method, params, (error: any, value: any) => {
      if (error) reject(error);
      else resolve(value);
    });
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      cliente,
      cart,
      notes,
      deliveryDate,
      subtotal,
      descuento,
      baseImponible,
      iva,
      total,
    } = body;

    const url = process.env.ODOO_URL!;
    const db = process.env.ODOO_DATABASE!;
    const username = process.env.ODOO_USER!;
    const apiKey = process.env.ODOO_API_KEY!;

    const common = xmlrpc.createClient({
      url: `${url}/xmlrpc/2/common`,
    });

    const object = xmlrpc.createClient({
      url: `${url}/xmlrpc/2/object`,
    });

    const uid = await callXmlRpc(common, "authenticate", [
      db,
      username,
      apiKey,
      {},
    ]);

    const orderLines = cart.map((item: any) => [
      0,
      0,
      {
        product_id: item.id,
        product_uom_qty: item.quantity,

        // El precio de la app lleva IVA incluido.
        // Odoo necesita recibir el precio sin IVA porque después añade el 21%.
        price_unit: Number(item.list_price || 0) / 1.21,

        // Descuento automático por pedido realizado desde la app
        discount: 2,
      },
    ]);

    const orderId = await callXmlRpc(object, "execute_kw", [
      db,
      uid,
      apiKey,
      "sale.order",
      "create",
      [
        {
          partner_id: cliente.id,
          order_line: orderLines,
          note: `
Pedido realizado desde OneSupply Connect

Descuento App: 2%

Observaciones: ${notes || "-"}
Fecha de entrega solicitada: ${deliveryDate || "-"}
Subtotal IVA incluido: ${subtotal || "-"} €
Descuento App (2%): -${descuento || "-"} €
Base imponible: ${baseImponible || "-"} €
IVA: ${iva || "-"} €
Total IVA incluido: ${total || "-"} €
`,
        },
      ],
    ]);

    return NextResponse.json({
      ok: true,
      orderId,
      mensaje: "Pedido creado correctamente",
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error.message,
    });
  }
}