// import { useState } from "react";
import ShowButton from "../buttons/ShowButton";
import FetchAnalytics from "../data/FetchAnalyctics";

export default function AnalyticsSection() {

return (
    <div id="admin-analytics" className="admin-container">
        <h2>Analytics</h2>
        <ShowButton
        showWhat="Show analytics"
        content={
            <div className="button-wrapper">
                <FetchAnalytics />
            </div>
        }
        />
    </div>
)

}