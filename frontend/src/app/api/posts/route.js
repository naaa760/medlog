import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { apiRequest } from "@/lib/api";
import { z } from "zod";

// Your backend URL
const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// Schema for creating/updating posts
const postSchema = z.object({
  title: z.string().min(5).max(100),
  subtitle: z.string().max(150).optional(),
  content: z.string().min(10),
  coverImage: z.string().url().optional(),
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

// GET handler for fetching posts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    // Use the apiRequest utility we created
    const data = await apiRequest("/posts?" + searchParams.toString());
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST handler for creating new posts
export async function POST(request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Get clerk token
    const { getToken } = auth();
    const token = await getToken();

    // Call backend using the utility
    const data = await apiRequest(
      "/posts",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      token
    );

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
