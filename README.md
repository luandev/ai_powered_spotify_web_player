# AI-Powered Spotify Web Player

This project is an AI-powered Spotify web player built using the T3 Stack, which includes Next.js, tRPC, Tailwind CSS, and more. The player integrates with Spotify's Web Playback SDK and uses AI to provide insights and comments on the music being played.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Spotify Integration**: Stream music directly from Spotify using the Web Playback SDK.
- **AI Insights**: Get AI-generated insights and comments on the music being played.
- **Responsive Design**: Beautiful and responsive UI built with Tailwind CSS.
- **State Management**: Efficient state management using Redux Toolkit and React Query.
- **Type Safety**: Full TypeScript support for type safety and better developer experience.

## Tech Stack

- **Next.js**: React framework for server-side rendering and static site generation.
- **tRPC**: End-to-end typesafe APIs.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Redux Toolkit**: State management library.
- **React Query**: Data fetching and caching library.
- **Spotify Web Playback SDK**: SDK for streaming music from Spotify.

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Spotify Developer Account

### Installation

1. Clone the repository:

  ```sh
  git clone https://github.com/luandev/ai_powered_spotify_web_player.git
  ```

2. Install dependencies:

  ```sh
  npm install
  ```

3. Set up environment variables:

  - Create a `.env` file in the root directory.
  - Copy the contents of `.env.example` into `.env` and fill in the required values.

## Environment Variables

The following environment variables need to be set in your `.env` file:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `NEXT_PUBLIC_SPOTIFY_REDIRECT_URI`

## Usage

### Development

To start the development server, run:

```sh
npm run dev
```

This will start the Next.js development server on [http://localhost:3000](http://localhost:3000).

### Build

To build the project for production, run:

```sh
npm run build
```

### Start

To start the production server, run:

```sh
npm start
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your fork.
5. Create a pull request to the main repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
