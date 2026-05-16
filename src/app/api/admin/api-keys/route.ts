import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Query all API keys with partner names
    const result = await query(
      `SELECT
        pak.id,
        pak.partner_id,
        p.name as partner_name,
        pak.platform,
        pak.api_key,
        pak.api_secret,
        pak.endpoint_url,
        pak.is_active,
        pak.last_sync_at,
        pak.sync_status,
        pak.created_at
       FROM partner_api_keys pak
       LEFT JOIN partners p ON pak.partner_id = p.id
       ORDER BY pak.created_at DESC`
    );

    return NextResponse.json({
      success: true,
      apiKeys: result.rows,
    });
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partner_id, platform, api_key, api_secret, endpoint_url } = body;

    // Validate required fields
    if (!partner_id || !platform || !api_key) {
      return NextResponse.json(
        { error: "Partner, platform, and API key are required" },
        { status: 400 }
      );
    }

    // Check if partner exists
    const partnerCheck = await query(
      `SELECT id FROM partners WHERE id = $1`,
      [partner_id]
    );

    if (partnerCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }

    // Check if API key already exists for this partner/platform combo
    const existingKey = await query(
      `SELECT id FROM partner_api_keys WHERE partner_id = $1 AND platform = $2`,
      [partner_id, platform]
    );

    if (existingKey.rows.length > 0) {
      return NextResponse.json(
        { error: "API key already exists for this partner and platform" },
        { status: 409 }
      );
    }

    // Insert new API key
    const result = await query(
      `INSERT INTO partner_api_keys (partner_id, platform, api_key, api_secret, endpoint_url, is_active, sync_status)
       VALUES ($1, $2, $3, $4, $5, true, 'pending')
       RETURNING id, partner_id, platform, api_key, is_active, sync_status, created_at`,
      [partner_id, platform, api_key, api_secret || null, endpoint_url || null]
    );

    return NextResponse.json({
      success: true,
      apiKey: result.rows[0],
      message: "API key added successfully",
    });
  } catch (error) {
    console.error("Error creating API key:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
