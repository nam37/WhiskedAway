import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload } from 'lucide-react';
import { supabase, bakeryAPI, type BakeryBake, type BakeryRecipe, type BakeryAbout } from '../lib/supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

interface AdminProps {
  userRole?: string;
}

export default function BakeryAdmin({ userRole }: AdminProps) {
  const [activeTab, setActiveTab] = useState<'bakes' | 'recipes' | 'about'>('bakes');
  const [bakes, setBakes] = useState<BakeryBake[]>([]);
  const [recipes, setRecipes] = useState<BakeryRecipe[]>([]);
  const [aboutContent, setAboutContent] = useState<BakeryAbout | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated and has employee role
  const canEdit = userRole === 'employee';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [bakesData, recipesData, aboutData] = await Promise.all([
        bakeryAPI.getBakes(),
        bakeryAPI.getRecipes(),
        bakeryAPI.getAboutContent()
      ]);
      
      setBakes(bakesData);
      setRecipes(recipesData);
      setAboutContent(aboutData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBake = async (bake: Partial<BakeryBake>) => {
    if (!canEdit) return;

    try {
      if (bake.id) {
        // Update existing
        const { error } = await supabase
          .from('bakery_bakes')
          .update(bake)
          .eq('id', bake.id);
        
        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('bakery_bakes')
          .insert([bake]);
        
        if (error) throw error;
      }
      
      await loadData();
      setIsEditing(null);
    } catch (error) {
      console.error('Error saving bake:', error);
      alert('Error saving bake. Please try again.');
    }
  };

  const handleDeleteBake = async (id: string) => {
    if (!canEdit || !confirm('Are you sure you want to delete this bake?')) return;

    try {
      const { error } = await supabase
        .from('bakery_bakes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await loadData();
    } catch (error) {
      console.error('Error deleting bake:', error);
      alert('Error deleting bake. Please try again.');
    }
  };

  const handleSaveRecipe = async (recipe: Partial<BakeryRecipe>) => {
    if (!canEdit) return;

    // Debug: Log what we're about to save
    console.log('Saving recipe with full_recipe:', recipe.full_recipe);

    try {
      if (recipe.id) {
        // Update existing
        const { error } = await supabase
          .from('bakery_recipes')
          .update(recipe)
          .eq('id', recipe.id);
        
        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('bakery_recipes')
          .insert([recipe]);
        
        if (error) throw error;
      }
      
      await loadData();
      setIsEditing(null);
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Error saving recipe. Please try again.');
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!canEdit || !confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const { error } = await supabase
        .from('bakery_recipes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await loadData();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Error deleting recipe. Please try again.');
    }
  };

  const handleSaveAbout = async (content: string) => {
    if (!canEdit) return;

    try {
      if (aboutContent?.id) {
        // Update existing
        const { error } = await supabase
          .from('bakery_about')
          .update({ content })
          .eq('id', aboutContent.id);
        
        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('bakery_about')
          .insert([{ content, baker_name: 'Sarah' }]);
        
        if (error) throw error;
      }
      
      await loadData();
      setIsEditing(null);
    } catch (error) {
      console.error('Error saving about content:', error);
      alert('Error saving about content. Please try again.');
    }
  };

  if (!canEdit) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Access Restricted</h2>
          <p className="text-yellow-700">
            You need employee access to manage bakery content. Please contact an administrator.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">Bakery Content Management</h1>
          <p className="text-purple-100">Manage your bakery's content and showcase your magical creations</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'bakes' as const, label: 'Best Bakes', count: bakes.length },
              { key: 'recipes' as const, label: 'Recipes', count: recipes.length },
              { key: 'about' as const, label: 'About Page', count: 1 }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'bakes' && (
            <BakesManager
              bakes={bakes}
              onSave={handleSaveBake}
              onDelete={handleDeleteBake}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          )}
          
          {activeTab === 'recipes' && (
            <RecipesManager
              recipes={recipes}
              onSave={handleSaveRecipe}
              onDelete={handleDeleteRecipe}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          )}
          
          {activeTab === 'about' && (
            <AboutManager
              aboutContent={aboutContent}
              onSave={handleSaveAbout}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Component for managing bakes
function BakesManager({ bakes, onSave, onDelete, isEditing, setIsEditing }: any) {
  const [editData, setEditData] = useState<Partial<BakeryBake>>({});

  const startEdit = (bake?: BakeryBake) => {
    if (bake) {
      setEditData(bake);
      setIsEditing(bake.id);
    } else {
      setEditData({
        title: '',
        description: '',
        image_url: '',
        display_order: bakes.length + 1,
        is_featured: false,
        is_active: true
      });
      setIsEditing('new');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Best Bakes</h2>
        <button
          onClick={() => startEdit()}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Bake
        </button>
      </div>

      {isEditing && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editData.title || ''}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editData.image_url || ''}
                  onChange={(e) => setEditData({ ...editData, image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editData.description || ''}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editData.is_featured || false}
                  onChange={(e) => setEditData({ ...editData, is_featured: e.target.checked })}
                  className="mr-2"
                />
                Featured
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editData.is_active !== false}
                  onChange={(e) => setEditData({ ...editData, is_active: e.target.checked })}
                  className="mr-2"
                />
                Active
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bakes.map((bake) => (
          <div key={bake.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src={bake.image_url} alt={bake.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800 text-lg">{bake.title}</h3>
                <div className="flex gap-1">
                  {bake.is_featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Featured</span>
                  )}
                  {!bake.is_active && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Inactive</span>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{bake.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(bake)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(bake.id)}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Component for managing recipes
function RecipesManager({ recipes, onSave, onDelete, isEditing, setIsEditing }: any) {
  const [editData, setEditData] = useState<Partial<BakeryRecipe>>({});

  const startEdit = (recipe?: BakeryRecipe) => {
    if (recipe) {
      setEditData(recipe);
      setIsEditing(recipe.id);
    } else {
      setEditData({
        title: '',
        description: '',
        difficulty_level: 'medium',
        is_featured: false,
        is_active: true
      });
      setIsEditing('new');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Favorite Recipes</h2>
        <button
          onClick={() => startEdit()}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Recipe
        </button>
      </div>

      {isEditing && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editData.title || ''}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={editData.category || ''}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., cookies, bread, pastries"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editData.description || ''}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Recipe</label>
              <div className="border border-gray-300 rounded-md">
                <ReactQuill
                  value={editData.full_recipe || ''}
                  onChange={(content) => setEditData({ ...editData, full_recipe: content })}
                  placeholder="Enter the complete recipe including ingredients, instructions, tips, etc..."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link'],
                      ['clean']
                    ],
                  }}
                  formats={[
                    'header',
                    'bold', 'italic', 'underline',
                    'list', 'bullet',
                    'link'
                  ]}
                  style={{ minHeight: '300px' }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Use the rich text editor to format your recipe with headers, lists, and styling.
              </p>
              
              {/* Debug preview */}
              {editData.full_recipe && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(editData.full_recipe) 
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (minutes)</label>
                <input
                  type="number"
                  value={editData.prep_time_minutes || ''}
                  onChange={(e) => setEditData({ ...editData, prep_time_minutes: parseInt(e.target.value) || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (minutes)</label>
                <input
                  type="number"
                  value={editData.cook_time_minutes || ''}
                  onChange={(e) => setEditData({ ...editData, cook_time_minutes: parseInt(e.target.value) || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
                <input
                  type="number"
                  value={editData.servings || ''}
                  onChange={(e) => setEditData({ ...editData, servings: parseInt(e.target.value) || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="block text-sm font-medium text-gray-700">Difficulty</label>
              <select
                value={editData.difficulty_level || 'medium'}
                onChange={(e) => setEditData({ ...editData, difficulty_level: e.target.value as 'easy' | 'medium' | 'hard' })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editData.is_featured || false}
                  onChange={(e) => setEditData({ ...editData, is_featured: e.target.checked })}
                  className="mr-2"
                />
                Featured
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editData.is_active !== false}
                  onChange={(e) => setEditData({ ...editData, is_active: e.target.checked })}
                  className="mr-2"
                />
                Active
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-800 text-lg">{recipe.title}</h3>
              <div className="flex gap-1">
                {recipe.is_featured && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Featured</span>
                )}
                {!recipe.is_active && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Inactive</span>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-500 mb-2">
              {recipe.category && <span className="capitalize">{recipe.category}</span>}
              {recipe.difficulty_level && (
                <span className="ml-2 capitalize">• {recipe.difficulty_level}</span>
              )}
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{recipe.description}</p>
            
            {/* Debug: Show raw content */}
            {recipe.full_recipe && (
              <div className="text-xs text-gray-400 mb-4 truncate">
                Raw content: {recipe.full_recipe.substring(0, 100)}...
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(recipe)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete(recipe.id)}
                className="text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Component for managing about content
function AboutManager({ aboutContent, onSave, isEditing, setIsEditing }: any) {
  const [editData, setEditData] = useState('');

  const startEdit = () => {
    setEditData(aboutContent?.content || '');
    setIsEditing('about');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">About the Baker</h2>
        <button
          onClick={startEdit}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Edit2 className="h-4 w-4" />
          Edit Content
        </button>
      </div>

      {isEditing ? (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About Content</label>
              <div className="border border-gray-300 rounded-md">
                <ReactQuill
                  value={editData}
                  onChange={setEditData}
                  placeholder="Enter the about content here..."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link'],
                      ['clean']
                    ],
                  }}
                  formats={[
                    'header',
                    'bold', 'italic', 'underline',
                    'list', 'bullet',
                    'link'
                  ]}
                  style={{ minHeight: '400px' }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Use the rich text editor to format your about content with headers, lists, and styling.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white border rounded-lg p-6">
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-700"
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(aboutContent?.content || '<p>No content available. Click "Edit Content" to add some!</p>') 
              }}
            >
            </div>
          </div>
        </div>
      )}
    </div>
  );
}