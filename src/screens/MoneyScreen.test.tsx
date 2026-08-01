import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import MoneyScreen from "./MoneyScreen";

describe("MoneyScreen", () => {
  it("records a default full debt payment", async () => {
    const onRecordPayment = vi.fn();
    render(
      <MoneyScreen
        summaries={[
          { personId: "me", debt: 40000, penalties: [], payments: [] },
          { personId: "partner", debt: 20000, penalties: [], payments: [] }
        ]}
        onRecordPayment={onRecordPayment}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Minh đã đóng phạt" }));

    expect(onRecordPayment).toHaveBeenCalledWith("me", 40000, "");
  });
});
