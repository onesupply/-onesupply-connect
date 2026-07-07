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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const token = searchParams.get("token")?.trim().toUpperCase();

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

    let domain: any[] = [["customer_rank", ">", 0]];

    if (q) {
      domain = [
        "&",
        ["customer_rank", ">", 0],
        "|",
        ["name", "ilike", q],
        ["phone", "ilike", q],
      ];
    }

    if (token) {
      domain = [
        "&",
        ["x_studio_token_app", "=", token],
        ["x_studio_app_activa", "=", true],
      ];
    }

    const customers = await callXmlRpc(object, "execute_kw", [
      db,
      uid,
      apiKey,
      "res.partner",
      "search_read",
      [domain],
      {
        fields: [
          "id",
          "name",
          "email",
          "phone",
          "city",
          "x_studio_token_app",
          "x_studio_app_activa",
        ],
        limit: 20,
        order: "name asc",
      },
    ]);

    if (token) {
      return NextResponse.json({
        ok: Array.isArray(customers) && customers.length > 0,
        cliente: Array.isArray(customers) ? customers[0] : null,
      });
    }

    return NextResponse.json({
      ok: true,
      count: Array.isArray(customers) ? customers.length : 0,
      customers,
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error.message,
    });
  }
}