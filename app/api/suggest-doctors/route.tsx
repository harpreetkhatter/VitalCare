import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();
  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: JSON.stringify(AIDoctorAgents) },
        {
          role: 'user',
          content: `User Notes/Symptoms: ${notes}. Suggest list of doctors. Return response in JSON only.`
        },
      ],
      max_tokens: 512,   // ✅ prevent hitting 65k limit
    });

    const rawResp = completion.choices[0].message?.content;
    const resp = rawResp?.trim().replace('```json', '').replace('```', '');
    if (!resp) {
      throw new Error("No response content to parse from OpenAI.");
    }
    const JSONResp = JSON.parse(resp);
    
    return NextResponse.json({ JSONResp });
  } catch (error: any) {
    console.error("Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
