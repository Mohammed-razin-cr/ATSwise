import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  FileText,
  Gauge,
  Sparkles,
  TrendingUp,
  Upload,
} from 'lucide-react';
import api from '../api';

const DashboardPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const averageScore = analyses.length > 0
    ? Math.round(analyses.reduce((acc, analysis) => acc + (analysis.ats_score || 0), 0) / analyses.length)
    : 0;

  const motionProps = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await api.get('/api/analyses/');
      setAnalyses(response.data);
    } catch (error) {
      console.error('Error fetching analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <motion.section
        className="dashboard-hero"
        {...motionProps}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="dashboard-header">
          <div className="dashboard-heading-copy">
            <div className="dashboard-kicker">
              <span className="dashboard-kicker-dot" />
              Resume intelligence workspace
            </div>
            <h1>Your Dashboard</h1>
            <p>View your resume analyses and track your progress</p>
            <div className="dashboard-meta">
              <span><Sparkles size={15} /> AI-powered insights</span>
              <span><CheckCircle2 size={15} /> Ready when you are</span>
            </div>
          </div>

          <div className="dashboard-hero-actions">
            <div className="dashboard-signal">
              <div className="dashboard-signal-icon"><Gauge size={18} /></div>
              <div className="dashboard-signal-copy">
                <span>Average ATS score</span>
                <strong>{averageScore}<small>/100</small></strong>
              </div>
              <div className="dashboard-signal-progress" aria-hidden="true">
                <span style={{ width: `${averageScore}%` }} />
              </div>
            </div>
            <Link to="/upload" className="btn-upload">
              <Upload size={18} />
              Upload New Resume
              <ArrowUpRight className="button-arrow" size={16} />
            </Link>
          </div>
        </div>
      </motion.section>

      <motion.div
        className="stats-grid"
        {...motionProps}
        transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="stat-card stat-card-primary">
          <div className="stat-card-topline">
            <div className="stat-icon blue">
              <FileText size={22} />
            </div>
            <span className="stat-status">Workspace activity</span>
          </div>
          <div className="stat-value">{analyses.length}</div>
          <div className="stat-label">Total Analyses</div>
          <div className="stat-card-footer">
            <span>Resume reports created</span>
            <FileText size={14} />
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-card-topline">
            <div className="stat-icon green">
              <TrendingUp size={22} />
            </div>
            <span className="stat-status">ATS readiness</span>
          </div>
          <div className="stat-value">{averageScore}</div>
          <div className="stat-label">Avg ATS Score</div>
          <div className="stat-card-footer">
            <span>Across your analyzed resumes</span>
            <TrendingUp size={14} />
          </div>
        </div>
      </motion.div>

      <motion.section
        className="recent-analyses"
        {...motionProps}
        transition={{ duration: 0.45, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="recent-heading">
          <div>
            <span className="section-kicker">Your history</span>
            <h2>Recent Analyses</h2>
          </div>
          <span className="analysis-count">
            {analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'}
          </span>
        </div>
        {loading ? (
          <div className="dashboard-loading" aria-label="Loading analyses">
            <span /><span /><span />
          </div>
        ) : analyses.length === 0 ? (
          <div className="empty-state">
            <FileText size={64} style={{ color: '#cbd5e1' }} />
            <h3>No resumes analyzed yet</h3>
            <p>Upload your first resume to get started</p>
            <Link to="/upload" className="btn-primary">
              Upload Resume
            </Link>
          </div>
        ) : (
          <div className="analyses-list">
            {analyses.map((analysis) => (
              <motion.div
                key={analysis.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={`/results/${analysis.id}`} className="analysis-card">
                  <div className="analysis-header">
                    <div className="analysis-icon">
                      <FileText size={22} />
                    </div>
                    <div className="analysis-copy">
                      <div className="analysis-filename">{analysis.filename}</div>
                      <div className="analysis-date">
                        <Calendar size={14} />
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="analysis-card-action">
                      <div className="score-badge">
                        <span>{analysis.ats_score || 0}</span>/100
                      </div>
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                  <div className="analysis-progress" aria-hidden="true">
                    <div className="analysis-progress-track">
                      <span style={{ width: `${Math.min(100, Math.max(0, analysis.ats_score || 0))}%` }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default DashboardPage;
