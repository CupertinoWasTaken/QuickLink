// mod.ts
var __bodies = new Map;
var prefetch = (url) => {
  fetch(url).then((response) => response.text()).then((body) => {
    const bodyStartIndex = body.indexOf("<body");
    const bodyEndIndex = body.indexOf("</body>");
    __bodies.set(url, body.substring(bodyStartIndex, bodyEndIndex + 7));
  });
};
var hydrate = (url) => {
  const newBody = __bodies.get(url);
  switch (newBody) {
    case undefined:
      throw Error("Failed to get prefetched data for hydration.");
    default:
      document.body.innerHTML = newBody;
      history.pushState({}, "", url);
      onLoad();
  }
};
var onLoad = () => {
  for (const anchor of document.getElementsByTagName("a")) {
    if (/^http?s:\/\//.test(anchor.href))
      continue;
    anchor.addEventListener("mouseenter", () => prefetch(anchor.href), {
      once: true
    });
    anchor.onclick = (event) => {
      event.preventDefault();
      hydrate(anchor.href);
    };
  }
};
document.addEventListener("DOMContentLoaded", onLoad);
var isntAnchor = (element) => {
  if (!(element instanceof HTMLAnchorElement)) {
    return true;
  }
  return false;
};
document.onkeydown = (event) => {
  if (event.key != "Tab" || isntAnchor(document.activeElement))
    return;
  const activeElement = document.activeElement;
  prefetch(activeElement.href);
};
