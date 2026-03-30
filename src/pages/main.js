"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "./layout/main";
import MainDeep from "./main/container/main";
import Caraosel from "./component/caraosel";

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const loginStatus = localStorage.getItem("isLoggedIn");

        if (!loginStatus) {
            router.push("/");
            return;
        }

        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, [router]);


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
        <>
            <Head>
                <title>Transmitter Analytic Dashboard | TVRI Sumatera Selatan</title>
            </Head>
            <MainLayout>
                <MainDeep />
            </MainLayout>
        </>
    );
}
