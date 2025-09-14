import React from "react";
import Image from "next/image";

export default function Carousel() {
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
                                <p className="fw-semibold fs-2 text-warning mb-1"><b>Avg. Video Output<br></br>(Kw)</b></p>
                                <h6 className="fw-semibold text-warning mb-0"><b>97</b></h6>
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
                                <p className="fw-semibold fs-2 text-primary mb-1"><b>Avg. Exciter Output<br></br>(dBm)</b></p>
                                <h6 className="fw-semibold text-primary mb-0"><b>97</b></h6>
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
                                <p className="fw-semibold fs-2 text-success mb-1"><b>Avg. Electrical Power<br></br>(Kw)</b></p>
                                <h6 className="fw-semibold text-success mb-0"><b>97</b></h6>
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
                                <p className="fw-semibold fs-2 text-warning mb-1"><b>Avg. Video Reflected<br></br>(Watt)</b></p>
                                <h6 className="fw-semibold text-warning mb-0"><b>97</b></h6>
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
                                <p className="fw-semibold fs-2 text-primary mb-1"><b>Avg. Partner Bitrate<br></br>(Bit)</b></p>
                                <h6 className="fw-semibold text-primary mb-0"><b>97</b></h6>
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
                                <p className="fw-semibold fs-2 text-success mb-1"><b>Avg. Partner Bitrate<br></br>(Bit)</b></p>
                                <h6 className="fw-semibold text-success mb-0"><b>97</b></h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
