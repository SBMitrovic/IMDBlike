# IMDBlike

Deployed at: **imdblikesbm.netlify.app**

🎬 A modern, responsive movie database application built with Angular 17, inspired by IMDb. Browse movies, search for your favorites, create watchlists, and discover new content with a beautiful, mobile-first design.



### 🎭 Movie Discovery
- **Browse Movies**: Explore top-rated, now playing, and upcoming movies
- **Search Functionality**: Find movies by title with real-time search
- **Genre Filtering**: Filter movies by genres
- **Movie Details**: View comprehensive movie information including cast, crew, trailers, and recommendations
- **Movie Trailers**: Watch trailers directly in the app via YouTube integration

### 👤 User Management
- **Firebase Authentication**: Secure user registration and login
- **User Profiles**: Personalized user experience
- **Favorites**: Mark movies as favorites for quick access
- **Watchlist**: Create and manage your personal watchlist
- **Persistent Storage**: User preferences saved locally per account

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with optimized layouts for all screen sizes
- **Hero Carousel**: Interactive movie carousel with smooth transitions
- **IMDb-Style Design**: Professional, cinema-inspired interface
- **Dark Theme**: Sleek dark mode with golden accents
- **Smooth Animations**: Hardware-accelerated transitions and effects
- **Loading States**: Elegant loading indicators and error handling

### 🔧 Technical Features
- **Angular 17**: Latest Angular framework with modern features
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming for smooth data flow
- **Material Design**: Angular Material components
- **Bootstrap 5**: Responsive grid system and components
- **Firebase Integration**: Authentication and potential future database features
- **TMDB API**: Real-time movie data from The Movie Database

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SBMitrovic/IMDBlike.git
   cd IMDBlike
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create your environment files in `src/environments/`:
   
   **environment.ts** (Development):
   ```typescript
   export const environment = {
     production: false,
     firebase: {
       apiKey: "your-firebase-api-key",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "your-sender-id",
       appId: "your-app-id"
     }
   };
   ```
   
   **environment.prod.ts** (Production):
   ```typescript
   export const environment = {
     production: true,
     firebase: {
       // Your production Firebase config
     }
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   ng serve
   ```

5. **Open your browser**
   Navigate to `http://localhost:4200`

## 🛠️ Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build in watch mode
- `npm test` - Run unit tests
- `ng serve` - Start Angular development server
- `ng build --prod` - Build for production with optimizations

## 📱 Responsive Design

The application is built with a mobile-first approach and includes:

- **Mobile (320px+)**: Optimized layout with stacked components
- **Tablet (768px+)**: Balanced layout with side-by-side content
- **Desktop (992px+)**: Full-featured layout with sidebar
- **Large Desktop (1200px+)**: Enhanced spacing and larger content areas

## 🎯 API Integration

### The Movie Database (TMDB)
- **API Key**: Configured in `moviesapi.service.ts`
- **Endpoints Used**:
  - Top Rated Movies
  - Now Playing Movies
  - Upcoming Movies
  - Movie Search
  - Movie Details
  - Movie Videos/Trailers
  - Movie Cast & Crew
  - Movie Recommendations
  - Genre Lists

### Firebase Services
- **Authentication**: User registration, login, logout
- **User Management**: Profile management and user state persistence

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/              # Main landing page with hero carousel
│   │   ├── movies/            # Movie browsing and search
│   │   ├── movie-details/     # Individual movie details
│   │   ├── header/            # Navigation header
│   │   ├── footer/            # Footer component
│   │   ├── about/             # About page
│   │   ├── people/            # Cast & crew listings
│   │   ├── person/            # Individual person details
│   │   ├── genres/            # Genre browsing
│   │   ├── favorites/         # User favorites
│   │   ├── watch-later/       # User watchlist
│   │   └── registration/      # Auth components
│   ├── services/
│   │   ├── moviesapi.service.ts      # TMDB API integration
│   │   ├── firebase-auth.service.ts  # Firebase authentication
│   │   ├── user-lists.service.ts     # User favorites/watchlist
│   │   └── genres.service.ts         # Genre management
│   ├── interfaces/
│   │   ├── movie.ts           # Movie data interfaces
│   │   ├── genre.ts           # Genre interfaces
│   │   └── reglogin.ts        # Auth interfaces
│   ├── guards/
│   │   ├── auth.guard.ts      # Route protection
│   │   └── firebase-auth.guard.ts
│   └── assets/
│       └── [images and static files]
├── environments/              # Environment configurations
└── styles.css               # Global styles
```

## 🎨 Styling & Design

### CSS Architecture
- **CSS Custom Properties**: Consistent color scheme and spacing
- **Mobile-First Design**: Responsive breakpoints starting from 320px
- **Flexbox & Grid**: Modern layout techniques
- **Hardware Acceleration**: Optimized animations and transitions
- **Component-Scoped Styles**: Modular styling approach

### Design System
- **Primary Color**: Golden yellow (#e4bb23)
- **Secondary Color**: Dark green (#1c1f1d)
- **Background**: Deep dark tones
- **Typography**: Modern, readable font stack
- **Spacing**: Consistent spacing scale using CSS custom properties

## 🔐 Authentication Flow

1. **User Registration**: New users can create accounts via Firebase
2. **Login/Logout**: Secure authentication with session management
3. **Protected Routes**: Auth guards protect user-specific features
4. **Persistent Sessions**: User state maintained across browser sessions
5. **Local Storage**: User preferences and lists stored locally per account

## 🎬 Key Components

### Home Component
- Hero carousel with featured movies
- Interactive movie navigation
- User authentication integration
- Responsive movie information display

### Movies Component
- Paginated movie browsing
- Search functionality
- Genre filtering
- Grid/list view options

### Movie Details Component
- Comprehensive movie information
- Cast and crew details
- Trailer integration
- Recommendations
- User actions (favorites, watchlist)

### Header Component
- Responsive navigation
- Search bar
- User authentication status
- Genre selection dropdown

## 📊 Performance Optimizations

- **Lazy Loading**: Route-based code splitting
- **OnPush Change Detection**: Optimized Angular change detection
- **Hardware Acceleration**: CSS transforms for smooth animations
- **Image Optimization**: Responsive images with proper sizing
- **Caching**: HTTP interceptors for API response caching
- **Bundle Optimization**: Tree-shaking and minification

## 🧪 Testing

The application includes unit tests for:
- Services (API integration, authentication)
- Components (functionality and rendering)
- Guards (route protection)

Run tests with:
```bash
npm test
```

## 🚀 Deployment

### Building for Production
```bash
npm run build
```

### Firebase Hosting (Recommended)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init

# Deploy
firebase deploy
```

### Other Hosting Options
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License



## 🙏 Acknowledgments

- **TMDB**: For providing the comprehensive movie database API
- **Firebase**: For authentication and backend services
- **Angular Team**: For the fantastic framework and tools
- **Bootstrap**: For the responsive design components
- **Font Awesome**: For the beautiful icons

## 🐛 Known Issues

- Search functionality requires active internet connection
- Some movie images may not load due to TMDB API limitations
- Mobile carousel navigation could be improved for touch devices

## 🔮 Future Enhancements

- **Advanced Search**: Multi-criteria search with filters
- **Movie Reviews**: User-generated reviews and ratings
- **Social Features**: Share movies with friends
- **Offline Support**: PWA capabilities with service workers
- **Recommendation Engine**: AI-powered movie suggestions
- **Multi-language Support**: Internationalization
- **TV Shows**: Expand beyond movies to include TV series

---
**by Stefan-Branko Mitrovic**


