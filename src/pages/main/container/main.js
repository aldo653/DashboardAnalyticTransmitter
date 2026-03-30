"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Modal, Select, DatePicker, Space, Empty } from "antd";
import { Line } from "@ant-design/plots";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Image from "next/image";
import LoadingPage from "@/providers/loading";
import { getLastData, getData } from "../../api/function/getData";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

/* ===========================
   CARD COMPONENT
=========================== */

const MetricCard = ({ bg, text, img, width, height, title, value, unit, mt, onClick }) => (
  <div className="col">
    <div
      className={`card border-0 zoom-in ${bg} shadow-none`}
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <div className="card-body p-3 text-center">
        <Image src={img} width={width} height={height} alt="icon" />
        <p className={`fw-semibold ${text} mt-2 mb-1`}>
          <b>{title}</b>
        </p>
        <h6 className={`${text}`}>
          <b>{value ?? "-"} {unit}</b>
        </h6>
      </div>
    </div>
  </div>
);

/* ===========================
   MAIN COMPONENT
=========================== */

export default function MainDeep() {

  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [filterType, setFilterType] = useState("perjam");
  const [filterValue, setFilterValue] = useState(null);

  useEffect(() => {
    getLastData().then(setData);
    getData().then(setHistory);
  }, []);

  const openModal = (key) => {
    setSelectedKey(key);
    setOpen(true);
  };

  console.log(data);

  /* ===========================
     CONVERT UTC → WIB
  =========================== */

  const toWIB = (date) => {
    return dayjs.utc(date).tz("Asia/Jakarta");
  };

  /* ===========================
     FILTERED DATA
  =========================== */

  const filteredData = useMemo(() => {

    if (!selectedKey) return [];

    let result = [...history];

    if (filterValue) {

      if (filterType === "perjam") {
        result = result.filter(d =>
          toWIB(d.created_at).format("YYYY-MM-DD HH") ===
          dayjs(filterValue).format("YYYY-MM-DD HH")
        );
      }

      if (filterType === "harian") {
        result = result.filter(d =>
          toWIB(d.created_at).isSame(filterValue, "day")
        );
      }

      if (filterType === "mingguan") {
        result = result.filter(d =>
          toWIB(d.created_at).isSame(filterValue, "week")
        );
      }

      if (filterType === "bulanan") {
        result = result.filter(d =>
          toWIB(d.created_at).isSame(filterValue, "month")
        );
      }

    }

    return result
      .sort((a, b) => toWIB(a.created_at).valueOf() - toWIB(b.created_at).valueOf())
      .map(item => ({
        date: toWIB(item.created_at).toDate(),
        value: Number(item[selectedKey]),
      }));

  }, [history, selectedKey, filterType, filterValue]);

  /* ===========================
     CHART CONFIG
  =========================== */

  const chartConfig = {
    data: filteredData,
    xField: "date",
    yField: "value",
    smooth: true,
    autoFit: true,
    height: 480,
    legend: false,
    xAxis: {
      type: "time",
      label: {
        formatter: (v) => dayjs(v).format("DD/MM HH:mm"),
      },
    },
    tooltip: {
      formatter: (data) => ({
        name: selectedKey?.toUpperCase(),
        value: new Intl.NumberFormat("id-ID").format(data.value),
      }),
    },
  };

  if (!data) return <LoadingPage />;

  return (
    <>
      <div>
        <div className="d-flex justify-content-end mb-3">
          <span className="badge bg-primary-subtle text-primary"><i className="ti ti-clock me-2"></i>
            <b style={{fontSize: "12px"}}>Last Update: {toWIB(data.created_at).format("DD MMM YYYY, HH:mm:ss")}</b>
          </span>
        </div>

        {/* ROW 1 */}
        <div className="row">
          <MetricCard bg="bg-warning-subtle" text="text-warning" img="/assets/asset/Video.svg" width={50} height={50} title="Video Output" value={data.output} unit="Kw" onClick={() => openModal("output")} />
          <MetricCard bg="bg-primary-subtle" text="text-primary" img="/assets/asset/Document.svg" width={50} height={50} title="Video Reflected" value={data.reflected} unit="Watt" onClick={() => openModal("reflected")} />
          <MetricCard bg="bg-success-subtle" text="text-success" img="/assets/asset/Shield.svg" width={50} height={50} title="Video MER" value={data.mer} unit="dB" onClick={() => openModal("mer")} />
          <MetricCard bg="bg-warning-subtle" text="text-warning" img="/assets/asset/Camera.svg" width={50} height={50} title="Video IM" value={data.im} unit="dB" onClick={() => openModal("im")} />
          <MetricCard bg="bg-primary-subtle" text="text-primary" img="/assets/asset/Lock.svg" width={50} height={50} title="Exciter Output" value={data.output_ext} unit="dBm" onClick={() => openModal("output_ext")} />
          <MetricCard bg="bg-success-subtle" text="text-success" img="/assets/asset/Edit.svg" width={50} height={50} title="Cooling Temp" value={data.temp} unit="°C" onClick={() => openModal("temp")} />
          <MetricCard bg="bg-warning-subtle" text="text-warning" img="/assets/asset/Graph.svg" width={50} height={50} title="Liquid Flow" value={data.liquid} unit="L/min" onClick={() => openModal("liquid")} />
        </div>

        {/* ROW 2 */}
        <div className="row">
          <MetricCard bg="bg-warning-subtle" text="text-warning" img="/assets/asset/logo.png" width={50} height={30} title="TVRI Sumsel" value={data.tvri_sumsel} unit="Mbps" onClick={() => openModal("tvri_sumsel")} />
          <MetricCard bg="bg-primary-subtle" text="text-primary" img="/assets/asset/logo.png" width={50} height={30} title="TVRI Nasional" value={data.tvri_nasional} unit="Mbps" onClick={() => openModal("tvri_nasional")} />
          <MetricCard bg="bg-success-subtle" text="text-success" img="/assets/asset/logo.png" width={50} height={30} title="TVRI Sport" value={data.tvri_sport} unit="Mbps" onClick={() => openModal("tvri_sport")} />
          <MetricCard bg="bg-warning-subtle" text="text-warning" img="/assets/asset/logo.png" width={50} height={30} title="TVRI World" value={data.tvri_world} unit="Mbps" onClick={() => openModal("tvri_world")} />
        </div>

        {/* ROW 3 */}
        <div className="row">
          <MetricCard bg="bg-primary-subtle" text="text-primary" img="/assets/asset/rcti.png" width={55} height={20} title="RCTI" value={data.rcti} unit="Mbps" mt="mt-2" onClick={() => openModal("rcti")} />
          <MetricCard bg="bg-success-subtle" text="text-success" img="/assets/asset/rtv.png" width={60} height={20} title="RTV" value={data.rtv} unit="Mbps" mt="mt-2" onClick={() => openModal("rtv")} />
          <MetricCard bg="bg-warning-subtle" text="text-warning" img="/assets/asset/mdtv.webp" width={50} height={20} title="MDTV" value={data.mdtv} unit="Mbps" mt="mt-2" onClick={() => openModal("mdtv")} />
          <MetricCard bg="bg-primary-subtle" text="text-primary" img="/assets/asset/paltv.png" width={50} height={20} title="PALTV" value={data.paltv} unit="Mbps" onClick={() => openModal("paltv")} />
          <MetricCard bg="bg-success-subtle" text="text-success" img="/assets/asset/btv.png" width={50} height={20} title="BTV" value={data.btv} unit="Mbps" onClick={() => openModal("btv")} />
        </div>

      </div>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width="60%"
        centered
        title={`Trend ${selectedKey?.toUpperCase()}`}
      >

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
          <Space>
            <Select value={filterType} style={{ width: 150 }} onChange={(val) => { setFilterType(val); setFilterValue(null); }}>
              <Option value="perjam">Per Jam</Option>
              <Option value="harian">Harian</Option>
              <Option value="mingguan">Mingguan</Option>
              <Option value="bulanan">Bulanan</Option>
            </Select>

            {filterType === "perjam" && <DatePicker showTime onChange={(val) => setFilterValue(val)} />}
            {filterType === "harian" && <DatePicker onChange={(val) => setFilterValue(val)} />}
            {filterType === "mingguan" && <DatePicker picker="week" onChange={(val) => setFilterValue(val)} />}
            {filterType === "bulanan" && <DatePicker picker="month" onChange={(val) => setFilterValue(val)} />}
          </Space>
        </div>

        <div
          style={{
            width: "100%",
            minHeight: 480,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {filteredData.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>
                  Data tidak tersedia untuk filter yang dipilih
                </span>
              }
            />
          ) : (
            <Line {...chartConfig} style={{ width: "100%" }} />
          )}
        </div>

      </Modal>
    </>
  );
}