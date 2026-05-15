import React from 'react';
import './FAQPalette.css';

const FAQPalette = ({ faqs }) => {
  return (
    <div className="faq-palette-container">
      <div className="palette">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-color" id={`faq-color${index + 1}`}>
            <div className="faq-preview-base">
              <span className="material-symbols-outlined faq-icon-small">{faq.icon}</span>
              <h4 className="faq-question-small">{faq.q}</h4>
            </div>

            <div className="faq-expanded-content">
              <span className="material-symbols-outlined faq-icon-large">{faq.icon}</span>
              <h4 className="faq-question-large">{faq.q}</h4>
              <p className="faq-answer">{faq.a}</p>
            </div>
          </div>
        ))}
        <div id="faq-center-node">
          <div id="faq-node-text"></div>
        </div>
      </div>
    </div>
  );
};

export default FAQPalette;
