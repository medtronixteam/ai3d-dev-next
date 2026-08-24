import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL } from '../../config';
import { ChipMultiSelect, ChoicePills, Field, FormSection, StepActions, Stepper } from './InquiryFields';
import '../Service/bookDemo.css';
import './inquiry.css';
import {
  BILLING_OPTIONS,
  BUDGET_OPTIONS,
  COMPANY_SIZES,
  ENTERPRISE_USES,
  EXPECTED_PROJECTS,
  EXPECTED_USERS,
  INDUSTRIES,
  SCANS_PER_MONTH,
  SLA_OPTIONS,
  START_DATES,
  STORAGE_OPTIONS,
  SUPPORT_LEVELS,
  USAGE_PRESETS,
  YES_NO,
  YES_NO_UNSURE,
} from './inquiryOptions';

const COMPANY_SIZE_BUCKETS = [
  { value: '1-10', min: 1, max: 10 },
  { value: '11-50', min: 11, max: 50 },
  { value: '51-200', min: 51, max: 200 },
  { value: '201-500', min: 201, max: 500 },
];

function toApiRange(value) {
  return String(value || '')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, '');
}

function toApiCompanySize(selected, customValue) {
  if (selected === 'Custom') {
    const count = Number(customValue);
    if (!Number.isFinite(count) || count < 1) return '';
    if (count >= 500) return '500+';
    const bucket = COMPANY_SIZE_BUCKETS.find((item) => count >= item.min && count <= item.max);
    return bucket ? bucket.value : String(count);
  }
  return toApiRange(selected);
}

const STEP_TITLES = [
  'Contact',
  'Company',
  'Usage',
  'Storage',
  'Performance',
  'Collaboration',
  'Support',
  'Commercial',
  'Requirements',
];

const INITIAL_FORM = {
  fullName: '',
  workEmail: '',
  companyName: '',
  jobTitle: '',
  phone: '',
  companySize: '',
  customCompanySize: '',
  industry: '',
  website: '',
  platformUse: [],
  otherUse: '',
  scansPerMonth: '',
  expectedUsers: '',
  expectedProjects: '',
  twoDPercent: 50,
  storage: '',
  longTermRetention: '',
  priorityProcessing: '',
  dedicatedCapacity: '',
  peakUsage: '',
  teamsCount: '',
  apiAccess: '',
  customIntegrations: '',
  supportLevel: '',
  accountManager: '',
  sla: '',
  billing: '',
  budget: '',
  startDate: '',
  requirements: '',
};

