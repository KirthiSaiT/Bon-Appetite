import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, X, ChefHat, Flame, Timer, BookOpen } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { SimpleFooter } from '@/components/Footer';

const Recipes = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const recipes = [
    {
      id: 1,
      title: "Creamy Chicken Alfredo",
      description: "Rich and creamy pasta dish with tender chicken and fresh herbs",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d130?w=400&h=300&fit=crop",
      cookTime: "25 mins",
      prepTime: "10 mins",
      servings: 4,
      rating: 4.8,
      difficulty: "Medium",
      cuisine: "Italian",
      calories: 520,
      ingredients: [
        { item: "Fettuccine pasta", amount: "400g" },
        { item: "Chicken breast", amount: "500g" },
        { item: "Heavy cream", amount: "200ml" },
        { item: "Parmesan cheese", amount: "100g" },
        { item: "Garlic cloves", amount: "3" },
        { item: "Fresh parsley", amount: "2 tbsp" },
        { item: "Butter", amount: "2 tbsp" },
        { item: "Salt & pepper", amount: "To taste" }
      ],
      instructions: [
        "Cook fettuccine pasta according to package directions until al dente. Drain and set aside.",
        "Season chicken breast with salt and pepper. Cut into bite-sized pieces.",
        "Heat butter in a large skillet over medium-high heat. Add chicken and cook until golden brown and cooked through, about 6-8 minutes.",
        "Add minced garlic and cook for 1 minute until fragrant.",
        "Pour in heavy cream and bring to a gentle simmer. Let it reduce slightly for 3-4 minutes.",
        "Add grated Parmesan cheese and stir until melted and smooth.",
        "Toss the cooked pasta with the creamy sauce until well coated.",
        "Garnish with fresh parsley and serve immediately."
      ]
    },
    {
      id: 2,
      title: "Mediterranean Quinoa Bowl",
      description: "Healthy and nutritious bowl packed with fresh vegetables and quinoa",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      cookTime: "20 mins",
      prepTime: "15 mins",
      servings: 2,
      rating: 4.6,
      difficulty: "Easy",
      cuisine: "Mediterranean",
      calories: 385,
      ingredients: [
        { item: "Quinoa", amount: "200g" },
        { item: "Cherry tomatoes", amount: "200g" },
        { item: "Cucumber", amount: "1 large" },
        { item: "Red onion", amount: "1/2 medium" },
        { item: "Feta cheese", amount: "100g" },
        { item: "Extra virgin olive oil", amount: "3 tbsp" },
        { item: "Fresh lemon juice", amount: "2 tbsp" },
        { item: "Fresh herbs (mint, parsley)", amount: "1/4 cup" }
      ],
      instructions: [
        "Rinse quinoa under cold water until water runs clear.",
        "Cook quinoa in boiling salted water for 15 minutes until tender. Drain and let cool.",
        "Halve cherry tomatoes and dice cucumber into small cubes.",
        "Thinly slice red onion and crumble feta cheese.",
        "Whisk together olive oil, lemon juice, salt, and pepper for dressing.",
        "Combine cooled quinoa with vegetables and herbs in a large bowl.",
        "Drizzle with dressing and toss gently to combine.",
        "Top with crumbled feta and serve chilled or at room temperature."
      ]
    },
    {
      id: 3,
      title: "Spicy Thai Green Curry",
      description: "Authentic Thai curry with coconut milk and fresh vegetables",
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
      cookTime: "30 mins",
      prepTime: "20 mins",
      servings: 4,
      rating: 4.9,
      difficulty: "Hard",
      cuisine: "Thai",
      calories: 445,
      ingredients: [
        { item: "Green curry paste", amount: "3 tbsp" },
        { item: "Coconut milk", amount: "400ml" },
        { item: "Chicken thighs", amount: "500g" },
        { item: "Thai basil", amount: "1/2 cup" },
        { item: "Bell peppers", amount: "2 large" },
        { item: "Thai eggplant", amount: "200g" },
        { item: "Fish sauce", amount: "2 tbsp" },
        { item: "Palm sugar", amount: "1 tbsp" }
      ],
      instructions: [
        "Cut chicken thighs into bite-sized pieces and season with salt.",
        "Slice bell peppers and quarter the Thai eggplants.",
        "Heat 2 tbsp of thick coconut cream in a wok over medium heat.",
        "Add green curry paste and fry until fragrant, about 2-3 minutes.",
        "Add chicken pieces and cook until they change color.",
        "Pour in remaining coconut milk and bring to a gentle boil.",
        "Add vegetables and simmer for 10-15 minutes until tender.",
        "Season with fish sauce and palm sugar. Garnish with Thai basil leaves."
      ]
    },
    {
      id: 4,
      title: "Classic Beef Burger",
      description: "Juicy beef patty with fresh toppings and homemade sauce",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      cookTime: "15 mins",
      prepTime: "10 mins",
      servings: 2,
      rating: 4.7,
      difficulty: "Easy",
      cuisine: "American",
      calories: 620,
      ingredients: [
        { item: "Ground beef (80/20)", amount: "500g" },
        { item: "Burger buns", amount: "2" },
        { item: "Lettuce leaves", amount: "4" },
        { item: "Tomato", amount: "1 large" },
        { item: "Red onion", amount: "1/2 medium" },
        { item: "Cheese slices", amount: "2" },
        { item: "Mayonnaise", amount: "2 tbsp" },
        { item: "Ketchup", amount: "2 tbsp" }
      ],
      instructions: [
        "Divide ground beef into 2 equal portions and form into patties.",
        "Season both sides of patties with salt and pepper.",
        "Heat a grill pan or skillet over medium-high heat.",
        "Cook patties for 4-5 minutes per side for medium doneness.",
        "Add cheese slices in the last minute of cooking.",
        "Toast burger buns lightly on the grill.",
        "Assemble burgers with lettuce, tomato, onion, and sauces.",
        "Serve immediately with your favorite sides."
      ]
    },
    {
      id: 5,
      title: "Vegetable Stir Fry",
      description: "Quick and healthy mix of fresh seasonal vegetables",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      cookTime: "12 mins",
      prepTime: "8 mins",
      servings: 3,
      rating: 4.5,
      difficulty: "Easy",
      cuisine: "Asian",
      calories: 180,
      ingredients: [
        { item: "Mixed vegetables (broccoli, carrots, snap peas)", amount: "500g" },
        { item: "Soy sauce", amount: "3 tbsp" },
        { item: "Garlic", amount: "3 cloves" },
        { item: "Fresh ginger", amount: "1 inch piece" },
        { item: "Sesame oil", amount: "2 tbsp" },
        { item: "Green onions", amount: "2" },
        { item: "Sesame seeds", amount: "1 tbsp" },
        { item: "Vegetable oil", amount: "2 tbsp" }
      ],
      instructions: [
        "Prep all vegetables by cutting into uniform, bite-sized pieces.",
        "Mince garlic and ginger, slice green onions.",
        "Heat vegetable oil in a large wok or skillet over high heat.",
        "Add garlic and ginger, stir-fry for 30 seconds until fragrant.",
        "Add harder vegetables first (carrots, broccoli) and stir-fry for 2-3 minutes.",
        "Add remaining vegetables and continue cooking for 3-4 minutes.",
        "Pour in soy sauce and sesame oil, toss to combine.",
        "Garnish with green onions and sesame seeds before serving."
      ]
    },
    {
      id: 6,
      title: "Chocolate Lava Cake",
      description: "Decadent chocolate dessert with molten center",
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop",
      cookTime: "18 mins",
      prepTime: "15 mins",
      servings: 2,
      rating: 4.9,
      difficulty: "Medium",
      cuisine: "French",
      calories: 485,
      ingredients: [
        { item: "Dark chocolate (70%)", amount: "100g" },
        { item: "Unsalted butter", amount: "100g" },
        { item: "Large eggs", amount: "2" },
        { item: "Granulated sugar", amount: "50g" },
        { item: "All-purpose flour", amount: "30g" },
        { item: "Vanilla extract", amount: "1 tsp" },
        { item: "Powdered sugar", amount: "For dusting" },
        { item: "Butter for ramekins", amount: "Extra" }
      ],
      instructions: [
        "Preheat oven to 200°C (400°F). Butter two 6oz ramekins and dust with cocoa powder.",
        "Melt chocolate and butter together in a double boiler until smooth.",
        "In a separate bowl, whisk eggs and sugar until pale and thick.",
        "Gradually add the melted chocolate mixture to the egg mixture.",
        "Fold in flour and vanilla extract until just combined.",
        "Divide batter between prepared ramekins.",
        "Bake for 12-14 minutes until edges are firm but center jiggles slightly.",
        "Let cool for 1 minute, then run a knife around edges and invert onto plates."
      ]
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Hard': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const RecipeModal = ({ recipe, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="relative">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-56 object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
            title="Close recipe modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-2 py-0.5 rounded-full text-xs">
            {recipe.cuisine}
          </div>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-14rem)]">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1 font-display">{recipe.title}</h2>
              <p className="text-gray-600 text-base">{recipe.description}</p>
            </div>
            <div className="flex items-center bg-yellow-50 px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
              <span className="font-semibold text-yellow-700 text-sm">{recipe.rating}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="flex items-center justify-center bg-blue-50 p-2 rounded-lg">
              <Timer className="w-4 h-4 text-blue-600 mr-1" />
              <div>
                <div className="text-xs text-blue-600 font-medium">Prep</div>
                <div className="text-blue-800 font-semibold text-sm">{recipe.prepTime}</div>
              </div>
            </div>
            <div className="flex items-center justify-center bg-orange-50 p-2 rounded-lg">
              <Clock className="w-4 h-4 text-orange-600 mr-1" />
              <div>
                <div className="text-xs text-orange-600 font-medium">Cook</div>
                <div className="text-orange-800 font-semibold text-sm">{recipe.cookTime}</div>
              </div>
            </div>
            <div className="flex items-center justify-center bg-green-50 p-2 rounded-lg">
              <Users className="w-4 h-4 text-green-600 mr-1" />
              <div>
                <div className="text-xs text-green-600 font-medium">Serves</div>
                <div className="text-green-800 font-semibold text-sm">{recipe.servings}</div>
              </div>
            </div>
            <div className="flex items-center justify-center bg-purple-50 p-2 rounded-lg">
              <Flame className="w-4 h-4 text-purple-600 mr-1" />
              <div>
                <div className="text-xs text-purple-600 font-medium">Calories</div>
                <div className="text-purple-800 font-semibold text-sm">{recipe.calories}</div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-gray-600" />
                Ingredients
              </h3>
              <div className="space-y-1">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 text-sm">{ingredient.item}</span>
                    <span className="font-semibold text-gray-800 text-sm">{ingredient.amount}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                <ChefHat className="w-4 h-4 mr-2 text-gray-600" />
                Instructions
              </h3>
              <div className="space-y-2">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-1">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />
      <div className="max-w-7xl mx-auto px-8 md:px-14 xl:px-20 py-16">
        {/* Header */}
        <div className="mb-12">
          <span className="text-orange-600 text-[0.63rem] tracking-[0.25em] uppercase font-semibold mb-6 block">
            From Our Kitchen
          </span>
          <h1
            className="text-[2.8rem] md:text-[4rem] xl:text-[5rem] font-bold leading-[1.05] text-stone-900 mb-6 font-display"
          >
            Signature <span className="text-orange-600">Recipes.</span>
          </h1>
          <div className="w-10 h-px bg-orange-600 mb-6" />
          <p className="text-lg text-stone-600 max-w-2xl leading-relaxed">
            Culinary masterpieces crafted by our expert chefs — each recipe tells a story of
            passion, tradition, and innovation you can recreate in your own kitchen.
          </p>
          <p className="text-xs text-stone-400 mt-4">Photography shown is for serving suggestion.</p>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="group text-left flex flex-col bg-white border border-stone-200 hover:border-orange-300 transition-colors overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/95 text-stone-700 text-[0.6rem] font-semibold uppercase tracking-wider px-2.5 py-1">
                    {recipe.difficulty}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3
                  className="text-xl font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors leading-snug"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {recipe.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-5 flex-grow">
                  {recipe.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-stone-500 font-medium border-t border-stone-100 pt-4">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-orange-500" />{recipe.cookTime}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-orange-500" />{recipe.servings} servings</span>
                  <span className="ml-auto text-orange-600 font-semibold">{recipe.calories} cal</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <section className="py-20 px-8 md:px-14 bg-stone-50 border-t border-stone-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-stone-900 mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to start cooking?
          </h2>
          <p className="text-stone-600 mb-8 leading-relaxed max-w-xl mx-auto">
            Every recipe here is tested and perfected in our kitchen. Pair them with our handmade
            pasta for results worth sharing.
          </p>
          <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 rounded-none">
            <a href="/products">Shop the Pasta</a>
          </Button>
        </div>
      </section>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
      <SimpleFooter />
    </div>
  );
};

export default Recipes;