import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import InputFlight from "./InputFlight";

function getPassengerRow(label: string) {
  return screen.getByText(label).parentElement as HTMLElement;
}

function incrementRow(label: string) {
  const row = getPassengerRow(label);
  const [plusButton] = within(row).getAllByRole("button");
  fireEvent.click(plusButton);
}

function decrementRow(label: string) {
  const row = getPassengerRow(label);
  const [, minusButton] = within(row).getAllByRole("button");
  const minusIcon = minusButton.querySelector("svg") as SVGElement;
  fireEvent.click(minusIcon);
}

describe("InputFlight (flight)", () => {
  it("defaults to the One Way trip type checked", () => {
    render(<InputFlight />);

    expect(screen.getByRole("radio", { name: "One Way" })).toBeChecked();
  });

  it("opens the passenger panel and closes it via the backdrop", () => {
    const { container } = render(<InputFlight />);

    expect(screen.queryByText("Atur Penumpang")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Penumpang/i }));
    expect(screen.getByText("Atur Penumpang")).toBeInTheDocument();

    const backdrop = container.querySelector(
      ".fixed.inset-0.z-10.bg-transparent",
    ) as HTMLElement;
    fireEvent.click(backdrop);

    expect(screen.queryByText("Atur Penumpang")).not.toBeInTheDocument();
  });

  it("increments and decrements the adult passenger count", () => {
    render(<InputFlight />);
    fireEvent.click(screen.getByRole("button", { name: /Penumpang/i }));

    const row = getPassengerRow("Dewasa (12 tahun ke atas)");
    expect(within(row).getByText("0")).toBeInTheDocument();

    incrementRow("Dewasa (12 tahun ke atas)");
    expect(within(row).getByText("1")).toBeInTheDocument();

    decrementRow("Dewasa (12 tahun ke atas)");
    expect(within(row).getByText("0")).toBeInTheDocument();
  });

  it("increments the children and infant passenger counts", () => {
    render(<InputFlight />);
    fireEvent.click(screen.getByRole("button", { name: /Penumpang/i }));

    incrementRow("Anak (2 - 11 tahun)");
    expect(
      within(getPassengerRow("Anak (2 - 11 tahun)")).getByText("1"),
    ).toBeInTheDocument();

    incrementRow("Bayi (dibawah 2 tahun)");
    expect(
      within(getPassengerRow("Bayi (dibawah 2 tahun)")).getByText("1"),
    ).toBeInTheDocument();
  });

  it("opens the class panel and selects a class", () => {
    render(<InputFlight />);

    fireEvent.click(screen.getByRole("button", { name: /Class/i }));
    const businessButton = screen.getByRole("button", { name: "Business" });

    expect(businessButton.className).not.toContain("bg-blue-50");

    fireEvent.click(businessButton);

    expect(businessButton.className).toContain("bg-blue-50");
  });

  it("updates the from and to inputs", () => {
    render(<InputFlight />);

    const fromInput = screen.getByLabelText("From") as HTMLInputElement;
    const toInput = screen.getByLabelText("To") as HTMLInputElement;

    fireEvent.change(fromInput, { target: { value: "Jakarta" } });
    fireEvent.change(toInput, { target: { value: "Bali" } });

    expect(fromInput.value).toBe("Jakarta");
    expect(toInput.value).toBe("Bali");
  });

  it("swaps the from and to values", () => {
    render(<InputFlight />);

    const fromInput = screen.getByLabelText("From") as HTMLInputElement;
    const toInput = screen.getByLabelText("To") as HTMLInputElement;

    fireEvent.change(fromInput, { target: { value: "Jakarta" } });
    fireEvent.change(toInput, { target: { value: "Bali" } });

    fireEvent.click(
      screen.getByRole("button", { name: "Swap origin and destination" }),
    );

    expect(fromInput.value).toBe("Bali");
    expect(toInput.value).toBe("Jakarta");
  });

  it("defaults the date label to today and opens the calendar on click", () => {
    const { container } = render(<InputFlight />);

    const expectedLabel = format(new Date(), "d MMM yyyy", { locale: id });
    const dateButton = screen.getByRole("button", { name: "Date" });

    expect(dateButton).toHaveTextContent(expectedLabel);
    expect(
      container.querySelector(".react-datepicker"),
    ).not.toBeInTheDocument();

    fireEvent.click(dateButton);

    expect(container.querySelector(".react-datepicker")).toBeInTheDocument();
  });
});
