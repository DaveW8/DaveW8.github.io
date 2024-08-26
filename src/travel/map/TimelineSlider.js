import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const TimelineSlider = ({ onChange, locations }) => {
  return (
    <Slider
      min={0}
      max={1}
      step={0.01}
      marks={locations}
      onChange={onChange}
      style={{ marginTop: '20px' }}
    />
  );
};

export default TimelineSlider;