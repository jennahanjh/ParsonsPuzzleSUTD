import React from 'react';
import { AlertTriangle } from 'lucide-react';
import styles from './ErrorTooltip.module.css';

const ErrorTooltip = ({ error, show = true, containerMode = false }) => {
  if (!show || !error) return null;

  // Container mode: positions itself absolutely in top-right of parent
  // Normal mode: displays inline as before
  const wrapperClass = containerMode 
    ? styles.errorTooltipContainerWrapper 
    : styles.errorTooltipWrapper;

  return (
    <div className={wrapperClass}>
      <span className={styles.errorIndicator} title="Connection Issues">
        <AlertTriangle size={16} />
      </span>
      <div className={styles.errorTooltip}>
        <div className={styles.errorTooltipArrow}></div>
        <div className={styles.errorTooltipContent}>
          <strong>Connection Issue</strong><br />
          {error}<br />
          Using local data instead.
        </div>
      </div>
    </div>
  );
};

export default ErrorTooltip;
