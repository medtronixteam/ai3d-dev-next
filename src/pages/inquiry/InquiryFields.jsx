import { useRef, useState } from 'react';

export function Field({ label, optional, children, className = '' }) {
  return (
    <div className={`bd-field ${className}`}>
      <label className="bd-label">
        {label}
        {optional ? <span className="inq-optional">Optional</span> : null}
      </label>
      {children}
    </div>
  );
}

export function FormSection({ number, title, subtitle, children }) {
  return (
    <section className="inq-section">
      <div className="inq-section-head">
        <span className="inq-section-num">{number}</span>
        <div>
          <h3 className="inq-section-title">{title}</h3>
          {subtitle ? <p className="inq-section-sub">{subtitle}</p> : null}
        </div>
      </div>
      <div className="inq-section-body">{children}</div>
    </section>
  );
}

export function Stepper({ steps, current }) {
  const progress = ((current + 1) / steps.length) * 100;

  return (
    <div className="inq-stepper">
      <div className="inq-stepper-meta">
        <span>
          Step {current + 1} of {steps.length}
        </span>
        <span>{steps[current]}</span>
      </div>
      <div className="inq-progress" aria-hidden="true">
        <div className="inq-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="inq-stepper-labels">
        {steps.map((step, index) => (
          <span
            key={step}
            className={`inq-stepper-label ${index === current ? 'active' : ''} ${index < current ? 'done' : ''}`}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

export function StepActions({ step, total, loading, onBack, nextLabel = 'Next', submitLabel = 'Submit' }) {
  const isLast = step === total - 1;

  return (
    <div className="inq-step-actions">
      {step > 0 ? (
        <button type="button" className="inq-secondary" onClick={onBack}>
          Back
        </button>
      ) : null}
      <button type="submit" className="bd-submit" disabled={loading}>
        {loading ? (
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
        ) : null}
        {loading ? 'Sending...' : isLast ? submitLabel : nextLabel}
      </button>
    </div>
  );
}

export function ChoicePills({ name, value, options, onChange }) {
  return (
    <div className="inq-choice-row" role="radiogroup">
      {options.map((option) => {
        const selected = value === option;
        return (
          <label key={option} className={`inq-choice ${selected ? 'active' : ''}`}>
            <input
              type="radio"
              name={name}
              value={option}
              checked={selected}
              onChange={(e) => onChange(e.target.value)}
            />
            {option}
          </label>
        );
      })}
    </div>
  );
}

export function ChipMultiSelect({ options, value, onChange }) {
  const toggle = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
      return;
    }
    onChange([...value, option]);
  };

  return (
    <div className="inq-chip-row">
      {options.map((option) => {
        const selected = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            className={`inq-chip ${selected ? 'active' : ''}`}
            onClick={() => toggle(option)}
            aria-pressed={selected}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function FileUpload({ file, preview, onChange, accept = 'image/*' }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const applyFile = (nextFile) => {
    if (!nextFile) return;
    onChange(nextFile);
  };

  return (
    <div
      className={`inq-dropzone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        applyFile(e.dataTransfer.files?.[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => applyFile(e.target.files?.[0])}
      />
      {preview ? (
        <div className="inq-dropzone-preview">
          <img src={preview} alt="Student ID preview" />
          <div>
            <p className="inq-dropzone-name">{file?.name}</p>
            <p className="inq-dropzone-hint">Click or drop a new image to replace</p>
          </div>
        </div>
      ) : (
        <div className="inq-dropzone-empty">
          <span className="inq-dropzone-icon">ID</span>
          <p>Upload a clear photo of your student ID card</p>
          <span>PNG, JPG up to 5 MB</span>
        </div>
      )}
    </div>
  );
}
