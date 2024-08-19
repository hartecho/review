<template>
  <div class="hero-section">
    <div class="content">
      <h1>
        <span>Where</span> Expertise <br />meets <span>Accountability</span>
      </h1>
      <p>
        Subsource is a review platform dedicated to all things commercial
        construction. Our mission is to reward those who excel in their field
        and hold accountable those who fall short. We provide a transparent and
        reliable platform for reviewing and rating contractors, subcontractors,
        suppliers, and agencies involved in commercial construction.
      </p>
      <p>
        By using Subsource, you help maintain high standards in the industry and
        ensure that only the best companies thrive. We believe in the power of
        community feedback to drive improvement and excellence.
      </p>
      <div class="buttons-container">
        <div class="button-wrapper">
          <router-link to="/search/searchContract" class="primary-button">
            Search Contractors
          </router-link>
        </div>
        <div class="button-wrapper">
          <router-link to="/search/searchSub" class="secondary-button">
            Search Subcontractors
          </router-link>
        </div>
        <div class="button-wrapper">
          <router-link to="/search/searchSupply" class="secondary-button">
            Search Suppliers
          </router-link>
        </div>
        <div class="button-wrapper">
          <router-link to="/search/searchAgency" class="primary-button">
            Search Agencies
          </router-link>
        </div>
      </div>
    </div>
    <div class="image-container">
      <NuxtImg
        src="/aboutPic.webp"
        placeholder="/aboutPicBlur.webp"
        alt="Construction Image"
        class="hero-image"
      />
    </div>
  </div>
</template>
  
  <script setup>
// No need to import the photos since we're using NuxtImg and the paths are direct
</script>
  
  <style scoped>
.hero-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 4rem;
  background-color: #000000;
  color: #ffffff;
  max-width: 1400px;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

.content {
  flex: 1;
  padding-right: 30px;
}

h1 {
  font-size: 3rem;
  font-weight: bold;
  line-height: 1.2;
}

h1 span {
  color: #ff8210; /* Highlighted words color */
}

p {
  margin: 20px 0;
  font-size: 1.2rem;
  line-height: 1.6;
  color: #cccccc;
}

.buttons-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 30px;
}

.button-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-button,
.secondary-button {
  padding: 10px 20px; /* Shorter height */
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  text-decoration: none;
  display: inline-block;
  width: 100%; /* Make buttons uniform width */
}

.primary-button {
  background-color: #ff8210;
  color: #000000;
  border: none;
}

.primary-button:hover {
  background-color: #faaa4a;
}

.secondary-button {
  background-color: transparent;
  color: #ffffff;
  border: 2px solid #ffffff;
}

.secondary-button:hover {
  background-color: #ffffff;
  color: #000000;
}

.image-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px; /* Added margin for when the image wraps under */
}

.hero-image {
  width: 100%;
  max-width: 500px;
  height: auto;
  object-fit: cover;
  border-radius: 15px;
}

/* Responsive Design */

/* At max-width 1080px: image wraps underneath text */
@media (max-width: 1080px) {
  .hero-section {
    flex-direction: column;
    align-items: center;
  }

  .content {
    padding-right: 0;
    text-align: center;
  }

  .buttons-container {
    max-width: 100%; /* Allow buttons to take full width */
  }

  .image-container {
    margin-top: 30px;
  }
}

/* At max-width 768px: smaller adjustments for medium screens */
@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem; /* Slightly smaller heading */
  }

  p {
    font-size: 1.1rem; /* Slightly smaller paragraph text */
  }

  .buttons-container {
    grid-template-columns: 1fr; /* Stack buttons vertically */
    gap: 15px;
  }

  .button-wrapper {
    width: 100%;
  }
}

/* At max-width 480px: adjustments for small screens */
@media (max-width: 480px) {
  .hero-section {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  h1 {
    font-size: 1.8rem; /* Smaller heading */
    line-height: 1.2;
  }

  p {
    font-size: 1rem; /* Smaller paragraph text */
    line-height: 1.4;
  }

  .buttons-container {
    grid-template-columns: 1fr; /* Stack buttons vertically */
    gap: 10px;
  }

  .button-wrapper {
    width: 100%;
  }

  .primary-button,
  .secondary-button {
    font-size: 0.9rem; /* Slightly smaller buttons */
    padding: 8px 16px; /* Reduce button padding */
  }
}
</style>
  