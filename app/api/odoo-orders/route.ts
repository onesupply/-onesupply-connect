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
    const { cliente } = body;

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
      [[["partner_id", "=", cliente.id]]],
      {
        fields: ["id", "name", "date_order", "amount_total", "state"],
        limit: 5,
        order: "date_order desc",
      },
    ]);

    const orderIds = orders.map((order: any) => order.id);

    const lines: any = orderIds.length
      ? await callXmlRpc(object, "execute_kw", [
          db,
          uid,
          apiKey,
          "sale.order.line",
          "search_read",
          [[["order_id", "in", orderIds]]],
          {
            fields: [
              "id",
              "order_id",
              "product_id",
              "name",
              "product_uom_qty",
              "price_unit",
              "price_subtotal",
            ],
          },
        ])
      : [];

    const ordersWithLines = orders.map((order: any) => ({
      ...order,
      lines: lines.filter(
        (line: any) => Array.isArray(line.order_id) && line.order_id[0] === order.id
      ),
    }));

    return NextResponse.json({
      ok: true,
      orders: ordersWithLines,
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error.message,
    });
  }
}