import React, { useState, useEffect } from "react";
import "./Tasks.css";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  // const [gridApi,setGridApi] = userState(null);

  useEffect(async () => {
    const result = await axios("api/tasks");
    setTasks(result.data.tasks);
  }, []);

  return (
    <div className="ag-theme-material x">
      <AgGridReact
        enableRtl={true}
        onGridReady={params => {
          params.api.sizeColumnsToFit();
          // setGridApi(params.api);
        }}
        columnDefs={[
          {
            headerName: "נושא",
            field: "title",
            resizable: true
          },
          {
            headerName: "משימה",
            field: "description",
            resizable: true
          },
          {
            headerName: "אחריות",
            field: "assign",
            resizable: true
          },
          {
            headerName: "תאריך יעד",
            field: "due",
            resizable: true
          }
        ]}
        rowData={tasks}
      />
    </div>
  );
}

export default Tasks;
