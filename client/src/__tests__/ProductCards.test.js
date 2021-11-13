import { render, screen } from "@testing-library/react";
import React from "react";
import { ProductCards, ProductCard } from "../components/ProductCards";

test("test ProductCards component rendering", () => {
  window.scrollTo = jest.fn();
  render(<ProductCards/>);
  const title = screen.getByText("Browse products");
  expect(title).toBeInTheDocument();
});

test("test ProductCard component rendering", () => {
  const p = { id: 1, name: "Baguette", description: "Delicious", category: "bread", quantity: 1, price: 1, unit: "Kg" };
  render(<ProductCard product={p}/>);
  const title = screen.getByText("Baguette");
  expect(title).toBeInTheDocument();
});