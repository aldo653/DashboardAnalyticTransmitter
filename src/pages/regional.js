"use client";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import MainLayout from "./layout/main";
import RegionalDashboard from "./component/regional-dashboard";
import CarouselReg from "./component/caraosel-regional";
import { useTransmitterRegional } from "./api/fetchRegional";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const { data, loading: dataLoading } = useTransmitterRegional();

  // Ambil daftar region unik
  const uniqueRegions = useMemo(() => {
    if (!data || data.length === 0) return [];
    const regions = data.map((d) => d["Satuan Transmisi Daerah"]).filter(Boolean);
    return [...new Set(regions)];
  }, [data]);

  // Data difilter sesuai region
  const filteredData = useMemo(() => {
    if (!selectedRegion) return data;
    return data.filter((d) => d["Satuan Transmisi Daerah"] === selectedRegion);
  }, [data, selectedRegion]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Transmitter Analytic Dashboard | TVRI Sumatera Selatan</title>
      </Head>

      <MainLayout>
        {/* === FILTER BUTTONS === */}
        <div className="mb-4 d-flex flex-wrap gap-2 justify-content-center align-items-center">
          {uniqueRegions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region === selectedRegion ? null : region)}
              className={`btn ${
                region === selectedRegion ? "btn-primary text-white" : "btn-outline-primary"
              } btn-sm d-flex align-items-center`}
            >
              <i className="ti ti-building-broadcast-tower me-2"></i>
              {region}
            </button>
          ))}
        </div>

        {/* === KOMPONEN DASHBOARD === */}
        <CarouselReg data={filteredData} loading={dataLoading} />
        <RegionalDashboard selectedRegion={selectedRegion} />
      </MainLayout>
    </>
  );
}
