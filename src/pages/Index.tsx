import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Star, Heart, User, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock_quantity: number;
  categories?: { name: string };
}

const Index = () => {
  const { user, profile, signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<Array<{id: string, name: string, price: number, quantity: number}>>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          image_url,
          stock_quantity,
          categories (
            name
          )
        `)
        .eq('is_active', true)
        .limit(6);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1 
      }];
    });
    setCartCount(prev => prev + 1);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => {
      const item = prev.find(item => item.id === productId);
      if (item && item.quantity > 1) {
        setCartCount(prev => prev - 1);
        return prev.map(item => 
          item.id === productId 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      setCartCount(prev => prev - (item?.quantity || 0));
      return prev.filter(item => item.id !== productId);
    });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
              <img 
                src="/lovable-uploads/ce257a3a-e907-444a-b331-b2e3222d93a0.png" 
                alt="K&A Logo" 
                className="h-10 w-10 object-contain"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-red-600 bg-clip-text text-transparent tracking-wider">
                K<span className="text-red-600">&</span>A
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/new" className="text-white hover:text-red-600 transition-colors font-medium relative group">
                New
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/men" className="text-white hover:text-red-600 transition-colors font-medium relative group">
                Men
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/women" className="text-white hover:text-red-600 transition-colors font-medium relative group">
                Women
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/sale" className="text-white hover:text-red-600 transition-colors font-medium relative group">
                Sale
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-white/70 hidden sm:block">
                    {profile?.full_name || user.email}
                  </span>
                  {profile?.role === 'admin' && (
                    <Button asChild variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                      <Link to="/admin">
                        <Shield className="w-4 h-4 mr-2" />
                        Admin
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" onClick={signOut} size="sm" className="border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900">
                    <User className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button asChild className="bg-red-600 text-white hover:bg-red-700">
                  <Link to="/auth">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )}
              
              <Sheet>
                <SheetTrigger asChild>
                  <button className="relative p-2 text-white hover:text-red-600 transition-colors border border-white/20 rounded-full hover:border-red-600 hover:scale-110 transition-all duration-300">
                    <ShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-600 text-white">
                        {cartCount}
                      </Badge>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent className="bg-black text-white border-l border-white/10">
                  <SheetHeader>
                    <SheetTitle className="text-white">Shopping Cart</SheetTitle>
                    <SheetDescription className="text-white/70">
                      {cartItems.length === 0 ? 'Your cart is empty' : `${cartItems.length} item(s) in your cart`}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-white/30" />
                        <p className="text-white/70">Your cart is empty</p>
                      </div>
                    ) : (
                      <>
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                            <div>
                              <h4 className="font-medium text-white">{item.name}</h4>
                              <p className="text-white/70">${item.price.toFixed(2)} each</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => removeFromCart(item.id)}
                                className="border-red-500 text-red-500 bg-white hover:bg-red-100 hover:text-red-700 min-w-[32px]"
                              >
                                -
                              </Button>
                              <span className="text-white min-w-[20px] text-center">{item.quantity}</span>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => {
                                  const product = products.find(p => p.id === item.id);
                                  if (product) addToCart(product);
                                }}
                                className="border-red-500 text-red-500 bg-white hover:bg-red-100 hover:text-red-700 min-w-[32px]"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="border-t border-white/10 pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-medium text-white">Total:</span>
                            <span className="text-lg font-bold text-red-600">${getTotalPrice().toFixed(2)}</span>
                          </div>
                          <Button className="w-full bg-red-600 text-white hover:bg-red-700">
                            Checkout
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              
              <button
                className="md:hidden p-2 text-white hover:text-red-600 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              <Link to="/new" className="block text-white hover:text-red-600 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>New</Link>
              <Link to="/men" className="block text-white hover:text-red-600 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Men</Link>
              <Link to="/women" className="block text-white hover:text-red-600 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Women</Link>
              <Link to="/sale" className="block text-white hover:text-red-600 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Sale</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-16 min-h-screen bg-gradient-to-br from-black via-black to-red-900/20 relative overflow-hidden">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3e%3cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`,
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <div className="text-center">
            {/* Logo in Hero */}
            <div className="flex justify-center mb-8">
              <img 
                src="/lovable-uploads/ce257a3a-e907-444a-b331-b2e3222d93a0.png" 
                alt="K&A Logo" 
                className="h-32 w-32 object-contain animate-pulse"
                style={{filter: 'drop-shadow(0 0 20px rgba(255, 0, 0, 0.5))'}}
              />
            </div>
            
            <h2 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight animate-pulse">
              <span className="block bg-gradient-to-r from-white to-red-600 bg-clip-text text-transparent drop-shadow-2xl" style={{textShadow: '0 0 20px rgba(255, 0, 0, 0.5)'}}>
                Premium
              </span>
              <span className="block text-red-600 drop-shadow-2xl" style={{textShadow: '0 0 30px rgba(255, 0, 0, 0.8)'}}>
                Style
              </span>
              <span className="block text-white drop-shadow-2xl">
                Redefined
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
              Discover the exclusive K&A collection where luxury meets streetwear
            </p>
            {!user ? (
              <Button asChild className="relative inline-block px-12 py-4 text-lg font-semibold text-white bg-gradient-to-r from-red-600 to-red-800 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden group"
                      style={{boxShadow: '0 10px 30px rgba(255, 0, 0, 0.3)'}}>
                <Link to="/auth">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
                  <span className="relative">Shop Collection</span>
                </Link>
              </Button>
            ) : (
              <button className="relative inline-block px-12 py-4 text-lg font-semibold text-white bg-gradient-to-r from-red-600 to-red-800 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden group"
                      style={{boxShadow: '0 10px 30px rgba(255, 0, 0, 0.3)'}}>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
                <span className="relative">Shop Collection</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-red-600 bg-clip-text text-transparent">
            Featured Products
          </h3>
          
          {loading ? (
            <div className="text-center text-white/70">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="max-w-md mx-auto text-center p-8 border border-white/10 rounded-lg bg-black/50">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-red-600" />
              <h4 className="text-2xl font-semibold mb-4 text-white">No Products Yet</h4>
              <p className="text-white/70 mb-6">
                Products will appear here once they're added to the store.
              </p>
              {profile?.role === 'admin' && (
                <Button asChild className="bg-red-600 text-white hover:bg-red-700">
                  <Link to="/admin">Add Products</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 to-black border border-white/10 hover:border-red-600/50 transition-all duration-300 hover:scale-105">
                  {product.image_url ? (
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <ShoppingCart className="w-16 h-16 text-white/30" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-xl font-bold text-white group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h4>
                      <Badge className="bg-red-600 text-white text-lg px-3 py-1">
                        ${product.price.toFixed(2)}
                      </Badge>
                    </div>
                    
                    {product.categories && (
                      <Badge variant="outline" className="border-white/30 text-white/70 mb-3">
                        {product.categories.name}
                      </Badge>
                    )}
                    
                    <p className="text-white/70 mb-4 text-sm">
                      {product.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/50">
                        Stock: {product.stock_quantity}
                      </span>
                      <Button 
                        onClick={() => addToCart(product)}
                        className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white border-0"
                        disabled={product.stock_quantity === 0}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-black/50 rounded-full text-white hover:text-red-600 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-br from-red-900/10 to-black border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-red-600 bg-clip-text text-transparent">
            Stay Updated
          </h3>
          <p className="text-xl text-white/70 mb-8">
            Get the latest drops, exclusive offers, and style inspiration
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-red-600 transition-colors"
            />
            <Button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-sm text-white py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/lovable-uploads/ce257a3a-e907-444a-b331-b2e3222d93a0.png" 
                  alt="K&A Logo" 
                  className="h-8 w-8 object-contain"
                />
                <h4 className="text-2xl font-bold bg-gradient-to-r from-white to-red-600 bg-clip-text text-transparent">
                  K<span className="text-red-600">&</span>A
                </h4>
              </div>
              <p className="text-white/70 mb-6">
                Premium streetwear that defines your style. Quality craftsmanship meets modern design.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4 text-red-600">Quick Links</h5>
              <ul className="space-y-2 text-white/70">
                <li><Link to="/page/about" className="hover:text-red-600 transition-colors">About Us</Link></li>
                <li><Link to="/page/size-guide" className="hover:text-red-600 transition-colors">Size Guide</Link></li>
                <li><Link to="/page/shipping" className="hover:text-red-600 transition-colors">Shipping</Link></li>
                <li><Link to="/page/returns" className="hover:text-red-600 transition-colors">Returns</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4 text-red-600">Support</h5>
              <ul className="space-y-2 text-white/70">
                <li><Link to="/page/contact" className="hover:text-red-600 transition-colors">Contact Us</Link></li>
                <li><Link to="/page/faq" className="hover:text-red-600 transition-colors">FAQ</Link></li>
                <li><Link to="/page/track-order" className="hover:text-red-600 transition-colors">Track Order</Link></li>
                <li><Link to="/page/privacy" className="hover:text-red-600 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/50">
            <p>&copy; 2024 K&A. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
