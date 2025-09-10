import React, { useEffect, useState } from "react";
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
        <MainLayout>
        </MainLayout>
    );
}
