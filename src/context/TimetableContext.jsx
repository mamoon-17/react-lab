import { createContext, useContext, useState } from "react";

const TimetableContext = createContext();

export function TimetableProvider({ children }) {
  const [timetable, setTimetable] = useState([]);
  const [clashReport, setClashReport] = useState([]);
  const [filteredClashes, setFilteredClashes] = useState([]);

  const clearAll = () => {
    setTimetable([]);
    setClashReport([]);
    setFilteredClashes([]);
  };

  return (
    <TimetableContext.Provider
      value={{
        timetable,
        setTimetable,
        clashReport,
        setClashReport,
        filteredClashes,
        setFilteredClashes,
        clearAll,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
}

export function useTimetableContext() {
  return useContext(TimetableContext);
}
