export const THANK_YOU_DELAY_MS = 15000;

export const buildThankYouUrl = (returnTo = "/") => {
  return `/thank-you?redirect=${encodeURIComponent(returnTo)}`;
};

export const redirectToThankYou = (router) => {
  const currentUrl =
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}${window.location.hash}`
      : "/";

  router.push(buildThankYouUrl(currentUrl));
};
