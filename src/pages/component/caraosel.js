"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { useTransmitterData } from "../api/fetchController";
import { getMonthlyAverage } from '../../utils/getMonth';

export default function Carousel() {
    const { data, loading } = useTransmitterData();

    //rata-Rata Video Output (Kw) bulan ini
    const avgVideoOutput = useMemo(() => getMonthlyAverage(data, "Video Output (Kw)"), [data]);
    const avgVideoReflected = useMemo(() => getMonthlyAverage(data, "Video Reflected (Watt)"), [data]);
    const avgExciterOutput = useMemo(() => getMonthlyAverage(data, "Exciter Output (dBm)"), [data]);
    const avgVideoMER = useMemo(() => getMonthlyAverage(data, "Video MER (dB)"), [data]);
    const avgVideoIM = useMemo(() => getMonthlyAverage(data, "Video IM (dB)"), [data]);
    const avgElectricalPower = useMemo(() => getMonthlyAverage(data, ["R-N (V1)", "S-N (V2)", "T-N (V3)"]), [data]);
    const avgElectricalPower3 = useMemo(() => getMonthlyAverage(data, ["R-S (U12)", "S-T (U23)", "T-R (U31)"]), [data]);

    //rata-Rata Bitrate
    const avgTvriSumsel = useMemo(() => getMonthlyAverage(data, "TVRI SUMSEL"), [data]);
    const avgTvriNasional = useMemo(() => getMonthlyAverage(data, "TVRI NASIONAL"), [data]);
    const avgTvriWorld = useMemo(() => getMonthlyAverage(data, "TVRI WORLD"), [data]);
    const avgTvriSport = useMemo(() => getMonthlyAverage(data, "TVRI SPORT"), [data]);
    const avgRcti = useMemo(() => getMonthlyAverage(data, "RCTI"), [data]);
    const avgMdtv = useMemo(() => getMonthlyAverage(data, "MDTV"), [data]);
    const avgPaltv = useMemo(() => getMonthlyAverage(data, "PAL TV"), [data]);
    const avgRtv = useMemo(() => getMonthlyAverage(data, "RTV"), [data]);
    const avgBtv = useMemo(() => getMonthlyAverage(data, "BTV"), [data]);

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
                <div className="col">
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
                <div className="col">
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
                                <p className="fw-semibold fs-2 text-primary mb-1"><b>Avg. Vid. Ref.</b></p>
                                <h6 className="fw-semibold text-primary mb-0"><b>{avgVideoReflected} Watt</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
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
                                <p className="fw-semibold fs-2 text-success mb-1"><b>Avg. Video MER</b></p>
                                <h6 className="fw-semibold text-success mb-0"><b>{avgVideoMER} dB</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
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
                                <p className="fw-semibold fs-2 text-warning mb-1"><b>Avg. Video IM</b></p>
                                <h6 className="fw-semibold text-warning mb-0"><b>{avgVideoIM} db</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
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
                                <p className="fw-semibold fs-2 text-primary mb-1"><b>Avg. Exc. Output</b></p>
                                <h6 className="fw-semibold text-primary mb-0"><b>{avgExciterOutput} dBm</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
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
                                <p className="fw-semibold fs-2 text-success mb-1"><b>Avg. Elect 2 Phase</b></p>
                                <h6 className="fw-semibold text-success mb-0"><b>{avgElectricalPower} Volt</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="col">
                    <div className="card border-0 zoom-in bg-warning-subtle shadow-none">
                        <div className="card-body p-3">
                            <div className="text-center">
                                <Image
                                    src="/assets/asset/Graph.svg"
                                    width={50}
                                    height={50}
                                    alt="User Icon"
                                    className="mb-3"
                                />
                                <p className="fw-semibold fs-2 text-warning mb-1"><b>Avg. Elect 3 Phase</b></p>
                                <h6 className="fw-semibold text-warning mb-0"><b>{avgElectricalPower3} Kw</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="card border-0 zoom-in bg-warning-subtle shadow-none">
                        <div className="card-body p-3">
                            <div className="text-center">
                                <Image
                                    src="/assets/asset/logo.png"
                                    width={50}
                                    height={30}
                                    alt="User Icon"
                                    className="mb-3"
                                />
                                <p className="fw-semibold fs-2 text-warning mb-1"><b>TVRI <br></br> Sumsel</b></p>
                                <h6 className="fw-semibold text-warning mb-0"><b>{avgTvriSumsel} Byte</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card border-0 zoom-in bg-primary-subtle shadow-none">
                        <div className="card-body p-3">
                            <div className="text-center">
                                <Image
                                    src="/assets/asset/logo.png"
                                    width={50}
                                    height={30}
                                    alt="User Icon"
                                    className="mb-3"
                                />
                                <p className="fw-semibold fs-2 text-primary mb-1"><b>TVRI <br></br> Nasional</b></p>
                                <h6 className="fw-semibold text-primary mb-0"><b>{avgTvriNasional} Byte</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card border-0 zoom-in bg-success-subtle shadow-none">
                        <div className="card-body p-3">
                            <div className="text-center">
                                <Image
                                    src="/assets/asset/logo.png"
                                    width={50}
                                    height={30}
                                    alt="User Icon"
                                    className="mb-3"
                                />
                                <p className="fw-semibold fs-2 text-success mb-1"><b>TVRI <br></br> Sport</b></p>
                                <h6 className="fw-semibold text-success mb-0"><b>{avgTvriSport} Byte</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card border-0 zoom-in bg-warning-subtle shadow-none">
                        <div className="card-body p-3">
                            <div className="text-center">
                                <Image
                                    src="/assets/asset/logo.png"
                                    width={50}
                                    height={30}
                                    alt="User Icon"
                                    className="mb-3"
                                />
                                <p className="fw-semibold fs-2 text-warning mb-1"><b>TVRI <br></br> World</b></p>
                                <h6 className="fw-semibold text-warning mb-0"><b>{avgTvriWorld} Byte</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card border-0 zoom-in bg-primary-subtle shadow-none">
                        <div className="card-body p-3">
                            <div className="text-center mt-2">
                                <Image
                                    src="/assets/asset/rcti.png"
                                    width={55}
                                    height={20}
                                    alt="User Icon"
                                    className="mb-3"
                                />
                                <p className="fw-semibold fs-2 text-primary mb-1"><b>Swasta <br></br>RCTI</b></p>
                                <h6 className="fw-semibold text-primary mb-0"><b>{avgRcti} Byte</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card border-0 zoom-in bg-success-subtle shadow-none">
                        <div className="card-body p-3">
                            <div className="text-center mt-2">
                               <Image
                                    src="/assets/asset/rtv.png"
                                    width={60}
                                    height={20}
                                    alt="User Icon"
                                    className="mb-3"
                                />
                                <p className="fw-semibold fs-2 text-success mb-1"><b>Swasta <br></br> RTV</b></p>
                                <h6 className="fw-semibold text-success mb-0"><b>{avgRtv} Byte</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card border-0 zoom-in bg-warning-subtle shadow-none">
                        <div className="card-body p-3">
                            <div className="text-center mt-2">
                                <Image
                                    src="/assets/asset/mdtv.webp"
                                    width={50}
                                    height={20}
                                    alt="User Icon"
                                    className="mb-3"
                                />
                                <p className="fw-semibold fs-2 text-warning mb-1"><b>Swasta <br></br> MDTV</b></p>
                                <h6 className="fw-semibold text-warning mb-0"><b>{avgMdtv} Byte</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card border-0 zoom-in bg-primary-subtle shadow-none">
                        <div className="card-body p-3">
                            <div className="text-center">
                                <Image
                                    src="/assets/asset/paltv.png"
                                    width={50}
                                    height={30}
                                    alt="User Icon"
                                    className="mb-3"
                                />
                                <p className="fw-semibold fs-2 text-primary mb-1"><b>Swasta <br></br>PALTV</b></p>
                                <h6 className="fw-semibold text-primary mb-0"><b>{avgPaltv} Byte</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card border-0 zoom-in bg-success-subtle shadow-none">
                        <div className="card-body p-3">
                            <div className="text-center">
                                <Image
                                    src="/assets/asset/btv.png"
                                    width={50}
                                    height={30}
                                    alt="User Icon"
                                    className="mb-3"
                                />
                                <p className="fw-semibold fs-2 text-success mb-1"><b>Swasta <br></br> BTV</b></p>
                                <h6 className="fw-semibold text-success mb-0"><b>{avgBtv} Byte</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
