import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import world from '../../pages/images/worl.png';

const LangButton = () => (
  <>
    <img src={world} alt="World" className="footer-lang-icon" />
    <span className="footer-select-label">English</span>
    <FaChevronDown size={12} className="footer-select-chevron" />
  </>
);

const CurrencyButton = () => (
  <>
    <span className="footer-currency-symbol">$</span>
    <span className="footer-select-label">USD</span>
    <FaChevronDown size={12} className="footer-select-chevron" />
  </>
);

const LangDropdownItem = () => (
  <button type="button" className="dropdown-item black footer-dropdown-item">
    <img src={world} alt="World" className="footer-lang-icon" />
    <span className="footer-select-label">English</span>
    <span className="footer-select-chevron-spacer" aria-hidden="true" />
  </button>
);

const CurrencyDropdownItem = () => (
  <button type="button" className="dropdown-item black footer-dropdown-item">
    <span className="footer-currency-symbol">$</span>
    <span className="footer-select-label">USD</span>
    <span className="footer-select-chevron-spacer" aria-hidden="true" />
  </button>
);

const FooterLangCurrency = () => (
  <>
    {/* Mobile Language Dropdown */}
    <div className="dropdown btn-wrapper footer-lang-dropdown d-lg-none d-md-none d-sm-none d-block">
      <button className="btn english" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Select language">
        <LangButton />
      </button>
      <ul className="dropdown-menu menuo usd-tittle" data-bs-popper="static">
        <li>
          <LangDropdownItem />
        </li>
      </ul>
    </div>

    {/* Mobile Currency Dropdown */}
    <div className="dropdown btn-wrapper footer-usd-dropdown d-lg-none d-md-none d-sm-none d-block">
      <button className="btn usd" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Select currency">
        <CurrencyButton />
      </button>
      <ul className="dropdown-menu menu usd-tittle" data-bs-popper="static">
        <li>
          <CurrencyDropdownItem />
        </li>
      </ul>
    </div>

    {/* Desktop Language + Currency */}
    <div className="d-flex gap-2 none footer-select-row">
      <div className="dropdown btn-wrapper none">
        <button className="btn english" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Select language">
          <LangButton />
        </button>
        <ul className="dropdown-menu menuo usd-tittle" data-bs-popper="static">
          <li>
            <LangDropdownItem />
          </li>
        </ul>
      </div>

      <div className="dropdown btn-wrapper none">
        <button className="btn usd" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Select currency">
          <CurrencyButton />
        </button>
        <ul className="dropdown-menu menu usd-tittle" data-bs-popper="static">
          <li>
            <CurrencyDropdownItem />
          </li>
        </ul>
      </div>
    </div>
  </>
);

export default FooterLangCurrency;
