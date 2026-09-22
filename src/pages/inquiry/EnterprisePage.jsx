import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Building2,
  Briefcase,
  Phone,
  MessageSquare,
  Send,
  Sparkles,
  ShieldCheck,
  Cpu,
  Code2,
  Headphones,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { baseURL } from '../../config';
import './enterprise.css';

const INITIAL_FORM = {
  fullName: '',
  workEmail: '',
  companyName: '',
  jobTitle: '',
  phone: '',
  message: '',
};

const EnterprisePage = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
  const handleChange = (e) => setField(e.target.name, e.target.value);

  const validate = () => {
    if (!form.fullName.trim()) return 'Full name is required.';
    if (!form.workEmail.trim()) return 'Work email is required.';
    if (!/\S+@\S+\.\S+/.test(form.workEmail)) return 'Please enter a valid work email address.';
    if (!form.companyName.trim()) return 'Company name is required.';
    if (!form.jobTitle.trim()) return 'Job title is required.';
    return '';
  };

  const submitInquiry = async () => {
    const payload = {
      full_name: form.fullName.trim(),
      work_email: form.workEmail.trim(),
      company_name: form.companyName.trim(),
      job_title: form.jobTitle.trim(),
      phone: form.phone.trim() || null,
      description: form.message.trim() || null,
    };

    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/enterprise/request`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const apiMessage =
        response.data?.message ||
        response.data?.data?.message ||
        'Your enterprise inquiry has been submitted successfully. Our team will contact you shortly.';
      setSuccessMessage(apiMessage);
      setSubmitted(true);
      setForm(INITIAL_FORM);
    } catch (error) {
      const errors = error.response?.data?.errors;
      const firstError = errors && typeof errors === 'object' ? Object.values(errors).flat()[0] : '';
      const rawMsg = firstError || error.response?.data?.message;
      toast.error(
        rawMsg && !String(rawMsg).toLowerCase().includes('server error')
          ? rawMsg
          : "We're experiencing a minor technical hiccup. Please try again in a moment!",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.warning(error);
      return;
    }
    await submitInquiry();
  };

  if (submitted) {
    return (
      <div className="ent-wrapper">
        <div className="ent-bg-glow" />
        <motion.div
          className="ent-form-card ent-success-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div className="ent-success-icon-wrap">
            <CheckCircle2 size={40} strokeWidth={2.4} />
          </div>
          <h2 className="ent-success-title">Inquiry Received!</h2>
          <p className="ent-success-text">{successMessage}</p>
          <div className="ent-success-actions">
            <Link to="/3dio/" className="ent-btn-secondary">
              Back to Dashboard
            </Link>
            <button
              type="button"
              className="ent-btn-primary-sm"
              onClick={() => {
                setSubmitted(false);
                setSuccessMessage('');
              }}
            >
              Submit Another Inquiry
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="ent-wrapper">
      <div className="ent-bg-glow" />

      <div className="ent-container">
        {/* Top Header */}
        <motion.div
          className="ent-header"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="ent-badge">
            <span className="ent-badge-dot" />
            <Sparkles size={14} />
            <span>Enterprise Solutions</span>
          </div>
          <h1 className="ent-title">
            Scale Your 3D Production with <span className="ent-title-gradient">Enterprise AI</span>
          </h1>
          <p className="ent-subtitle">
            Get custom pipeline integrations, dedicated high-throughput GPU capacity, tailored SLA, and
            flexible volume pricing for your organization.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="ent-grid">
          {/* Left Column: Key Enterprise Highlights */}
          <motion.div
            className="ent-perks-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div>
              <h3 className="ent-perks-heading">Why Enterprise?</h3>
              <p className="ent-perks-desc">
                Everything you need to integrate generative 3D modeling into production at scale.
              </p>

              <div className="ent-perks-list">
                <div className="ent-perk-item">
                  <div className="ent-perk-icon-wrap">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h4 className="ent-perk-title">Dedicated GPU Compute</h4>
                    <p className="ent-perk-text">
                      High-throughput priority queue with zero cold-starts and guaranteed uptime.
                    </p>
                  </div>
                </div>

                <div className="ent-perk-item">
                  <div className="ent-perk-icon-wrap">
                    <Code2 size={20} />
                  </div>
                  <div>
                    <h4 className="ent-perk-title">Custom API & Webhooks</h4>
                    <p className="ent-perk-text">
                      Direct programmatic generation, batch export pipelines, and webhook triggers.
                    </p>
                  </div>
                </div>

                <div className="ent-perk-item">
                  <div className="ent-perk-icon-wrap">
                    <Headphones size={20} />
                  </div>
                  <div>
                    <h4 className="ent-perk-title">Dedicated Account Support</h4>
                    <p className="ent-perk-text">
                      Dedicated technical account manager with 99.9% uptime SLA and priority tickets.
                    </p>
                  </div>
                </div>

                <div className="ent-perk-item">
                  <div className="ent-perk-icon-wrap">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="ent-perk-title">Enterprise Security & Compliance</h4>
                    <p className="ent-perk-text">
                      Strict NDA, private storage isolation, and custom data retention policies.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="ent-perk-trust">
              <ShieldCheck size={18} color="#de3996" />
              <span>Trusted by forward-thinking 3D teams worldwide</span>
            </div>
          </motion.div>

          {/* Right Column: Contact Inquiry Form */}
          <motion.div
            className="ent-form-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            <div className="ent-form-header">
              <h2 className="ent-form-title">Contact our Solutions Team</h2>
              <p className="ent-form-subtitle">
                Fill in your details below and our solution architects will reach out within 24 hours.
              </p>
            </div>

            <form className="ent-form" onSubmit={handleSubmit}>
              <div className="ent-row">
                <div className="ent-field">
                  <label className="ent-label">Full Name</label>
                  <div className="ent-input-wrap">
                    <User size={18} className="ent-input-icon" />
                    <input
                      className="ent-input"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>

                <div className="ent-field">
                  <label className="ent-label">Work Email</label>
                  <div className="ent-input-wrap">
                    <Mail size={18} className="ent-input-icon" />
                    <input
                      className="ent-input"
                      type="email"
                      name="workEmail"
                      value={form.workEmail}
                      onChange={handleChange}
                      placeholder="e.g. name@company.com"
                    />
                  </div>
                </div>
              </div>

              <div className="ent-row">
                <div className="ent-field">
                  <label className="ent-label">Company Name</label>
                  <div className="ent-input-wrap">
                    <Building2 size={18} className="ent-input-icon" />
                    <input
                      className="ent-input"
                      name="companyName"
                      value={form.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Acme Studios"
                    />
                  </div>
                </div>

                <div className="ent-field">
                  <label className="ent-label">Job Title / Role</label>
                  <div className="ent-input-wrap">
                    <Briefcase size={18} className="ent-input-icon" />
                    <input
                      className="ent-input"
                      name="jobTitle"
                      value={form.jobTitle}
                      onChange={handleChange}
                      placeholder="e.g. Head of 3D / CTO"
                    />
                  </div>
                </div>
              </div>

              <div className="ent-field">
                <label className="ent-label">
                  <span>Phone / WhatsApp</span>
                  <span className="ent-optional-tag">Optional</span>
                </label>
                <div className="ent-input-wrap">
                  <Phone size={18} className="ent-input-icon" />
                  <input
                    className="ent-input"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. +1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="ent-field">
                <label className="ent-label">
                  <span>Message</span>
                  <span className="ent-optional-tag">Optional</span>
                </label>
                <div className="ent-input-wrap ent-textarea-wrap">
                  <MessageSquare size={18} className="ent-input-icon" />
                  <textarea
                    className="ent-textarea"
                    name="message"
                    rows={3}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project or requirements..."
                  />
                </div>
              </div>

              <div className="ent-actions">
                <button type="submit" className="ent-submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Enterprise Inquiry</span>
                      <Send size={18} />
                    </>
                  )}
                </button>

                <p className="ent-footer-note">
                  <ShieldCheck size={14} />
                  <span>Your information is protected by enterprise NDA and never shared.</span>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EnterprisePage;
