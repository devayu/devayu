import { getFragments } from "@/lib/notion";
import { NotionAPIResponse } from "@/types";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<NotionAPIResponse>> {
  try {
    const data = await getFragments();
    return NextResponse.json({
      success: true,
      data,
      total_count: data.length,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Notion API Error:", error);

    return NextResponse.json(
      {
        success: false,
        data: [],
        total_count: 0,
        error: "Failed to fetch from Notion",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
