import { render, screen, fireEvent } from "@testing-library/react";

import App from "../App";
import VirtualClock from "../components/VirtualClock";

describe("Virtual Time Clock", () => {
  test("test virtual clock button", () => {
    render(<App />);
    const vcButton = screen.getByText("Virtual clock");
    expect(vcButton).toBeInTheDocument();
  });

  test("test opening virtual clock modal", () => {
    render(<VirtualClock />);

    //Click on "Virtual clock" button to open the modal
    fireEvent(
      screen.getByText("Virtual clock"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );

    const nextDayButton = screen.getByText("Next day");
    const resetButton = screen.getByText("Reset");
    const updateVCButton = screen.getByText("Update Virtual clock");
    expect(nextDayButton).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();
    expect(updateVCButton).toBeInTheDocument();
  });

  test("test changing virtual clock time and day", () => {
    render(<VirtualClock />);

    //Click on "Virtual clock" button to open the modal
    fireEvent(
      screen.getByText("Virtual clock"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );

    //Click on "Next day" button to change the date
    fireEvent(
      screen.getByText("Next day"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );

    //Click on the time picker and open the dropdown
    fireEvent(
      screen.getByText("00:00"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );

    //Click on '11:00' to change time
    fireEvent(
      screen.getByText("11:00"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );

    //Click on 'Update Virtual clock' to update date and time
    fireEvent(
      screen.getByText("Update Virtual clock"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );
  });
});
