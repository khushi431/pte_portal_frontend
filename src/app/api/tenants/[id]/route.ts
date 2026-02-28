import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "ok" });
}

export async function PATCH() {
    return NextResponse.json({ message: "ok" });
}

export async function DELETE() {
    return NextResponse.json({ message: "ok" });
}
