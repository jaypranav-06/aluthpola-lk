import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Query all partners
    const result = await query(
      `SELECT id, name, logo, description, website, commission, is_active, created_at
       FROM partners
       WHERE is_active = true
       ORDER BY name ASC`
    );

    return NextResponse.json({
      success: true,
      partners: result.rows,
    });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, logo, description, website, commission } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Partner name is required" },
        { status: 400 }
      );
    }

    // Check if partner already exists
    const existingPartner = await query(
      `SELECT id FROM partners WHERE name = $1`,
      [name]
    );

    if (existingPartner.rows.length > 0) {
      return NextResponse.json(
        { error: "Partner with this name already exists" },
        { status: 409 }
      );
    }

    // Insert new partner
    const result = await query(
      `INSERT INTO partners (name, logo, description, website, commission, is_active)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING id, name, logo, description, website, commission, is_active, created_at`,
      [name, logo || null, description || null, website || null, commission || 0]
    );

    return NextResponse.json({
      success: true,
      partner: result.rows[0],
      message: "Partner created successfully",
    });
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
