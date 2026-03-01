import { useEffect, useRef, useState } from "react";
import useTimetableParser from "../hooks/useTimetableParser";

import { useTimetableContext } from "../context/TimetableContext";
import * as XLSX from "xlsx";

export default function UploadTimetable() {
  const [fileData, setFileData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const timetableRef = useRef(null);
  const { setTimetable } = useTimetableContext();

  const parsedTimetable = useTimetableParser(fileData);

  useEffect(() => {
    if (parsedTimetable.length > 0) {
      setTimetable(parsedTimetable);
    }
  }, [parsedTimetable, setTimetable]);

  function handleFileChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0].name);
    } else {
      setSelectedFile(null);
    }
  }

  function handleUpload() {
    if (!timetableRef.current || timetableRef.current.files.length === 0) {
      alert("Please select a file first.");
      return;
    }

    const file = timetableRef.current.files[0];

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
        console.log("Excel Parsed JSON:", jsonData);

        if (jsonData.length === 0) {
          alert("The uploaded file is empty or has no data.");
          setIsLoading(false);
          return;
        }

        setFileData(jsonData);
        setSelectedFile(null); // Hide file name after upload
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing file:", error);
        alert("Error parsing file. Please ensure it's a valid Excel file.");
        setIsLoading(false);
      }
    };

    reader.onerror = function () {
      alert("Error reading file. Please try again.");
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  }
  console.log("Parsed Timetable:", parsedTimetable);

  return (
    <div className="upload-card">
      <label htmlFor="timetable-upload">Upload Timetable</label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <input
          id="timetable-upload"
          type="file"
          ref={timetableRef}
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
