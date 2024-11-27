import { Html, Head, Main, NextScript } from "next/document";
import Layout from "@/components/Layout/Layout";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased bg-white">
        <Layout>
          <Main />
          <NextScript />
        </Layout>
      </body>
    </Html>
  );
}
