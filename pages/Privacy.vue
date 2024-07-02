<template>
  <div class="body">
    <div class="terms">
      <h1>Privacy Policy</h1>
      <h2>1. Information We Collect</h2>
      <p>We collect and process the following information:</p>
      <ul>
        <li>
          <b>Personal Identification Information:</b> Name, email address, and
          any other information you provide when signing up or leaving reviews.
        </li>
      </ul>
      <h2>2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Provide our services to you.</li>
        <li>Improve and personalize your experience on our website.</li>
        <li>Communicate with you, including responding to your inquiries.</li>
        <li>
          Send promotional emails about new products, special offers, or other
          information we think you may find interesting. You can unsubscribe
          from these emails at any time.
        </li>
      </ul>
      <h2>3. Sharing of Your Information</h2>
      <p>
        We do not sell, distribute, or lease your personal information to third
        parties unless we have your permission or are required by law to do so.
      </p>
      <h2>4. Security</h2>
      <p>
        We are committed to ensuring that your information is secure. In order
        to prevent unauthorized access or disclosure, we have put in place
        suitable physical, electronic, and managerial procedures to safeguard
        and secure the information we collect online.
      </p>
      <h2>5. Google Services</h2>
      <p>
        We use Google services such as Google Analytics and Google Ads to
        understand how our website is used and to serve relevant advertisements.
        These services may collect information such as your IP address and
        browsing behavior automatically.
      </p>
      <p>
        Google Analytics uses "cookies" and other tracking technologies to help
        the website analyze how users use the site. The information generated
        about your use of the website (including your IP address) will be
        transmitted to and stored by Google on servers in the United States.
        Google will use this information for the purpose of evaluating your use
        of the website, compiling reports on website activity for website
        operators, and providing other services relating to website activity and
        internet usage. Google may also transfer this information to third
        parties where required to do so by law, or where such third parties
        process the information on Google's behalf. Google will not associate
        your IP address with any other data held by Google.
      </p>
      <p>
        We use the data collected by Google Analytics to analyze website traffic
        and improve our website. For more information on Google Analytics and
        privacy, please visit
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          >Google's Privacy Policy</a
        >.
      </p>
      <h2>6. Links to Other Websites</h2>
      <p>
        Our website may contain links to other websites of interest. However,
        once you have used these links to leave our site, you should note that
        we do not have any control over that other website.
      </p>
      <h2>7. Changes to Our Privacy Policy</h2>
      <p>
        We may update this policy from time to time by updating this page. You
        should check this page occasionally to ensure that you are happy with
        any changes.
      </p>
      <h2>8. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at support@subsource.org.
      </p>
    </div>
    <!-- <SubcomponentsContactBanner
      graphicPath="ContactBannerGraphic.svg"
      buttonClass="contact-button"
      buttonPath="/contact"
      backgroundPath="ContactBannerBG.svg"
    /> -->
  </div>
</template>

<script setup>
useSeoMeta({
  title: "Privacy Policy - Subsource",
  ogTitle: "Privacy Policy - Subsource",
  description:
    "Read our Privacy Policy to understand how we collect, use, and protect your personal information.",
  ogDescription:
    "Read our Privacy Policy to understand how we collect, use, and protect your personal information.",
  ogImage: "/SSLogo.webp",
  twitterCard: "/SSLogo.webp",
});
</script>

<style scoped>
.body {
  width: 100%;
  min-height: 70rem;
  height: auto;
  color: black;
}

.terms {
  max-width: 1200px;
  margin: 4rem auto;
  width: 100%;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  font-style: normal !important;
  margin-bottom: 2rem;
}

h2 {
  text-align: left;
  width: 100%;
  font-size: 1.3rem;
  font-weight: bold;
}

p {
  width: 100%;
  font-size: 1.3rem;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

ul {
  list-style-type: disc;
  padding-left: 3rem;
  margin-bottom: 2rem;
}

li {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
}

a {
  color: blue;
}

a:hover {
  text-decoration: underline;
}
</style>
