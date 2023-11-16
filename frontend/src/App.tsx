import { FormEvent, useRef, useState, useEffect } from "react";
import "./App.css";
import { searchRecipes, getFavouriteRecipes } from "./API";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";
import { AiOutlineSearch } from "react-icons/ai";

type Tabs = "search" | "favorites";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
    undefined
  );
  const [selectedTab, setSelectedTab] = useState<Tabs>("search");
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);

  const pageNumber = useRef(1);

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        const { results } = await getFavouriteRecipes();
        setFavoriteRecipes(results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavoriteRecipes();
  }, []);

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const { results } = await searchRecipes(searchTerm, 1);
      setRecipes(results);
      pageNumber.current = 1;
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewMoreClick = async () => {
    const nextPage = pageNumber.current + 1;
    try {
      const nextRecipes = await searchRecipes(searchTerm, nextPage);
      setRecipes((prevRecipes) => [...prevRecipes, ...nextRecipes.results]);
      pageNumber.current = nextPage;
    } catch (error) {
      console.error(error);
    }
  };

  const addFavouriteRecipe = async (recipe: Recipe) => {
    try {
      await addFavouriteRecipe(recipe);
      setFavoriteRecipes([...favoriteRecipes, recipe]);
    } catch (error) {
      console.error(error);
    }
  };

  const removeFavouriteRecipe = async (recipe: Recipe) => {
    try {
      await removeFavouriteRecipe(recipe);
      const updatedRecipes = favoriteRecipes.filter(
        (favRecipe) => favRecipe.id !== recipe.id
      );
      setFavoriteRecipes(updatedRecipes);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <img src="/hero-image.jpg" />
        <div className="title">My Recipe App</div>
      </div>

      <div className="tabs">
        <h1
          className={selectedTab === "search" ? "tab-active" : ""}
          onClick={() => setSelectedTab("search")}
        >
          Recipe Search
        </h1>
        <h1
          className={selectedTab === "favorites" ? "tab-active" : ""}
          onClick={() => setSelectedTab("favorites")}
        >
          Favourites
        </h1>
      </div>

      {selectedTab === "search" && (
        <>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              required
              placeholder="Enter a search term"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="submit">
              <AiOutlineSearch size={40} />
            </button>
          </form>

          <div className="recipe-grid">
            {recipes.map((recipe) => {
              const isFavourite = favoriteRecipes.some(
                (favRecipe) => favRecipe.id === recipe.id
              );

              return (
                <RecipeCard
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  onFavouriteButtonClick={
                    isFavourite ? removeFavouriteRecipe : addFavouriteRecipe
                  }
                  isFavourite={isFavourite}
                />
              );
            })}
          </div>
          <button className="view-more" onClick={handleViewMoreClick}>
            View More
          </button>
        </>
      )}

      {selectedTab === "favorites" && (
        <div className="recipe-grid">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onFavouriteButtonClick={removeFavouriteRecipe}
              isFavourite={true}
            />
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeModal
          recipeId={selectedRecipe.id.toString()}
          onClose={() => setSelectedRecipe(undefined)}
        />
      )}
    </div>
  );
};

export default App;
