import { escapeHtml } from "../../../lib/escape.js";

export function renderAdminRecipeForm({ recipe, formAction, title }) {
  const recipeTitle = recipe?.title || "";
  const recipeSlug = recipe?.slug || "";
  const recipeHtml = recipe?.recipe_html || "";
  const imageUrl = recipe?.image_url || "";
  const published = recipe?.published ?? true;

  const head = `
  <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css" />`;

  const body = `
  <section class="container page-header">
    <h1>${escapeHtml(title)}</h1>
    <a class="link" href="/admin/recipes">Back to list</a>
  </section>
  <section class="container form-card">
    <form method="post" action="${escapeHtml(formAction)}" enctype="multipart/form-data">
      <label class="field">
        <span>Title *</span>
        <input type="text" name="title" value="${escapeHtml(recipeTitle)}" required />
      </label>
      <label class="field">
        <span>Slug</span>
        <input type="text" name="slug" value="${escapeHtml(recipeSlug)}" placeholder="leave blank to auto-generate" />
      </label>
      <label class="field">
        <span>Image URL</span>
        <input type="text" name="image_url" value="${escapeHtml(imageUrl)}" placeholder="/uploads/your-image.jpg" />
      </label>
      <label class="field">
        <span>Upload Image</span>
        <input type="file" name="image_file" accept="image/*" />
      </label>
      <label class="field checkbox">
        <input type="checkbox" name="published" ${published ? "checked" : ""} />
        <span>Published</span>
      </label>
      <div class="field">
        <span>Recipe Body *</span>
        <div id="editor" class="quill-editor">${recipeHtml}</div>
        <input type="hidden" name="recipe_html" id="recipe_html" />
      </div>
      <button type="submit" class="button">Save Recipe</button>
    </form>
  </section>
  <script src="https://cdn.quilljs.com/1.3.6/quill.min.js"></script>
  <script>
    const quill = new Quill('#editor', {
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
    document.querySelector('#recipe_html').value = quill.root.innerHTML;
    form.addEventListener('submit', () => {
      document.querySelector('#recipe_html').value = quill.root.innerHTML;
    });
  </script>`;

  return { head, body };
}
