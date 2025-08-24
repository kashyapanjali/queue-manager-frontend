import React from 'react';
import { Clock, Users, TrendingUp, BarChart3, Activity, Check } from 'lucide-react';
import '../styles/AnalyticsCard.css';

const AnalyticsCard = ({ icon, iconColor, label, value }) => {
  const iconComponents = { Clock, Users, TrendingUp, BarChart3, Activity, Check };
  const IconComponent = iconComponents[icon];

  // Handle case where icon is not found
  if (!IconComponent) {
    console.warn(`Icon "${icon}" not found in AnalyticsCard`);
    return (
      <div className="analytics-card">
        <div className="analytics-content">
          <div className="analytics-text">
            <div className="analytics-label">{label}</div>
            <div className="analytics-value">{value}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-card">
      <div className="analytics-content">
        <div className="analytics-icon-container">
          <IconComponent className={`analytics-icon ${iconColor}`} />
        </div>
        <div className="analytics-text">
          <div className="analytics-label">{label}</div>
          <div className="analytics-value">{value}</div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
