import ImageNext from "@/components/Image";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Author, Software Architect, Software Engineer, Software Developer : https://www.linkedin.com/in/wahyu-fatur-rizky

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Login",
  description: "Login page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AntdRegistry>
            <div className="bg-[url('https://i.ibb.co/D9pb4x0/Screenshot-2024-03-02-at-15-56-52.png')]">
              <ImageNext
                src="https://i.ibb.co/56jY2KL/Whats-App-Image-2024-03-01-at-19-22-45.jpg"
                width={611}
                height={822}
                priority
                alt="logo-klikyou"
                className="mx-auto h-[822px] w-auto object-cover"
              />
            </div>
          </AntdRegistry>
        </Providers>
      </body>
    </html>
  );
}
