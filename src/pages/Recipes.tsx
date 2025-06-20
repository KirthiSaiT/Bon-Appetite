import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star } from "lucide-react";
import { SimpleFooter } from "@/components/Footer";

const Recipes = () => {
  const recipes = [
    {
      id: 1,
      title: "Creamy Chicken Alfredo",
      description: "Rich and creamy pasta dish with tender chicken and fresh herbs",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d130?w=400&h=300&fit=crop",
      cookTime: "25 mins",
      servings: 4,
      rating: 4.8,
      difficulty: "Medium",
      ingredients: [
        "400g fettuccine pasta",
        "500g chicken breast",
        "200ml heavy cream",
        "100g parmesan cheese",
        "3 cloves garlic",
        "Fresh parsley"
      ]
    },
    {
      id: 2,
      title: "Mediterranean Quinoa Bowl",
      description: "Healthy and nutritious bowl packed with fresh vegetables and quinoa",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      cookTime: "20 mins",
      servings: 2,
      rating: 4.6,
      difficulty: "Easy",
      ingredients: [
        "200g quinoa",
        "Cherry tomatoes",
        "Cucumber",
        "Red onion",
        "Feta cheese",
        "Olive oil",
        "Lemon juice"
      ]
    },
    {
      id: 3,
      title: "Spicy Thai Green Curry",
      description: "Authentic Thai curry with coconut milk and fresh vegetables",
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
      cookTime: "30 mins",
      servings: 4,
      rating: 4.9,
      difficulty: "Hard",
      ingredients: [
        "Green curry paste",
        "Coconut milk",
        "Chicken thighs",
        "Thai basil",
        "Bell peppers",
        "Eggplant",
        "Fish sauce"
      ]
    },
    {
      id: 4,
      title: "Classic Beef Burger",
      description: "Juicy beef patty with fresh toppings and homemade sauce",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      cookTime: "15 mins",
      servings: 2,
      rating: 4.7,
      difficulty: "Easy",
      ingredients: [
        "500g ground beef",
        "Burger buns",
        "Lettuce",
        "Tomato",
        "Onion",
        "Cheese slices",
        "Special sauce"
      ]
    },
    {
      id: 5,
      title: "Vegetable Stir Fry",
      description: "Quick and healthy mix of fresh seasonal vegetables",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      cookTime: "12 mins",
      servings: 3,
      rating: 4.5,
      difficulty: "Easy",
      ingredients: [
        "Mixed vegetables",
        "Soy sauce",
        "Garlic",
        "Ginger",
        "Sesame oil",
        "Green onions",
        "Sesame seeds"
      ]
    },
    {
      id: 6,
      title: "Chocolate Lava Cake",
      description: "Decadent chocolate dessert with molten center",
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop",
      cookTime: "18 mins",
      servings: 2,
      rating: 4.9,
      difficulty: "Medium",
      ingredients: [
        "Dark chocolate",
        "Butter",
        "Eggs",
        "Sugar",
        "Flour",
        "Vanilla extract",
        "Powdered sugar"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Our Signature Recipes</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the secrets behind our most popular dishes. Each recipe is crafted with love 
            and perfected by our expert chefs for you to enjoy at home.
          </p>
        </div>

        {/* Recipes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={recipe.image} 
                  alt={recipe.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{recipe.title}</CardTitle>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{recipe.rating}</span>
                  </div>
                </div>
                <CardDescription className="text-gray-600">
                  {recipe.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {recipe.cookTime}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {recipe.servings} servings
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {recipe.difficulty}
                  </span>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Key Ingredients:</h4>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.slice(0, 4).map((ingredient, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded"
                      >
                        {ingredient}
                      </span>
                    ))}
                    {recipe.ingredients.length > 4 && (
                      <span className="text-xs text-gray-500">
                        +{recipe.ingredients.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Recipe
                  </Button>
                  <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                    Order Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Want to Try These at Home?</h2>
          <p className="text-gray-600 mb-6">
            Get our complete recipe collection with step-by-step instructions and cooking tips
          </p>
          <Button className="bg-orange-600 hover:bg-orange-700 px-8 py-3">
            Get Recipe Book
          </Button>
        </div>
      </div>

      {/* Footer */}
      <SimpleFooter />
    </div>
  );
};

export default Recipes;
