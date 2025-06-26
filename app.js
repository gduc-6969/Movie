// Main Application Logic
class MovieBookingApp {
    constructor() {
        this.currentMovies = [];
        this.currentTheatres = [];
        this.currentShows = [];
        this.selectedMovie = null;
        this.selectedShow = null;
        this.init();
    }

    async init() {
        this.initAuth();
        await this.loadMovies();
        await this.loadTheatres();
        await this.loadShows();
        this.setupEventListeners();
        this.renderMovies();
    }

    // ==================== DATA LOADING METHODS ====================
    
    async loadMovies() {
        try {
            this.currentMovies = await apiService.getMovies();
            console.log('Movies loaded:', this.currentMovies);
        } catch (error) {
            console.error('Error loading movies:', error);
            this.showError('Failed to load movies. Please make sure the API is running.');
        }
    }

    async loadTheatres() {
        try {
            this.currentTheatres = await apiService.getTheatres();
            console.log('Theatres loaded:', this.currentTheatres);
        } catch (error) {
            console.error('Error loading theatres:', error);
            this.showError('Failed to load theatres.');
        }
    }

    async loadShows() {
        try {
            this.currentShows = await apiService.getShows();
            console.log('Shows loaded:', this.currentShows);
        } catch (error) {
            console.error('Error loading shows:', error);
            this.showError('Failed to load shows.');
        }
    }

    // ==================== RENDERING METHODS ====================
    
    renderMovies() {
        const moviesContainer = document.getElementById('movies-container');
        if (!moviesContainer) {
            console.warn('Movies container not found');
            return;
        }

        if (this.currentMovies.length === 0) {
            moviesContainer.innerHTML = `
                <div class="no-data">
                    <p>No movies available. Please make sure the API is running and contains data.</p>
                    <button class="btn btn-primary" onclick="app.loadMovies()">Retry</button>
                </div>
            `;
            return;
        }

        moviesContainer.innerHTML = this.currentMovies.map(movie => `
            <div class="movie-card" data-movie-id="${movie.movieId}">
                <div class="movie-poster">
                    <img src="https://via.placeholder.com/300x450/ff6b6b/ffffff?text=${encodeURIComponent(movie.name)}" 
                         alt="${movie.name}" loading="lazy">
                    <div class="movie-overlay">
                        <button class="btn btn-primary" onclick="app.showMovieDetails('${movie.movieId}')">
                            View Details
                        </button>
                    </div>
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.name}</h3>
                    <p class="movie-genre">${movie.genre || 'Not specified'}</p>
                    <p class="movie-language">${movie.language || 'Not specified'}</p>
                    <p class="movie-audience">${movie.targetAudience || 'General'}</p>
                </div>
            </div>
        `).join('');
    }

