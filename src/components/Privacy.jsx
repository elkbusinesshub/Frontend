import React from 'react'
import Footer from './Footer'

function Privacy() {
    return (
        
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{background:'linear-gradient(180deg, #F5CC40 0%, #4FBBB4 100%)', flexGrow: 1}} id ='contacts'>
        <div style={{ margin: '0 auto', maxWidth: '800px', padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6'}}>
      <h1 style={{ textAlign: 'center',color:'white' }}>Privacy Policy for ELK</h1>

      <section style={{color:'white'}}>
        <h2>Introduction</h2>
        <p>
          Welcome to ELK! We are committed to protecting your privacy and ensuring the security of
          your personal information. This Privacy Policy explains how we collect, use, disclose, and
          protect your information when you use our platform.
        </p>
      </section>

      <section style={{color:'white'}}>
        <h2>Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <ul>
          <li><strong>Personal Information:</strong> Name, email address, phone number and other contact details.</li>
          <li><strong>Usage Information:</strong> Details about your interactions with our platform, such as search queries, pages viewed, and time spent on the site.</li>
          <li><strong>Transaction Information:</strong> Information about the products and services you rent, hire, or list on our platform.</li>
          <li><strong>Location Information:</strong> Geolocation data from your device to provide location-based services.</li>
        </ul>
      </section>

      <section style={{color:'white'}}>
        <h2>How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide and improve our services.</li>
          <li>Facilitate transactions and communicate with you about your account.</li>
          <li>Personalize your experience on our platform.</li>
          <li>Monitor and analyze usage and trends to improve our platform.</li>
          <li>Send you updates, marketing communications, and promotional offers.</li>
          <li>Respond to your inquiries and provide customer support.</li>
          <li>Ensure compliance with our terms of service and policies.</li>
        </ul>
      </section>

      <section style={{color:'white'}}>
        <h2>Sharing Your Information</h2>
        <p>We may share your information with:</p>
        <ul>
          <li><strong>Service Providers:</strong> Third-party vendors who help us provide and improve our services.</li>
          <li><strong>Other Users:</strong> When you engage in transactions or communication with other users on our platform.</li>
          <li><strong>Legal Authorities:</strong> If required by law or to protect the rights, property, or safety of ELK, our users, or others.</li>
        </ul>
      </section>

      <section style={{color:'white'}}>
        <h2>Security</h2>
        <p>
          We implement appropriate security measures to protect your information from unauthorized
          access, alteration, disclosure, or destruction. However, no method of transmission over the
          internet or electronic storage is 100% secure.
        </p>
      </section>

      <section style={{color:'white'}}>
        <h2>Cookies and Tracking Technologies</h2>
        <p>We use cookies and similar tracking technologies to:</p>
        <ul>
          <li>Enhance your experience on our platform.</li>
          <li>Analyze usage and traffic on our site.</li>
          <li>Personalize content and ads.</li>
        </ul>
        <p>
          You can control the use of cookies through your browser settings, but disabling cookies may
          affect the functionality of our platform.
        </p>
      </section>

      <section style={{color:'white'}}>
        <h2>Your Choices</h2>
        <p>You have the following rights regarding your information:</p>
        <ul>
          <li><strong>Access and Update:</strong> You can access and update your personal information through your account settings.</li>
          <li><strong>Opt-Out:</strong> You can opt-out of receiving marketing communications from us by following the unsubscribe instructions in those communications.</li>
          <li><strong>Delete:</strong> You can request the deletion of your account and personal information, subject to certain legal obligations.</li>
        </ul>
      </section>

      <section style={{color:'white'}}>
        <h2>Children's Privacy</h2>
        <p>
          Our platform is not intended for children under the age of 18. We do not knowingly collect
          personal information from children under 18. If we become aware that we have collected
          personal information from a child under 18, we will take steps to delete such information.
        </p>
      </section>

      <section style={{color:'white'}}>
        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by
          posting the new Privacy Policy on our site and updating the effective date at the top. Your
          continued use of our platform after any changes constitutes your acceptance of the new
          Privacy Policy.
        </p>
      </section>

      <section style={{color:'white'}} id ='contactsinprivacy'  >
        <h2>Contact Us</h2>
        <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
        <p><strong>Email:</strong> elkcompanyin@gmail.com</p>
        <p><strong>Contact No: +91-7012931047</strong></p>
        <p>Thank you for trusting ELK with your personal information. We are committed to protecting
          your privacy and ensuring a safe and secure experience on our platform.</p>
      </section>
    </div>
    </div>
<Footer/>
        
        </div> 
    )

}

export default Privacy