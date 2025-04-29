# Injective Create App Template with Vue and Turnkey

This is a template project that demonstrates how to build a Vue.js application with Injective Protocol integration using Turnkey for wallet management. The project consists of a frontend Vue application and a backend server.

## Project Structure

```
.
├── app/                 # Frontend Vue application
│   ├── src/            # Source code
│   │   ├── components/ # Vue components
│   │   ├── assets/     # Static assets
│   │   └── ...         # Other source files
│   └── ...             # Configuration files
└── server/             # Backend server
    └── src/            # Source code
        └── lib/        # Server utilities
```

## Features

- Vue 3 frontend with TypeScript support
- Injective Protocol integration
- Turnkey wallet management
- Secure backend server with Hono framework
- TypeScript support throughout the stack

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Basic understanding of Vue.js and TypeScript

## Getting Started

### Quick Start (Recommended)

1. Install dependencies and start both frontend and backend servers:
   ```bash
   yarn install
   yarn dev
   ```

### Manual Setup

#### Frontend Setup

1. Navigate to the app directory:
   ```bash
   cd app
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn dev
   ```

#### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn dev
   ```

### Development Commands

- `yarn dev` - Start both frontend and backend servers concurrently
- `yarn dev:app` - Start only the frontend server
- `yarn dev:server` - Start only the backend server

## Dependencies

### Frontend
- Vue 3
- Injective Protocol SDK
- Turnkey Wallet Integration
- Vite for build tooling

### Backend
- Hono framework
- Turnkey SDK
- JWT for authentication
- Zod for validation

## Development

- The frontend runs on `http://localhost:5173` by default
- The backend server runs on `http://localhost:3000` by default

## Building for Production

### Frontend
```bash
cd app
yarn build
```

The built files will be in the `dist` directory.

## Security Considerations

- The application uses Turnkey for secure wallet management
- JWT is used for authentication
- Environment variables should be properly configured for production

## Contributing

Please follow the standard Git workflow:
1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
