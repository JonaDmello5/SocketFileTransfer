# **App Name**: SocketFileTransfer

## Core Features:

- User Authentication: User authentication via Firebase Auth (email/OTP).
- File and IP Input: File selection via drag-and-drop zone or file picker, and destination IP input form (Material UI).
- Temporary Cloud Storage: Upload file to temporary Cloud Storage bucket with auto-deletion.
- File Sending via Cloud Function: Backend process that uses a tool to runs a modified version of `sender.py` to stream the file over TCP to the destination IP using Cloud Functions.
- Receiver Setup Page: Instructions page with code snippets for setting up `receiver.py` on the remote host.
- Transfer Status UI: Display real-time transfer progress (progress bar animation) and logs (Firestore, EventSource).
- Signed URL Fallback: Upon transfer completion, provide a signed URL (valid for 1 hour) to re-download the file from Cloud Storage as a fallback.
- Theme Toggle: Dark/light theme toggle stored in localStorage. Uses themes: Glorious Secure Citrus, Aurora Shield Neon, and Fresh Spring Pop

## Style Guidelines:

- Primary color: Lime green (#32CD32), symbolizing secure transfer and reliability with a touch of joy (Theme C/Fresh Spring Pop default).
- Background color: Pale green (#F0FFF0), for a clean and calming interface (Theme C/Fresh Spring Pop default).
- Accent color: Sea green (#2E8B57) to provide clear visual distinction of key elements from primary and background colors (Theme C/Fresh Spring Pop default).
- Font pairing: 'Space Grotesk' (sans-serif) for headlines and 'Inter' (sans-serif) for body text.
- Code font: 'Source Code Pro' for displaying code snippets.
- Minimalist icons for file types and transfer status.
- Smooth, determinate progress bar animation during file transfer, gradient Primary -> Accent2.
- Theme A (Glorious Secure Citrus) Primary: #3AFD5A, Background: #F5FFF7, Accent1: #FF9E00
- Theme B (Aurora Shield Neon) Primary: #6BFF95, Background: #F2FFFB, Accent1: #FF52B4