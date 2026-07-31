import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Couple Habit",
    short_name: "Habits",
    description: "Theo dõi thói quen hằng ngày cho hai người.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf9ff",
    theme_color: "#201f3b",
    icons: []
  };
}
