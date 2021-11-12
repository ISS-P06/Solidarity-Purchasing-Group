import { render, screen } from "@testing-library/react";
import App from "../App";
import ProductCards from "../components/ProductCards";

test("renders learn react link", () => {
  render(<App />);
  const navBar = screen.getByText("Solidarity Purchasing Group");
  expect(navBar).toBeInTheDocument();
});

test("test ProductCards component rendering", async () => {
  window.scrollTo = jest.fn()
  const p = [{ id: 0, name: "test", description: "test", category: "bread", quantity: 1, price: 1, unit: "Kg" }];
  render(<ProductCards productList={p}/>);
  const productCard = screen.getByText("Quantity: 1 Kg");
  expect(productCard).toBeInTheDocument();
});