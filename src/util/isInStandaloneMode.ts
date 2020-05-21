export const isInStandaloneMode = () => {
  if (typeof window === "object") {
    return (
      !!window.matchMedia("(display-mode: standalone)").matches ||
      !!window?.navigator?.standalone ||
      !!document.referrer.includes("android-app://")
    );
  }

  return false;
};
