import { Client } from "@notionhq/client";
import { NotionRichText, NotionProperty, NotionFile } from "@/types";

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
