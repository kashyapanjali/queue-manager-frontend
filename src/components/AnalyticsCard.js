import React from 'react';
import { Clock, Users, TrendingUp, BarChart3 } from 'lucide-react';
import '../styles/AnalyticsCard.css';

const AnalyticsCard = ({ icon, iconColor, label, value }) => {
  const iconComponents = { Clock, Users, TrendingUp, BarChart3 };
  const IconComponent = iconComponents[icon];

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
