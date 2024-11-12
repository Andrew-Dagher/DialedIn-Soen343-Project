// layout.jsx
'use client';

import NavBar from '../components/NavBar';
import Chat from '../components/Chat';
import './globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
        <link 
          rel="stylesheet" 
          href="https://cdn.auth0.com/js/auth0-samples-theme/1.0/css/auth0-theme.min.css" 
        />
      </head>
      <body className="bg-slate-950">
        <UserProvider>
          <NavBar />
          <main className="pt-24 min-h-screen"> 
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <Chat />
        </UserProvider>
      </body>
    </html>
  );
}