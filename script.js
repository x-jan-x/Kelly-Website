/* =========================================
   1. CONFIGURATION
   ========================================= */
const twitchUsername = "kellynicole515"; 
const youtubePlaylistID = "PLyKbTGUD1Bdc2ZAY9fqmBeNmEC4A5hSE2"; 

// DOMAIN CONFIGURATION
// For testing: use "localhost"
// For live: use "kellynicole-linkinbio.netlify.app" (or your custom domain)
const parentDomain = "www.kellynicole.net"; 

// API Endpoint
const uptimeUrl = `https://decapi.me/twitch/uptime/${twitchUsername}`;

/* =========================================
   2. CONTENT DEFINITIONS
   ========================================= */
const contentMain = {
    // SCENARIO A: You are LIVE -> Show Twitch Player
    online: `
        <iframe 
            src="https://player.twitch.tv/?channel=${twitchUsername}&parent=${parentDomain}&muted=false" 
            height="100%" width="100%" frameborder="0" allowfullscreen>
        </iframe>
        <div class="live-badge">🔴 LIVE NOW</div>
    `,
    // SCENARIO B: You are OFFLINE -> Show YouTube Playlist
    offline: `
        <iframe 
            width="100%" height="100%" 
            src="https://www.youtube.com/embed?listType=playlist&list=${youtubePlaylistID}" 
            title="Latest YouTube Video" frameborder="0" allowfullscreen>
        </iframe>
    `
};

const contentSide = {
    // SCENARIO A: LIVE -> Side Button is YouTube
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
    // SCENARIO B: OFFLINE -> Side Button is Twitch
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

/* =========================================
   3. THE BRAIN (Logic)
   ========================================= */
async function initStatusCheck() {
    const mainStage = document.getElementById('main-stage');
    const sideStage = document.getElementById('side-stage');

    // Default to OFFLINE view
    render(false);

    try {
        console.log("Checking live status...");
        const response = await fetch(uptimeUrl);
        const data = await response.text();

        if (!data.includes("offline")) {
            console.log("Status: LIVE! Swapping content.");
            render(true); 
        } else {
            console.log("Status: Offline.");
        }
    } catch (error) {
        console.error("API Error:", error);
    }

    function render(isLive) {
        if (isLive) {
            mainStage.innerHTML = contentMain.online;
            mainStage.classList.add("is-live"); 
            
            sideStage.href = contentSide.online.link;
            sideStage.innerHTML = contentSide.online.html;
            sideStage.classList.remove("card-discord"); 
        } else {
            mainStage.innerHTML = contentMain.offline;
            mainStage.classList.remove("is-live");
            
            sideStage.href = contentSide.offline.link;
            sideStage.innerHTML = contentSide.offline.html;
        }
    }
}

// Run immediately
initStatusCheck();

// Check again every 5 minutes
setInterval(initStatusCheck, 300000);

/* =========================================
   4. FOOTER YEAR UPDATE
   ========================================= */
const date = new Date();
document.getElementById("year").textContent = date.getFullYear();