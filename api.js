// API Configuration
const API_BASE_URL = 'http://localhost:5213/api';

// API Service class to handle all backend communication
class ApiService {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // Generic fetch method with error handling
    async fetchApi(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ==================== MOVIE API METHODS ====================
    
    // Get all movies
    async getMovies() {
        return await this.fetchApi('/Movie');
    }

    // Get movie by ID
    async getMovie(id) {
        return await this.fetchApi(`/Movie/${id}`);
    }

    // Create new movie
    async createMovie(movie) {
        return await this.fetchApi('/Movie', {
            method: 'POST',
            body: JSON.stringify(movie)
        });
    }

    // Update movie
    async updateMovie(id, movie) {
        return await this.fetchApi(`/Movie/${id}`, {
            method: 'PUT',
            body: JSON.stringify(movie)
        });
    }

    // Delete movie
    async deleteMovie(id) {
        return await this.fetchApi(`/Movie/${id}`, {
            method: 'DELETE'
        });
    }

    // ==================== THEATRE API METHODS ====================
    
    // Get all theatres
    async getTheatres() {
        return await this.fetchApi('/Theatre');
    }

    // Get theatre by ID
    async getTheatre(id) {
        return await this.fetchApi(`/Theatre/${id}`);
    }

    // ==================== SHOW API METHODS ====================
    
    // Get all shows
    async getShows() {
        return await this.fetchApi('/Show');
    }

    // Get show by ID
    async getShow(id) {
        return await this.fetchApi(`/Show/${id}`);
    }

    // ==================== BOOKING API METHODS ====================
    
    // Get all bookings
    async getBookings() {
        return await this.fetchApi('/Booking');
    }

    // Get booking by ID
    async getBooking(id) {
        return await this.fetchApi(`/Booking/${id}`);
    }

    // Create new booking
    async createBooking(booking) {
        return await this.fetchApi('/Booking', {
            method: 'POST',
            body: JSON.stringify(booking)
        });
    }

    // Update booking
    async updateBooking(id, booking) {
        return await this.fetchApi(`/Booking/${id}`, {
            method: 'PUT',
            body: JSON.stringify(booking)
        });
    }

    // Delete booking
    async deleteBooking(id) {
        return await this.fetchApi(`/Booking/${id}`, {
            method: 'DELETE'
        });
    }

    // ==================== USER API METHODS ====================
    
    // Get all users
    async getUsers() {
        return await this.fetchApi('/User');
    }

    // Get user by ID
    async getUser(id) {
        return await this.fetchApi(`/User/${id}`);
    }
}

// Create global instance
const apiService = new ApiService();

// Export for use in other files
window.ApiService = ApiService;
window.apiService = apiService;
