import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote"
];

const ALLOWED_ATTRIBUTES = {
  a: ["href", "title", "target", "rel"]
};

export function sanitizeRecipeHtml(html) {
  return sanitizeHtml(html || "", {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener", target: "_blank" })
    }
  });
}
