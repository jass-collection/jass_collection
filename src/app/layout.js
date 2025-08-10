import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GeoProvider } from "../components/GeoContext";
import { AuthProvider } from "../components/AuthContext";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Jass Collection - Designer Suits",
  description: "Premium designer suits for every occasion. Tailored to perfection.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <GeoProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </GeoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
