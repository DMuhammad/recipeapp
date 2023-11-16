import { Recipe } from "./types";

const searchRecipes = async (searchTerm: string, page: number) => {
  const baseURL = new URL("http://localhost:5000/api/recipe/search");
  baseURL.searchParams.append("searchTerm", searchTerm);
  baseURL.searchParams.append("page", page.toString());

  const response = await fetch(baseURL);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return response.json();
};

const getRecipeSummary = async (recipeId: string) => {
  const baseURL = new URL(
    `http://localhost:5000/api/recipe/${recipeId}/summary`
  );
  const response = await fetch(baseURL);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return response.json();
};

const getFavouriteRecipes = async () => {
  const baseURL = new URL("http://localhost:5000/api/recipe/favourite");
  const response = await fetch(baseURL);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return response.json();
};

const addFavouriteRecipe = async (recipe: Recipe) => {
  const baseURL = new URL("http://localhost:5000/api/recipe/favourite");
  const body = {
    recipeId: recipe.id,
  };

  const response = await fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
};

const removeFavouriteRecipe = async (recipe: Recipe) => {
  const baseURL = new URL("http://localhost:5000/api/recipe/favourite");
  const body = {
    recipeId: recipe.id,
  };

  const response = await fetch(baseURL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to remove favourite`);
  }
};

export {
  searchRecipes,
  getRecipeSummary,
  getFavouriteRecipes,
  addFavouriteRecipe,
  removeFavouriteRecipe,
};
