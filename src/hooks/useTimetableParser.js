import { useMemo } from "react";

export default function useTimetableParser(fileData) {
  const parsedData = useMemo(() => {
    if (!fileData) return [];

    const lines = fileData.split("\n");

    const dataLines = lines.slice(1);

    const structured = dataLines
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const values = line.split(",");

        return {
          course: values[0].trim(),
          time: values[1].trim(),
          venue: values[2].trim(),
          section: values[3].trim() || null,
        };
      });

    return structured;
  }, [fileData]);

  return parsedData;
}
