"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { getMonthlyAverage } from "../../utils/getMonth";

export default function CarouselReg({ data = [], loading }) {
  const avgOutput = useMemo(() => getMonthlyAverage(data, "Output (kW)"), [data]);
  const avgReflected = useMemo(() => getMonthlyAverage(data, "Reflected (Watt)"), [data]);
  const avgCooling = useMemo(() => getMonthlyAverage(data, "Cooling System Temperature (°C)"), [data]);
  const avgElectricalPower = useMemo(
    () => getMonthlyAverage(data, ["R-N (Volt)", "S-N (Volt)", "T-N (Volt)"]),
    [data]
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "120px" }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* === METRIC CARDS === */}
      <div className="row">
        <div className="col-12 col-md-4 col-lg-3">
          <div className="card border-0 zoom-in bg-warning-subtle shadow-none">
            <div className="card-body p-3 text-center">
              <Image src="/assets/asset/Video.svg" width={50} height={50} alt="Output Icon" className="mb-3" />
              <p className="fw-semibold fs-2 text-warning mb-1"><b>Avg. Video Output</b></p>
              <h6 className="fw-semibold text-warning mb-0"><b>{avgOutput} kW</b></h6>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4 col-lg-3">
          <div className="card border-0 zoom-in bg-primary-subtle shadow-none">
            <div className="card-body p-3 text-center">
              <Image src="/assets/asset/Document.svg" width={50} height={50} alt="Reflected Icon" className="mb-3" />
              <p className="fw-semibold fs-2 text-primary mb-1"><b>Avg. Video Reflected</b></p>
              <h6 className="fw-semibold text-primary mb-0"><b>{avgReflected} Watt</b></h6>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4 col-lg-3">
          <div className="card border-0 zoom-in bg-success-subtle shadow-none">
            <div className="card-body p-3 text-center">
              <Image src="/assets/asset/Shield.svg" width={50} height={50} alt="Cooling Icon" className="mb-3" />
              <p className="fw-semibold fs-2 text-success mb-1"><b>Avg. Cooling Temp</b></p>
              <h6 className="fw-semibold text-success mb-0"><b>{avgCooling} °C</b></h6>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4 col-lg-3">
          <div className="card border-0 zoom-in bg-warning-subtle shadow-none">
            <div className="card-body p-3 text-center">
              <Image src="/assets/asset/Camera.svg" width={50} height={50} alt="Electrical Icon" className="mb-3" />
              <p className="fw-semibold fs-2 text-warning mb-1"><b>Avg. Electrical Power</b></p>
              <h6 className="fw-semibold text-warning mb-0"><b>{avgElectricalPower} KWatt</b></h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
