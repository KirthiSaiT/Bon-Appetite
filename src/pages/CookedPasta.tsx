import Navigation from "@/components/Navigation";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SimpleFooter } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

const CookedPasta = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const parsePrice = (priceString: string) => {
    const numericPart = priceString.match(/[\d.]+/);
    return numericPart ? parseFloat(numericPart[0]) : 0;
  };

  const [comboType, setComboType] = useState<'standard' | 'ravioli'>('standard');
  const [selectedPasta, setSelectedPasta] = useState('Fettuccine');
  const [selectedRavioli, setSelectedRavioli] = useState('Ricotta Spinach');
  const [selectedVariant, setSelectedVariant] = useState('Plain');
  const [selectedSauce, setSelectedSauce] = useState('Tomato Basil Sauce');
  const [extraSauce, setExtraSauce] = useState(false);
  const [extraCheese, setExtraCheese] = useState(false);

  const pastaOptions = [
    { name: 'Fettuccine', variants: ['Plain', 'Paprika', 'Spinach', 'Beetroot', 'Wheat'] },
    { name: 'Farfalle', variants: ['Plain', 'Paprika', 'Spinach', 'Beetroot', 'Wheat'] },
    { name: 'Spaghetti', variants: ['Plain', 'Paprika', 'Spinach', 'Beetroot', 'Wheat'] },
  ];
  const ravioliOptions = [
    { name: 'Ricotta Spinach', variants: ['Beetroot'] },
    { name: 'Corn Cheese', variants: ['Wheat'] },
    { name: 'Chicken Cheese', variants: [''] },
  ];
  const sauceOptions = ['Tomato Basil Sauce', 'Arrabbiata', 'Pesto'];

  const getComboPrice = () => {
    let price = comboType === 'standard' ? 250 : 300;
    if (extraSauce) price += 70;
    if (extraCheese) price += 50;
    return price;
  };

  const handleComboAddToCart = () => {
    const name = comboType === 'standard'
      ? `${selectedPasta} (${selectedVariant}) with ${selectedSauce} Sauce [Standard Combo]`
      : `Ravioli - ${selectedRavioli} (${selectedVariant}) with ${selectedSauce} Sauce [Ravioli Combo]`;
    const extras = [
      extraSauce ? 'Extra Sauce' : null,
      extraCheese ? 'Extra Cheese' : null,
    ].filter(Boolean).join(', ');
    addToCart({
      id: `combo-${comboType}-${selectedPasta || selectedRavioli}-${selectedVariant}-${selectedSauce}`,
      name: extras ? `${name} + ${extras}` : name,
      price: getComboPrice(),
      image: '/lovable-uploads-optimized/cooked pasta.webp',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-orange-600 hover:text-orange-700 mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Products
          </button>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Our <span className="text-orange-600">Cooked Pasta</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Delicious pasta dishes, cooked to perfection. Pre-order 1-2 days in advance, 2-hour shelf life.
            </p>
          </div>

          {/* Ready to Eat Combo Section - Sleek Modern UI */}
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-full max-w-xl bg-white/90 rounded-3xl shadow-2xl p-8 border border-orange-100">
              <h2 className="text-3xl font-extrabold text-orange-700 mb-6 text-center tracking-tight">Ready to Eat Combos</h2>

              {/* Step 1: Combo Type */}
              <div className="mb-6">
                <div className="flex justify-center gap-4">
                  <button
                    className={`flex-1 px-4 py-2 rounded-full font-semibold border transition-all duration-200 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${comboType === 'standard' ? 'bg-orange-600 text-white border-orange-600 scale-105' : 'bg-white text-orange-600 border-orange-300 hover:bg-orange-50'}`}
                    onClick={() => {
                      setComboType('standard');
                      setSelectedPasta('Fettuccine');
                      setSelectedVariant(pastaOptions.find(p => p.name === 'Fettuccine')?.variants[0] || '');
                    }}
                  >
                    Standard Combo
                  </button>
                  <button
                    className={`flex-1 px-4 py-2 rounded-full font-semibold border transition-all duration-200 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${comboType === 'ravioli' ? 'bg-orange-600 text-white border-orange-600 scale-105' : 'bg-white text-orange-600 border-orange-300 hover:bg-orange-50'}`}
                    onClick={() => {
                      setComboType('ravioli');
                      setSelectedRavioli('Ricotta Spinach');
                      setSelectedVariant(ravioliOptions.find(r => r.name === 'Ricotta Spinach')?.variants[0] || '');
                    }}
                  >
                    Ravioli Combo
                  </button>
                </div>
                </div>
                
              {/* Step 2: Pasta/Ravioli & Variant */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comboType === 'standard' ? (
                    <>
                      <div>
                        <label htmlFor="combo-pasta" className="text-xs text-orange-700 font-semibold mb-1 block">Step 1: Choose Pasta</label>
                        <select
                          id="combo-pasta"
                          className="w-full border border-orange-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                          value={selectedPasta}
                          onChange={e => {
                            setSelectedPasta(e.target.value);
                            setSelectedVariant(pastaOptions.find(p => p.name === e.target.value)?.variants[0] || '');
                          }}
                        >
                          {pastaOptions.map(pasta => (
                            <option key={pasta.name} value={pasta.name}>{pasta.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="combo-pasta-variant" className="text-xs text-orange-700 font-semibold mb-1 block">Step 2: Variant</label>
                        <select
                          id="combo-pasta-variant"
                          className="w-full border border-orange-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                          value={selectedVariant}
                          onChange={e => setSelectedVariant(e.target.value)}
                        >
                          {(pastaOptions.find(p => p.name === selectedPasta)?.variants || []).map(variant => (
                            <option key={variant} value={variant}>{variant}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label htmlFor="combo-ravioli" className="text-xs text-orange-700 font-semibold mb-1 block">Step 1: Choose Ravioli</label>
                        <select
                          id="combo-ravioli"
                          className="w-full border border-orange-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                          value={selectedRavioli}
                          onChange={e => {
                            setSelectedRavioli(e.target.value);
                            setSelectedVariant(ravioliOptions.find(r => r.name === e.target.value)?.variants[0] || '');
                          }}
                        >
                          {ravioliOptions.map(ravioli => (
                            <option key={ravioli.name} value={ravioli.name}>{ravioli.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="combo-ravioli-variant" className="text-xs text-orange-700 font-semibold mb-1 block">Step 2: Variant</label>
                        <select
                          id="combo-ravioli-variant"
                          className="w-full border border-orange-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                          value={selectedVariant}
                          onChange={e => setSelectedVariant(e.target.value)}
                        >
                          {(ravioliOptions.find(r => r.name === selectedRavioli)?.variants.filter(Boolean) || ['']).map(variant => (
                            <option key={variant} value={variant}>{variant || 'Original'}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Step 3: Sauce */}
              <div className="mb-6">
                <label htmlFor="combo-sauce" className="text-xs text-orange-700 font-semibold mb-1 block">Step 3: Choose Sauce</label>
                <select
                  id="combo-sauce"
                  className="w-full border border-orange-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                  value={selectedSauce}
                  onChange={e => setSelectedSauce(e.target.value)}
                >
                  {sauceOptions.map(sauce => (
                    <option key={sauce} value={sauce}>{sauce}</option>
                  ))}
                </select>
              </div>

              {/* Step 4: Extras */}
              <div className="mb-6">
                <div className="text-xs text-orange-700 font-semibold mb-2">Step 4: Add Extras</div>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-400"
                      checked={extraSauce}
                      onChange={e => setExtraSauce(e.target.checked)}
                    />
                    <span className="ml-2 text-gray-700">Extra Sauce <span className="text-xs text-orange-500">(+₹70)</span></span>
                  </label>
                  <label className="flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-400"
                      checked={extraCheese}
                      onChange={e => setExtraCheese(e.target.checked)}
                    />
                    <span className="ml-2 text-gray-700">Extra Cheese <span className="text-xs text-orange-500">(+₹50)</span></span>
                  </label>
                    </div>
                  </div>
                  
              {/* Step 5: Summary & Add to Cart */}
              <div className="bg-orange-50 rounded-2xl p-4 mb-4 shadow-inner">
                <div className="flex flex-col gap-1 text-sm text-gray-700">
                  <div><span className="font-semibold text-orange-700">Combo:</span> {comboType === 'standard' ? 'Standard' : 'Ravioli'}</div>
                  <div>
                    <span className="font-semibold text-orange-700">{comboType === 'standard' ? 'Pasta' : 'Ravioli'}:</span> {comboType === 'standard' ? selectedPasta : selectedRavioli} ({selectedVariant})
                  </div>
                  <div><span className="font-semibold text-orange-700">Sauce:</span> {selectedSauce}</div>
                  <div>
                    <span className="font-semibold text-orange-700">Extras:</span> {extraSauce || extraCheese ? [extraSauce ? 'Extra Sauce' : null, extraCheese ? 'Extra Cheese' : null].filter(Boolean).join(', ') : 'None'}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-bold text-orange-600">Total: ₹{getComboPrice()}</span>
                  <button
                    onClick={handleComboAddToCart}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add Combo to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <SimpleFooter />
    </div>
  );
};

export default CookedPasta; 