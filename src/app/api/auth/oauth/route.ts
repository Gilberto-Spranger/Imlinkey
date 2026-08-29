import { NextResponse } from "next/server";
import { api } from "@/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, code_verifier } = body;

    // Troca code por token
    const tokenRes = await api.post("oauth/token/", {
      client_id: "ENVGOTRAVEL_APP",
      code,
      code_verifier,
      grant_type: "authorization_code",
      redirect_uri: "envgotravel://oauth/imlinkey",
    });

    const tokenData = tokenRes.data;

    // Pega dados do user
    const userInfoRes = await api.get("oauth/userinfo/", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userInfo = userInfoRes.data;

    // Map TS User → Backend User
    const mappedUser = {
      id: userInfo.id,
      username: userInfo.username,
      password: null,
      email: userInfo.email,
      phone_number: userInfo.phone,
      first_name: userInfo.full_name?.split(" ")[0] || null,
      last_name: userInfo.full_name?.split(" ")[1] || null,
      age: parseInt(userInfo.age) || null,
      birthdate: userInfo.birth_date || null,
      is_driver: false,
      is_available: false,
      is_superuser: userInfo.is_superuser,
      is_staff: userInfo.is_staff,
      is_active: userInfo.is_active,
      wallet_balance: 0.0,
      profile_picture: userInfo.avatar_url,
      last_login: new Date().toISOString(),
      date_joined: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Upsert via API própria
    const upsertRes = await api.post("users/upsert/", mappedUser);

    return NextResponse.json({
      user: upsertRes.data,
      access_token: tokenData.access_token,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.response?.data || error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const res = await api.get("oauth/apps/");
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.response?.data || error.message }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const res = await api.post("oauth/apps/create/", body);
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.response?.data || error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const res = await api.delete(`oauth/apps/${id}/`);
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.response?.data || error.message }, { status: 400 });
  }
}