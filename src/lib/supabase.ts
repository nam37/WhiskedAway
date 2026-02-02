import { createClient } from '@supabase/supabase-js'

// For client-side usage, we need to ensure env vars are available
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

// More detailed error checking for debugging
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment check:', {
    PUBLIC_SUPABASE_URL: import.meta.env.PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY: import.meta.env.PUBLIC_SUPABASE_ANON_KEY ? '[REDACTED]' : undefined,
    allEnvKeys: Object.keys(import.meta.env)
  })
  throw new Error(`Missing Supabase environment variables. URL: ${!!supabaseUrl}, Key: ${!!supabaseAnonKey}`)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types based on database schema
export interface BakeryBake {
  id: string
  title: string
  description: string
  image_url: string
  display_order: number
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface BakeryRecipe {
  id: string
  title: string
  description: string
  full_recipe?: string
  ingredients?: string
  instructions?: string
  prep_time_minutes?: number
  cook_time_minutes?: number
  servings?: number
  difficulty_level: 'easy' | 'medium' | 'hard'
  category?: string
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface BakeryAbout {
  id: string
  content: string
  baker_name?: string
  baker_image_url?: string
  updated_at: string
  updated_by?: string
}

export interface BakerySettings {
  id: string
  setting_key: string
  setting_value?: string
  description?: string
  updated_at: string
  updated_by?: string
}

// API methods for bakery operations
export const bakeryAPI = {
  // Bakes operations
  async getBakes() {
    const { data, error } = await supabase
      .from('bakery_bakes')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data as BakeryBake[]
  },

  async getFeaturedBakes() {
    const { data, error } = await supabase
      .from('bakery_bakes')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data as BakeryBake[]
  },

  async createBake(bake: Omit<BakeryBake, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('bakery_bakes')
      .insert([bake])
      .select()
      .single()
    
    if (error) throw error
    return data as BakeryBake
  },

  async updateBake(id: string, updates: Partial<BakeryBake>) {
    const { data, error } = await supabase
      .from('bakery_bakes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as BakeryBake
  },

  async deleteBake(id: string) {
    const { error } = await supabase
      .from('bakery_bakes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Recipes operations
  async getRecipes() {
    const { data, error } = await supabase
      .from('bakery_recipes')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
    
    // Debug: Log what we get from the database
    console.log('Retrieved recipes:', data)
    
    if (error) throw error
    return data as BakeryRecipe[]
  },

  async getFeaturedRecipes() {
    const { data, error } = await supabase
      .from('bakery_recipes')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as BakeryRecipe[]
  },

  async createRecipe(recipe: Omit<BakeryRecipe, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('bakery_recipes')
      .insert([recipe])
      .select()
      .single()
    
    if (error) throw error
    return data as BakeryRecipe
  },

  async updateRecipe(id: string, updates: Partial<BakeryRecipe>) {
    const { data, error } = await supabase
      .from('bakery_recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as BakeryRecipe
  },

  async deleteRecipe(id: string) {
    const { error } = await supabase
      .from('bakery_recipes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // About operations
  async getAboutContent() {
    const { data, error } = await supabase
      .from('bakery_about')
      .select('*')
      .limit(1)
      .single()
    
    // Debug: Log what we get from the database
    console.log('Retrieved about content:', data)
    
    if (error) throw error
    return data as BakeryAbout
  },

  async updateAboutContent(updates: Partial<BakeryAbout>) {
    // Get existing record first
    const { data: existing } = await supabase
      .from('bakery_about')
      .select('id')
      .limit(1)
      .single()

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('bakery_about')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single()
      
      if (error) throw error
      return data as BakeryAbout
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('bakery_about')
        .insert([updates])
        .select()
        .single()
      
      if (error) throw error
      return data as BakeryAbout
    }
  },

  // Settings operations
  async getSettings() {
    const { data, error } = await supabase
      .from('bakery_settings')
      .select('*')
      .order('setting_key', { ascending: true })
    
    if (error) throw error
    return data as BakerySettings[]
  },

  async getSetting(key: string) {
    const { data, error } = await supabase
      .from('bakery_settings')
      .select('*')
      .eq('setting_key', key)
      .single()
    
    if (error) throw error
    return data as BakerySettings
  },

  async setSetting(key: string, value: string, description?: string) {
    const { data, error } = await supabase
      .from('bakery_settings')
      .upsert({
        setting_key: key,
        setting_value: value,
        description
      })
      .select()
      .single()
    
    if (error) throw error
    return data as BakerySettings
  }
}