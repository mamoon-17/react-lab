import { useRef } from "react";

export default function UploadTimetable() {
  const timetableRef = useRef(null);

  function handleUpload() {
    if (timetableRef.current.files !== null) {
    }
  }

  return (
    <>
      <label htmlFor="timetable-upload">Upload Timetable</label>
      <input id="timetable-upload" type="file" ref={timetableRef}></input>

      <button onClick={handleUpload}>Upload</button>
    </>
  );
}
