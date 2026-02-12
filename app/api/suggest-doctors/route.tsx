import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();

  if (!notes || notes.trim() === '') {
    return NextResponse.json({ error: "Notes are required" }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: JSON.stringify(AIDoctorAgents) },
        {
          role: 'user',
          content: `User Notes/Symptoms: ${notes}. Suggest list of doctors from the provided list. Return response in JSON array format only with the doctor objects.`
        },
      ],
      max_tokens: 512,
    });

    const rawResp = completion.choices[0].message?.content;

    if (!rawResp) {
      console.error("No response from AI");
      // Fallback: return first 3 doctors from the list
      return NextResponse.json({ JSONResp: AIDoctorAgents.slice(0, 3) });
    }

    const resp = rawResp.trim().replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const JSONResp = JSON.parse(resp);

      // Ensure it's an array
      if (Array.isArray(JSONResp)) {
        return NextResponse.json({ JSONResp });
      } else if (JSONResp.doctors && Array.isArray(JSONResp.doctors)) {
        return NextResponse.json({ JSONResp: JSONResp.doctors });
      } else {
        // Fallback to first 3 doctors
        return NextResponse.json({ JSONResp: AIDoctorAgents.slice(0, 3) });
      }
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      // Fallback: return first 3 doctors
      return NextResponse.json({ JSONResp: AIDoctorAgents.slice(0, 3) });
    }

  } catch (error: any) {
    console.error("Error in suggest-doctors:", error);
    // Fallback: return first 3 doctors from the list
    return NextResponse.json({ JSONResp: AIDoctorAgents.slice(0, 3) });
  }
}
