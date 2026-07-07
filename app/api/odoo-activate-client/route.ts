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

function generateToken() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const clientId = body.clientId;

    if (!clientId) {
      return NextResponse.json({ ok: false, error: "Falta clientId" });
    }

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

    const token = generateToken();

    await callXmlRpc(object, "execute_kw", [
      db,
      uid,
      apiKey,
      "res.partner",
      "write",
      [[clientId], {
        x_studio_token_app: token,
        x_studio_app_activa: true,
      }],
    ]);

    const link = `http://localhost:3000/acceso/${token}`;

    return NextResponse.json({
      ok: true,
      token,
      link,
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error.message || "Error activando cliente",
    });
  }
}