import React from 'react'
import { Skeleton, Card } from 'antd'

export default function LoadingPage() {
    return (
        <div style={{ padding: 40 }}>
            <Card style={{maxWidth: 600, margin: "0 auto"}}>
                <Skeleton active paragraph = {{ rows: 4 }} />
            </Card>
        </div>
    )
}
