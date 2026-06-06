import React, { useState, useEffect } from 'react';
import './Subscription.css'
import { useNavigate } from 'react-router-dom';
import CardPayment from './CardPayment';
import axios from 'axios';
import { baseURL } from '../../config';
import { useAuth } from '../../context/AuthContext';

const Subscription = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const navigate = useNavigate();
  const [monthlyPlan, setMonthlyPlan] = useState({ name: 'Starter', price: '29', duration: 'Month' });
  const [yearlyPlan, setYearlyPlan] = useState({ name: 'Starter', price: '290', duration: 'Year' });
  const { token } = useAuth();

  useEffect(() => {
    const monthlyPlans = document.querySelector('.subscription-monthly-plans');
    const yearlyPlans = document.querySelector('.subscription-yearly-plans');

    if (monthlyPlans && yearlyPlans) {
      if (billingPeriod === 'monthly') {
        monthlyPlans.style.display = 'block';
        yearlyPlans.style.display = 'none';
      } else {
        monthlyPlans.style.display = 'none';
        yearlyPlans.style.display = 'block';
      }
    }
    // Fetch plans
    axios.get(`${baseURL}/plan/monthly`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).then(res => {
      const data = res.data || {};
      setMonthlyPlan({
        name: data.name || 'Starter',
        price: data.price || '29',
        duration: data.duration || 'Month',
      });
    }).catch(() => {
      setMonthlyPlan({ name: 'Starter', price: '29', duration: 'Month' });
    });
    axios.get(`${baseURL}/plan/yearly`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).then(res => {
      const data = res.data || {};
      setYearlyPlan({
        name: data.name || 'Starter',
        price: data.price || '290',
        duration: data.duration || 'Year',
      });
    }).catch(() => {
      setYearlyPlan({ name: 'Starter', price: '290', duration: 'Year' });
    });
  }, [billingPeriod, token]);

  return (
    <>
  {/* =================== Hero Section ============= */}
  <section className="subscription-hero-section p-5">
    <div className="container">
      <div className="row justify-content-center align-items-center text-center">
        <div className="col-md-6">
          <h2>
            Choose <span>Your</span>Plan
          </h2>
          <p>Flexible Plans to Power Your 3D Needs</p>
        </div>
      </div>
    </div>
  </section>
  {/* =================== Hero Section End ============= */}
  <div className="subscription-toggle-container">
    <div
      className={`subscription-toggle-option ${billingPeriod === 'monthly' ? 'active' : ''}`}
      onClick={() => setBillingPeriod('monthly')}
      data-period="monthly"
    >
      Monthly
    </div>
    <div
      className={`subscription-toggle-option ${billingPeriod === 'yearly' ? 'active' : ''}`}
      onClick={() => setBillingPeriod('yearly')}
      data-period="yearly"
    >
      Yearly
    </div>
  </div>
  {/* <div class="">
  <h6><span>Save from 10%</span>with yearly</h6>
  </div> */}
  {/* Monthly Plans Section */}
  <section className="subscription-monthly-plans mb-5">
    <div className="container">
      <div className="row">
        <div className="col-md-6 col-lg-4 mt-lg-0 mt-3">
          <div className="subscription-card subscription-freemium p-4">
            <h3>Freemium</h3>
            <div className="subscription-plan-price">
              Free<sub className="subscription-plan-period">/14 days trial</sub>
            </div>
            <p>Experience 3D Ai Power, No Card require, Cancle any time</p>
            <hr />
            <h5>Features you'll get:</h5>
            <div className="subscription-plan-features">
              <ul>
                <li>Instance 2D to 3D conversion</li>
                <li>Real-time preview &amp; exports</li>
                <li>Access to all tools &amp; APIs</li>
              </ul>
            </div>
            <p>
              At the end of 14 days,you can choose a plan that fits your
              needs.We'll notify you 2 days before your trial ends.
            </p>
            <button className="subscription-plan-button" onClick={() => window.open('/3dio/subscription/card', '_blank')}>Start Free Trial</button>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mt-lg-0 mt-3 subscription-popular">
          <div className="subscription-card p-4">
            <div className="subscription-popular-tag">Popular</div>
            <h3>{monthlyPlan.name || 'Starter'}</h3>
            <div className="subscription-plan-price">
              ${monthlyPlan.price || '29'}<sub className="subscription-plan-period text-white">/{monthlyPlan.duration || 'Month'}</sub>
            </div>
            <p className="mb-0">
              ${yearlyPlan.price || '290'}<sub>/Year</sub>
            </p>
            <p>Unlock more Powerful design tools.</p>
            <hr />
            <h5>Features you'll get:</h5>
            <div className="subscription-plan-features">
              <ul>
                <li>Instance 2D to 3D conversion</li>
                <li>Real-time preview &amp; exports</li>
                <li>Access to all tools &amp; APIs</li>
              </ul>
            </div>
            <p>
              At the end of 14 days,you can choose a plan that fits your
              needs.We'll notify you 2 days before your trial ends.
            </p>
            <button className="subscription-plan-button" onClick={() => window.open('/subscription/card', '_blank')}>Choose Starter</button>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mt-lg-0 mt-3">
          <div className="subscription-card subscription-pro p-4">
            <h3>Pro Plan</h3>
            <div className="subscription-plan-price">
              $99<sub className="subscription-plan-period">/Month</sub>
            </div>
            <p className="mb-0">
              $990<sub>/Year</sub>
            </p>
            <p>Unlock more Powerful design tools.</p>
            <hr />
            <h5>Features you'll get:</h5>
            <div className="subscription-plan-features">
              <ul>
                <li>Instance 2D to 3D conversion</li>
                <li>Real-time preview &amp; exports</li>
                <li>Access to all tools &amp; APIs</li>
              </ul>
            </div>
            <p>
              At the end of 14 days,you can choose a plan that fits your
              needs.We'll notify you 2 days before your trial ends.
            </p>
            <button className="subscription-plan-button" onClick={() => window.open('/subscription/card', '_blank')}>Choose Pro</button>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* Yearly Plans Section */}
  <section className="subscription-yearly-plans mb-5">
    <div className="container">
      <div className="row">
        <div className="col-md-6 col-lg-4 mt-lg-0 mt-3">
          <div className="subscription-card subscription-yearly-special p-4">
            <h3>{yearlyPlan.name || 'Starter'}</h3>
            <div className="subscription-plan-price">
              ${yearlyPlan.price || '290'}<sub className="subscription-plan-period">/{yearlyPlan.duration || 'Year'}</sub>
            </div>
            <p>Basic conversions</p>
            <hr />
            <h5>Features you'll get:</h5>
            <div className="subscription-plan-features">
              <ul>
                <li>Instance 2D to 3D conversion</li>
                <li>Real-time preview &amp; exports</li>
                <li>Access to all tools &amp; APIs</li>
              </ul>
            </div>
            <p>
              At the end of 14 days,you can choose a plan that fits your
              needs.We'll notify you 2 days before your trial ends.
            </p>
            <button className="subscription-plan-button" onClick={() => window.open('/subscription/card', '_blank')}>Choose Starter</button>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mt-lg-0 mt-3">
          <div className="subscription-card subscription-yearly-special p-4">
            <h3>Pro Plan</h3>
            <div className="subscription-plan-price">
              $990<sub className="subscription-plan-period">/Year</sub>
            </div>
            <p>Unlock me more Powerful design tools.</p>
            <hr />
            <h5>Features you'll get:</h5>
            <div className="subscription-plan-features">
              <ul>
                <li>Instance 2D to 3D conversion</li>
                <li>Real-time preview &amp; exports</li>
                <li>Access to all tools &amp; APIs</li>
              </ul>
            </div>
            <p>
              At the end of 14 days,you can choose a plan that fits your
              needs.We'll notify you 2 days before your trial ends.
            </p>
            <button className="subscription-plan-button" onClick={() => window.open('/subscription/card', '_blank')}>Choose Pro</button>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mt-lg-0 mt-3">
          <div className="subscription-card subscription-pro p-4">
            <h3>Enterprise Plan</h3>
            <div className="subscription-plan-price mb-5">
              Custom<sub className="subscription-plan-period">billing</sub>
            </div>
            <hr />
            <h5>Features you'll get:</h5>
            <div className="subscription-plan-features">
              <ul>
                <li>Instance 2D to 3D conversion</li>
                <li>Real-time preview &amp; exports</li>
                <li>Access to all tools &amp; APIs</li>
              </ul>
            </div>
            <p>
              At the end of 14 days,you can choose a plan that fits your
              needs.We'll notify you 2 days before your trial ends.
            </p>
            <button className="subscription-plan-button" onClick={() => window.open('/subscription/card', '_blank')}>Contact Us</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</>

  );
};

export default Subscription; 