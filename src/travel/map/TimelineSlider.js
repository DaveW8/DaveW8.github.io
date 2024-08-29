import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const TimelineSlider = ({ onChange, locations, styles }) => {
	const { railStyle, trackStyle, handleStyle, labelStyle } = styles;

  return (
		<div 
			style={{ 
			position: 'absolute',
			bottom: '20px',
			left: '20px',
			bottom: '20px',
			right: '20px',
			padding: '20px',
			background: 'white',
			boxShadow: '0 0 5px rgba(0,0,0,0.3)',
			zIndex: 1000,
		}}>
			<Slider
				min={0}
				max={1}
				step={0.01}
				marks={locations}
				onChange={onChange}
				railStyle={railStyle}
        trackStyle={trackStyle}
        handleStyle={handleStyle}
        markStyle={labelStyle}
			/>
		</div>
  );
};

export default TimelineSlider;