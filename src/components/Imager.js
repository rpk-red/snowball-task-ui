import React from 'react'
import PropTypes from 'prop-types'

import '../assets/css/imager.css';
import { statusEnum } from '../assets/constants/appConstants';

const { DROP, DONE, PREVIEW } = statusEnum;

const Imager = ({
  scale,
  status,
  onDragEnter,
  onDrop,
  onDragOver,
  preview,
  onAbortClick,
  percentage
}) => {
  return (
    <div
      style={{ width: `${scale * 0.8}%` }}
      className={`DropArea ${status === DROP && 'Over'} 
      ${status.indexOf('%') > -1 || (status === DONE && 'Uploading')}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragEnter}
      id="imager"
      name="imager"
    >
      <div
        id="container-imager"
        name="container-imager"
        className={`ImageProgress ${preview && 'Show'}`}
      >
        <div
          id="progress-imager"
          name="progress-imager"
          className={`ImageProgressImage ${status === DONE && 'Done'}`}
          style={{ backgroundImage: `url(${preview})` }}
        />
        <div
          id="upload-imager"
          name="upload-imager"
          className="ImageProgressUploaded"
          style={{
            backgroundImage: `url(${preview})`,
            clipPath: `inset(${100 - Number(percentage)}% 0 0 0)`
          }}
        />
      </div>
      <div
        id="status-imager"
        name="status-imager"
        className={`Status ${status.indexOf('%') > -1 || (status === DONE && 'Uploading')}`}
      >
        {status}
      </div>
      {(status === PREVIEW || status === DONE) &&
        <div
          id="abort-imager"
          name="abort-imager"
          className="Abort"
          onClick={onAbortClick}
        >
          <span>&times;</span>
        </div>}
    </div >
  )
}

Imager.propTypes = {
  scale: PropTypes.number,
  status: PropTypes.string,
  onDragEnter: PropTypes.func,
  onDrop: PropTypes.func,
  onDragOver: PropTypes.func,
  onAbortClick: PropTypes.func,
  preview: PropTypes.string,
  percentage: PropTypes.number
}

export default Imager
