import React, { useMemo, useState } from 'react';
import CeoImg from '../images/Arslanbhi.png';
import './Schedule.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faChevronLeft,
  faChevronRight,
  faClock,
  faVideo,
  faGlobe,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SchedulePage = () => {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const monthName = useMemo(
    () =>
      new Date(viewYear, viewMonth, 1).toLocaleString(undefined, {
        month: 'long',
        year: 'numeric',
      }),
    [viewYear, viewMonth],
  );

  // Calendar matrix with Monday as first day of week
  const daysMatrix = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    let startWeekday = firstDay.getDay() - 1;
    if (startWeekday < 0) startWeekday = 6; // Sunday to end

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
    const cells = [];

    // Fill previous month days
    for (let i = startWeekday - 1; i >= 0; i -= 1) {
      const d = daysInPrevMonth - i;
      cells.push({ day: d, inMonth: false, date: new Date(viewYear, viewMonth - 1, d) });
    }
    // Fill current month days
    for (let d = 1; d <= daysInMonth; d += 1) {
      cells.push({ day: d, inMonth: true, date: new Date(viewYear, viewMonth, d) });
    }
    // Fill next month days
    while (cells.length % 7 !== 0) {
      const d = cells.length - (startWeekday + daysInMonth) + 1;
      cells.push({ day: d, inMonth: false, date: new Date(viewYear, viewMonth + 1, d) });
    }
    return cells;
  }, [viewYear, viewMonth]);

  // Split daysMatrix into weeks (arrays of 7)
  const weeks = [];
  for (let i = 0; i < daysMatrix.length; i += 7) {
    weeks.push(daysMatrix.slice(i, i + 7));
  }

  const times = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'];

  const onPrevMonth = () => {
    const d = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const onNextMonth = () => {
    const d = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const selectedDateStr = selectedDate
    ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
    : '';

  // Custom timezone dropdown (no border)
  const [showTz, setShowTz] = useState(false);
  const [timezone, setTimezone] = useState('Pakistan, Maldives Time (11:11am)');
  const timezoneOptions = [
    'Pakistan, Maldives Time (11:11am)',
    'UTC',
    'US Eastern',
    'London',
    'Tokyo',
  ];

  return (
    <div className="schedule-wrapper py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-xxl-10">
          <div className="schedule-card shadow-sm border rounded-4 overflow-hidden bg-white">
            <div className="row g-0">
              {/* Left Profile */}
              <div className="col-12 col-lg-4 p-4 sp-profile-bg">
                <div className="d-flex flex-column gap-3 mb-3">
                  {/* Profile Image */}
                  <img
                    src={CeoImg}
                    alt="Arslan Ahmad"
                    className="rounded-circle"
                    width={60}
                    height={60}
                  />

                  {/* Name */}
                  <h5 className="mb-1 sp-name">Arslan Ahmad</h5>

                  {/* Duration */}
                  <div className="d-flex align-items-center gap-2 text-muted">
                    <FontAwesomeIcon icon={faClock} className="text-muted" />
                    <small className="sp-duration">30 mins</small>
                  </div>

                  {/* Web Conference Note */}
                  <div className="d-flex align-items-start gap-2 text-muted">
                    <FontAwesomeIcon icon={faVideo} className="mt-1 text-muted" />
                    <small className="sp-note">
                      Web conferencing details provided upon confirmation
                    </small>
                  </div>
                </div>

                {/* Agenda & Info */}
                <div className="sp-info">
                  <p>
                    <strong>Agenda:</strong> Sequences, Automation Journey
                  </p>
                  <p>
                    <strong>Duration:</strong> 30 minutes
                  </p>
                  <p>
                    <strong>Language:</strong> English only
                  </p>
                </div>

                {/* Final Note */}
                <div className="sp-note mt-2 text-muted">
                  <p>
                    <strong>Note:</strong> Make sure you have selected the correct date, time and
                    time zone.
                  </p>
                  <p>
                    In case you do not find an open slot, feel free to check with the team over
                    chat.
                  </p>
                </div>
              </div>

              {/* Right Calendar & Time */}
              <div className="col-12 col-lg-8 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h6 className="mb-0">Select Date & Time</h6>
                    <div
                      className="custom-tz-dropdown"
                      tabIndex={0}
                      onBlur={() => setTimeout(() => setShowTz(false), 150)}
                    >
                      <button
                        className="custom-tz-btn"
                        type="button"
                        onClick={() => setShowTz((v) => !v)}
                      >
                        <FontAwesomeIcon icon={faGlobe} className="me-1" />
                        {timezone}
                        <FontAwesomeIcon icon={faAngleDown} className="ms-2 tz-dropdown-arrow" />
                      </button>
                      {showTz && (
                        <ul className="custom-tz-menu">
                          {timezoneOptions.map((tz) => (
                            <li key={tz}>
                              <button
                                className="custom-tz-item"
                                type="button"
                                onClick={() => {
                                  setTimezone(tz);
                                  setShowTz(false);
                                }}
                              >
                                {tz}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  {selectedDate && (
                    <div className="schedule-small text-muted mt-2">{selectedDateStr}</div>
                  )}
                </div>

                <div className="row g-3">
                  {/* Calendar */}
                  <div className="col-12 col-md-8">
                    <div className="schedule-calendar-grid p-3 bg-white rounded-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">{monthName}</h6>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary calendar-nav-btn"
                            onClick={onPrevMonth}
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary calendar-nav-btn"
                            onClick={onNextMonth}
                          >
                            <FontAwesomeIcon icon={faChevronRight} />
                          </button>
                        </div>
                      </div>
                      <div className="d-flex flex-row gap-1 row-cols-7 g-1 text-center schedule-small mb-2">
                        {weekDays.map((d) => (
                          <div
                            key={d}
                            className="text-muted fw-medium flex-fill calendar-cell-small"
                          >
                            {d}
                          </div>
                        ))}
                      </div>
                      {weeks.map((week, wi) => (
                        <div className="row row-cols-7 g-1 mb-3" key={wi}>
                          {week.map((cell, i) => (
                            <div key={i} className="col calendar-cell-small">
                              {cell.inMonth ? (
                                <button
                                  type="button"
                                  className={`btn btn-sm w-100 calendar-date-btn ${
                                    selectedDate &&
                                    selectedDate.toDateString() === cell.date.toDateString()
                                      ? 'btn-schedule-selected'
                                      : 'btn-outline-light'
                                  }`}
                                  onClick={() => {
                                    setSelectedDate(cell.date);
                                    setSelectedTime(null);
                                  }}
                                >
                                  {cell.day}
                                </button>
                              ) : (
                                <div style={{ height: 28 }}></div>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="col-12 col-md-4">
                    {/* Show info text if no date selected */}
                    {!selectedDate && (
                      <div className="text-center mb-3">
                        <div className="no-date-selected-text">
                          Please select a date from the calendar to see available time slots.
                        </div>
                      </div>
                    )}
                    {/* Show time slots, but replace selected time with confirm row */}
                    <div className="d-grid gap-3">
                      {selectedDate &&
                        times.map((t) =>
                          selectedTime === t ? (
                            <div className="d-flex gap-2 justify-content-center" key={t}>
                              <div className="selected-time-box">
                                <span>{selectedTime}</span>
                              </div>
                              <button
                                className="btn btn-confirm selected-confirm-btn"
                                onClick={() => alert('Meeting confirmed!')}
                              >
                                Confirm
                              </button>
                            </div>
                          ) : (
                            <button
                              key={t}
                              type="button"
                              className={`btn btn-outline-light`}
                              disabled={!selectedDate}
                              onClick={() => setSelectedTime(t)}
                            >
                              {t}
                            </button>
                          ),
                        )}
                      {!selectedDate &&
                        times.map((t) => (
                          <button key={t} type="button" className="btn btn-outline-light" disabled>
                            {t}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Custom timezone dropdown and calendar/time CSS */}
      <style>
        {`
        .custom-tz-dropdown {
          position: relative;
          display: inline-block;
          min-width: 300px;
        }
        .custom-tz-btn {
          background: none;
          border: none;
          outline: none;
          box-shadow: none;
          padding: 6px 14px 6px 0px;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.15s;
          display: flex;
          align-items: center;
        }
        .tz-dropdown-arrow {
          font-size: 1.1em;
          color: #de3996;
          transition: transform 0.2s;
        }
        .custom-tz-btn[aria-expanded="true"] .tz-dropdown-arrow {
          transform: rotate(180deg);
        }
        .custom-tz-btn:focus,
        .custom-tz-btn:active {
          background: none !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        .custom-tz-menu {
          display: block;
          position: absolute;
          right: 0;
          top: 110%;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
          z-index: 10;
          padding: 0.5rem 0;
        }
        .custom-tz-dropdown:not(:focus-within) .custom-tz-menu {
          display: none;
        }
        .custom-tz-item {
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          padding: 8px 18px;
          font-size: 1rem;
          color: #222;
          cursor: pointer;
          border-radius: 0;
        }
        .custom-tz-item:hover {
          background: #f7f7fa;
        }
        .calendar-nav-btn {
          border: 1.5px solid #f7f7fa !important;
          background: #f7f7fa !important;
          color: #de3996 !important;
          transition: background 0.15s, color 0.15s, border 0.15s;
        }
        .calendar-nav-btn:hover,
        .calendar-nav-btn:focus,
        .calendar-nav-btn:active {
          background: #de3996 !important;
          color: #fff !important;
          border: 1.5px solid #de3996 !important;
        }
        .calendar-cell-small {
          // min-width: 28px;
          // max-width: 32px;
          padding-left: 1px;
          padding-right: 1px;
        }
        .calendar-date-btn {
          min-width: 30px;
          max-width: 55px;
          min-height: 26px;
          font-size: 0.98rem;
          background: #fff;
          border-radius: 3px !important;
          border: 1.5px solid #f7f7fa;
         box-shadow: 0px 0px 4px 0px #00000040;
          transition: background 0.15s, border 0.15s, box-shadow 0.15s;
        }
        .calendar-date-btn:hover,
        .calendar-date-btn:active,
        .calendar-date-btn:focus {
          background: #ff9c3e !important;
          color: #fff !important;
          border: 1.5px solid #ff9c3e !important;
          box-shadow: 0 4px 16px rgba(255,156,62,0.18);
        }
        .btn-schedule-selected {
          background: #de3996 !important;
          color: #fff !important;
          border: 1.5px solid #de3996 !important;
          box-shadow: 0 4px 16px rgba(222,57,150,0.18);
        }
        .no-date-selected-text {
          color: #de3996;
          font-weight: 600;
          font-size: 1.08rem;
          background: #fff0f7;
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 8px;
        }
        .selected-time-box {
          background: #f7f7fa;
          border-radius: 8px;
          padding: 5px 20px;
          font-weight: 600;
          font-size: 1.08rem;
          color: #de3996;
          display: flex;
          align-items: center;
          border: 1px solid #ffd6ef;
        }
        .selected-confirm-btn {
          background: #ff9c3e !important;
          color: #fff !important;
          border-radius: 8px;
          font-weight: 600;
          padding: 5px 20px;
          font-size: 1.08rem;
          border: none;
        }
        `}
      </style>
    </div>
  );
};

export default SchedulePage;
