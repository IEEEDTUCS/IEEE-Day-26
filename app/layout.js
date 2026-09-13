import "./globals.css";

export const metadata = {
  title: "IEEE DTU — Build Beyond",
  description: "The IEEE DTU Student Branch — a community for technology, innovation, and impact.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
