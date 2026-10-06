# Event Friend Finder

Event Friend Finder is a full-stack mobile app that helps people connect with others at events based on shared interests, humor, and personality. The app combines a React Native/Expo frontend with a GraphQL backend powered by Apollo Server and Prisma.

## Overview

Users can:
- create and manage a profile
- join an event using a code
- discover other attendees with shared interests and compatible vibes
- react to memes to surface personality matches
- view mutual matches and set up meetings

## Tech Stack

- Frontend: React Native, Expo, Expo Router, TypeScript, NativeWind
- Backend: Apollo Server, GraphQL, Node.js, TypeScript
- Database: PostgreSQL, Prisma ORM
- API layer: GraphQL resolvers and schema modules for users, events, matches, meetings, and memes

## Repository Structure

```text
event_frnd_finder/
├── mobile/              # Expo mobile app
│   ├── app/             # App screens and routes
│   ├── src/             # Components, GraphQL client code, stores, utilities
│   ├── package.json     # Mobile app scripts and dependencies
│   └── tsconfig.json    # TypeScript configuration
├── server/              # GraphQL API and Prisma backend
│   ├── prisma/          # Prisma schema and migrations
│   ├── src/             # GraphQL schema, resolvers, and Prisma services
│   ├── package.json     # Server scripts and dependencies
│   └── .env             # Local environment variables
├── .gitignore
├── README.md
└── LICENSE              # if present in your repo
```

## Features

### User Profiles
- create a profile with personal details and interests
- store profile picture, bio, gender, and birth date
- manage preferences that help match logic work well

### Events
- create or join events using a unique code
- track event membership and participant activity

### Matching Logic
- match users within an event using shared traits and responses
- collect meme reactions to build compatibility signals
- score matches and surface pairs for follow-up interaction

### Meetings
- suggest or coordinate meetings between matched users
- track meeting status and acceptance flow

## Prerequisites

Before running the project locally, install:
- Node.js 18+
- npm
- PostgreSQL
- Expo CLI (optional, but helpful for local development)

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/AyushTyagi2/event_frnd_finder.git
cd event_frnd_finder
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder with a PostgreSQL connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
```

Then generate Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Start the GraphQL server:

```bash
npm run dev
```

The server runs via Apollo Server and listens on port 4000 by default.

### 3. Install mobile dependencies

```bash
cd ../mobile
npm install
```

Start the Expo app:

```bash
npm start
```

Then run the app in:
- an Android emulator
- an iOS simulator
- Expo Go on a physical device
- a web browser using Expo web support

## Useful Scripts

### Server

```bash
npm run dev     # run the API in watch mode
```

### Mobile

```bash
 npx expo start --clear # start Expo development server
```

## Backend Notes

The server uses a modular GraphQL structure with separate domain folders for:
- users
- memes
- events
- event members
- matches
- meeting places
- meetings

The Prisma schema defines the database models and relationships driving the app experience.

## Development Workflow

1. Start PostgreSQL and ensure `DATABASE_URL` is valid.
2. Run the backend with `npm run dev` in `server`.
3. Start the Expo client with `npm start` in `mobile`.
4. Use the app to create a profile, join an event, and explore matches.

This project currently uses the repo's configured licensing setup. Check the repository root for the active license file before publishing or redistributing the project.
