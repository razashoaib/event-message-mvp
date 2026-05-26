# Event Message MVP

A React + Vite app for creating WhatsApp-ready event reminder messages for Azadari Updates - Sydney.

## Features

- Build one or more event reminders from a compact form.
- Preview the WhatsApp message live as fields are updated.
- Copy the generated message to the clipboard.
- Sort events by start time in the generated message.
- Choose reminder type for Majlis or Jashan message styling.
- Use autocomplete suggestions for event titles, addresses, speakers, and organisers while still allowing custom values.

## Suggested Values

The app includes curated suggestions for:

- Event title: Majlis e Aza
- Address: local venue and organisation address entries
- Speaker: commonly used speaker names
- Organiser: commonly used organiser names

## Local Development

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

The production app is deployed at:

[https://event-message-mvp.vercel.app](https://event-message-mvp.vercel.app)

Pushes to the connected repository can be deployed through Vercel.
