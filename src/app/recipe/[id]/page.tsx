import RecipeDetailView from '@/presentation/components/RecipeDetailView';

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const recipeId = parseInt(resolvedParams.id);

  if (isNaN(recipeId)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 font-medium">Invalid Recipe ID</p>
      </div>
    );
  }

  return <RecipeDetailView recipeId={recipeId} />;
}
