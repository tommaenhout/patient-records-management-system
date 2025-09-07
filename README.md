# Patient Records Management System

A modern, responsive patient records management application built with React, TypeScript, and Redux Toolkit. This application allows healthcare professionals to manage patient information with features like adding, editing, searching, and viewing patient records.

## 🚀 Features

- **Patient Management**: Add, edit, and view patient records
- **Real-time Search**: Search patients by name with debounced input
- **Data Validation**: Form validation using Zod schemas and React Hook Form
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **State Management**: Centralized state management with Redux Toolkit
- **Data Persistence**: Fetches data from external API with error handling
- **Avatar Management**: Upload and manage patient avatars with file validation
- **Duplicate Detection**: Automatically removes duplicate records based on name and description
- **Name Formatting**: Standardizes patient names (removes titles, proper capitalization)
- **Loading States**: Skeleton loaders and loading indicators for better UX
- **Alert System**: User feedback through toast-like alert notifications
- **Comprehensive Testing**:  test coverage with Jest and React Testing Library

## 🛠️ Tech Stack

### Core Technologies
- **React 19.1.1** 
- **TypeScript 5.8.3** 
- **Vite 7.1.2** 

### State Management
- **Redux Toolkit 2.9.0** 
- **React Redux 9.2.0** 

### UI & Styling
- **Tailwind CSS 4.1.13** 
- **Framer Motion 12.23.12** 

### Forms & Validation
- **React Hook Form 7.62.0** 
- **Zod 4.1.5** 
- **@hookform/resolvers 5.2.1** 

### Testing
- **Jest 30.1.3** 
- **React Testing Library 16.3.0** 
- **Jest Environment JSDOM 30.1.2** 

### Development Tools
- **ESLint 9.33.0** 
- **TypeScript ESLint 8.39.1** 

### Utilities
- **use-debounce 10.0.6** 
- **uuid 12.0.0** 

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
- **npm** (version 8.0.0 or higher) or **yarn** (version 1.22.0 or higher)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pati
```

### 2. Install Dependencies

```bash
npm install
```

or if you prefer yarn:

```bash
yarn install
```

### 3. Start the Development Server

```bash
npm run dev
```

or with yarn:

```bash
yarn dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

This will create an optimized production build in the `dist` folder.

### 5. Preview Production Build

```bash
npm run preview
```

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
```

The coverage report will be generated in the `coverage` folder and can be viewed by opening `coverage/lcov-report/index.html` in your browser.

### Current Test Coverage

The application maintains high test coverage across all components:

- **Components**: 100% coverage for all atoms, molecules, and organisms
- **Hooks**: 98%+ coverage for custom hooks
- **Store**: 100% coverage for Redux slices and actions
- **Utilities**: 100% coverage for helper functions

## 🏗️ Project Structure

```
src/
├── components/           # React components organized by atomic design
│   ├── atoms/           # Basic building blocks (Button, Input, etc.)
│   ├── molecules/       # Component combinations (PatientCard, Header, etc.)
│   ├── organisms/       # Complex components (PatientsPage)
│   ├── skeletons/       # Loading skeleton components
│   └── svg/             # SVG icon components
├── hooks/               # Custom React hooks
├── store/               # Redux store configuration
│   ├── slices/          # Redux Toolkit slices
│   ├── hooks.ts         # Typed Redux hooks
│   └── index.ts         # Store configuration
├── helpers/             # Utility functions
├── interfaces/          # TypeScript type definitions
├── __tests__/           # Test files mirroring src structure
└── main.tsx            # Application entry point
```

## 🎨 Design Decisions

### Architecture Patterns

1. **Atomic Design**: Components are organized using atomic design principles for better maintainability and reusability
2. **Container/Presentational Pattern**: Clear separation between data logic and presentation
3. **Custom Hooks**: Business logic extracted into reusable custom hooks
4. **Type-First Development**: Comprehensive TypeScript usage for better developer experience

### State Management

- **Redux Toolkit**: Chosen for its simplified Redux usage and excellent TypeScript support
- **Normalized State**: Patient data is stored in a normalized format for efficient updates
- **Slice Pattern**: Each feature has its own slice for better organization

### Form Handling

- **React Hook Form**: Selected for its performance benefits and minimal re-renders
- **Zod Validation**: Type-safe validation schemas that integrate seamlessly with TypeScript
- **Controlled Components**: Strategic use of controlled vs uncontrolled components

### Styling Approach

- **Tailwind CSS**: Utility-first approach for rapid development and consistent design
- **Mobile-First**: Responsive design starting from mobile breakpoints
- **Component Variants**: Reusable component patterns with prop-based styling

### Testing Strategy

- **Testing Library**: Focus on testing user behavior rather than implementation details
- **Comprehensive Coverage**: All components, hooks, and utilities are thoroughly tested
- **Mock Strategy**: External dependencies are mocked for isolated unit tests

## 🔧 Configuration

### Environment Variables

The application uses the following API endpoint (hardcoded for demo purposes):
- **API URL**: `https://63bedcf7f5cfc0949b634fc8.mockapi.io/users`

### Build Configuration

- **Vite**: Fast build tool with hot module replacement
- **TypeScript**: Strict mode enabled for better type safety
- **Path Aliases**: `@` alias configured for cleaner imports

## 🚨 Known Issues & Limitations

1. **Avatar Filtering**: The application filters out avatars from `cloudflare-ipfs.com` due to reliability issues
2. **API Dependency**: Currently depends on external MockAPI service
3. **No Authentication**: This is a demo application without user authentication
4. **Local Storage**: No local persistence of data between sessions

## 🆘 Troubleshooting

### Common Issues

1. **Port Already in Use**: If port 5173 is busy, Vite will automatically use the next available port
2. **Node Version**: Ensure you're using Node.js 18+ for compatibility
3. **Dependencies**: Run `npm install` if you encounter module resolution errors
4. **Test Failures**: Ensure all dependencies are installed and run `npm test` to verify setup

