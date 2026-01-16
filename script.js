/* =========================================
   1. MASTER CONTROL (Feature Flags)
   ========================================= */
const featureFlags = {
    bio:        true,  
    mainStage:  true,  
    sideStage:  true,  
    twitter:    true,
    instagram:  true,
    discord:    true,
    contact:    true,  
    patreon:    false, // DISABLED: Will show "Coming Soon"
    shop:       false  // DISABLED: Will show "Coming Soon"
};

// Map IDs to the flags above
const cardMap = {
    'card-bio':     featureFlags.bio,
    'main-stage':   featureFlags.mainStage,
    'side-stage':   featureFlags.sideStage,
    'card-twitter': featureFlags.twitter,
    'card-insta':   featureFlags.instagram,
    'card-discord': featureFlags.discord,
    'card-contact': featureFlags.contact,
    'card-patreon': featureFlags.patreon,
    'card-shop':    featureFlags.shop
};

/* =========================================
   2. CONFIGURATION
   ========================================= */
const twitchUsername = "kellynicole515"; 
const youtubePlaylistID = "PLyKbTGUD1Bdc2ZAY9fqmBeNmEC4A5hSE2"; 
const parentDomain = "kellynicole.net"; // UPDATED for your live site

// API Endpoint
const uptimeUrl = `https://decapi.me/twitch/uptime/${twitchUsername}`;

/* =========================================
   3. LOGIC & INITIALIZATION
   ========================================= */

// A. Apply Feature Flags (Disable cards if needed)
function applyFeatureFlags() {
    for (const [id, isActive] of Object.entries(cardMap)) {
        if (!isActive) {
            disableCard(id);
        }
    }
}

function disableCard(elementId) {
    const card = document.getElementById(elementId);
    if (!card) return;

    // Visuals
    card.classList.add('disabled');
    
    // Interactions
    card.removeAttribute('href');
    card.style.pointerEvents = "none";
    card.style.cursor = "default";

    // Badge
    if (!card.querySelector('.coming-soon-badge')) {
        card.insertAdjacentHTML('beforeend', `
            <div class="coming-soon-badge">COMING SOON</div>
        `);
    }
}

// B. Content Definitions
const contentMain = {
    online: `
        <iframe 
            src="https://player.twitch.tv/?channel=${twitchUsername}&parent=${parentDomain}&muted=false" 
            height="100%" width="100%" frameborder="0" allowfullscreen>
        </iframe>
        <div class="live-badge">🔴 LIVE NOW</div>
    `,
    offline: `
        <iframe 
            width="100%" height="100%" 
            src="https://www.youtube.com/embed?listType=playlist&list=${youtubePlaylistID}" 
            title="Latest YouTube Video" frameborder="0" allowfullscreen>
        </iframe>
    `
};

const contentSide = {
    online: {
        link: "https://youtube.com/@KellyNicole515",
        html: `
            <div class="card-content">
                <h3>YouTube</h3>
                <p>Watch VODs</p>
            </div>
            <img src="https://cdn.simpleicons.org/youtube/white" class="card-icon">
        `
    },
    offline: {
        link: `https://twitch.tv/${twitchUsername}`,
        html: `
            <div class="card-content">
                <h3>Twitch</h3>
                <p>Hang out Live</p>
            </div>
            <img src="https://cdn.simpleicons.org/twitch/white" class="card-icon">
        `
    }
};

// C. Status Check (The Brain)
async function initStatusCheck() {
    const mainStage = document.getElementById('main-stage');
    const sideStage = document.getElementById('side-stage');

    // Default to OFFLINE view
    render(false);

    try {
        const response = await fetch(uptimeUrl);
        const data = await response.text();

        if (!data.includes("offline")) {
            render(true); 
        } 
    } catch (error) {
        console.error("API Error:", error);
    }

    function render(isLive) {
        // SAFETY: Do not touch cards if they are disabled via Feature Flags
        if (featureFlags.mainStage) {
            if (isLive) {
                mainStage.innerHTML = contentMain.online;
                mainStage.classList.add("is-live"); 
            } else {
                mainStage.innerHTML = contentMain.offline;
                mainStage.classList.remove("is-live");
            }
        }

        if (featureFlags.sideStage) {
            if (isLive) {
                sideStage.href = contentSide.online.link;
                sideStage.innerHTML = contentSide.online.html;
                sideStage.classList.remove("card-discord"); 
            } else {
                sideStage.href = contentSide.offline.link;
                sideStage.innerHTML = contentSide.offline.html;
            }
        }
    }
}

// Run everything
applyFeatureFlags();
initStatusCheck();
setInterval(initStatusCheck, 300000);

// Footer Year
const date = new Date();
document.getElementById("year").textContent = date.getFullYear();