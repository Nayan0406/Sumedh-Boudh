// API Configuration
const API_CONFIG = {
    // Change this to your Vercel deployment URL when deployed
    PRODUCTION_URL: 'htpp://localhost:5000/',
    LOCAL_URL: 'http://localhost:5000',
    
    // Automatically detect environment
    getBaseURL() {
        // Check if we're running locally
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1' ||
            window.location.protocol === 'file:') {
            return this.LOCAL_URL;
        }
        return this.PRODUCTION_URL;
    },
    
    // Get full API endpoint
    getApiUrl(endpoint) {
        return `${this.getBaseURL()}${endpoint}`;
    }
};

// Export for use in other files
window.API_CONFIG = API_CONFIG;
