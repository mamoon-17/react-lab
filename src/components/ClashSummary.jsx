import { useMemo } from "react";
import { useTimetableContext } from "../context/TimetableContext";

export default function ClashSummary() {
  const { timetable, clashReport } = useTimetableContext();

  const timetableWithClashes = useMemo(() => {
    if (!timetable.length) return [];

    return timetable.map((item) => {
      const clashMatch = clashReport.find(
        (clash) =>
          clash.course === item.course && clash.section === item.section,
      );
      return {
        ...item,
        clashCount: clashMatch ? Number(clashMatch.clashCount) : 0,
      };
    });
  }, [timetable, clashReport]);

  const totalClashes = useMemo(() => {
    return timetableWithClashes.reduce((sum, item) => sum + item.clashCount, 0);
  }, [timetableWithClashes]);

  const clashCountPerTimeSlot = useMemo(() => {
    const summary = {};

    timetableWithClashes.forEach((item) => {
      // Skip items with undefined or empty time
      if (!item.time || item.time === "undefined") return;

      if (!summary[item.time]) {
        summary[item.time] = 0;
      }

      summary[item.time] += item.clashCount;
    });

    return summary;
  }, [timetableWithClashes]);

  if (!timetable.length) return null;

  return (
    <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
      <h2>Clash Summary</h2>

      <h3>Total Clashing Students: {totalClashes}</h3>

      <h3>Clash Count Per Time Slot</h3>
      <ul>
        {Object.entries(clashCountPerTimeSlot).map(([time, total]) => (
          <li key={time}>
            {time} → {total} students
          </li>
        ))}
      </ul>
    </div>
  );
}
