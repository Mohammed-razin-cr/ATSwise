import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';
import api from '../api';
import { toast } from 'react-toastify';

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    setProgress(20);

    const formData = new FormData();
    formData.append('file', file);
    if (jobDesc) formData.append('job_desc', jobDesc);

    try {
      setProgress(50);
      const response = await api.post('/api/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProgress(100);
      toast.success('Resume analyzed successfully!');
      navigate(`/results/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-wrapper">
        <div className="upload-header text-center">
          <h1>Analyze Your Resume</h1>
          <p>Upload your resume and get ATS optimization insights</p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {file ? (
              <div className="file-preview">
                <FileText size={40} style={{ color: 'var(--primary-color)' }} />
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <CheckCircle2 size={28} style={{ color: 'var(--success-color)' }} />
              </div>
            ) : (
              <div className="drop-prompt">
                <Upload size={48} style={{ color: 'var(--text-secondary)' }} />
                <h3>Drag & drop your resume here</h3>
                <p>or click to browse files</p>
                <span className="file-types">Supports PDF and DOCX</span>
              </div>
            )}
          </div>

          <div className="job-desc-section">
            <label>
              Job Description (Optional)
              <span style={{ color: 'var(--text-secondary)', fontWeight: 400, marginLeft: '0.5rem' }}>
                For better keyword matching
              </span>
            </label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste the job description here to get tailored suggestions..."
              rows={6}
            />
          </div>

          {loading && (
            <div className="progress-container">
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="progress-text">Analyzing resume...</div>
            </div>
          )}

          <button
            type="submit"
            className={`analyze-btn ${loading ? 'loading' : ''}`}
            disabled={loading || !file}
          >
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
