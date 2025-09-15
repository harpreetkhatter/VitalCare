import { SessionChartTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from"@/config/db"
import {currentUser} from "@clerk/nextjs/server"
import { desc, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const { notes, selectedDoctor } = await req.json();
    const user = await currentUser();
    try {
        // Remove sessionId if not present in schema or ensure correct type
        const result = await db.insert(SessionChartTable).values({
            sessionId: uuidv4(),
            createdBy: user?.primaryEmailAddress?.emailAddress!,
            notes: notes,
            selectedDoctor: selectedDoctor,
      
            //@ts-ignore
        }).returning()
        return NextResponse.json(result);

    } catch (e) {
        console.error("Error inserting session chart:", e);
        return new Response("Error inserting session chart", { status: 500 });
    }}
    
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const user = await currentUser();
  if(sessionId==="all"){
      const result = await db
      .select()
      .from(SessionChartTable)
      .where(eq(SessionChartTable.createdBy, user?.primaryEmailAddress?.emailAddress!))
      .orderBy(desc(SessionChartTable.id));

    return NextResponse.json(result);

  }else{
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