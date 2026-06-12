import { createUser, createUserToken, hasEmail } from "@/services/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ message: "Invalid credentials" });
  }

  const has = await hasEmail(email);
  if (has) return NextResponse.json({ message: "Email already exists" });

  const newUser = await createUser(name, email, password);
  if (!newUser) return NextResponse.json({ error: "User creation failed" });

  const token = await createUserToken(newUser.id);

  return NextResponse.json({ user: newUser, token }, { status: 201 });
}
