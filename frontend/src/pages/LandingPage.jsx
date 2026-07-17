import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Brain, FileText, Zap, Target, Sparkles, Download } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { BRAND_NAME } from '../brand';

const MotionLink = motion(Link);

const featureItems = [
  {
    icon: FileText,
    title: 'Smart Resume Analysis',
    description: 'Upload your resume and get instant feedback on formatting, content, and ATS compatibility.',
  },
  {
    icon: Target,
    title: 'ATS Score Breakdown',
    description: 'See exactly how your resume performs with detailed scoring on every important aspect.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Improvements',
    description: 'Get actionable suggestions to optimize your resume and stand out to recruiters.',
  },
  {
    icon: Zap,
    title: 'Optimized Resume Generator',
    description: 'Let AI rewrite your resume for maximum impact and ATS compatibility.',
  },
  {
    icon: Download,
    title: 'Download in Any Format',
    description: 'Export your improved resume as PDF or DOCX with a single click.',
  },
  {
    icon: Brain,
    title: 'Domain-Specific Keywords',
    description: 'Get relevant keyword suggestions based on your industry and job role.',
  },
];

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  const revealTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.7, ease: [0.22, 1, 0.36, 1] };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero" aria-labelledby="landing-title">
        <div className="hero-grid" aria-hidden="true" />
        <motion.div
          className="hero-orb hero-orb-one"
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : { x: [0, 22, -12, 0], y: [0, -18, 12, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="hero-orb hero-orb-two"
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : { x: [0, -28, 12, 0], y: [0, 18, -10, 0], rotate: [0, 12, -8, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="hero-layout">
          <motion.div
            className="hero-content"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={revealTransition}
          >
          <motion.div
            className="hero-mark"
            aria-hidden="true"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.7, rotate: -12 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
            transition={{ ...revealTransition, delay: 0.08 }}
          >
            <Brain size={80} color="black" />
          </motion.div>
          <motion.h1
            id="landing-title"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22, letterSpacing: '-0.02em' }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, letterSpacing: '-0.075em' }}
            transition={{ ...revealTransition, delay: 0.16 }}
          >
            Welcome to {BRAND_NAME}
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: 0.28 }}
          >
            AI-Powered Resume Analysis and ATS Optimization Platform
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: 0.38 }}
          >
            <MotionLink
              to="/signup"
              className="btn-primary"
              whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.03 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            >
              Get Started Free
            </MotionLink>
            <MotionLink
              to="/login"
              className="btn-secondary"
              whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.03 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            >
              Sign In
            </MotionLink>
          </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" aria-labelledby="features-title">
        <motion.div
          className="section-heading-lockup"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={revealTransition}
        >
          <h2 id="features-title">Powerful Features</h2>
          <p className="features-subtitle">
            Everything you need to land your dream job
          </p>
        </motion.div>

        <div className="features-grid">
          {featureItems.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              className="feature-card"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ ...revealTransition, delay: index * 0.06 }}
              whileHover={shouldReduceMotion ? undefined : { y: -8, rotateX: 2, rotateY: index % 2 ? -2 : 2 }}
            >
              <div className="feature-shine" aria-hidden="true" />
              <div className="feature-icon">
                <Icon size={40} color="white" />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
