import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

// Ensure the store_settings table exists
async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS store_settings (
      key   VARCHAR(100) PRIMARY KEY,
      value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

const DEFAULTS: Record<string, string> = {
  store_name:              "Aluthpola.lk",
  store_tagline:           "Your trusted online store",
  contact_email:           "hello@aluthpola.lk",
  contact_phone:           "",
  store_address:           "",
  currency:                "LKR",
  timezone:                "Asia/Colombo",
  date_format:             "DD/MM/YYYY",
  maintenance_mode:        "false",
  cod_enabled:             "true",
  free_shipping_threshold: "5000",
  default_shipping_cost:   "300",
  meta_title:              "Aluthpola.lk",
  meta_description:        "Your trusted online store in Sri Lanka",
  google_analytics_id:     "",
  gtm_id:                  "",
  low_stock_alert:         "true",
  new_order_alert:         "true",
  new_user_alert:          "false",
  notification_email:      "",
  accent_color:            "#f97316",
};

export async function GET() {
  try {
    await ensureTable();
    const res = await query(`SELECT key, value FROM store_settings`);
    const settings: Record<string, string> = { ...DEFAULTS };
    for (const row of res.rows) settings[row.key] = row.value;
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable();
    const body = await req.json();

    // Handle password change separately
    if (body.action === "change_password") {
      const { admin_id, current_password, new_password } = body;
      if (!admin_id || !current_password || !new_password)
        return NextResponse.json({ error: "All password fields required" }, { status: 400 });

      const userRes = await query(`SELECT password_hash FROM users WHERE id = $1`, [admin_id]);
      if (!userRes.rows.length)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

      const valid = await bcrypt.compare(current_password, userRes.rows[0].password_hash);
      if (!valid)
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

      if (new_password.length < 8)
        return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });

      const hash = await bcrypt.hash(new_password, 12);
      await query(`UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [hash, admin_id]);
      return NextResponse.json({ success: true, message: "Password updated successfully" });
    }

    // Upsert all settings
    const { settings } = body as { settings: Record<string, string> };
    if (!settings) return NextResponse.json({ error: "No settings provided" }, { status: 400 });

    for (const [key, value] of Object.entries(settings)) {
      await query(`
        INSERT INTO store_settings (key, value, updated_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP
      `, [key, value]);
    }

    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
