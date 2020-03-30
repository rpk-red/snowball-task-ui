import React, { useState } from 'react';
import Slider from './components/Slider';
import Imager from './components/Imager';
import { statusEnum } from './assets/constants/appConstants';
import ButtonSubmit from './components/ButtonSubmit';
import { UPLOAD_IMAGE_URL } from './assets/constants/apiConstants';


const App = () => {
  const [status, setStatus] = useState(statusEnum.DROP_HERE);
  const [preview, setPreview] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [enableDragDrop, setEnableDragDrop] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [scale, setScale] = useState(100);
  const [payload, setPayload] = useState(new FormData());


  const onDragEnter = event => {
    if (enableDragDrop) {
      setStatus(statusEnum.FILE_DETECTED);
    }
    event.stopPropagation();
    event.preventDefault();
  }

  const onDragLeave = event => {
    if (enableDragDrop) {
      setStatus(statusEnum.DROP_HERE);
    }
    event.preventDefault();
  }

  const onDragOver = event => {
    if (enableDragDrop) {
      setStatus(statusEnum.DROP);
    }
    event.preventDefault();
  }
  const onDrop = event => {
    const supportedFilesTypes = ['image/jpeg', 'image/png'];
    const { type } = event.dataTransfer.files[0] || {};
    if (supportedFilesTypes.indexOf(type) > -1 && enableDragDrop) {

      const reader = new FileReader();
      reader.onload = e => setPreview(e.target.result);
      reader.readAsDataURL(event.dataTransfer.files[0]);

      // Create Form Data
      const payload = new FormData();
      payload.append('image', event.dataTransfer.files[0]);
      payload.append('size', window.innerWidth)
      setPayload(payload);
      setStatus(statusEnum.PREVIEW)
      setEnableDragDrop(false);
    }
    event.preventDefault();
  }

  const onAbortClick = () => {
    setPreview(null);
    setStatus(statusEnum.DROP_HERE);
    setPercentage(0);
    setPayload(new FormData());
    setEnableDragDrop(true);
  };

  const doNothing = event => event.preventDefault();

  const handleSubmit = () => {
    setUploading(true);
    // XHR - New XHR Request
    const xhr = new XMLHttpRequest();

    // XHR - Upload Progress
    xhr.upload.onprogress = (e) => {
      const done = e.position || e.loaded
      const total = e.totalSize || e.total;
      const perc = (Math.floor(done / total * 1000) / 10);
      if (perc < 100) {
        setStatus(`${perc}%`);
      }
      else {
        setPreview(null);
        setStatus('Loading...')
      }
      setPercentage(perc);
    };

    // XHR - Make Request  
    xhr.open('POST', UPLOAD_IMAGE_URL);

    xhr.onreadystatechange = function (oEvent) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log(xhr.responseText)
          const res = JSON.parse(xhr.responseText);
          setStatus(statusEnum.DONE);
          setPreview(res.fileUrl)
          setPercentage(0);
          setUploading(false);

        } else {
          console.log("Error", xhr.statusText);
        }
      }
    };

    xhr.send(payload);
  };
  const handleSlider = value => {
    setScale(value)
  }

  return (
    <div
      className="App"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={doNothing}
    >
      <Imager
        scale={scale}
        status={status}
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        onDragOver={onDragOver}
        preview={preview}
        onAbortClick={onAbortClick}
        percentage={percentage} />
      <div className="slider">
        <Slider onChange={handleSlider} initial={100} min={5} max={100} />
      </div>
      <ButtonSubmit onClick={handleSubmit} status={status} uploading={uploading} />
    </div>
  );
};
export default App;