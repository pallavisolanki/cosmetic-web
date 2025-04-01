import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "./globals.css";
import { CartProvider } from "../components/CartContext";
import { RecoilRoot } from "recoil";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Cosky Cosmo</title>
        <meta 
          name="description" 
          content="Shop premium cosmetic products online at amazing prices. Find skincare, makeup, and beauty essentials." 
        />
        <meta 
          httpEquiv="Content-Security-Policy" 
          content="default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self';" 
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-white font-sans">
        
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
