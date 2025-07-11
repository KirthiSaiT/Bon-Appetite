import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

// This is a placeholder for the actual type.
// I will define this more robustly in the main Products.tsx file later.
type Subcategory = {
  name: string;
  description: string;
  image: string;
};

type Category = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  subcategories: Subcategory[];
};

type CategoryItemProps = {
  category: Category;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onOrderClick: (categoryTitle: string, subcategory: Subcategory) => void;
  onBookWorkshop: () => void;
  onCater: () => void;
};

const CategoryItem = ({ 
  category, 
  isExpanded, 
  onToggle, 
  onOrderClick,
  onBookWorkshop,
  onCater
}: CategoryItemProps) => {
  const navigate = useNavigate();

  // State for category image loading
  const [catImgLoaded, setCatImgLoaded] = useState(false);
  const [catImgError, setCatImgError] = useState(false);

  // Helper for subcategory image loading
  const [subImgLoaded, setSubImgLoaded] = useState<{ [key: number]: boolean }>({});
  const [subImgError, setSubImgError] = useState<{ [key: number]: boolean }>({});

  const handleSubImgLoad = (idx: number) => setSubImgLoaded((prev) => ({ ...prev, [idx]: true }));
  const handleSubImgError = (idx: number) => setSubImgError((prev) => ({ ...prev, [idx]: true }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => onToggle(category.id)}
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
            {/* Category image with placeholder */}
            {(!catImgLoaded || catImgError) && (
              <img 
                src="/placeholder.svg" 
                alt="placeholder" 
                className="w-12 h-12 object-cover rounded-full absolute" 
                style={{ position: 'absolute' }}
              />
            )}
            <img 
              src={category.image} 
              alt={category.title}
              className="w-12 h-12 object-cover rounded-full"
              style={{ opacity: catImgLoaded && !catImgError ? 1 : 0 }}
              onLoad={() => setCatImgLoaded(true)}
              onError={() => setCatImgError(true)}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{category.title}</h3>
            <p className="text-gray-600 text-sm">{category.subtitle}</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-gray-400" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-400" />
        )}
      </div>

      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-0 md:ml-20">
            {category.subcategories.map((subcategory, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-orange-100 mx-auto mb-3 flex items-center justify-center relative">
                    {/* Subcategory image with placeholder */}
                    {(!subImgLoaded[index] || subImgError[index]) && (
                      <img 
                        src="/placeholder.svg" 
                        alt="placeholder" 
                        className="w-12 h-12 object-cover rounded-full absolute" 
                        style={{ position: 'absolute' }}
                      />
                    )}
                    <img 
                      src={subcategory.image || category.image} 
                      alt={subcategory.name}
                      className="w-12 h-12 object-cover rounded-full"
                      style={{ opacity: subImgLoaded[index] && !subImgError[index] ? 1 : 0 }}
                      onLoad={() => handleSubImgLoad(index)}
                      onError={() => handleSubImgError(index)}
                    />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{subcategory.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{subcategory.description}</p>
                </div>
                {(() => {
                  const subcategoryName = subcategory.name;
                  if (category.title === 'Our Services') {
                    if (subcategoryName === 'Pasta Workshop') {
                      return (
                        <button
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-center"
                          onClick={onBookWorkshop}
                        >
                          Book
                        </button>
                      );
                    }
                    if (subcategoryName === 'Catering') {
                      return (
                        <button
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                          onClick={onCater}
                        >
                          Enquire Now
                        </button>
                      );
                    }
                  } else {
                    const pageUrl = `/${subcategoryName.toLowerCase().replace(/ /g, '-')}`;
                    return (
                      <button
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-center"
                        onClick={() => navigate(pageUrl)}
                      >
                        View Products
                      </button>
                    );
                  }
                  return null;
                })()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CategoryItem); 