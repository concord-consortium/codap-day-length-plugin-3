import React from "react";
import { TabName } from "../types";

import "./header.scss";

interface IHeaderProps {
  activeTab: TabName;
  onTabClick: (tab: TabName) => void;
}

export const Header: React.FC<IHeaderProps> = ({ activeTab, onTabClick }) => {
  return (
    <div className="tab-container">
      <div
        className={`tab location ${activeTab === "location" ? "active" : ""}`}
        onClick={() => onTabClick("location")}
      >
        Location
      </div>
      <div
        className={`tab simulation ${activeTab === "simulation" ? "active" : ""}`}
        onClick={() => onTabClick("simulation")}
      >
        Simulation
      </div>
      <div
        className={`tab about ${activeTab === "about" ? "active" : ""}`}
        onClick={() => onTabClick("about")}
      >
        About
      </div>
    </div>
  );
};