    renderTheatres() {
        const theatresContainer = document.getElementById('theatres-container');
        if (!theatresContainer) return;

        theatresContainer.innerHTML = this.currentTheatres.map(theatre => `
            <div class="theatre-card" data-theatre-id="${theatre.theatreId}">
                <div class="theatre-info">
                    <h3>${theatre.nameOfTheatre}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${theatre.area || 'Location not specified'}</p>
                    <p><i class="fas fa-tv"></i> ${theatre.noOfScreens} Screens</p>
                    <button class="btn btn-outline" onclick="app.showTheatreShows('${theatre.theatreId}')">
                        View Shows
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderShows(movieId = null) {
        const showsContainer = document.getElementById('shows-container');
        if (!showsContainer) return;

        let filteredShows = this.currentShows;
        if (movieId) {
            filteredShows = this.currentShows.filter(show => show.movieId === movieId);
        }

        showsContainer.innerHTML = filteredShows.map(show => `
            <div class="show-card" data-show-id="${show.showId}">
                <div class="show-info">
                    <h4>${show.movie?.name || 'Movie name not available'}</h4>
                    <p><i class="fas fa-calendar"></i> ${this.formatDate(show.showDate)}</p>
                    <p><i class="fas fa-clock"></i> ${show.showTime}</p>
                    <p><i class="fas fa-building"></i> ${show.screen?.theatre?.nameOfTheatre || 'Theatre not available'}</p>
                    <div class="show-pricing">
                        <span class="price gold">Gold: $${show.classCostGold || 'N/A'}</span>
                        <span class="price silver">Silver: $${show.classCostSilver || 'N/A'}</span>
                    </div>
                    <div class="show-seats">
                        <span>Gold: ${show.seatsRemainingGold || 0} seats</span>
                        <span>Silver: ${show.seatsRemainingSilver || 0} seats</span>
                    </div>
                    <button class="btn btn-primary" onclick="app.bookShow('${show.showId}')">
                        Book Now
                    </button>
                </div>
            </div>
        `).join('');
    }

    // ==================== AUTHENTICATION METHODS ====================
    
    initAuth() {
        this.currentUser = null;
        this.loadUserFromStorage();
        this.updateAuthUI();
        this.setupAuthEventListeners();
    }

    loadUserFromStorage() {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (userData && token) {
            try {
                this.currentUser = JSON.parse(userData);
                console.log('User loaded from storage:', this.currentUser);
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }

    updateAuthUI() {
        const guestActions = document.getElementById('guest-actions');
        const userActions = document.getElementById('user-actions');
        const userName = document.getElementById('user-name');
        const adminPanelBtn = document.getElementById('admin-panel-btn');

        if (this.currentUser) {
            // User is logged in
            guestActions.style.display = 'none';
            userActions.style.display = 'flex';
            userName.textContent = this.currentUser.firstName || 'User';
            
            // Show admin panel button for admins
            if (this.currentUser.roleId === 'R001') {
                adminPanelBtn.style.display = 'inline-block';
            } else {
                adminPanelBtn.style.display = 'none';
            }
        } else {
            // User is not logged in
            guestActions.style.display = 'flex';
            userActions.style.display = 'none';
        }
    }

    setupAuthEventListeners() {
        const logoutBtn = document.getElementById('logout-btn');
        const adminPanelBtn = document.getElementById('admin-panel-btn');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        if (adminPanelBtn) {
            adminPanelBtn.addEventListener('click', () => {
                this.openAdminPanel();
            });
        }
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.currentUser = null;
        this.updateAuthUI();
        this.showNotification('Logged out successfully', 'success');
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.roleId === 'R001';
    }

    requireAuth() {
        if (!this.isLoggedIn()) {
            this.showNotification('Please log in to continue', 'error');
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    openAdminPanel() {
        if (!this.isAdmin()) {
            this.showNotification('Access denied. Admin privileges required.', 'error');
            return;
        }
        
        // Open admin modal or redirect to admin page
        this.showNotification('Admin panel feature coming soon!', 'info');
    }

    // ==================== EVENT HANDLERS ====================
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterMovies(e.target.value);
            });
        }

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href');
                this.showSection(target);
            });
        });

        // Admin functions (if needed)
        this.setupAdminFunctions();
    }

    setupAdminFunctions() {
        // Add movie form submission
        const addMovieForm = document.getElementById('add-movie-form');
        if (addMovieForm) {
            addMovieForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.addMovie(new FormData(addMovieForm));
            });
        }
    }

    // ==================== UI INTERACTION METHODS ====================
    
    async showMovieDetails(movieId) {
        try {
            const movie = await apiService.getMovie(movieId);
            this.selectedMovie = movie;
            
            // Show movie details modal or navigate to details page
            this.showModal('movie-details', this.renderMovieDetails(movie));
            
            // Load shows for this movie
            this.renderShows(movieId);
        } catch (error) {
            this.showError('Failed to load movie details');
        }
    }

    async showTheatreShows(theatreId) {
        const theatre = this.currentTheatres.find(t => t.theatreId === theatreId);
        if (!theatre) return;

        const theatreShows = this.currentShows.filter(show => 
            show.screen?.theatre?.theatreId === theatreId
        );

        this.showModal('theatre-shows', this.renderTheatreShows(theatre, theatreShows));
    }

    async bookShow(showId) {
        // Check if user is logged in
        if (!this.requireAuth()) {
            return;
        }

        try {
            const show = await apiService.getShow(showId);
            this.selectedShow = show;
            
            // Show booking form
            this.showBookingForm(show);
        } catch (error) {
            this.showError('Failed to load show details');
        }
    }

    async submitBooking(bookingData) {
        try {
            // Add user ID to booking data
            bookingData.userId = this.currentUser.userId;
            
            const booking = await apiService.createBooking(bookingData);
            this.showSuccess('Booking created successfully!');
            this.hideModal();
            
            // Refresh shows to update seat availability
            await this.loadShows();
            this.renderShows();
        } catch (error) {
            this.showError('Failed to create booking');
        }
    }

    // ==================== UTILITY METHODS ====================
    
    filterMovies(searchTerm) {
        const filteredMovies = this.currentMovies.filter(movie =>
            movie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (movie.genre && movie.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (movie.language && movie.language.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        this.renderFilteredMovies(filteredMovies);
    }

    renderFilteredMovies(movies) {
        const moviesContainer = document.getElementById('movies-container');
        if (!moviesContainer) return;

        moviesContainer.innerHTML = movies.map(movie => `
            <div class="movie-card" data-movie-id="${movie.movieId}">
                <div class="movie-poster">
                    <img src="https://via.placeholder.com/300x450/ff6b6b/ffffff?text=${encodeURIComponent(movie.name)}" 
                         alt="${movie.name}" loading="lazy">
                    <div class="movie-overlay">
                        <button class="btn btn-primary" onclick="app.showMovieDetails('${movie.movieId}')">
                            View Details
                        </button>
                    </div>
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.name}</h3>
                    <p class="movie-genre">${movie.genre || 'Not specified'}</p>
                    <p class="movie-language">${movie.language || 'Not specified'}</p>
                    <p class="movie-audience">${movie.targetAudience || 'General'}</p>
                </div>
            </div>
        `).join('');
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="${sectionId}"]`)?.classList.add('active');
    }

    showModal(type, content) {
        const modal = document.getElementById('modal') || this.createModal();
        modal.innerHTML = content;
        modal.style.display = 'flex';
    }

    hideModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="app.hideModal()">&times;</span>
                <div class="modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // ==================== RENDER HELPER METHODS ====================
    
    renderMovieDetails(movie) {
        return `
            <div class="movie-details">
                <h2>${movie.name}</h2>
                <div class="movie-meta">
                    <p><strong>Genre:</strong> ${movie.genre || 'Not specified'}</p>
                    <p><strong>Language:</strong> ${movie.language || 'Not specified'}</p>
                    <p><strong>Target Audience:</strong> ${movie.targetAudience || 'General'}</p>
                </div>
                <div class="movie-shows">
                    <h3>Available Shows</h3>
                    <div id="shows-container"></div>
                </div>
            </div>
        `;
    }

    renderTheatreShows(theatre, shows) {
        return `
            <div class="theatre-shows">
                <h2>${theatre.nameOfTheatre}</h2>
                <p><i class="fas fa-map-marker-alt"></i> ${theatre.area}</p>
                <p><i class="fas fa-tv"></i> ${theatre.noOfScreens} Screens</p>
                <div class="shows-list">
                    ${shows.map(show => `
                        <div class="show-item">
                            <h4>${show.movie?.name}</h4>
                            <p>${this.formatDate(show.showDate)} at ${show.showTime}</p>
                            <button class="btn btn-primary" onclick="app.bookShow('${show.showId}')">
                                Book Now
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    showBookingForm(show) {
        const content = `
            <div class="booking-form">
                <h2>Book Tickets</h2>
                <div class="show-details">
                    <h3>${show.movie?.name}</h3>
                    <p>${this.formatDate(show.showDate)} at ${show.showTime}</p>
                    <p>${show.screen?.theatre?.nameOfTheatre}</p>
                </div>
                <form id="booking-form">
                    <div class="form-group">
                        <label for="seats">Number of Tickets:</label>
                        <input type="number" id="seats" name="noOfTickets" min="1" max="10" required>
                    </div>
                    <div class="form-group">
                        <label for="class">Seat Class:</label>
                        <select id="class" name="seatClass" required>
                            <option value="gold">Gold - $${show.classCostGold} (${show.seatsRemainingGold} available)</option>
                            <option value="silver">Silver - $${show.classCostSilver} (${show.seatsRemainingSilver} available)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="cardNumber">Card Number:</label>
                        <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" required>
                    </div>
                    <div class="form-group">
                        <label for="nameOnCard">Name on Card:</label>
                        <input type="text" id="nameOnCard" name="nameOnCard" required>
                    </div>
                    <div class="total-cost">
                        <strong>Total: $<span id="total-cost">0</span></strong>
                    </div>
                    <button type="submit" class="btn btn-primary">Confirm Booking</button>
                </form>
            </div>
        `;

        this.showModal('booking', content);

        // Setup form submission
        document.getElementById('booking-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            const bookingData = {
                bookingId: this.generateBookingId(),
                noOfTickets: parseInt(formData.get('noOfTickets')),
                totalCost: this.calculateTotalCost(formData.get('noOfTickets'), formData.get('seatClass'), show),
                cardNumber: formData.get('cardNumber'),
                nameOnCard: formData.get('nameOnCard'),
                userId: 'USER001', // This should come from authentication
                showId: show.showId
            };

            await this.submitBooking(bookingData);
        });

        // Setup cost calculation
        const seatsInput = document.getElementById('seats');
        const classSelect = document.getElementById('class');
        const totalCostSpan = document.getElementById('total-cost');

        const updateCost = () => {
            const seats = parseInt(seatsInput.value) || 0;
            const seatClass = classSelect.value;
            const cost = this.calculateTotalCost(seats, seatClass, show);
            totalCostSpan.textContent = cost.toFixed(2);
        };

        seatsInput.addEventListener('input', updateCost);
        classSelect.addEventListener('change', updateCost);
        updateCost();
    }

    calculateTotalCost(seats, seatClass, show) {
        const pricePerSeat = seatClass === 'gold' ? show.classCostGold : show.classCostSilver;
        return seats * (pricePerSeat || 0);
    }

    generateBookingId() {
        return 'BK' + Date.now().toString().substr(-8);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MovieBookingApp();
});

// Export for global access
window.MovieBookingApp = MovieBookingApp;
