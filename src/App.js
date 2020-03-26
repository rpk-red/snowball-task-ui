import React, { useState } from 'react';
import Slider from './components/Slider';


const App = () => {
  const [status, setStatus] = useState('Drop Here');
  const [preview, setPreview] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [enableDragDrop, setEnableDragDrop] = useState(true);
  const [stateXhr, setStateXhr] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [scale, setScale] = useState(100);
  const [payload, setPayload] = useState(new FormData());


  const onDragEnter = event => {
    if (enableDragDrop) {
      setStatus('File Detected');
    }
    event.stopPropagation();
    event.preventDefault();
  }

  const onDragLeave = event => {
    if (enableDragDrop) {
      setStatus('Drop Here');
    }
    event.preventDefault();
  }

  const onDragOver = event => {
    if (enableDragDrop) {
      setStatus('Drop');
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
      setStatus('Preview')
      setEnableDragDrop(false);
    }
    event.preventDefault();
  }

  const onAbortClick = () => {
    // stateXhr.abort();
    setPreview(null);
    setStatus('Drop Here');
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
      if (perc >= 100) {
        setStatus('Done');
        // Delayed reset
        setTimeout(() => {
          setPreview(null);
          setStatus('Drop Here');
          setPercentage(0);
          setEnableDragDrop(true);
          setUploading(false);
        }, 1750); // To match the transition 500 / 250
      } else {
        setStatus(`${perc}%`);
      }
      setPercentage(perc);
    };

    // XHR - Make Request  
    xhr.open('POST', 'http://localhost:5000/api/upload/image');

    xhr.onreadystatechange = function (oEvent) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log(xhr.responseText)
          const res = JSON.parse(xhr.responseText);
          console.log("xhr.onreadystatechange -> res", res.fileUrl)
          // setPreview(res.fileUrl)
        } else {
          console.log("Error", xhr.statusText);
        }
      }
    };

    xhr.send(payload);
    setStateXhr(xhr);
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
      <div
        style={{ width: `${scale * 0.8}%` }}
        className={`DropArea ${status === 'Drop' ? 'Over' : ''} ${status.indexOf('%') > -1 || status === 'Done' ? 'Uploading' : ''}`}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragLeave={onDragEnter}
      >
        <div className={`ImageProgress ${preview ? 'Show' : ''}`}>
          <div className="ImageProgressImage" style={{ backgroundImage: `url(${preview})` }}></div>
          <div className="ImageProgressUploaded" style={{
            backgroundImage: `url(${preview})`, clipPath: `inset(${100 - Number(percentage)}% 0 0 0)`
          }}></div>
        </div>
        <div className={`Status ${status.indexOf('%') > -1 || status === 'Done' ? 'Uploading' : ''}`}>{status}</div>
        {status === 'Preview' && <div className="Abort" onClick={onAbortClick}><span>&times;</span></div>}
      </div>
      <div className="slider">
        <Slider className="slider" onChange={handleSlider} initial={100} min={1} max={100} />
      </div>
      <button className="buttonSubmit" type="submit" onClick={handleSubmit} disabled={!preview || uploading} > Upload image </button>
    </div>
  );
};
export default App;