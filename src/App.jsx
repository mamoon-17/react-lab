import "./App.css";
import ClashSummary from "./components/ClashSummary";
import TimetableView from "./components/TimetableView";

import UploadClashReport from "./components/UploadClashReport";
import UploadTimetable from "./components/UploadTimetable";
import {
  TimetableProvider,
  useTimetableContext,
} from "./context/TimetableContext";

function AppContent() {
  const { clearAll, timetable, clashReport } = useTimetableContext();

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all data?")) {
      clearAll();
    }
  };

  return (
    <div className="app-container">
      <h1>Timetable & Clash Report Uploader</h1>
      <div className="upload-section">
        <UploadTimetable />
        <UploadClashReport />
      </div>
      {(timetable.length > 0 || clashReport.length > 0) && (
        <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
          <button onClick={handleClearAll} className="clear-btn">
            Clear All Data
          </button>
        </div>
      )}
      <ClashSummary />
      <TimetableView />
    </div>
  );
}

function App() {
  return (
    <TimetableProvider>
      <AppContent />
    </TimetableProvider>
  );
}

export default App;
