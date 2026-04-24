"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Upload, Sparkles, X, ChevronLeft, CheckCircle2, Loader2, UtensilsCrossed, Leaf, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { Recipe } from '@/domain/recipe/Recipe';
import { RecipeCard } from '@/presentation/components/RecipeCard';
import { RecipeAIRepository } from '@/infrastructure/recipeAI/RecipeAIRepository';
import { RecipeRepository } from '@/infrastructure/recipe/RecipeRepository';
import { RecipeAIResult, IngredientScanResult } from '@/domain/recipeAI/RecipeAI';

const recipeAIRepo = new RecipeAIRepository();
const recipeRepo = new RecipeRepository();

type ScanState = 'IDLE' | 'SCANNING' | 'RESULTS' | 'NO_FOOD' | 'ERROR';
type ScanMode = 'FOOD' | 'INGREDIENTS';

export default function ScanPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const [state, setState] = useState<ScanState>('IDLE');
  const [mode, setMode] = useState<ScanMode | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [forceSearch, setForceSearch] = useState(false);
  const [scanResults, setScanResults] = useState<RecipeAIResult | IngredientScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[] | null>(null);
  const [currentIngredients, setCurrentIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');

  // Handle mounting and restoration
  useEffect(() => {
    const savedSession = sessionStorage.getItem('scan_session');
    if (savedSession) {
      try {
        const { state: s, mode: m, image: i, scanResults: r } = JSON.parse(savedSession);
        setState(s);
        setMode(m);
        setImage(i);
        setScanResults(r);
      } catch (e) {
        console.error('Failed to restore scan session', e);
      }
    }
    setIsMounted(true);
  }, []);

  // Persist entire session as a single object
  useEffect(() => {
    if (!isMounted) return;

    const session = {
      state,
      mode,
      image,
      scanResults,
    };
    sessionStorage.setItem('scan_session', JSON.stringify(session));
  }, [isMounted, state, mode, image, scanResults]);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-32 text-center px-6 bg-[#FDFBF7] dark:bg-[#0F0F0F]">
        <h2 className="text-4xl font-serif italic mb-4 text-luxury-text">Members Only</h2>
        <p className="text-luxury-text-muted max-w-md mb-8 font-light">
          Please sign in to access the AI Culinary Concierge and scan your ingredients.
        </p>
        <Link
          href="/login"
          className="px-8 py-3 bg-luxury-text text-white rounded-full hover:bg-luxury-text/90 transition-all duration-300"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setIsUploading(false);
        startScanning(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const startScanning = async (file: File) => {
    setState('SCANNING');
    setError(null);
    try {
      let results;
      if (mode === 'FOOD') {
        results = await recipeAIRepo.analyzeFoodImage(file, forceSearch);
        if (!(results as RecipeAIResult).isFood) {
          setState('NO_FOOD');
          return;
        }
      } else {
        results = await recipeAIRepo.analyzeIngredientImage(file);
        if (results && 'ingredients' in results) {
          setCurrentIngredients(results.ingredients);
        }
      }

      setScanResults(results);
      setState('RESULTS');
    } catch (error: any) {
      console.error('Scanning error:', error);
      setError(error.message || 'An unexpected error occurred.');

      if (error.isNoFood) {
        setState('NO_FOOD');
      } else {
        setState('ERROR');
      }
    }
  };
  const resetScan = () => {
    setImage(null);
    setState('IDLE');
    setMode(null);
    setForceSearch(false);
    setScanResults(null);
    setSelectedTagIds([]);
    setSelectedTagNames([]);
    setFilteredRecipes(null);
    setCurrentIngredients([]);
    setNewIngredient('');
    sessionStorage.removeItem('scan_session');
  };

  const refreshRecipes = async (ingredients: string[], tagIds: number[] | null) => {
    if (!tagIds || tagIds.length === 0) {
      setFilteredRecipes(null);
      return;
    }

    try {
      setIsFiltering(true);
      const recipes = await recipeRepo.getRecipesByIngredientsAndTag(ingredients, tagIds);
      setFilteredRecipes(recipes);
    } catch (err) {
      console.error('Error refreshing recipes:', err);
      setError('Failed to update recipes based on your ingredients.');
    } finally {
      setIsFiltering(false);
    }
  };

  const handleTagClick = async (tagId: number, tagName: string) => {
    let updatedIds: number[];
    let updatedNames: string[];

    if (selectedTagIds.includes(tagId)) {
      updatedIds = selectedTagIds.filter(id => id !== tagId);
      updatedNames = selectedTagNames.filter(name => name !== tagName);
    } else {
      updatedIds = [...selectedTagIds, tagId];
      updatedNames = [...selectedTagNames, tagName];
    }

    setSelectedTagIds(updatedIds);
    setSelectedTagNames(updatedNames);

    try {
      await refreshRecipes(currentIngredients, updatedIds);
    } catch (err) {
      console.error('Error filtering recipes by tag:', err);
      setError('Failed to fetch recipes for the selected theme.');
    }
  };

  const addIngredient = () => {
    const trimmed = newIngredient.trim();
    if (trimmed && !currentIngredients.includes(trimmed)) {
      const updated = [...currentIngredients, trimmed];
      setCurrentIngredients(updated);
      setNewIngredient('');
      if (selectedTagIds.length > 0) {
        refreshRecipes(updated, selectedTagIds);
      }
    }
  };

  const removeIngredient = (ingToRemove: string) => {
    const updated = currentIngredients.filter(ing => ing !== ingToRemove);
    setCurrentIngredients(updated);
    if (selectedTagIds.length > 0) {
      refreshRecipes(updated, selectedTagIds);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] dark:bg-[#0F0F0F] transition-colors duration-300 font-sans overflow-hidden">
      {/* Atmospheric Blobs - Match HomeView */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* --- HEADER --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-luxury-text hover:text-luxury-accent-start transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-luxury-accent-start font-bold text-[10px] uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>AI Culinary Concierge</span>
          </div>
        </div>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif italic text-luxury-text">
            Visual <span className="not-italic font-black text-luxury-accent-start uppercase tracking-tighter">Discovery</span>
          </h1>
          <p className="text-luxury-text-muted font-light text-lg max-w-xl mx-auto">
            {mode === 'FOOD' 
              ? "Identify any dish in the world and unlock its secret recipe." 
              : mode === 'INGREDIENTS' 
                ? "Turn your available ingredients into a gourmet masterpiece." 
                : "Upload a photo of your ingredients or a dish you love, and let our AI curate the perfect recipe for you."}
          </p>
        </div>

        {/* --- SCAN STUDIO CONTAINER --- */}
        <div className="relative w-full max-w-4xl mx-auto min-h-[500px]">
          {state === 'IDLE' && (
            <div className="relative w-full h-[500px]">
              {/* Mode Selection - Absolute to prevent layout shift */}
              <div className={`absolute inset-0 w-full ${mode === null ? 'block' : 'hidden'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                  {/* Food Mode Card */}
                  <button
                    onClick={() => setMode('FOOD')}
                    className="group relative p-12 rounded-[3rem] bg-white dark:bg-white/5 border-2 border-luxury-border hover:border-luxury-accent-start transition-all duration-300 text-center space-y-6 hover:shadow-2xl hover:shadow-luxury-accent-start/10 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <UtensilsCrossed className="w-32 h-32 text-luxury-accent-start" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center space-y-4">
                      <div className="w-20 h-20 bg-luxury-surface dark:bg-gray-800 rounded-full flex items-center justify-center text-luxury-accent-start shadow-inner group-hover:scale-110 transition-transform duration-300">
                        <UtensilsCrossed className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-serif font-bold text-luxury-text">Dish Discovery</h3>
                        <p className="text-sm text-luxury-text-muted font-light">Identify a finished dish and find its recipe</p>
                      </div>
                    </div>
                  </button>

                  {/* Ingredients Mode Card */}
                  <button
                    onClick={() => setMode('INGREDIENTS')}
                    className="group relative p-12 rounded-[3rem] bg-white dark:bg-white/5 border-2 border-luxury-border hover:border-luxury-accent-start transition-all duration-300 text-center space-y-6 hover:shadow-2xl hover:shadow-luxury-accent-start/10 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Leaf className="w-32 h-32 text-luxury-accent-start" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center space-y-4">
                      <div className="w-20 h-20 bg-luxury-surface dark:bg-gray-800 rounded-full flex items-center justify-center text-luxury-accent-start shadow-inner group-hover:scale-110 transition-transform duration-300">
                        <Leaf className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-serif font-bold text-luxury-text">Ingredient Insight</h3>
                        <p className="text-sm text-luxury-text-muted font-light">Scan your ingredients to get recipe ideas</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Upload Area - Absolute to prevent layout shift */}
              <div className={`absolute inset-0 w-full ${mode !== null ? 'block' : 'hidden'}`}>
                <div className="relative h-full">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative flex flex-col items-center justify-center w-full h-[500px] border-2 border-dashed border-luxury-border rounded-[3rem] bg-white/50 dark:bg-white/5 backdrop-blur-sm cursor-pointer hover:border-luxury-accent-start transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-luxury-accent-start/10 overflow-hidden"
                  >
                    <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
                      <div className="w-20 h-20 bg-luxury-surface dark:bg-gray-800 rounded-full flex items-center justify-center text-luxury-accent-start shadow-inner group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-serif text-luxury-text">
                          {mode === 'FOOD' ? 'Upload a photo of the dish' : 'Upload a photo of your ingredients'}
                        </p>
                        <p className="text-sm text-luxury-text-muted font-light">Supports JPG, PNG or WebP</p>
                      </div>

                      {mode === 'FOOD' && (
                        <div 
                          className="flex items-center gap-3 px-4 py-2 bg-luxury-surface/80 dark:bg-white/5 rounded-full border border-luxury-border transition-all duration-300 hover:border-luxury-accent-start/50 shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-text-muted">Force Search</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setForceSearch(!forceSearch);
                            }}
                            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
                              forceSearch ? 'bg-luxury-accent-start shadow-[0_0_10px_rgba(139,92,246,0.4)]' : 'bg-luxury-border dark:bg-gray-700'
                            }`}
                          >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
                              forceSearch ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>
                      )}

                      <span className="px-6 py-3 bg-luxury-gradient text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                        Select Image
                      </span>
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                    />
                  </div>
                  <button
                    onClick={() => setMode(null)}
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-widest text-luxury-text-muted hover:text-luxury-accent-start transition-colors flex items-center gap-2"
                  >
                    <X className="w-3 h-3" />
                    Change Mode
                  </button>
                </div>
              </div>
            </div>
          )}
          {state === 'SCANNING' && (
            <div className="relative w-full h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border border-luxury-border bg-black">
              {image && (
                <img
                  src={image}
                  alt="Scanning..."
                  className="w-full h-full object-cover opacity-60 grayscale"
                />
              )}

              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-1 bg-luxury-accent-start shadow-[0_0_20px_rgba(139,92,246,0.8)] animate-scan-line absolute left-0"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-luxury-accent-start/10 to-transparent opacity-50"></div>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-6">
                <Loader2 className="w-12 h-12 text-luxury-accent-start animate-spin" />
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-serif italic animate-pulse">
                    {mode === 'FOOD' ? 'Identifying Dish...' : 'Analyzing Ingredients...'}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">
                    {mode === 'FOOD' ? 'Consulting Global Cuisine Database' : 'Detecting Fresh Produce'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {state === 'RESULTS' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {mode === 'INGREDIENTS' ? (
                <div className="bg-white/70 dark:bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/40 dark:border-white/10 shadow-xl">
                  <div className="flex flex-col md:flex-row gap-12 items-center">
                    {image && (
                      <div className="relative shrink-0">
                        <img 
                          src={image} 
                          alt="Uploaded ingredients" 
                          className="w-64 h-64 object-cover rounded-3xl border-4 border-white dark:border-luxury-surface shadow-2xl"
                        />
                        <div className="absolute -top-3 -right-3 bg-luxury-accent-start text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-luxury-surface">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="w-5 h-5 text-luxury-accent-start" />
                        <h3 className="text-xl font-serif font-bold text-luxury-text">Detected Ingredients</h3>
                      </div>
                      <div className="flex flex-wrap gap-3 mb-6">
                        {currentIngredients.map((ing, idx) => (
                          <div
                            key={idx}
                            className="group flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-luxury-border rounded-full text-xs font-bold text-luxury-text dark:text-white animate-in zoom-in duration-300 shadow-sm hover:border-luxury-accent-start transition-all"
                            style={{ animationDelay: `${idx * 100}ms` }}
                          >
                            <CheckCircle2 className="w-3 h-3 text-luxury-accent-start" />
                            {ing}
                            <button
                              onClick={() => removeIngredient(ing)}
                              className="ml-1 p-0.5 rounded-full bg-luxury-text/10 text-luxury-text hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="relative mb-8 group">
                        <input
                          type="text"
                          value={newIngredient}
                          onChange={(e) => setNewIngredient(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
                          placeholder="Add an ingredient..."
                          className="w-full px-5 py-3 bg-transparent border-b border-luxury-border focus:border-luxury-accent-start outline-none text-sm font-light text-luxury-text dark:text-white transition-all placeholder:text-luxury-text-muted/50"
                        />
                        <button
                          onClick={addIngredient}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-luxury-accent-start text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                        >
                          Add
                        </button>
                      </div>

                      {(scanResults as IngredientScanResult)?.tags && (scanResults as IngredientScanResult).tags.length > 0 && (
                        <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-700" style={{ animationDelay: '400ms' }}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-text-muted">Culinary Profiles</span>
                              <div className="h-px w-8 bg-luxury-border/50" />
                            </div>
                            {selectedTagIds.length > 0 && (
                              <button 
                                onClick={() => {
                                  setSelectedTagIds([]);
                                  setSelectedTagNames([]);
                                  setFilteredRecipes(null);
                                }}
                                className="text-[10px] font-bold uppercase tracking-widest text-luxury-text-muted hover:text-luxury-accent-start transition-colors flex items-center gap-1"
                              >
                                <X className="w-2 h-2" /> Clear All
                              </button>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(scanResults as IngredientScanResult).tags.map((tag, idx) => (
                              <button
                                key={tag.id}
                                onClick={() => handleTagClick(tag.id, tag.name)}
                                className={`text-[11px] font-serif italic px-3 py-1 rounded-full border transition-all duration-300 animate-in zoom-in ${
                                  selectedTagIds.includes(tag.id)
                                    ? 'bg-luxury-accent-start text-white border-luxury-accent-start shadow-md scale-105'
                                    : 'text-luxury-accent-start bg-luxury-accent-start/10 border-luxury-accent-start/20 hover:bg-luxury-accent-start/20'
                                }`}
                                style={{ animationDelay: `${500 + (idx * 100)}ms` }}
                              >
                                {tag.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/70 dark:bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/40 dark:border-white/10 shadow-xl text-center">
                  <div className="flex flex-col items-center justify-center gap-8">
                    {image && (
                      <div className="relative">
                        <div className="w-72 h-72 p-2 bg-luxury-gradient rounded-[3rem] shadow-2xl">
                          <img 
                            src={image} 
                            alt="Uploaded dish" 
                            className="w-full h-full object-cover rounded-[2.5rem] border-4 border-white dark:border-luxury-surface"
                          />
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-luxury-accent-start text-white p-2 rounded-full shadow-lg border-4 border-white dark:border-luxury-surface">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      </div>
                    )}
                    <div className="space-y-8">
                      <div className="flex items-center justify-center gap-3">
                        <Sparkles className="w-5 h-5 text-luxury-accent-start" />
                        <h3 className="text-xl font-serif font-bold text-luxury-text">Dish Identified</h3>
                      </div>
                      <div className="flex flex-wrap justify-center gap-4 px-4">
                        {(scanResults as RecipeAIResult)?.predictedNames?.map((name, idx) => (
                          <div
                            key={idx}
                            className="group relative animate-in fade-in zoom-in duration-500 fill-mode-both"
                            style={{ animationDelay: `${idx * 100}ms` }}
                          >
                            <div className="px-6 py-3 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-full shadow-sm group-hover:shadow-luxury-accent-start/20 group-hover:border-luxury-accent-start/50 transition-all duration-300 group-hover:-translate-y-1 cursor-default">
                              <p className="text-3xl font-serif italic text-luxury-accent-start text-center tracking-wide">
                                {name}
                              </p>
                            </div>
                            <div className="absolute -inset-1 bg-luxury-accent-start/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        ))}
                        {! (scanResults as RecipeAIResult)?.predictedNames?.length && (
                          <p className="text-4xl font-serif italic text-luxury-accent-start text-center">Unknown Dish</p>
                        )}
                      </div>
                      <p className="text-sm text-luxury-text-muted font-light text-center">We've found the perfect match for this culinary creation.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-3xl font-serif font-bold text-luxury-text">
                      {mode === 'FOOD' ? 'The Secret Recipe' : 'Curated Matches'}
                    </h3>
                    {selectedTagIds.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-500">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-text-muted">Filtering by:</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedTagNames.map((name, idx) => (
                            <span key={idx} className="text-xs font-serif italic text-luxury-accent-start bg-luxury-accent-start/10 px-2 py-0.5 rounded-full border border-luxury-accent-start/20">
                              {name}
                            </span>
                          ))}
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedTagIds([]);
                            setSelectedTagNames([]);
                            setFilteredRecipes(null);
                          }}
                          className="text-[10px] font-bold uppercase tracking-widest text-luxury-text-muted hover:text-luxury-accent-start transition-colors flex items-center gap-1 ml-2"
                        >
                          <X className="w-2 h-2" /> Clear All
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={resetScan}
                    className="text-xs font-bold uppercase tracking-widest text-luxury-text-muted hover:text-luxury-accent-start transition-colors flex items-center gap-2"
                  >
                    <X className="w-3 h-3" />
                    Start Over
                  </button>
                </div>
                <div className="flex flex-col gap-6">
                  {isFiltering ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                      <Loader2 className="w-8 h-8 text-luxury-accent-start animate-spin" />
                      <p className="text-sm font-serif italic text-luxury-text-muted">Curating recipes for your theme...</p>
                    </div>
                  ) : (
                    <>
                      {(filteredRecipes || scanResults?.recipes) && (filteredRecipes || scanResults?.recipes).length > 0 ? (
                        (filteredRecipes || scanResults?.recipes).map((recipe, index) => (
                          <div
                            key={recipe.recipeId}
                            className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                            style={{ animationDelay: `${index * 150}ms` }}
                          >
                            <RecipeCard recipe={recipe} variant="horizontal" />
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center py-20 space-y-6">
                          <div className="w-20 h-20 bg-luxury-surface dark:bg-gray-800 rounded-full flex items-center justify-center text-luxury-text-muted opacity-50">
                            {mode === 'INGREDIENTS' ? <Leaf className="w-10 h-10" /> : <UtensilsCrossed className="w-10 h-10" />}
                          </div>
                          <div className="space-y-2">
                            <p className="text-xl font-serif italic text-luxury-text">
                              {mode === 'INGREDIENTS' ? 'No Gourmet Match Found' : 'No Perfect Match Found'}
                            </p>
                            <p className="text-sm text-luxury-text-muted font-light max-w-xs mx-auto">
                              {mode === 'INGREDIENTS' 
                                ? 'We couldn\'t find a recipe that perfectly matches these ingredients. Try adding more or changing the photo!' 
                                : 'Our curators are still searching for the ideal recipe. Try a different angle or lighting!'}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          {state === 'NO_FOOD' && (
            <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-luxury-surface dark:bg-gray-800 rounded-full flex items-center justify-center text-luxury-text-muted shadow-inner">
                <UtensilsCrossed className="w-10 h-10 opacity-50" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-serif italic text-luxury-text">No Culinary Match Found</h3>
                <p className="text-luxury-text-muted font-light max-w-md mx-auto">
                  {error || "Our AI couldn't identify any food or ingredients in this image. Please ensure the photo is clear and well-lit."}
                </p>
              </div>
              <button
                onClick={resetScan}
                className="px-8 py-3 bg-luxury-gradient text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
              >
                Try Again
              </button>
            </div>
          )}
          {state === 'ERROR' && (
            <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 shadow-inner">
                <AlertCircle className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-serif italic text-luxury-text">Culinary Interruption</h3>
                <p className="text-luxury-text-muted font-light max-w-md mx-auto">
                  {error || "Our AI concierge is currently experiencing high demand. Please allow a moment and try again."}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (image) {
                      // Convert image back to file to retry
                      fetch(image)
                        .then(res => res.blob())
                        .then(blob => {
                          const file = new File([blob], "retry-image.jpg", { type: "image/jpeg" });
                          startScanning(file);
                        });
                    } else {
                      resetScan();
                    }
                  }}
                  className="px-8 py-3 bg-luxury-gradient text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <RefreshCw className="w-3 h-3" />
                  Try Again
                </button>
                <button
                  onClick={resetScan}
                  className="px-8 py-3 bg-white dark:bg-white/5 border border-luxury-border text-luxury-text rounded-full text-xs font-bold uppercase tracking-widest hover:bg-luxury-surface transition-all"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        @keyframes scan-line {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
