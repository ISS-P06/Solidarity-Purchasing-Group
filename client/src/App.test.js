import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const navBar = screen.getByText("Solidarity Purchasing Group");
  expect(navBar).toBeInTheDocument();
});
