"use client";
import React, { useEffect } from 'react'
import { useTransmitterRegional } from '../api/fetchRegional';
import CardOutputReg from './regional/cardoutput';
import CardBarOutput from './regional/cardbaroutput';
import CardtrendlistrikReg from './regional/cardtrendlistrik';
import CardtrendlistrikallReg from './regional/cardtrendlistrikall';
import HeatmapReg from './regional/heatmaphpa';
import HeatmapRegPump from './regional/heatmapfan';

export default function RegionalDashboard() {
  const { data, loading } = useTransmitterRegional();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "350px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="row">
        <CardOutputReg data={data} />
        <CardBarOutput data={data} />
        <CardtrendlistrikReg data={data} />
        <CardtrendlistrikallReg data={data} />
      </div>
      <HeatmapReg data={data} />
      <HeatmapRegPump data={data} />
    </div>
  )
}
