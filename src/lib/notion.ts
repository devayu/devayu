import { Client } from "@notionhq/client";
import {
  NotionFile,
  NotionPage,
  NotionProperty,
  NotionRichText,
  TransformedNotionItem,
} from "@/types";

// Initialize Notion client
export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Helper function to extract plain text from rich text
export const getPlainText = (richText: NotionRichText[]): string => {
  return richText?.map((text) => text.plain_text).join("") || "";
};

// Helper function to get property value
export const getPropertyValue = (
  properties: Record<string, NotionProperty>,
  propertyName: string
): string | number | boolean | string[] | NotionFile[] | null | undefined => {
  const property = properties[propertyName];

  if (!property) return null;

  switch (property.type) {
    case "title":
      return property.title ? getPlainText(property.title) : null;
    case "rich_text":
      return property.rich_text ? getPlainText(property.rich_text) : null;
    case "select":
      return property.select?.name || null;
    case "multi_select":
      return property.multi_select?.map((item) => item.name) || [];
    case "date":
      return property.date?.start || null;
    case "checkbox":
      return property.checkbox ?? false;
    case "url":
      return property.url;
    case "files":
      return property.files || [];
    default:
      return null;
  }
};

// Fetches every page in the fragments database, flattened into plain values.
export const getFragments = async (): Promise<TransformedNotionItem[]> => {
  const databaseId = process.env.NOTION_DB_ID;
  if (!databaseId) {
    throw new Error("NOTION_DB_ID is not configured");
  }

  const response = await notion.databases.query({ database_id: databaseId });

  return response.results.map((page) => {
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
  });
};
