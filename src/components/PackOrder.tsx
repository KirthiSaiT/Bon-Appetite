/* Size picker + Add to Cart for a pasta pack (50 g, 100 g, 200 g).
 * Prices: fill PACK_PRICES below (rupees). A size with no price yet can be picked but not added,
 * so no order can be placed at a made-up price. */
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const PACK_SIZES = [50, 100, 200] as const;
type Size = (typeof PACK_SIZES)[number];

export const PACK_PRICES: Record<Size, number | null> = {
  50: null,
  100: null,
  200: null,
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600";

const PackOrder = ({ id, name, image }: { id: string; name: string; image: string }) => {
  const { addToCart } = useCart();
  const [size, setSize] = useState<Size>(100);
  const price = PACK_PRICES[size];

  return (
    <div className="mt-4">
      <div role="radiogroup" aria-label={`${name} pack size`} className="flex gap-2">
        {PACK_SIZES.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={size === s}
            onClick={() => setSize(s)}
            className={`min-w-0 flex-1 rounded-full border px-3 py-2 text-sm font-semibold transition-colors active:translate-y-px ${focusRing} ${
              size === s
                ? "border-orange-600 bg-orange-600 text-white"
                : "border-stone-300 bg-white text-stone-700 hover:border-orange-600"
            }`}
          >
            {s} g
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-lg font-semibold text-stone-900">{price !== null ? `₹${price}` : "Price coming soon"}</span>
        <button
          type="button"
          disabled={price === null}
          onClick={() => {
            if (price === null) return;
            addToCart({ id: `pack-${id}-${size}`, name: `${name} pasta (${size} g)`, price, image });
            toast.success(`${name} ${size} g added to your cart`);
          }}
          className={`inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700 active:translate-y-px disabled:cursor-not-allowed disabled:bg-stone-300 ${focusRing}`}
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default PackOrder;
