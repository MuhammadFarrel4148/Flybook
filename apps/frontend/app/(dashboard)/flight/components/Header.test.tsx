import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header (flight)", () => {
  it("renders the heading and description", () => {
    render(<Header />);

    expect(screen.getByText("Where to next?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Discover your next destination with seamless booking and curated travel experiences.",
      ),
    ).toBeInTheDocument();
  });
});
