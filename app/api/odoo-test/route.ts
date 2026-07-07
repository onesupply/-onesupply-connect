import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    ODOO_URL: process.env.ODOO_URL,
    ODOO_DATABASE: process.env.ODOO_DATABASE,
    ODOO_USER: process.env.ODOO_USER,
    ODOO_API_KEY: process.env.ODOO_API_KEY,
  });
}