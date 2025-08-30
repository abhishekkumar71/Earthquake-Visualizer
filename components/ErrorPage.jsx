// src/components/ErrorPage.jsx
import React from "react";
import { Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function ErrorPage({ message, onRetry }) {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <ErrorOutlineIcon style={{ fontSize: 80, color: "#f44336" }} />
      <h1 style={{ marginTop: "1rem", color: "#333" }}>Oops!</h1>
      <p style={{ color: "#666", maxWidth: 400 }}>
        {message || "Something went wrong. Please try again."}
      </p>
      {onRetry && (
        <Button
          variant="contained"
          color="primary"
          onClick={onRetry}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      )}
    </div>
  );
}
