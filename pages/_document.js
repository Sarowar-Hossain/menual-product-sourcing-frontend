import { Html, Head, Main, NextScript } from "next/document";
import Layout from "@/components/Layout/Layout";
import { Toaster } from "react-hot-toast";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased bg-white">
        <Layout>
          <Toaster position="top-center" />
          <Main />
          <NextScript />
        </Layout>
      </body>
    </Html>
  );
}
