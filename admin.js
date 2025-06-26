// Admin utilities and additional helper functions
class AdminUtils {
    constructor(apiService) {
        this.apiService = apiService;
    }

    // Load all bookings for admin view
    async loadBookings() {
        try {
            const bookings = await this.apiService.getBookings();
            this.renderBookingsTable(bookings);
        } catch (error) {
            console.error('Error loading bookings:', error);
        }
    }

    // Load all users for admin view
    async loadUsers() {
        try {
            const users = await this.apiService.getUsers();
            this.renderUsersTable(users);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    // Render bookings table
    renderBookingsTable(bookings) {
        const container = document.getElementById('bookings-list');
        if (!container) return;

        if (bookings.length === 0) {
            container.innerHTML = '<p>No bookings found.</p>';
            return;
        }

        container.innerHTML = `
            <div class="admin-table">
                <table>
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Movie</th>
                            <th>User</th>
                            <th>Tickets</th>
                            <th>Total Cost</th>
                            <th>Show Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bookings.map(booking => `
                            <tr>
                                <td>${booking.bookingId}</td>
                                <td>${booking.show?.movie?.name || 'N/A'}</td>
                                <td>${booking.user?.firstName || 'N/A'} ${booking.user?.lastName || ''}</td>
                                <td>${booking.noOfTickets}</td>
                                <td>$${booking.totalCost}</td>
                                <td>${booking.show?.showDate ? new Date(booking.show.showDate).toLocaleDateString() : 'N/A'}</td>
                                <td>
                                    <button class="btn btn-sm btn-outline" onclick="adminUtils.viewBooking('${booking.bookingId}')">View</button>
                                    <button class="btn btn-sm btn-danger" onclick="adminUtils.deleteBooking('${booking.bookingId}')">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Render users table
    renderUsersTable(users) {
        const container = document.getElementById('users-list');
        if (!container) return;

        if (users.length === 0) {
            container.innerHTML = '<p>No users found.</p>';
            return;
        }

        container.innerHTML = `
            <div class="admin-table">
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Age</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td>${user.webUserId}</td>
                                <td>${user.firstName} ${user.lastName}</td>
                                <td>${user.emailId}</td>
                                <td>${user.phoneNumber}</td>
                                <td>${user.age}</td>
                                <td>
                                    <button class="btn btn-sm btn-outline" onclick="adminUtils.viewUser('${user.webUserId}')">View</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // View individual booking
    async viewBooking(bookingId) {
        try {
            const booking = await this.apiService.getBooking(bookingId);
            const content = `
                <div class="booking-details">
                    <h2>Booking Details</h2>
                    <div class="details-grid">
                        <div class="detail-item">
                            <label>Booking ID:</label>
                            <span>${booking.bookingId}</span>
                        </div>
                        <div class="detail-item">
                            <label>Movie:</label>
                            <span>${booking.show?.movie?.name || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Theatre:</label>
                            <span>${booking.show?.screen?.theatre?.nameOfTheatre || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Show Date:</label>
                            <span>${booking.show?.showDate ? new Date(booking.show.showDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Show Time:</label>
                            <span>${booking.show?.showTime || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Number of Tickets:</label>
                            <span>${booking.noOfTickets}</span>
                        </div>
                        <div class="detail-item">
                            <label>Total Cost:</label>
                            <span>$${booking.totalCost}</span>
                        </div>
                        <div class="detail-item">
                            <label>Customer:</label>
                            <span>${booking.user?.firstName || 'N/A'} ${booking.user?.lastName || ''}</span>
                        </div>
                        <div class="detail-item">
                            <label>Card Number:</label>
                            <span>****-****-****-${booking.cardNumber ? booking.cardNumber.slice(-4) : 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Card Holder:</label>
                            <span>${booking.nameOnCard || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            `;
            app.showModal('booking-details', content);
        } catch (error) {
            app.showError('Failed to load booking details');
        }
    }

    // View individual user
    async viewUser(userId) {
        try {
            const user = await this.apiService.getUser(userId);
            const content = `
                <div class="user-details">
                    <h2>User Details</h2>
                    <div class="details-grid">
                        <div class="detail-item">
                            <label>User ID:</label>
                            <span>${user.webUserId}</span>
                        </div>
                        <div class="detail-item">
                            <label>First Name:</label>
                            <span>${user.firstName}</span>
                        </div>
                        <div class="detail-item">
                            <label>Last Name:</label>
                            <span>${user.lastName}</span>
                        </div>
                        <div class="detail-item">
                            <label>Email:</label>
                            <span>${user.emailId}</span>
                        </div>
                        <div class="detail-item">
                            <label>Phone:</label>
                            <span>${user.phoneNumber}</span>
                        </div>
                        <div class="detail-item">
                            <label>Age:</label>
                            <span>${user.age}</span>
                        </div>
                    </div>
                    <div class="user-bookings">
                        <h3>Recent Bookings</h3>
                        <div class="bookings-list">
                            ${user.bookings && user.bookings.length > 0 ? 
                                user.bookings.map(booking => `
                                    <div class="booking-item">
                                        <span>${booking.show?.movie?.name || 'N/A'}</span>
                                        <span>${booking.show?.showDate ? new Date(booking.show.showDate).toLocaleDateString() : 'N/A'}</span>
                                        <span>$${booking.totalCost}</span>
                                    </div>
                                `).join('') :
                                '<p>No bookings found for this user.</p>'
                            }
                        </div>
                    </div>
                </div>
            `;
            app.showModal('user-details', content);
        } catch (error) {
            app.showError('Failed to load user details');
        }
    }

    // Delete booking
    async deleteBooking(bookingId) {
        if (confirm('Are you sure you want to delete this booking?')) {
            try {
                await this.apiService.deleteBooking(bookingId);
                app.showSuccess('Booking deleted successfully');
                this.loadBookings(); // Refresh the list
            } catch (error) {
                app.showError('Failed to delete booking');
            }
        }
    }

    // Add new movie
    async addMovie(formData) {
        try {
            const movieData = {
                movieId: formData.get('movieId'),
                name: formData.get('name'),
                language: formData.get('language'),
                genre: formData.get('genre'),
                targetAudience: formData.get('targetAudience')
            };

            await this.apiService.createMovie(movieData);
            app.showSuccess('Movie added successfully');
            
            // Clear form
            document.getElementById('add-movie-form').reset();
            
            // Refresh movies list
            await app.loadMovies();
            app.renderMovies();
        } catch (error) {
            app.showError('Failed to add movie');
        }
    }
}

// Global admin tab management
function showAdminTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(`admin-${tabName}`);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load data for the selected tab
    if (tabName === 'bookings') {
        adminUtils.loadBookings();
    } else if (tabName === 'users') {
        adminUtils.loadUsers();
    }
}

// Data validation utilities
class ValidationUtils {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.length >= 10;
    }

    static validateCardNumber(cardNumber) {
        const cleaned = cardNumber.replace(/\s/g, '');
        return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned);
    }

    static formatCardNumber(cardNumber) {
        const cleaned = cardNumber.replace(/\s/g, '');
        const groups = cleaned.match(/\d{1,4}/g);
        return groups ? groups.join(' ') : cleaned;
    }

    static validateBookingForm(formData) {
        const errors = [];
        
        const seats = parseInt(formData.get('noOfTickets'));
        if (!seats || seats < 1 || seats > 10) {
            errors.push('Number of tickets must be between 1 and 10');
        }
        
        const cardNumber = formData.get('cardNumber');
        if (!this.validateCardNumber(cardNumber)) {
            errors.push('Please enter a valid card number');
        }
        
        const nameOnCard = formData.get('nameOnCard');
        if (!nameOnCard || nameOnCard.trim().length < 2) {
            errors.push('Please enter a valid name on card');
        }
        
        return errors;
    }
}

// Initialize admin utilities when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminUtils = new AdminUtils(apiService);
    window.ValidationUtils = ValidationUtils;
    window.showAdminTab = showAdminTab;
});

// Export for global access
window.AdminUtils = AdminUtils;
