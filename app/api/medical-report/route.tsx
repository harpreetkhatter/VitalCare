import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";
import { SessionChartTable } from "@/config/schema";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";

const REPORT_GEN_PROMPT = `You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on doctor AI agent info and conversation between user and AI medical agent, generate a structured report with the following fields:

{
  "sessionId": "string",
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "chiefComplaint": "string",
  "summary": "string",
  "symptoms": ["symptom1", "symptom2"],
  "duration": "string",
  "severity": "string",
  "medicationsMentioned": ["med1", "med2"],
  "recommendations": ["rec1", "rec2"]
}

Only include valid fields. Respond with nothing else.`

export async function POST(req: NextRequest) {
  try {
    const { sessionId, messages, sessionDetail } = await req.json();

    if (!sessionId || !messages || !sessionDetail) {
      return NextResponse.json(
        { error: "Missing required fields (sessionId, messages, sessionDetail)" },
        { status: 400 }
      );
    }



    const UserInput =
      "AI Doctor Agent Info: " +
      JSON.stringify(sessionDetail) +
      " , Conversation:" +
      JSON.stringify(messages);

    // ✅ Use a valid OpenAI model
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // change if needed
      messages: [
        { role: "system", content: REPORT_GEN_PROMPT },
        { role: "user", content: UserInput },
      ],
    });

    const rawResp = completion.choices[0].message?.content;
    if (!rawResp) {
      throw new Error("No response content from AI.");
    }

    const cleanedResp = rawResp.trim().replace("```json", "").replace("```", "");
    let JSONResp;
    try {
      JSONResp = JSON.parse(cleanedResp);
    } catch (err) {
      console.error("Invalid JSON from AI:", cleanedResp);
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: cleanedResp },
        { status: 500 }
      );
    }

   

    // ✅ Save to DB
    const result = await db
      .update(SessionChartTable)
      .set({
        report: JSONResp,
        conversation: JSON.stringify(messages),
      })
      .where(eq(SessionChartTable.sessionId, sessionId))
      .returning();

   

    return NextResponse.json(JSONResp);
  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
