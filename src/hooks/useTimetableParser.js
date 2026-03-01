import { useMemo } from "react";

export default function useTimetableParser(fileData) {
  return useMemo(() => {
    if (!fileData) return [];

    return fileData.map((row) => ({
      course: row["Course Name"] || row.Course || undefined,
      time: row.Time || row["Time"] || undefined,
      venue: row.Venue || row["Venue"] || undefined,
      section: row.Section || row["Section"] || undefined,
      regCount:
        row["Reg. Count"] || row["Reg Count"] || row["Reg. Count"] || undefined,
    }));
  }, [fileData]);
}
