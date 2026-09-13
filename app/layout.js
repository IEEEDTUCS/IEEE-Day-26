import "./globals.css";
import ScrollReveal from "../components/ScrollReveal";

export const metadata = {
  title: "IEEE DTU",
  description: "North India's Largest IEEE Student Branch",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><ScrollReveal />{children}</body>
    </html>
  );
}
