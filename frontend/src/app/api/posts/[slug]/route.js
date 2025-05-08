import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api";

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    // Get token from request header if available
    const token = request.headers.get("authorization")?.split(" ")[1];

    // Call backend API
    const post = await apiRequest(
      `/posts/${slug}`,
      {
        method: "GET",
      },
      token
    );

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch post" },
      { status: 500 }
    );
  }
}
