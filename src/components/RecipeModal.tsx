import { X, Clock, Users, ChefHat } from 'lucide-react';
import type { BakeryRecipe } from '../lib/supabase';
import DOMPurify from 'dompurify';

interface RecipeModalProps {
  recipe: BakeryRecipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RecipeModal({ recipe, isOpen, onClose }: RecipeModalProps) {
  if (!isOpen || !recipe) return null;

  const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-purple-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <h2 className="font-script text-3xl md:text-4xl font-bold text-white mb-2">
            {recipe.title}
          </h2>
          
          <div className="flex flex-wrap gap-4 text-purple-100">
            {recipe.prep_time_minutes && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Prep: {recipe.prep_time_minutes} min</span>
              </div>
            )}
            {recipe.cook_time_minutes && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Cook: {recipe.cook_time_minutes} min</span>
              </div>
            )}
            {totalTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Total: {totalTime} min</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">Serves: {recipe.servings}</span>
              </div>
            )}
            {recipe.difficulty_level && (
              <div className="flex items-center gap-1">
                <ChefHat className="h-4 w-4" />
                <span className="text-sm capitalize">{recipe.difficulty_level}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-600 text-lg leading-relaxed">
              {recipe.description}
            </p>
          </div>

          {/* Full Recipe */}
          {recipe.full_recipe ? (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-xl text-purple-800 mb-4">Complete Recipe</h3>
              
              {/* Debug info */}
              <div className="text-xs text-gray-400 mb-2">
                Content length: {recipe.full_recipe.length} characters
              </div>
              
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(recipe.full_recipe) 
                  }}
                >
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-yellow-800 mb-2">Full Recipe Coming Soon!</h3>
              <p className="text-yellow-700">
                We're working on adding the complete recipe details. Check back soon or visit us in-store for the full recipe!
              </p>
            </div>
          )}

          {/* Close Button */}
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
            >
              Close Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}