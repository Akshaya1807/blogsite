import React from "react";
import LandingLayout from "../components/LandingPage/Layout";
import Link from "next/link";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import BookIcon from "@material-ui/icons/Book";

const Index = () => {
  return (
    <LandingLayout
      title={"Tech Blogsite"}
      MetaDescription="Welcome to Tech Blogsite — a MERN-powered platform for creating and browsing technology blogs with style."
    >
      <div
        style={{
          height: "100vh",
          background: "linear-gradient(135deg, #38b000, #0096c7)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontFamily: "'Poppins', sans-serif",
          padding: "0 2rem",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "700",
            marginBottom: "1rem",
            lineHeight: "1.2",
          }}
        >
          Welcome to <span style={{ color: "#fff" }}> Blogsite</span>
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            maxWidth: "800px",
            marginBottom: "2rem",
            opacity: 0.9,
          }}
        >
          A sleek MERN-powered blogging platform where you can explore and
          create blogs about technology. Built with Next.js, Node.js, Express,
          and MongoDB — fast, elegant, and free to use.
        </p>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/signup">
            <a
              style={{
                backgroundColor: "#fff",
                color: "#0096c7",
                fontWeight: "600",
                padding: "0.8rem 1.5rem",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s ease",
              }}
            >
              Get Started <DoubleArrowIcon />
            </a>
          </Link>

          <Link href="/blogs">
            <a
              style={{
                border: "2px solid #fff",
                color: "#fff",
                fontWeight: "600",
                padding: "0.8rem 1.5rem",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s ease",
              }}
            >
              Browse Blogs <BookIcon />
            </a>
          </Link>
        </div>
      </div>
    </LandingLayout>
  );
};

export default Index;
