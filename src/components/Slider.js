import React, { useRef, useCallback, useEffect } from 'react';
import PropTypes from "prop-types"
import styled from 'styled-components';

const RangeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 5px
`;

const StyledRange = styled.div`
  position: relative;
  border-radius: 3px;
  background: #dddddd;
  height: 15px;
`;

const StyledRangeProgress = styled.div`
  border-radius: 3px;
  position: absolute;
  height: 100%;
  opacity: 0.5;
  background: rgb(102, 202, 249);
`;

const StyledThumb = styled.div`
  width: 10px;
  height: 25px;
  border-radius: 3px;
  position: relative;
  top: -5px;
  opacity: 0.5;
  background: rgb(102, 202, 249);
  cursor: pointer;
  &:active {
    background: rgba(15, 127, 255);
  }
`;

const getPercentage = (current, min, max) =>
  ((current - min) / (max - min)) * 100;

const getValue = (percentage, min, max) =>
  ((max - min) / 100) * percentage + min;

const getLeft = percentage => `calc(${percentage}% - 5px)`;

const getWidth = percentage => `${percentage}%`;

const formatFn = (number = 0) => number.toFixed(0)


const Slider = ({
  initial,
  min,
  max,
  formatFn,
  onChange,
}) => {
  const initialPercentage = getPercentage(initial, min, max);

  const rangeRef = useRef();
  const rangeProgressRef = useRef();
  const thumbRef = useRef();
  const currentRef = useRef();

  const diff = useRef();

  const handleUpdate = useCallback(
    (value, percentage) => {
      thumbRef.current.style.left = getLeft(percentage);
      rangeProgressRef.current.style.width = getWidth(percentage);
      currentRef.current.textContent = formatFn(value);
    },
    [formatFn]
  );

  const handleMouseMove = event => {
    let newX =
      event.clientX -
      diff.current -
      rangeRef.current.getBoundingClientRect().left;

    const end =
      rangeRef.current.offsetWidth - thumbRef.current.offsetWidth;

    const start = 0;

    if (newX < start) {
      newX = 0;
    }

    if (newX > end) {
      newX = end;
    }

    const newPercentage = getPercentage(newX, start, end);
    const newValue = getValue(newPercentage, min, max);

    handleUpdate(newValue, newPercentage);

    onChange(newValue);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleMouseMove);
  };

  const handleMouseDown = event => {
    diff.current =
      event.clientX - thumbRef.current.getBoundingClientRect().left;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    handleUpdate(initial, initialPercentage);
  }, [initial, initialPercentage, handleUpdate]);

  return (
    <>
      <RangeHeader id="header-slider" name="header-slider">
        <div>{formatFn(min)}</div>
        <div>
          <strong ref={currentRef} />
          &nbsp;/&nbsp;
          {formatFn(max)}
        </div>
      </RangeHeader>
      <StyledRange
        id="styled-slider"
        name="styled-slider"
        ref={rangeRef}
      >
        <StyledRangeProgress
          id="progress-slider"
          name="progress-slider"
          ref={rangeProgressRef}
        />
        <StyledThumb
          id="thumb-slider"
          name="thumb-slider"
          ref={thumbRef}
          onMouseDown={handleMouseDown}
        />
      </StyledRange>
    </>
  );
};

Slider.propTypes = {
  formatFn: PropTypes.func,
  onChange: PropTypes.func,
  initial: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number
}

Slider.defaultProps = {
  formatFn: formatFn,
  onChange: () => { },
  initial: 0,
  min: 0,
  max: 100,
}

export default Slider;