const EnterprisePage = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
  const handleChange = (e) => setField(e.target.name, e.target.value);

  const validateStep = () => {
    if (step === 0) {
      if (!form.fullName.trim()) return 'Full name is required.';
      if (!form.workEmail.trim()) return 'Work email is required.';
      if (!form.companyName.trim()) return 'Company name is required.';
      if (!form.jobTitle.trim()) return 'Job title is required.';
    }
    if (step === 1) {
      if (!form.companySize) return 'Please select company size.';
      if (form.companySize === 'Custom' && !String(form.customCompanySize).trim()) {
        return 'Please enter company size.';
      }
      if (!form.industry) return 'Please select an industry.';
    }
    if (step === 2) {
      if (!form.platformUse.length) return 'Select at least one platform use.';
      if (!form.scansPerMonth) return 'Please select estimated AI scans per month.';
      if (!form.expectedUsers) return 'Please select expected number of users.';
      if (!form.expectedProjects) return 'Please select expected projects/assets.';
    }
    if (step === 3) {
      if (!form.storage) return 'Please select required private storage.';
      if (!form.longTermRetention) return 'Please confirm long-term asset retention.';
    }
    if (step === 4) {
      if (!form.priorityProcessing) return 'Please confirm priority processing.';
      if (!form.dedicatedCapacity) return 'Please confirm dedicated capacity needs.';
    }
    if (step === 5) {
      if (!form.teamsCount) return 'Please enter number of teams/workspaces.';
      if (!form.apiAccess) return 'Please confirm API access needs.';
      if (!form.customIntegrations) return 'Please confirm custom integration needs.';
    }
    if (step === 6) {
      if (!form.supportLevel) return 'Please select a support level.';
      if (!form.accountManager) return 'Please confirm if you need an account manager.';
      if (!form.sla) return 'Please select a required SLA.';
    }
    if (step === 7) {
      if (!form.billing) return 'Please select preferred billing.';
      if (!form.budget) return 'Please select an estimated budget.';
      if (!form.startDate) return 'Please select a target start date.';
    }
    if (step === 8) {
      if (!form.requirements.trim()) return 'Please tell us about your project.';
      if (!agreed) return 'Please agree to be contacted about this inquiry.';
    }
    return '';
  };

  const submitInquiry = async () => {
    const toBool = (value) => value === 'Yes';
    const useCases = form.platformUse.includes('Other') && form.otherUse.trim()
      ? [...form.platformUse.filter((item) => item !== 'Other'), form.otherUse.trim()]
      : form.platformUse;

    const payload = {
      full_name: form.fullName,
      work_email: form.workEmail,
      company_name: form.companyName,
      job_title: form.jobTitle,
      phone: form.phone || null,
      company_size: toApiCompanySize(form.companySize, form.customCompanySize),
      industry: form.industry,
      company_website: form.website || null,
      use_cases: useCases,
      estimated_ai_scans_per_month: toApiRange(form.scansPerMonth),
      expected_users: toApiRange(form.expectedUsers),
      expected_projects_assets: toApiRange(form.expectedProjects),
      scan_workflow_usage: `2D → 3D ${form.twoDPercent}% / Prompt → 3D ${100 - form.twoDPercent}%`,
      required_private_storage: form.storage,
      long_term_retention: toBool(form.longTermRetention),
      priority_processing: toBool(form.priorityProcessing),
      dedicated_capacity: form.dedicatedCapacity,
      expected_peak_usage: form.peakUsage || null,
      teams_workspaces: Number(form.teamsCount),
      api_access: toBool(form.apiAccess),
      custom_integrations: toBool(form.customIntegrations),
      support_level: form.supportLevel,
      dedicated_account_manager: toBool(form.accountManager),
      required_sla: form.sla,
      preferred_billing: form.billing,
      estimated_budget: form.budget,
      target_start_date: form.startDate,
      project_requirements: form.requirements,
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
        'Your enterprise inquiry has been submitted.';
      setSuccessMessage(apiMessage);
      setSubmitted(true);
      setForm(INITIAL_FORM);
      setAgreed(false);
      setStep(0);
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
    const error = validateStep();
    if (error) {
      toast.warning(error);
      return;
    }
    if (step < STEP_TITLES.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    await submitInquiry();
  };

  if (submitted) {
    return (
      <div className="inq-dash">
        <div className="inq-form-card inq-success-card">
          <div className="inq-success">
            <div className="inq-success-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 7L10 17l-6-6"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2>Request submitted</h2>
            <p className="inq-success-msg">{successMessage}</p>
            <div className="inq-success-actions">
              <Link to="/3dio/" className="inq-secondary">
                Back to dashboard
              </Link>
              <button
                type="button"
                className="bd-submit"
                onClick={() => {
                  setSubmitted(false);
                  setSuccessMessage('');
                }}
              >
                Submit another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inq-dash">
      <h1 className="inq-dash-title">Enterprise Inquiry</h1>
      <p className="inq-dash-sub">
        Share your team size, usage, and requirements so we can prepare the right storage,
        processing, and support plan.
      </p>
      <div className="inq-form-card">
      <form className="inq-form" onSubmit={handleSubmit}>
        <Stepper steps={STEP_TITLES} current={step} />

        {step === 0 && (
          <FormSection number="01" title="Contact" subtitle="Who should we reach out to?">
            <div className="bd-form-row">
              <Field label="Full name">
                <input className="bd-input" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Please enter name" />
              </Field>
              <Field label="Work email">
                <input className="bd-input" type="email" name="workEmail" value={form.workEmail} onChange={handleChange} placeholder="Please enter work email" />
              </Field>
            </div>
            <div className="bd-form-row">
              <Field label="Company name">
                <input className="bd-input" name="companyName" value={form.companyName} onChange={handleChange} placeholder="Please enter company name" />
              </Field>
              <Field label="Job title / role">
                <input className="bd-input" name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Please enter job title" />
              </Field>
            </div>
            <Field label="Phone / WhatsApp" optional>
              <input className="bd-input" name="phone" value={form.phone} onChange={handleChange} placeholder="Please enter phone number" />
            </Field>
          </FormSection>
        )}

        {step === 1 && (
          <FormSection number="02" title="Company" subtitle="Help us understand your organization.">
            <div className="bd-form-row">
              <Field label="Company size">
                <select
                  className="bd-select"
                  name="companySize"
                  value={form.companySize}
                  onChange={(e) => {
                    setField('companySize', e.target.value);
                    if (e.target.value !== 'Custom') setField('customCompanySize', '');
                  }}
                >
                  <option value="">Select company size...</option>
                  {COMPANY_SIZES.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </Field>
              <Field label="Industry">
                <select className="bd-select" name="industry" value={form.industry} onChange={handleChange}>
                  <option value="">Select industry...</option>
                  {INDUSTRIES.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </Field>
            </div>
            {form.companySize === 'Custom' ? (
              <Field label="Custom company size">
                <input
                  className="bd-input"
                  type="number"
                  min="1"
                  name="customCompanySize"
                  value={form.customCompanySize}
                  onChange={handleChange}
                  placeholder="Please enter company size"
                />
              </Field>
            ) : null}
            <Field label="Company website" optional>
              <input className="bd-input" name="website" value={form.website} onChange={handleChange} placeholder="Please enter company website" />
            </Field>
          </FormSection>
        )}

        {step === 2 && (
          <FormSection number="03" title="Usage" subtitle="How you expect to use the platform.">
            <Field label="What will you use the platform for?">
              <ChipMultiSelect
                options={ENTERPRISE_USES}
                value={form.platformUse}
                onChange={(platformUse) => setField('platformUse', platformUse)}
              />
            </Field>
            {form.platformUse.includes('Other') ? (
              <Field label="Other use">
                <input className="bd-input" name="otherUse" value={form.otherUse} onChange={handleChange} placeholder="Please enter other use" />
              </Field>
            ) : null}
            <div className="bd-form-row">
              <Field label="Estimated AI scans per month">
                <select className="bd-select" name="scansPerMonth" value={form.scansPerMonth} onChange={handleChange}>
                  <option value="">Select volume...</option>
                  {SCANS_PER_MONTH.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </Field>
              <Field label="Expected number of users">
                <select className="bd-select" name="expectedUsers" value={form.expectedUsers} onChange={handleChange}>
                  <option value="">Select users...</option>
                  {EXPECTED_USERS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Expected number of projects / assets">
              <select className="bd-select" name="expectedProjects" value={form.expectedProjects} onChange={handleChange}>
                <option value="">Select projects...</option>
                {EXPECTED_PROJECTS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="2D → 3D vs Prompt → 3D usage">
              <div className="inq-split">
                <ChoicePills
                  name="usagePreset"
                  options={USAGE_PRESETS.map((item) => item.label)}
                  value={USAGE_PRESETS.find((item) => item.twoD === form.twoDPercent)?.label || ''}
                  onChange={(label) => {
                    const preset = USAGE_PRESETS.find((item) => item.label === label);
                    if (preset) setField('twoDPercent', preset.twoD);
                  }}
                />
                <input
                  className="inq-split-bar"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={form.twoDPercent}
                  onChange={(e) => setField('twoDPercent', Number(e.target.value))}
                />
                <div className="inq-split-labels">
                  <span>2D → 3D {form.twoDPercent}%</span>
                  <span>Prompt → 3D {100 - form.twoDPercent}%</span>
                </div>
              </div>
            </Field>
          </FormSection>
        )}

        {step === 3 && (
          <FormSection number="04" title="Storage" subtitle="Private storage and retention needs.">
            <Field label="Required private storage">
              <select className="bd-select" name="storage" value={form.storage} onChange={handleChange}>
                <option value="">Select storage...</option>
                {STORAGE_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Do you need long-term asset retention?">
              <ChoicePills
                name="longTermRetention"
                options={YES_NO}
                value={form.longTermRetention}
                onChange={(value) => setField('longTermRetention', value)}
              />
            </Field>
          </FormSection>
        )}

        {step === 4 && (
          <FormSection number="05" title="Performance" subtitle="Processing capacity and peak load.">
            <Field label="Do you require priority processing?">
              <ChoicePills
                name="priorityProcessing"
                options={YES_NO}
                value={form.priorityProcessing}
                onChange={(value) => setField('priorityProcessing', value)}
              />
            </Field>
            <Field label="Do you need dedicated rendering / processing capacity?">
              <ChoicePills
                name="dedicatedCapacity"
                options={YES_NO_UNSURE}
                value={form.dedicatedCapacity}
                onChange={(value) => setField('dedicatedCapacity', value)}
              />
            </Field>
            <Field label="Expected peak usage" optional>
              <input
                className="bd-input"
                name="peakUsage"
                value={form.peakUsage}
                onChange={handleChange}
                placeholder="Please enter peak usage"
              />
            </Field>
          </FormSection>
        )}

        {step === 5 && (
          <FormSection number="06" title="Collaboration & integration">
            <div className="bd-form-row">
              <Field label="How many teams / workspaces?">
                <input
                  className="bd-input"
                  type="number"
                  min="1"
                  name="teamsCount"
                  value={form.teamsCount}
                  onChange={handleChange}
                  placeholder="Please enter number of teams"
                />
              </Field>
              <Field label="Do you need API access?">
                <ChoicePills
                  name="apiAccess"
                  options={YES_NO}
                  value={form.apiAccess}
                  onChange={(value) => setField('apiAccess', value)}
                />
              </Field>
            </div>
            <Field label="Do you need custom integrations?">
              <ChoicePills
                name="customIntegrations"
                options={YES_NO}
                value={form.customIntegrations}
                onChange={(value) => setField('customIntegrations', value)}
              />
            </Field>
          </FormSection>
        )}

        {step === 6 && (
          <FormSection number="07" title="Support" subtitle="How we should support your team.">
            <Field label="Required support level">
              <ChoicePills
                name="supportLevel"
                options={SUPPORT_LEVELS}
                value={form.supportLevel}
                onChange={(value) => setField('supportLevel', value)}
              />
            </Field>
            <div className="bd-form-row">
              <Field label="Do you need a dedicated account manager?">
                <ChoicePills
                  name="accountManager"
                  options={YES_NO}
                  value={form.accountManager}
                  onChange={(value) => setField('accountManager', value)}
                />
              </Field>
              <Field label="Required SLA">
                <select className="bd-select" name="sla" value={form.sla} onChange={handleChange}>
                  <option value="">Select SLA...</option>
                  {SLA_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </Field>
            </div>
          </FormSection>
        )}

        {step === 7 && (
          <FormSection number="08" title="Commercial" subtitle="Billing preference and timeline.">
            <Field label="Preferred billing">
              <ChoicePills
                name="billing"
                options={BILLING_OPTIONS}
                value={form.billing}
                onChange={(value) => setField('billing', value)}
              />
            </Field>
            <div className="bd-form-row">
              <Field label="Estimated budget">
                <select className="bd-select" name="budget" value={form.budget} onChange={handleChange}>
                  <option value="">Select budget...</option>
                  {BUDGET_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </Field>
              <Field label="Target start date">
                <select className="bd-select" name="startDate" value={form.startDate} onChange={handleChange}>
                  <option value="">Select start date...</option>
                  {START_DATES.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </Field>
            </div>
          </FormSection>
        )}

        {step === 8 && (
          <FormSection number="09" title="Requirements">
            <Field label="Tell us about your project and requirements">
              <textarea
                className="bd-textarea"
                name="requirements"
                rows={5}
                value={form.requirements}
                onChange={handleChange}
                placeholder="Please enter your project requirements"
              />
            </Field>
            <div className="bd-checkbox-wrap">
              <label className="bd-checkbox-label">
                <input
                  type="checkbox"
                  className="bd-checkbox-input"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                />
                <span className="bd-checkbox-box">
                  {agreed && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5 4-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeJoin="round" />
                    </svg>
                  )}
                </span>
                By submitting this form, you agree to be contacted by our team regarding your enterprise inquiry.
              </label>
            </div>
          </FormSection>
        )}

        <StepActions
          step={step}
          total={STEP_TITLES.length}
          loading={loading}
          onBack={() => setStep((prev) => prev - 1)}
          submitLabel="Submit enterprise inquiry"
        />
      </form>
      </div>
    </div>
  );
};

export default EnterprisePage;
