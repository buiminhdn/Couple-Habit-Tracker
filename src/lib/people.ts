import type { PersonSlug } from "../types/domain";

// Tên hiển thị của hai người (nguồn dùng chung cho toàn app).
export const personNames: Record<PersonSlug, string> = {
  partner: "Ly",
  me: "Minh"
};

// Chữ cái đầu, dùng cho avatar.
export const personInitials: Record<PersonSlug, string> = {
  partner: "L",
  me: "M"
};
