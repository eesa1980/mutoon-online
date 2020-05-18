import scrollIntoView from "smooth-scroll-into-view-if-needed";

export const smoothScroll = (
  selector: string,
  position: ScrollLogicalPosition = "start"
) => {
  scrollIntoView(document.querySelector(selector), {
    behavior: "smooth",
    block: position,
  });
};

export const smoothPageScroll = (
  page: number,
  position: ScrollLogicalPosition = "start"
) => {
  const selector = `#page-${page}`;
  smoothScroll(selector, position);
};
