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

export async function GET() {
  try {
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

    const products = await callXmlRpc(object, "execute_kw", [
      db,
      uid,
      apiKey,
      "product.product",
      "search_read",
      [[]],
      {
        fields: [
          "id",
          "name",
          "default_code",
          "list_price",
          "qty_available",
          "image_128",
          "categ_id",
          "uom_id",
        ],
        limit: 80,
      },
    ]);

    return NextResponse.json({
      ok: true,
      products,
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error.message,
    });
  }
}