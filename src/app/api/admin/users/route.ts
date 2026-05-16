import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Query all users from database
    const result = await query(
      `SELECT id, name, email, phone, role, is_active, created_at, last_login
       FROM users
       ORDER BY created_at DESC`
    );

    return NextResponse.json({
      success: true,
      users: result.rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, role, permissions } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Prepare permissions JSON
    const permissionsJson = permissions || {
      canViewProducts: true,
      canManageOrders: false,
      canManageInventory: false,
      canViewReports: false,
      canManageUsers: false,
    };

    // Insert new user
    const result = await query(
      `INSERT INTO users (name, email, password_hash, phone, role, is_active, email_verified, permissions)
       VALUES ($1, $2, $3, $4, $5, true, true, $6)
       RETURNING id, name, email, phone, role, is_active, permissions, created_at`,
      [name, email, passwordHash, phone || null, role || "user", JSON.stringify(permissionsJson)]
    );

    return NextResponse.json({
      success: true,
      user: result.rows[0],
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
