"use client";

import { Calendar } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

import { TransformedNotionItem } from "@/types";

interface NotionGridProps {
  data: TransformedNotionItem[];
  title?: string;
  columns?: 2 | 3 | 4;
  showImages?: boolean;
  showDates?: boolean;
  showTags?: boolean;
  loading?: boolean;
  error?: string | null;
}

const NotionGrid = ({
  data,
  columns = 3,
  showImages = true,
  showDates = true,
  loading = false,
  error = null,
}: NotionGridProps) => {
  const gridClasses = {
    2: "columns-1 sm:columns-2",
    3: "columns-1 sm:columns-2 lg:columns-3",
    4: "columns-1 sm:columns-2 lg:columns-3 xl:columns-4",
  };

  if (loading && data.length === 0) {
    return (
      <div className="space-y-6">
        <div className={`${gridClasses[columns]} gap-4 space-y-4`}>
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="break-inside-avoid animate-pulse">
              <CardContent className="p-0">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-2">Unable to load data</h3>
          <p className="text-red-500 mb-4 text-sm">{error}</p>
          <div className="space-x-2">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
            >
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getImageUrl = (item: TransformedNotionItem): string | null => {
    if (item.cover?.url) {
      return item.cover.url;
    }

    if (item.icon?.url && item.icon.type !== "emoji") {
      return item.icon.url;
    }

    // Priority 3: File properties (uploaded images)
    const imageFields = [
      "image",
      "images",
      "photo",
      "photos",
      "picture",
      "pictures",
      "thumbnail",
      "file",
      "files",
      "media",
      "url",
    ];

    for (const field of imageFields) {
      const value = item[field];

      if (Array.isArray(value) && value.length > 0) {
        const firstFile = value[0];
        if (
          typeof firstFile === "object" &&
          firstFile &&
          "url" in firstFile &&
          typeof firstFile.url === "string"
        ) {
          return firstFile.url;
        }
        if (typeof firstFile === "string" && firstFile.startsWith("http")) {
          return firstFile;
        }
      }

      if (
        value &&
        typeof value === "object" &&
        "url" in value &&
        typeof value.url === "string"
      ) {
        return value.url;
      }

      if (typeof value === "string") {
        return value;
      }
    }

    return null;
  };

  const getTitle = (item: TransformedNotionItem): string | null => {
    const titleFields = ["name", "title", "heading", "subject"];

    for (const field of titleFields) {
      const value = item[field];
      if (value && typeof value === "string") return value;
    }
    return null;
  };

  const getDescription = (item: TransformedNotionItem): string | null => {
    const descFields = [
      "description",
      "content",
      "summary",
      "excerpt",
      "notes",
    ];

    for (const field of descFields) {
      const value = item[field];
      if (value && typeof value === "string") return value;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"></div>
      <>
        <div className={`${gridClasses[columns]} gap-4 space-y-4`}>
          {data.map((item, index) => {
            const imageUrl = getImageUrl(item);
            const title = getTitle(item);
            const description = getDescription(item);

            return (
              <Card
                key={item.id}
                className="break-inside-avoid hover:shadow-lg transition-all duration-300 group overflow-hidden bg-black/40 backdrop-blur-md border border-border/50 hover:border-primary/30 pb-0"
              >
                <CardContent className="p-0">
                  {showImages && imageUrl && (
                    <div className="relative overflow-hidden max-w-md max-h-80">
                      <Image
                        src={imageUrl}
                        alt={title ?? `random thought-${index}`}
                        width={400}
                        height={300}
                        className="max-w-md max-h-80 w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold font-space-grotesk line-clamp-2 transition-colors">
                      {title}
                    </h3>

                    {description && (
                      <p className="text-sm line-clamp-3 leading-relaxed font-hanken-grotesk font-semibold text-muted-foreground italic">
                        &quot;{description}&quot;
                      </p>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-border/50">
                      {showDates && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.created_time).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </>
    </div>
  );
};

export default NotionGrid;
