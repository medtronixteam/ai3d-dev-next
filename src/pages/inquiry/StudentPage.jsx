'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL } from '../../config';
import InquiryPageLayout from './InquiryPageLayout';
import { ChipMultiSelect, Field, FileUpload, FormSection, StepActions, Stepper } from './InquiryFields';
import { GRADUATION_YEARS, STUDENT_USES } from './inquiryOptions';

const STEP_TITLES = ['Details', 'Usage', 'Student ID'];

const INITIAL_FORM = {
  fullName: '',
  university: '',
  universityEmail: '',
  course: '',
  fieldOfStudy: '',
  graduationYear: '',
  country: '',
  city: '',
  platformUse: [],
  otherUse: '',
};

const BENEFITS = [
  { title: 'Academic projects', text: 'Use AI 3D scanning for class work, studios, and assignments.' },
  { title: 'Research & thesis', text: 'Create models for university research and dissertations.' },
  { title: 'Verified access', text: 'Apply with your university email and student ID card.' },
];

const StudentPage = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [idCard, setIdCard] = useState(null);
  const [idPreview, setIdPreview] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
  const handleChange = (e) => setField(e.target.name, e.target.value);

  useEffect(() => {
    if (!idCard) {
      setIdPreview('');
      return undefined;
    }
    const url = URL.createObjectURL(idCard);
    setIdPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [idCard]);

  const handleIdChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.warning('Please upload an image of your student ID card.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.warning('Student ID image must be 5 MB or smaller.');
      return;
    }
    setIdCard(file);
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.fullName.trim()) return 'Full name is required.';
      if (!form.university.trim()) return 'University / college name is required.';
      if (!form.universityEmail.trim()) return 'University email is required.';
      if (!form.course.trim()) return 'Course / degree is required.';
      if (!form.fieldOfStudy.trim()) return 'Field of study is required.';
      if (!form.graduationYear) return 'Please select expected graduation year.';
      if (!form.country.trim()) return 'Country is required.';
      if (!form.city.trim()) return 'City is required.';
    }
    if (step === 1) {
      if (!form.platformUse.length) return 'Select at least one platform use.';
    }
    if (step === 2) {
      if (!idCard) return 'Please upload your student ID card.';
      if (!agreed) return 'Please agree to be contacted about this application.';
    }
    return '';
  };

  const submitApplication = async () => {
    const useCases = form.platformUse.includes('Other') && form.otherUse.trim()
      ? [...form.platformUse.filter((item) => item !== 'Other'), form.otherUse.trim()]
      : form.platformUse;

    const payload = new FormData();
    payload.append('full_name', form.fullName);
    payload.append('university_name', form.university);
    payload.append('university_email', form.universityEmail);
    payload.append('course_degree', form.course);
    payload.append('field_of_study', form.fieldOfStudy);
    payload.append('graduation_year', form.graduationYear);
    payload.append('country', form.country);
    payload.append('city', form.city);
    useCases.forEach((useCase) => {
      payload.append('use_cases[]', useCase);
    });
    payload.append('student_id', idCard);

    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/student/request`, payload, {
        headers: { Accept: 'application/json' },
      });
      const apiMessage =
        response.data?.message ||
        response.data?.data?.message ||
        'Your student application has been submitted.';
      setSuccessMessage(apiMessage);
      setSubmitted(true);
      setForm(INITIAL_FORM);
      setIdCard(null);
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
    await submitApplication();
  };

  if (submitted) {
    return (
      <InquiryPageLayout variant="student">
        <div className="inq-success inq-success-card">
          <div className="inq-success-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M20 7L10 17l-6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2>Application submitted</h2>
          <p className="inq-success-msg">{successMessage}</p>
          <div className="inq-success-actions">
            <Link to="/" className="inq-secondary">
              Back to home
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
      </InquiryPageLayout>
    );
  }

  return (
    <InquiryPageLayout variant="student">
      <div className="stu-shell">
        <aside className="stu-aside">
          <span className="stu-badge">Student Program</span>
          <h2>Apply for academic access</h2>
          <p>
            Share your university details and we’ll review your request for student use of the
            platform.
          </p>
          <ul className="stu-benefits">
            {BENEFITS.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <p className="stu-aside-note">
            Use your official university email. Personal Gmail / Yahoo addresses are usually not accepted.
          </p>
        </aside>

        <div className="stu-main">
          <form className="inq-form" onSubmit={handleSubmit}>
            <Stepper steps={STEP_TITLES} current={step} />

            {step === 0 && (
              <FormSection number="01" title="Student details" subtitle="Use your official university information.">
                <div className="bd-form-row">
                  <Field label="Full name">
                    <input className="bd-input" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Please enter name" />
                  </Field>
                  <Field label="University / college name">
                    <input className="bd-input" name="university" value={form.university} onChange={handleChange} placeholder="Please enter university name" />
                  </Field>
                </div>
                <div className="bd-form-row">
                  <Field label="University email">
                    <input
                      className="bd-input"
                      type="email"
                      name="universityEmail"
                      value={form.universityEmail}
                      onChange={handleChange}
                      placeholder="Please enter university email"
                    />
                  </Field>
                  <Field label="Course / degree">
                    <input className="bd-input" name="course" value={form.course} onChange={handleChange} placeholder="Please enter course or degree" />
                  </Field>
                </div>
                <div className="bd-form-row">
                  <Field label="Field of study">
                    <input className="bd-input" name="fieldOfStudy" value={form.fieldOfStudy} onChange={handleChange} placeholder="Please enter field of study" />
                  </Field>
                  <Field label="Expected graduation year">
                    <select className="bd-select" name="graduationYear" value={form.graduationYear} onChange={handleChange}>
                      <option value="">Select year...</option>
                      {GRADUATION_YEARS.map((year) => (
                        <option key={year}>{year}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="bd-form-row">
                  <Field label="Country">
                    <input className="bd-input" name="country" value={form.country} onChange={handleChange} placeholder="Please enter country" />
                  </Field>
                  <Field label="City">
                    <input className="bd-input" name="city" value={form.city} onChange={handleChange} placeholder="Please enter city" />
                  </Field>
                </div>
              </FormSection>
            )}

            {step === 1 && (
              <FormSection number="02" title="Usage" subtitle="How you plan to use the platform as a student.">
                <Field label="What will you use the platform for?">
                  <ChipMultiSelect
                    options={STUDENT_USES}
                    value={form.platformUse}
                    onChange={(platformUse) => setField('platformUse', platformUse)}
                  />
                </Field>
                {form.platformUse.includes('Other') ? (
                  <Field label="Other use">
                    <input className="bd-input" name="otherUse" value={form.otherUse} onChange={handleChange} placeholder="Please enter other use" />
                  </Field>
                ) : null}
              </FormSection>
            )}

            {step === 2 && (
              <FormSection number="03" title="Student ID" subtitle="Upload a clear photo of your student ID card.">
                <Field label="Student ID card picture">
                  <FileUpload file={idCard} preview={idPreview} onChange={handleIdChange} />
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
                          <path d="M2 5l2.5 2.5 4-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    By submitting this form, you agree to be contacted about your student access request.
                  </label>
                </div>
              </FormSection>
            )}

            <StepActions
              step={step}
              total={STEP_TITLES.length}
              loading={loading}
              onBack={() => setStep((prev) => prev - 1)}
              submitLabel="Submit application"
            />
          </form>
        </div>
      </div>
    </InquiryPageLayout>
  );
};

export default StudentPage;
