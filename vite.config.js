import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // This helps with CSP in development
    // headers: {
    //   'Content-Security-Policy': "script-src 'self' 'unsafe-inline'"
    // },
    // Expose env variables to the client
    define: {
    'process.env': process.env
  }
  },
  // Add CSP headers for development
  // configureServer(server) {
  //   server.middlewares.use((_req, res, next) => {
  //     res.setHeader(
  //       "Content-Security-Policy",
  //       "script-src 'self' 'unsafe-inline' https://pleasant-alien-27.clerk.accounts.dev https://clerk.accounts.dev https://*.clerk.accounts.dev; " +
  //       "connect-src 'self' https://pleasant-alien-27.clerk.accounts.dev https://clerk.accounts.dev https://*.clerk.accounts.dev https://api.github.com; " +
  //       "img-src 'self' data: https:; " +
  //       "style-src 'self' 'unsafe-inline'; " +
  //       "font-src 'self' data:;"
  //     );
  //     next();
  //   });
  // },
})