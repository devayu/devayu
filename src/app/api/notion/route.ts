import { getPropertyValue, notion } from "@/lib/notion";
import { NotionAPIResponse, NotionPage, TransformedNotionItem } from "@/types";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<NotionAPIResponse>> {
  try {
    const databaseId = process.env.NOTION_DB_ID as string;

    if (!databaseId) {
      return NextResponse.json(
        {
          success: false,
          data: [],
          total_count: 0,
          error: "Invalid database specified or database ID not configured",
        },
        { status: 400 }
      );
    }

    const response = await notion.databases.query({ database_id: databaseId });

    const transformedResults: TransformedNotionItem[] = response.results.map(
      (page) => {
        const notionPage = page as NotionPage;
        const properties = notionPage.properties;

        const transformed: TransformedNotionItem = {
          id: notionPage.id,
          created_time: notionPage.created_time,
          last_edited_time: notionPage.last_edited_time,
          url: notionPage.url,
        };

        if (notionPage.cover) {
          transformed.cover = {
            type: notionPage.cover.type,
            url: notionPage.cover.url,
            expiry_time: notionPage.cover.expiry_time || null,
          };
        }

        if (notionPage.icon) {
          transformed.icon = {
            type: notionPage.icon.type,
            url: notionPage.icon.url,
          };
        }

        Object.keys(properties).forEach((propertyName) => {
          const key = propertyName.toLowerCase().replace(/\s+/g, "_");
          transformed[key] = getPropertyValue(properties, propertyName);
        });

        return transformed;
      }
    );

    return NextResponse.json({
      success: true,
      data: transformedResults,
      total_count: transformedResults.length,
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
