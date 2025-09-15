
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { usersTable } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user ID
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the full user object to access email and name
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the primary email address
    const emailAddress = user.emailAddresses[0]?.emailAddress;

    if (!emailAddress) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    // Check if user already exists by email
    const existingUsers = await db.select()
      .from(usersTable)
      .where(eq(usersTable.email, emailAddress));

    if (existingUsers.length === 0) {
      // Create new user
      const result = await db.insert(usersTable).values({
        clerkId: userId,
        name: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}`
          : user.firstName || user.lastName || 'Unknown User',
        email: emailAddress,
        credits: 10
      }).returning();
 
      return NextResponse.json(result[0]);
    }

    // Return existing user
    return NextResponse.json(existingUsers[0]);

  } catch (error: any) {
    console.error("API /api/users error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}