import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://wbbug.github.io/",
  author: "Wbbug",
  desc: "A minimal, responsive and SEO-friendly Astro blog theme.",
  title: "WBbug's blog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 3,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

