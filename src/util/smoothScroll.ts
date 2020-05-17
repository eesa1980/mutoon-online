import scrollIntoView from "smooth-scroll-into-view-if-needed";

export const smoothScroll = (selector: string) => {
  scrollIntoView(document.querySelector(selector), {
    behavior: "smooth",
    block: "start",
  });
};

export const smoothPageScroll = (page: number) => {
  const selector = `#page-${page}`;
  const offset = document.querySelector(selector).getBoundingClientRect();

  if (offset.top > window.innerHeight / 2) {
    smoothScroll(selector);
  }
};
