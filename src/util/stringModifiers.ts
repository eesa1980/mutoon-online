import escapeRegExp from "lodash-es/escapeRegExp";

export const stripTashkeel = (input: string) => {
  return input.replace(/[\u0617-\u061A\u064B-\u0652]/g, "");
};

export const stripHtml = (input: string) => {
  return input.replace(/(<([^>]+)>)/g, "");
};

export const addHighlighting = (input: string, val: string) => {
  return input.replace(
    new RegExp(escapeRegExp(val), "gi"),
    `<mark>${val}</mark>`
  ) || val;
};
