import Head from "next/head";
import { useEffect, useState } from "react";
import MainLayout from "../pages/layout/main";
import MainDashboard from "./component/main-dashboard";
import Caraosel from "./component/caraosel";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head>
                <title>Transmitter Analytic Dashboard | TVRI Sumatera Selatan</title>
            </Head>
            <MainLayout>
                <Caraosel />
                <MainDashboard />
            </MainLayout>
        </>
    );
}
