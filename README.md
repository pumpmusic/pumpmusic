# PumpMusic - AI Music Generation Platform

## Project Overview
PumpMusic is an innovative AI-powered music generation platform that allows users to create unique music tracks based on text prompts. The platform implements a token-based system where users can earn or purchase tokens to generate music.

## Core Features
- **AI Music Generation**: Create original music tracks from text descriptions
- **Token Economy**: Users earn or purchase tokens to generate music
- **User Profiles**: Track generation history and manage tokens
- **Music Library**: Browse, play, and download generated tracks
- **Community Features**: Share and discover music created by other users

## Architecture
The project follows a modern web application architecture:

### Frontend
- React.js for the user interface
- Redux for state management
- HTML5 Audio API for music playback

### Backend
- Node.js with Express for the API server
- MongoDB for data storage
- JWT for authentication

### AI Music Generation
- Integration with a music generation model
- Processing queue for handling generation requests

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/yourusername/pumpmusic.git
cd pumpmusic
```

2. Install dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# In the server directory, create a .env file with the following variables
MONGODB_URI=mongodb://localhost:27017/pumpmusic
JWT_SECRET=your_jwt_secret
PORT=5000
AI_MODEL_API_KEY=your_ai_model_api_key
```

4. Start the development servers
```bash
# Start the backend server
cd server
npm run dev

# In a new terminal, start the frontend server
cd client
npm start
```

## Usage

1. Register an account or log in
2. Navigate to the "Create" page
3. Enter a text prompt describing the music you want to generate
4. Use tokens to generate the music
5. Listen to, download, or share your generated track

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Tokens
- `GET /api/tokens/balance` - Get user token balance
- `POST /api/tokens/purchase` - Purchase tokens

### Music Generation
- `POST /api/music/generate` - Generate music from a prompt
- `GET /api/music/history` - Get user's generation history
- `GET /api/music/library` - Get public music library

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- Thanks to all the open-source libraries that made this project possible
- Special thanks to the AI music generation research community