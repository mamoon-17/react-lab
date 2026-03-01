/**
 * Export timetable data to CSV format
 * @param {Array} data - The timetable data with clash information
 * @param {string} filename - The name of the file to download
 */
export function exportToCSV(data, filename = "timetable-with-clashes.csv") {
  if (!data || data.length === 0) {
    alert("No data to export.");
    return;
  }

  // Define headers
  const headers = ["Course", "Section", "Time", "Venue", "Clash Count"];

  // Convert data to CSV format
  const csvRows = [];
  csvRows.push(headers.join(","));

  data.forEach((item) => {
    const row = [
      `"${item.course || ""}"`,
      `"${item.section || ""}"`,
      `"${item.time || ""}"`,
      `"${item.venue || ""}"`,
      item.clashCount || 0,
    ];
    csvRows.push(row.join(","));
  });

  const csvContent = csvRows.join("\n");

  // Create a blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export clash summary to CSV format
 * @param {Object} clashCountPerTimeSlot - Object with time slots as keys and clash counts as values
 * @param {number} totalClashes - Total number of clashing students
 * @param {string} filename - The name of the file to download
 */
export function exportClashSummaryToCSV(
  clashCountPerTimeSlot,
  totalClashes,
  filename = "clash-summary.csv",
) {
  if (
    !clashCountPerTimeSlot ||
    Object.keys(clashCountPerTimeSlot).length === 0
  ) {
    alert("No clash summary to export.");
    return;
  }

  const csvRows = [];
  csvRows.push("Clash Summary Report");
  csvRows.push("");
  csvRows.push(`Total Clashing Students,${totalClashes}`);
  csvRows.push("");
  csvRows.push("Time Slot,Clash Count");

  Object.entries(clashCountPerTimeSlot).forEach(([time, count]) => {
    csvRows.push(`"${time}",${count}`);
  });

  const csvContent = csvRows.join("\n");

  // Create a blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
