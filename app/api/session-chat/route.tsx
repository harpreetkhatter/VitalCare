import { SessionChartTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/config/db"
import { currentUser } from "@clerk/nextjs/server"
import { desc, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { notes, selectedDoctor, sessionId, callDuration } = await req.json();
  const user = await currentUser();

  // If sessionId and callDuration are provided, update the existing session
  if (sessionId && callDuration !== undefined) {
    try {
      const result = await db
        .update(SessionChartTable)
        .set({ callDuration: callDuration })
        .where(eq(SessionChartTable.sessionId, sessionId))
        .returning();
      return NextResponse.json(result[0]);
    } catch (e) {
      console.error("Error updating call duration:", e);
      return new Response("Error updating call duration", { status: 500 });
    }
  }

  // Otherwise, create a new session
  try {
    const result = await db.insert(SessionChartTable).values({
      sessionId: uuidv4(),
      createdBy: user?.primaryEmailAddress?.emailAddress!,
      notes: notes,
      selectedDoctor: selectedDoctor,
      callDuration: 0,
      //@ts-ignore
    }).returning()
    return NextResponse.json(result);

  } catch (e) {
    console.error("Error inserting session chart:", e);
    return new Response("Error inserting session chart", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const user = await currentUser();
  if (sessionId === "all") {
    const result = await db
      .select()
      .from(SessionChartTable)
      .where(eq(SessionChartTable.createdBy, user?.primaryEmailAddress?.emailAddress!))
      .orderBy(desc(SessionChartTable.id));

    return NextResponse.json(result);

  } else {
    try {
      const result = await db
        .select()
        .from(SessionChartTable)
        .where(eq(SessionChartTable.sessionId, sessionId!));

      return NextResponse.json(result[0]);
    } catch (e) {
      console.error("Error fetching session charts:", e);
      return new Response("Error fetching session charts: " + e, { status: 500 });
    }
  }
}