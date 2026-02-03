import { escapeHtml } from "../../../lib/escape.js";

export function renderAdminProductForm({ product, formAction, title }) {
  const name = product?.name || "";
  const sku = product?.sku || "";
  const slug = product?.slug || "";
  const description = product?.description || "";
  const imageUrl = product?.image_url || "";
  const priceDisplay = product?.price_display || "";

  const head = `
  <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css" />`;

  const body = `
  <section class="container page-header">
    <h1>${escapeHtml(title)}</h1>
    <a class="link" href="/admin/products">Back to list</a>
  </section>
  <section class="container form-card">
    <form method="post" action="${escapeHtml(formAction)}">
      <label class="field">
        <span>Name *</span>
        <input type="text" name="name" value="${escapeHtml(name)}" required />
      </label>
      <label class="field">
        <span>SKU *</span>
        <input type="text" name="sku" value="${escapeHtml(sku)}" required />
      </label>
      <label class="field">
        <span>Slug</span>
        <input type="text" name="slug" value="${escapeHtml(slug)}" placeholder="leave blank to auto-generate" />
      </label>
      <label class="field">
        <span>Price Display</span>
        <input type="text" name="price_display" value="${escapeHtml(priceDisplay)}" placeholder="$12.00" />
      </label>
      <label class="field">
        <span>Image URL</span>
        <input type="text" name="image_url" value="${escapeHtml(imageUrl)}" placeholder="https://..." />
      </label>
      <div class="field">
        <span>Description</span>
        <div id="product-editor" class="quill-editor">${description}</div>
        <input type="hidden" name="description" id="description" />
      </div>
      <button type="submit" class="button">Save Item</button>
    </form>
  </section>
  <script src="https://cdn.quilljs.com/1.3.6/quill.min.js"></script>
  <script>
    const productQuill = new Quill('#product-editor', {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ header: [2, 3, false] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'blockquote']
        ]
      }
    });
    const form = document.querySelector('form');
    document.querySelector('#description').value = productQuill.root.innerHTML;
    form.addEventListener('submit', () => {
      document.querySelector('#description').value = productQuill.root.innerHTML;
    });
  </script>`;

  return { head, body };
}
