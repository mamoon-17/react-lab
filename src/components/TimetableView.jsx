import { useMemo, useState, useCallback } from "react";
import { useTimetableContext } from "../context/TimetableContext";

export default function TimetableView() {
  const { timetable, clashReport } = useTimetableContext();

  const [showOnlyClashes, setShowOnlyClashes] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Compute clash data
  const timetableWithClashes = useMemo(() => {
    if (!timetable.length) return [];

    return timetable.map((item) => {
      const clashMatch = clashReport.find(
        (clash) =>
          clash.course === item.course && clash.section === item.section,
      );
      return {
        ...item,
        clashCount: clashMatch ? clashMatch.clashCount : 0,
      };
    });
  }, [timetable, clashReport]);

  // Filter only clashing courses
  const filterClashingCourses = useCallback((data) => {
    return data.filter((item) => item.clashCount > 0);
  }, []);

  // Sort function
  const sortData = useCallback((data, config) => {
    if (!config.key) return data;

    const sortedData = [...data].sort((a, b) => {
      const aValue = a[config.key];
      const bValue = b[config.key];

      if (aValue === bValue) return 0;

      if (config.key === "clashCount") {
        // Numeric sort for clash count
        return config.direction === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        // String sort for other fields
        const aStr = String(aValue || "").toLowerCase();
        const bStr = String(bValue || "").toLowerCase();

        if (aStr < bStr) return config.direction === "asc" ? -1 : 1;
        if (aStr > bStr) return config.direction === "asc" ? 1 : -1;
        return 0;
      }
    });

    return sortedData;
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const displayedData = useMemo(() => {
    let data = showOnlyClashes
      ? filterClashingCourses(timetableWithClashes)
      : timetableWithClashes;
    return sortData(data, sortConfig);
  }, [
    showOnlyClashes,
    timetableWithClashes,
    filterClashingCourses,
    sortData,
    sortConfig,
  ]);

  const getSortIndicator = (columnKey) => {
    if (sortConfig.key !== columnKey) return " ⇅";
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  if (!timetable.length) {
    return (
      <div className="empty-state">
        <h3>No Timetable Data</h3>
        <p>Please upload a timetable file to view the schedule.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Timetable</h2>

      <button
        onClick={() => setShowOnlyClashes((prev) => !prev)}
        style={{ marginBottom: "1rem" }}
      >
        {showOnlyClashes ? "Show All Courses" : "Show Only Clashing Courses"}
      </button>

      {displayedData.length === 0 ? (
        <div className="empty-state">
          <h3>No Clashing Courses Found</h3>
          <p>Great! There are no courses with timetable clashes.</p>
        </div>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th
                onClick={() => handleSort("course")}
                className="sortable-header"
              >
                Course{getSortIndicator("course")}
              </th>
              <th
                onClick={() => handleSort("time")}
                className="sortable-header"
              >
                Time{getSortIndicator("time")}
              </th>
              <th
                onClick={() => handleSort("venue")}
                className="sortable-header"
              >
                Venue{getSortIndicator("venue")}
              </th>
              <th
                onClick={() => handleSort("clashCount")}
                className="sortable-header"
              >
                Clash Count{getSortIndicator("clashCount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedData.map((item, index) => (
              <tr
                key={index}
                className={item.clashCount > 0 ? "clash-row" : ""}
              >
                <td>{item.course}</td>
                <td>{item.time}</td>
                <td>{item.venue}</td>
                <td>{item.clashCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
