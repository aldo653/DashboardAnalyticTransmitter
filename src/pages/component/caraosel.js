"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { useTransmitterData } from "../api/fetchController";
import {getMonthlyAverage} from '../../utils/getMonth';

export default function Carousel() {
    const { data, loading } = useTransmitterData();

    //rata-Rata Video Output (Kw) bulan ini
    const avgVideoOutput = useMemo(() => getMonthlyAverage(data, "Video Output (Kw)"), [data]);

    //Rata-Rata Exciter Output (dBm) bulan ini
    const avgExciterOutput = useMemo(() => getMonthlyAverage(data, "Exciter Output (dBm)"), [data]);

    //Rata-Rata Electrical Power (Kw) bulan ini
    const avgElectricalPower = useMemo(() =>getMonthlyAverage(data, ["R-N (V1)", "S-N (V2)", "T-N (V3)", "R-S (U12)", "S-T (U23)", "T-R (U31)",]), [data]);

    //Rata-Rata Video Reflected (Watt) bulan ini
    const avgVideoReflected = useMemo(() => getMonthlyAverage(data, "Video Reflected (Watt)"), [data]);

    //rata-Rata Partner Bitrate HD (Bit) bulan ini
    const avgHdbitrate = useMemo(() =>getMonthlyAverage(data, ["TVRI SUMSEL", "TVRI NASIONAL", "TVRI WORLD", "TVRI SPORT", "RTV", "RCTI", "MDTV",]),[data]);

    //Rata-Rata Partner Bitrate SD (Bit) bulan ini
    const avgSdbitrate = useMemo(() => getMonthlyAverage(data, ["BTV", "PALTV"]), [data]);

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
            <div className="row">
                <div className="col-12 col-md-4 col-lg-2">
                    <div className="card border-0 zoom-in bg-warning-subtle shadow-none">
                        <div className="card-body p-3">
                            <div className="text-center">
                                <Image
                                    src="/assets/asset/Video.svg"
                                    width={50}
                                    height={50}
                                    alt="User Icon"
                                    className="mb-3"
                                />
                                <p className="fw-semibold fs-2 text-warning mb-1"><b>Avg. Video Output</b></p>
                                <h6 className="fw-semibold text-warning mb-0"><b>{avgVideoOutput} Kw</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 col-lg-2">
                    <div className="card border-0 zoom-in bg-primary-subtle shadow-none">
                        <div className="card-body p-3">
                            <div className="text-center">
                                <Image
                                    src="/assets/asset/Document.svg"
                                    width={50}
                                    height={50}
                                    alt="User Icon"
                                    className="mb-3"
                                />
                                <p className="fw-semibold fs-2 text-primary mb-1"><b>Avg. Exciter Output</b></p>
                                <h6 className="fw-semibold text-primary mb-0"><b>{avgExciterOutput} dBm</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 col-lg-2">
                    <div className="card border-0 zoom-in bg-success-subtle shadow-none">
                        <div className="card-body p-3">
                            <div className="text-center">
                                <Image
                                    src="/assets/asset/Shield.svg"
                                    width={50}
                                    height={50}
                                    alt="User Icon"
                                    className="mb-3"
                                />
                                <p className="fw-semibold fs-2 text-success mb-1"><b>Avg. Electrical Power</b></p>
                                <h6 className="fw-semibold text-success mb-0"><b>{avgElectricalPower} Kw</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 col-lg-2">
                    <div className="card border-0 zoom-in bg-warning-subtle shadow-none">
                        <div className="card-body p-3">
                            <div className="text-center">
                                <Image
                                    src="/assets/asset/Camera.svg"
                                    width={50}
                                    height={50}
                                    alt="User Icon"
                                    className="mb-3"
                                />
                                <p className="fw-semibold fs-2 text-warning mb-1"><b>Avg. Video Reflected</b></p>
                                <h6 className="fw-semibold text-warning mb-0"><b>{avgVideoReflected} Watt</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 col-lg-2">
                    <div className="card border-0 zoom-in bg-primary-subtle shadow-none">
                        <div className="card-body p-3">
                            <div className="text-center">
                                <Image
                                    src="/assets/asset/Lock.svg"
                                    width={50}
                                    height={50}
                                    alt="User Icon"
                                    className="mb-3"
                                />
                                <p className="fw-semibold fs-2 text-primary mb-1"><b>Avg. Partner Bitrate HD</b></p>
                                <h6 className="fw-semibold text-primary mb-0"><b>{avgHdbitrate} Bit</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 col-lg-2">
                    <div className="card border-0 zoom-in bg-success-subtle shadow-none">
                        <div className="card-body p-3">
                            <div className="text-center">
                                <Image
                                    src="/assets/asset/Edit.svg"
                                    width={50}
                                    height={50}
                                    alt="User Icon"
                                    className="mb-3"
                                />
                                <p className="fw-semibold fs-2 text-success mb-1"><b>Avg. Partner Bitrate SD</b></p>
                                <h6 className="fw-semibold text-success mb-0"><b>{avgSdbitrate} Bit</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
