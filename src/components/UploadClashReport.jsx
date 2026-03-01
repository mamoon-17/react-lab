import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useTimetableContext } from "../context/TimetableContext";

export default function UploadClashReport() {
  const clashRef = useRef(null);
  const { setClashReport } = useTimetableContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleFileChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0].name);
    } else {
      setSelectedFile(null);
    }
  }

  function handleUpload() {
    if (!clashRef.current || clashRef.current.files.length === 0) {
      alert("Please select a clash report file.");
      return;
    }

    const file = clashRef.current.files[0];

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      alert("Please upload a valid Excel or CSV file (.xlsx, .xls, .csv)");
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log("Clash Report JSON:", jsonData);

        if (jsonData.length === 0) {
          alert("The uploaded clash report is empty or has no data.");
          setIsLoading(false);
          return;
        }

        // Transform into clean structure
        const structured = jsonData.map((row) => ({
          course: row["Course Name"] || row.Course,
          section: row["Section"] || row.Section,
          clashCount:
            row["Reg. Count"] ||
            row["Number of students clashing"] ||
            row.clashCount,
        }));
        setClashReport(structured);
        setSelectedFile(null); // Hide file name after upload
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing clash report:", error);
        alert(
          "Error parsing clash report. Please ensure it's a valid Excel file.",
        );
        setIsLoading(false);
      }
    };

    reader.onerror = function () {
      alert("Error reading file. Please try again.");
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="upload-card">
      <label htmlFor="clash-upload">Upload Clash Report</label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <input
          id="clash-upload"
          type="file"
          ref={clashRef}
          onChange={handleFileChange}
        />
        {selectedFile && <span className="file-name">{selectedFile}</span>}
      </div>
      <button onClick={handleUpload} disabled={isLoading}>
        {isLoading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
