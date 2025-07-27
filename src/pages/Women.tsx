import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import PageLayout from "@/components/shared/PageLayout";

interface Product {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  image_url: string;
  description: string;
  is_new: boolean;
  is_sale: boolean;
}

const Women = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWomenProducts();
  }, []);

  const fetchWomenProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('product_type', 'women')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching women products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white/70">Loading women's collection...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-red-600 bg-clip-text text-transparent">
              Women's Collection
            </h1>
            <p className="text-xl text-white/70">
              Elegant streetwear designed for the modern woman
            </p>
          </div>

          {products.length === 0 ? (
            <div className="max-w-md mx-auto text-center p-8 border border-white/10 rounded-lg bg-black/50">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-red-600" />
              <h4 className="text-2xl font-semibold mb-4 text-white">No Women's Products</h4>
              <p className="text-white/70 mb-6">
                Check back soon for our women's collection!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 to-black border border-white/10 hover:border-red-600/50 transition-all duration-300 hover:scale-105">
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.is_new && (
                      <Badge className="absolute top-4 left-4 bg-red-600 text-white font-semibold">
                        NEW
                      </Badge>
                    )}
                    {product.is_sale && (
                      <Badge className="absolute top-4 right-4 bg-yellow-600 text-black font-semibold">
                        SALE
                      </Badge>
                    )}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-2 bg-black/50 rounded-full text-white hover:text-red-600 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-xl font-bold text-white group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        {product.is_sale && product.sale_price ? (
                          <>
                            <Badge className="bg-red-600 text-white text-lg px-3 py-1">
                              ${product.sale_price.toFixed(2)}
                            </Badge>
                            <span className="text-white/50 line-through text-sm">
                              ${product.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <Badge className="bg-red-600 text-white text-lg px-3 py-1">
                            ${product.price.toFixed(2)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-white/70 mb-4 text-sm line-clamp-2">
                      {product.description}
                    </p>
                    
                    <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white border-0">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Women;