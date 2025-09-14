"use client";
import React from "react";

export default function MainDashboard() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/main-transmiiter");
      const result = await res.json();
      if (result.data) setData(result.data);
    };

    fetchData();

    const interval = setInterval(fetchData, 600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="card w-100">
            <div className="card-body">
              <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                <div className="mb-3 mb-sm-0">
                  <h5 className="card-title fw-semibold">Nilai Transmisi</h5>
                  <p className="card-subtitle mb-0">Overview of Profit</p>
                </div>
                <select className="form-select w-30">
                  <option value="1">March 2023</option>
                  <option value="2">April 2023</option>
                  <option value="3">May 2023</option>
                  <option value="4">June 2023</option>
                </select>
              </div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Nilai</th>
                    <th>Posisi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.Tgl}</td>
                      <td>{row.Nilai}</td>
                      <td>{row.Posisi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
