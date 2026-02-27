import { useState } from "react";
import "./App.css";
import UploadTimetable from "./components/UploadTimetable";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <UploadTimetable />
    </>
  );
}

export default App;
