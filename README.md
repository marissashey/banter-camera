# Banter 📸💬

**Banter** is a mobile and web application that turns everyday moments into entertaining commentary. Snap a photo of anything, and our AI-powered backend will generate witty, insightful, or humorous "banter" in response to what it sees.

## 🎯 What is Banter?

Banter transforms ordinary images into conversation starters by:
- **Capturing moments**: Take photos directly through the app using your device's camera
- **AI-powered analysis**: Images are processed by multiple AI endpoints on our backend
- **Creative commentary**: Receive generated "banter" text that provides commentary, humor, or insights about your photo
- **Social sharing**: Share your favorite banter moments with friends

## 🛠️ Tech Stack

### Frontend
- **React Native** with **Expo** - Cross-platform mobile development
- **Expo Router** - File-based navigation
- **TypeScript** - Type-safe development
- **React** - Web interface support

### Camera & Media
- **Expo Camera** - Native camera access
- **Expo Image Picker** - Photo selection from gallery
- **Expo Media Library** - Photo storage and management

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **AI Endpoints** - Multiple AI services for image analysis and text generation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd banter-camera
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install Expo app dependencies
   cd expo
   npm install
   ```

3. **Set up Supabase**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Initialize Supabase (if not already done)
   cd supabase
   supabase start
   ```

4. **Configure environment variables**
   Create a `.env` file in the expo directory with your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running the App

#### Mobile Development
```bash
cd expo

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

#### Web Development
```bash
cd expo

# Start web development server
npm run web
```

## 📱 Features

### Current Features
- 📷 **Camera Integration**: Take photos directly in the app
- 🖼️ **Gallery Access**: Select existing photos from your device
- 🤖 **AI Commentary**: Backend AI analysis generates banter text
- 📱 **Cross-Platform**: Works on iOS, Android, and web
- 🎨 **Modern UI**: Clean, intuitive interface

### Planned Features
- 💬 **Social Sharing**: Share banter with friends
- 📊 **Banter History**: View and manage your past photos and commentary
- ⚙️ **Customizable AI**: Choose different banter styles or personalities
- 🏷️ **Tagging & Categories**: Organize your banter by themes

## 🏗️ Project Structure

```
banter-camera/
├── expo/                    # React Native Expo app
│   ├── app/                # App screens and navigation
│   │   ├── (tabs)/         # Tab-based navigation screens
│   │   ├── _layout.tsx     # Root layout
│   │   └── modal.tsx       # Modal screens
│   ├── components/         # Reusable React Native components
│   ├── constants/          # App constants and theming
│   └── assets/             # Images, fonts, and static assets
├── src/                    # Web application (if applicable)
├── supabase/               # Supabase backend configuration
│   ├── functions/          # Edge functions
│   └── config.toml         # Supabase configuration
└── public/                 # Web public assets
```

## 🔧 Development

### Available Scripts

**Expo App:**
- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run web version
- `npm test` - Run tests

**Web App:**
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Camera Permissions

The app requires camera and media library permissions:
- **iOS**: Configured in `app.json` with usage descriptions
- **Android**: Camera and storage permissions in `app.json`
- **Web**: Browser camera API access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/) for cross-platform development
- Powered by [Supabase](https://supabase.com/) for backend services
- AI commentary generated using various AI API endpoints

---

**Ready to add some banter to your photos?** Download the app and start creating memorable moments with AI-generated commentary! 📸✨
