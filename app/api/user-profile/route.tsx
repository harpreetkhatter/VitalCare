import { db } from "@/config/db";
import { userProfileTable } from "@/config/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET - Fetch user profile
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db
      .select()
      .from(userProfileTable)
      .where(eq(userProfileTable.clerkId, userId));

    if (profile.length === 0) {
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({ profile: profile[0] });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// POST - Create or update user profile
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { dateOfBirth, gender, conditions, allergies, height, weight } = body;

    // Check if profile exists
    const existingProfile = await db
      .select()
      .from(userProfileTable)
      .where(eq(userProfileTable.clerkId, userId));

    if (existingProfile.length > 0) {
      // Update existing profile
      const updated = await db
        .update(userProfileTable)
        .set({
          dateOfBirth,
          gender,
          conditions,
          allergies,
          height,
          weight,
          updatedAt: new Date(),
        })
        .where(eq(userProfileTable.clerkId, userId))
        .returning();

      return NextResponse.json({ profile: updated[0], message: "Profile updated successfully" });
    } else {
      // Create new profile
      const created = await db
        .insert(userProfileTable)
        .values({
          clerkId: userId,
          dateOfBirth,
          gender,
          conditions,
          allergies,
          height,
          weight,
        })
        .returning();

      return NextResponse.json({ profile: created[0], message: "Profile created successfully" });
    }
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
