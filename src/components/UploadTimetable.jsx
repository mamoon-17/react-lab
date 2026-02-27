import { useRef, useState } from "react";
import useTimetableParser from "../hooks/useTimetableParser";

export default function UploadTimetable() {
  const [fileData, setFileData] = useState(null);
  const timetableRef = useRef(null);

  const parsedTimetable = useTimetableParser(fileData);

  function handleUpload() {
    if (!timetableRef.current || timetableRef.current.files.length === 0) {
      alert("Please select a file first.");
      return;
    }

    const file = timetableRef.current.files[0];

    const reader = new FileReader();

    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);

      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log("Excel Parsed JSON:", jsonData);

      setFileData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  }
  console.log("Parsed Timetable:", parsedTimetable);

  return (
    <>
      <label htmlFor="timetable-upload">Upload Timetable</label>
      <input id="timetable-upload" type="file" ref={timetableRef}></input>

      <button onClick={handleUpload}>Upload</button>
    </>
  );
}
