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

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;

    const url = process.env.ODOO_URL!;
    const db = process.env.ODOO_DATABASE!;
    const username = process.env.ODOO_USER!;
    const apiKey = process.env.ODOO_API_KEY!;

    const common = xmlrpc.createClient({ url: `${url}/xmlrpc/2/common` });
    const object = xmlrpc.createClient({ url: `${url}/xmlrpc/2/object` });

    const uid = await callXmlRpc(common, "authenticate", [
      db,
      username,
      apiKey,
      {},
    ]);

    const orders: any = await callXmlRpc(object, "execute_kw", [
      db,
      uid,
      apiKey,
      "sale.order",
      "search_read",
      [["name", "=", `S00${params.id.replace("S00", "")}`]],
      {
        fields: [
          "id",
          "name",
          "date_order",
          "amount_total",
          "state",
          "order_line",
        ],
        limit: 1,
      },
    ]);

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        ok: false,
        error: "Pedido no encontrado",
      });
    }

    const order = orders[0];

    const lines: any = await callXmlRpc(object, "execute_kw", [
      db,
      uid,
      apiKey,
      "sale.order.line",
      "search_read",
      [[["order_id", "=", order.id]]],
      {
        fields: [
          "id",
          "name",
          "product_id",
          "product_uom_qty",
          "price_unit",
          "price_subtotal",
        ],
      },
    ]);

    return NextResponse.json({
      ok: true,
      order: {
        ...order,
        lines,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error.message,
    });
  }
}