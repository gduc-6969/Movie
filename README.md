# Movie Booking Frontend

This is a modern, responsive frontend application for the Movie Booking Ticket system. It connects to the ASP.NET Core API backend to provide a seamless movie booking experience.

## Features

### User Features
- **Browse Movies**: View all available movies with details like genre, language, and target audience
- **Search & Filter**: Search movies by name, genre, or language
- **Theatre Information**: View all theatres and their locations
- **Show Listings**: Browse available shows with dates, times, and pricing
- **Ticket Booking**: Book tickets with seat class selection (Gold/Silver)
- **Payment Processing**: Secure payment form for booking confirmation

### Admin Features
- **Movie Management**: Add new movies to the system
- **Booking Management**: View and manage all bookings
- **User Management**: View user information and booking history
- **Real-time Data**: All data is fetched from the API in real-time

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Modern CSS with Flexbox and Grid
- **API Communication**: Fetch API for HTTP requests
- **UI/UX**: Responsive design with mobile-first approach
- **Icons**: Font Awesome for iconography
- **Fonts**: Google Fonts (Poppins)

## Prerequisites

1. **Backend API**: Make sure the MovieBookingTicket API is running on `http://localhost:5213`
2. **Web Server**: Use a local web server to serve the HTML files (like Live Server in VS Code)
3. **Modern Browser**: Chrome, Firefox, Safari, or Edge (ES6+ support required)

## Setup Instructions

1. **Start the Backend API**:
   ```bash
   cd /path/to/MovieBookingTicket
   dotnet run
   ```
   The API should be running on `http://localhost:5213`

2. **Serve the Frontend**:
   - Using VS Code Live Server: Right-click on `index.html` → "Open with Live Server"
   - Using Python: `python -m http.server 8000`
   - Using Node.js: `npx http-server`

3. **Open in Browser**:
   Navigate to `http://localhost:5500` (or your server's address)

## File Structure

```
Movie/
├── index.html          # Main HTML file
├── styles.css          # Main stylesheet
├── api.js             # API service layer
├── app.js             # Main application logic
├── admin.js           # Admin functionality
└── README.md          # This file
```

## API Integration

The frontend communicates with the following API endpoints:

### Movies
- `GET /api/Movie` - Get all movies
- `GET /api/Movie/{id}` - Get specific movie
- `POST /api/Movie` - Create new movie
- `PUT /api/Movie/{id}` - Update movie
- `DELETE /api/Movie/{id}` - Delete movie

### Theatres
- `GET /api/Theatre` - Get all theatres
- `GET /api/Theatre/{id}` - Get specific theatre

### Shows
- `GET /api/Show` - Get all shows
- `GET /api/Show/{id}` - Get specific show

### Bookings
- `GET /api/Booking` - Get all bookings
- `GET /api/Booking/{id}` - Get specific booking
- `POST /api/Booking` - Create new booking
- `PUT /api/Booking/{id}` - Update booking
- `DELETE /api/Booking/{id}` - Delete booking

### Users
- `GET /api/User` - Get all users
- `GET /api/User/{id}` - Get specific user

## Configuration

### API Base URL
The API base URL is configured in `api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5213/api';
```

Change this if your API is running on a different port or host.

### CORS Configuration
Make sure your API allows requests from your frontend domain. The backend should have CORS configured to accept requests from your frontend URL.

## Usage Guide

### For Users

1. **Browse Movies**: 
   - The homepage displays all available movies
   - Use the search bar to find specific movies
   - Use filters to narrow down by genre or language

2. **View Movie Details**:
   - Click "View Details" on any movie card
   - See detailed information and available shows

3. **Book Tickets**:
   - Click "Book Now" on any show
   - Fill in the booking form with ticket quantity and payment details
   - Confirm your booking

### For Admins

1. **Access Admin Panel**:
   - Navigate to the admin section (add `/admin` to the URL or create a link)
   - Use the admin tabs to switch between different management sections

2. **Add Movies**:
   - Go to "Manage Movies" tab
   - Fill in the movie form with required details
   - Submit to add the movie to the system

3. **View Bookings**:
   - Go to "Manage Bookings" tab
   - View all bookings in a table format
   - Click "View" to see detailed booking information
   - Delete bookings if necessary

4. **Manage Users**:
   - Go to "Manage Users" tab
   - View all registered users
   - Click "View" to see user details and booking history

## Error Handling

The application includes comprehensive error handling:

- **Network Errors**: Displays user-friendly messages when API is unavailable
- **Validation Errors**: Form validation with real-time feedback
- **API Errors**: Proper error messages for failed requests
- **Loading States**: Loading indicators while fetching data

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development Notes

### Adding New Features

1. **API Methods**: Add new methods to the `ApiService` class in `api.js`
2. **UI Components**: Add new rendering methods to the `MovieBookingApp` class in `app.js`
3. **Styles**: Add CSS in `styles.css` following the existing naming conventions
4. **Admin Features**: Extend the `AdminUtils` class in `admin.js`

### Code Organization

- **api.js**: Contains all API communication logic
- **app.js**: Main application state and UI logic
- **admin.js**: Admin-specific functionality
- **styles.css**: All styling with modular approach

### Best Practices

- Use async/await for API calls
- Handle errors gracefully
- Provide loading states
- Validate user input
- Use semantic HTML
- Follow accessibility guidelines

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure the backend API has CORS configured
   - Check the API base URL in `api.js`

2. **API Not Available**:
   - Verify the backend is running on the correct port
   - Check if the API endpoints are accessible

3. **Data Not Loading**:
   - Open browser developer tools to check for errors
   - Verify API responses in the Network tab

4. **Styling Issues**:
   - Clear browser cache
   - Check for CSS syntax errors

### Debug Mode

To enable debug mode, open browser console and set:
```javascript
window.DEBUG = true;
```

This will enable additional logging for troubleshooting.

## Contributing

1. Follow the existing code style and structure
2. Test thoroughly on different browsers
3. Update documentation for new features
4. Ensure responsive design compatibility

## License

This project is part of the Movie Booking Ticket system. See the main project for license information.
