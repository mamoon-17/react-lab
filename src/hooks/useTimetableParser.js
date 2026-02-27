import { useMemo } from "react";

export default function useTimetableParser(fileData) {
  return useMemo(() => {
    if (!fileData) return [];

    return fileData.map((row) => ({
      course: row.Course,
      time: row.Time,
      venue: row.Venue,
      section: row.Section || null,
    }));
  }, [fileData]);
}
