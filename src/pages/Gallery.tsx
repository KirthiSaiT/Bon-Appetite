import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { SimpleFooter } from "@/components/Footer";
import { Search, Filter, Heart, Eye, ChefHat, Utensils, Coffee, Cookie, Camera, MapPin, Clock, Users, Award, Sparkles } from "lucide-react";

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedItems, setLikedItems] = useState(new Set());
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryItems = [
    {
      id: 1,
      title: "Our Professional Kitchen",
      image: "/lovable-uploads-optimized/bonapp.png",
      category: "Kitchen Space",
      description: "State-of-the-art commercial kitchen where all the magic happens. Equipped with modern appliances and designed for efficiency.",
      location: "Main Kitchen",
      date: "Established 2023",
      story: "This is where our culinary dreams come to life. Every dish is crafted with precision in our spotless, professional-grade kitchen.",
      tags: ["Professional", "Modern", "Spacious"]
    },
    {
      id: 2,
      title: "Fresh Ingredients Collection",
      image: "/lovable-uploads-optimized/b2b50198-3ee8-4357-b982-4b2765b951c7.png",
      category: "Ingredients",
      description: "We source the finest ingredients daily from local markets and trusted suppliers to ensure quality in every bite.",
      location: "Storage Area",
      date: "Daily Fresh",
      story: "Quality starts with ingredients. We handpick every vegetable, spice, and protein to maintain our high standards.",
      tags: ["Fresh", "Local", "Premium"]
    },
    {
      id: 3,
      title: "Signature Dish Creation",
      image: "/lovable-uploads-optimized/bonapp.png",
      category: "Cooking Process",
      description: "Behind the scenes of creating our most popular dishes. Watch our chefs pour their heart into every preparation.",
      location: "Cooking Station",
      date: "In Progress",
      story: "Each dish tells a story. From traditional family recipes to innovative fusion creations, we craft with passion.",
      tags: ["Signature", "Handcrafted", "Love"]
    },
    {
      id: 4,
      title: "Team in Action",
      image: "/lovable-uploads-optimized/b2b50198-3ee8-4357-b982-4b2765b951c7.png",
      category: "Our Team",
      description: "Meet our dedicated team of chefs and kitchen staff who work tirelessly to bring you exceptional food.",
      location: "Kitchen Floor",
      date: "Every Day",
      story: "Our team is our strength. Together, we create culinary experiences that touch hearts and satisfy souls.",
      tags: ["Teamwork", "Dedication", "Skilled"]
    },
    {
      id: 5,
      title: "Award-Winning Presentation",
      image: "/lovable-uploads-optimized/bonapp.png",
      category: "Achievements",
      description: "Our commitment to excellence has earned us recognition and awards from food critics and customers alike.",
      location: "Awards Corner",
      date: "2024 Winner",
      story: "Recognition motivates us to push boundaries and continue delivering exceptional culinary experiences.",
      tags: ["Award", "Excellence", "Recognition"]
    },
    {
      id: 6,
      title: "Special Event Catering",
      image: "/lovable-uploads-optimized/b2b50198-3ee8-4357-b982-4b2765b951c7.png",
      category: "Events",
      description: "Memorable moments from catering special events, bringing joy to celebrations across the city.",
      location: "Event Venue",
      date: "Recent Event",
      story: "Being part of your special moments is what drives us. Every event is a new opportunity to create memories.",
      tags: ["Events", "Celebration", "Memorable"]
    },
    {
      id: 7,
      title: "Customer Favorites Wall",
      image: "/lovable-uploads-optimized/bonapp.png",
      category: "Customer Love",
      description: "A collection of our most loved dishes as chosen by our loyal customers. These are the dishes that made us who we are.",
      location: "Display Area",
      date: "Hall of Fame",
      story: "These dishes have won hearts and created loyal customers. Each one represents a successful culinary journey.",
      tags: ["Popular", "Favorites", "Bestsellers"]
    },
    {
      id: 8,
      title: "Innovation Lab",
      image: "/lovable-uploads-optimized/b2b50198-3ee8-4357-b982-4b2765b951c7.png",
      category: "Innovation",
      description: "Our experimental kitchen where we develop new recipes and test innovative cooking techniques.",
      location: "R&D Kitchen",
      date: "Ongoing",
      story: "Innovation never stops. We constantly experiment with new flavors and techniques to surprise and delight.",
      tags: ["Innovation", "Experimental", "Future"]
    },
    {
      id: 9,
      title: "Packaging & Delivery Setup",
      image: "/lovable-uploads-optimized/bonapp.png",
      category: "Operations",
      description: "Our systematic packaging and delivery preparation area ensuring your food reaches you fresh and hot.",
      location: "Packaging Station",
      date: "Daily Operations",
      story: "The final step in our process - ensuring your food travels safely from our kitchen to your table.",
      tags: ["Packaging", "Delivery", "Fresh"]
    },
    {
      id: 10,
      title: "Community Engagement",
      image: "/lovable-uploads-optimized/b2b50198-3ee8-4357-b982-4b2765b951c7.png",
      category: "Community",
      description: "Giving back to the community through food donations and local partnerships.",
      location: "Community Center",
      date: "Monthly Drive",
      story: "Food brings people together. We believe in sharing our blessings with those who need it most.",
      tags: ["Community", "Giving", "Together"]
    }
  ];

  const categories = ["All", "Kitchen Space", "Ingredients", "Cooking Process", "Our Team", "Achievements", "Events", "Customer Love", "Innovation", "Operations", "Community"];

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Kitchen Space": return <ChefHat className="w-4 h-4" />;
      case "Ingredients": return <Sparkles className="w-4 h-4" />;
      case "Cooking Process": return <Utensils className="w-4 h-4" />;
      case "Our Team": return <Users className="w-4 h-4" />;
      case "Achievements": return <Award className="w-4 h-4" />;
      case "Events": return <Camera className="w-4 h-4" />;
      case "Customer Love": return <Heart className="w-4 h-4" />;
      case "Innovation": return <Coffee className="w-4 h-4" />;
      case "Operations": return <Clock className="w-4 h-4" />;
      case "Community": return <MapPin className="w-4 h-4" />;
      default: return <Camera className="w-4 h-4" />;
    }
  };

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.story.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleLike = (itemId) => {
    const newLikedItems = new Set(likedItems);
    if (newLikedItems.has(itemId)) {
      newLikedItems.delete(itemId);
    } else {
      newLikedItems.add(itemId);
    }
    setLikedItems(newLikedItems);
  };

  const openImageModal = (item) => {
    setSelectedImage(item);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-red-200/30 rounded-full blur-xl"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-md">
            <Camera className="w-5 h-5 text-orange-600" />
            <span className="text-gray-700 font-medium">Behind the Scenes</span>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Story</span> in Pictures
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Take a journey through our cloud kitchen - from the ingredients we carefully select to the moments we create together. 
            Every image tells a story of passion, dedication, and the love we put into every dish we serve.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 px-4 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search our story, moments, or memories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none bg-white/90 backdrop-blur-sm transition-all"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 max-w-4xl">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full font-medium transition-all duration-300 text-sm ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105"
                      : "bg-white/80 text-gray-600 hover:bg-orange-100 hover:text-orange-700 hover:shadow-md"
                  }`}
                >
                  {category !== "All" && getCategoryIcon(category)}
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No moments found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria to explore our story</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <Card key={item.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/95 backdrop-blur-sm border-0 shadow-lg h-full flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                      onClick={() => openImageModal(item)}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                    
                    {/* Quick Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-2 text-xs mb-1 opacity-90">
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{item.date}</span>
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(item.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                          likedItems.has(item.id)
                            ? "bg-red-500 text-white shadow-lg"
                            : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likedItems.has(item.id) ? "fill-current" : ""}`} />
                      </button>
                      <button
                        onClick={() => openImageModal(item)}
                        className="p-2 rounded-full bg-white/90 text-gray-600 hover:bg-white hover:text-orange-500 backdrop-blur-sm transition-all duration-300"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
                        {getCategoryIcon(item.category)}
                        <span className="text-xs font-medium text-gray-700">{item.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">{item.description}</p>
                    
                    {/* Story Preview */}
                    <div className="bg-orange-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-orange-800 italic line-clamp-2">"{item.story}"</p>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs px-2 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeImageModal}>
          <div className="relative max-w-6xl max-h-[95vh] bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="grid lg:grid-cols-2">
              <div className="aspect-square lg:aspect-auto">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 lg:p-12 overflow-y-auto max-h-[95vh]">
                <div className="flex items-center gap-2 mb-4">
                  {getCategoryIcon(selectedImage.category)}
                  <span className="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                    {selectedImage.category}
                  </span>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedImage.title}</h2>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedImage.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{selectedImage.date}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">{selectedImage.description}</p>
                
                {/* Story Section */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Our Story
                  </h3>
                  <p className="text-gray-700 italic leading-relaxed">"{selectedImage.story}"</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedImage.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
          </div>
          
                <div className="flex gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(selectedImage.id);
                    }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      likedItems.has(selectedImage.id)
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedItems.has(selectedImage.id) ? "fill-current" : ""}`} />
                    {likedItems.has(selectedImage.id) ? "Loved" : "Love This"}
                  </button>
                  
                  <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Experience Our Kitchen
                  </button>
            </div>
            </div>
            </div>
          </div>
        </div>
      )}

      <SimpleFooter />
    </div>
  );
};

export default Gallery; 