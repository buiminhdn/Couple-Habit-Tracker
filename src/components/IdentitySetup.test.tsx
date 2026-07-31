import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import IdentitySetup from "./IdentitySetup";

describe("IdentitySetup", () => {
  it("lets the user choose their identity", async () => {
    const onSelect = vi.fn();
    render(<IdentitySetup onSelect={onSelect} />);

    await userEvent.click(screen.getByRole("button", { name: "Tôi" }));

    expect(onSelect).toHaveBeenCalledWith("me");
  });
});
