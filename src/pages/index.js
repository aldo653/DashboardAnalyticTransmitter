import React, { useEffect, useState } from "react";
import Head from "next/head";
import MainLayout from "../pages/layout/main";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head>
                <title>
                    Transmitter Analytic Dashboard | TVRI Sumatera Selatan
                </title>
            </Head>

            {loading ? (
                <div></div>
            ) : (
                <MainLayout></MainLayout>
            )}
        </>
    );
}
