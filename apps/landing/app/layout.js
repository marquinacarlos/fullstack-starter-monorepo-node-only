import './globals.css';

export const metadata = {
  title: 'Fullstack starter',
  description: 'Landing page of the fullstack starter',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
