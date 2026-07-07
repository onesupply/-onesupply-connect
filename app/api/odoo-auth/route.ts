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

    const common = xmlrpc.createClient({
      url: `${url}/xmlrpc/2/common`,
    });

    const uid = await callXmlRpc(common, "authenticate", [
      db,
      username,
      apiKey,
      {},
    ]);

    return NextResponse.json({
      ok: true,
      uid,
      user: username,
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error.message,
    });
  }
}