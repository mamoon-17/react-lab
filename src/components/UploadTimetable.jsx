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
      const content = event.target.result;
      setFileData(content);
      console.log("Raw File Data: ", content);
    };

    reader.readAsText(file);
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
