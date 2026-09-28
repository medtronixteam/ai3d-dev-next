import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import world from '../../pages/images/worl.png';

const LANGUAGES = [
  { code: 'en', label: 'English' }
];

const CURRENCIES = [
  { code: 'usd', symbol: '$', label: 'USD' }
];

const FooterLangCurrency = () => {
  const [langOpen, setLangOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);

  const langRef = useRef(null);
  const currencyRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(e.target)) {
        setCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="d-flex gap-2 footer-select-row align-items-center">
      <style>{`
        .footer-select-row {
          width: 100% !important;
          max-width: 225px !important;
          display: flex !important;
          gap: 8px !important;
        }
        @media (max-width: 575px) {
          .footer-select-row {
            max-width: none !important;
          }
        }
        .footer-select-row .footer-lang-dropdown {
          flex: 1.15 1 0 !important;
          min-width: 0 !important;
          width: auto !important;
        }
        .footer-select-row .footer-usd-dropdown {
          flex: 0.85 1 0 !important;
          min-width: 0 !important;
          width: auto !important;
        }
        .footer-select-row .btn.english,
        .footer-select-row .btn.usd {
          width: 100% !important;
          padding: 4px 8px !important;
          font-size: 13px !important;
          line-height: 1.2 !important;
          height: 32px !important;
          min-height: 32px !important;
          border-radius: 4px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          border: 1px solid rgba(222, 57, 150, 1) !important;
          color: rgba(222, 57, 150, 1) !important;
          background: transparent !important;
          box-sizing: border-box !important;
        }
        .footer-select-row .footer-lang-icon {
          width: 13px !important;
          height: 13px !important;
          margin-right: 4px !important;
          flex-shrink: 0 !important;
        }
        .footer-select-row .footer-currency-symbol {
          font-size: 13px !important;
          font-weight: 600 !important;
          margin-right: 4px !important;
          flex-shrink: 0 !important;
        }
        .footer-select-row .footer-select-label {
          font-size: 13px !important;
          font-weight: 500 !important;
          white-space: nowrap !important;
        }
        .footer-select-row .footer-select-chevron {
          flex-shrink: 0 !important;
          margin-left: 2px !important;
        }
        .footer-select-row .footer-dropdown-item {
          padding: 4px 10px !important;
          font-size: 12px !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
        }
      `}</style>
      {/* Language Dropdown */}
      <div className="dropdown btn-wrapper footer-lang-dropdown position-relative" ref={langRef}>
        <button
          className="btn english"
          type="button"
          onClick={() => {
            setLangOpen((prev) => !prev);
            setCurrencyOpen(false);
          }}
          aria-expanded={langOpen}
          aria-label="Select language"
        >
          <img src={world} alt="World" className="footer-lang-icon" />
          <span className="footer-select-label">{selectedLang.label}</span>
          <FaChevronDown
            size={10}
            className="footer-select-chevron"
            style={{
              transform: langOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>

        {langOpen && (
          <ul
            className="dropdown-menu menuo usd-tittle show position-absolute w-100"
            style={{
              top: 'calc(100% + 4px)',
              left: 0,
              zIndex: 1050,
              display: 'block',
              margin: 0,
            }}
          >
            {LANGUAGES.map((lang) => (
              <li key={lang.code}>
                <button
                  type="button"
                  className="dropdown-item black footer-dropdown-item"
                  onClick={() => {
                    setSelectedLang(lang);
                    setLangOpen(false);
                  }}
                >
                  <img src={world} alt="World" className="footer-lang-icon" />
                  <span className="footer-select-label">{lang.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Currency Dropdown */}
      <div className="dropdown btn-wrapper footer-usd-dropdown position-relative" ref={currencyRef}>
        <button
          className="btn usd"
          type="button"
          onClick={() => {
            setCurrencyOpen((prev) => !prev);
            setLangOpen(false);
          }}
          aria-expanded={currencyOpen}
          aria-label="Select currency"
        >
          <span className="footer-currency-symbol">{selectedCurrency.symbol}</span>
          <span className="footer-select-label">{selectedCurrency.label}</span>
          <FaChevronDown
            size={10}
            className="footer-select-chevron"
            style={{
              transform: currencyOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>

        {currencyOpen && (
          <ul
            className="dropdown-menu menu usd-tittle show position-absolute w-100"
            style={{
              top: 'calc(100% + 4px)',
              left: 0,
              zIndex: 1050,
              display: 'block',
              margin: 0,
            }}
          >
            {CURRENCIES.map((curr) => (
              <li key={curr.code}>
                <button
                  type="button"
                  className="dropdown-item black footer-dropdown-item"
                  onClick={() => {
                    setSelectedCurrency(curr);
                    setCurrencyOpen(false);
                  }}
                >
                  <span className="footer-currency-symbol">{curr.symbol}</span>
                  <span className="footer-select-label">{curr.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FooterLangCurrency;
