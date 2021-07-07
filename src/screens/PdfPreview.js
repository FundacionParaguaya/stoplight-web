import React, { useRef } from 'react';

import { Button } from '@material-ui/core';
import DashboardGeneralData from './dashboard/DashboardGeneralData';
import GreenLineChart from '../components/GreenLineChart';
import IndicatorsVisualisation from '../components/IndicatorsVisualisation';
import OverviewBlock from '../components/OverviewBlock';
import { exportComponentAsPDF } from 'react-component-export-image';
import { useLocation } from 'react-router-dom';

const PdfPreview = ({ generalData }) => {
  let location = useLocation();
  const componentRef = useRef();
  console.log('location', location.state);
  return (
    <>
      <div
        ref={componentRef}
        style={{
          // height: '1500px',
          width: '1000px',
          overflow: 'scroll'
        }}
      >
        <GreenLineChart
          isMentor={location.state.operation.isMentor}
          width="100%"
          height={300}
          data={location.state.operation.chart}
        />
        <DashboardGeneralData data={location.state.generalData} />
        <OverviewBlock data={location.state.overview} width="70%" />
        <IndicatorsVisualisation data={location.state.indicators} />
      </div>
      <Button
        onClick={() =>
          exportComponentAsPDF(componentRef, {
            pdfOptions: {
              w: 200,
              h: 300,
              x: 0,
              y: 0
            }
          })
        }
      >
        Pdf
      </Button>
    </>
  );
};

export default PdfPreview;
