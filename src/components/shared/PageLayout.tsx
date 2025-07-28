import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Menu, X, User, Shield } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const { user, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<Array<{id: string, name: string, price: number, quantity: number}>>([]);

  const addToCart = (productId: string, name: string, price: number) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === productId);
      if (existingItem) {
        return prev.map(item => 
          item.id === productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: productId, name, price, quantity: 1 }];
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
                                onClick={() => addToCart(item.id, item.name, item.price)}
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
              
              {/* Mobile Menu Button */}
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

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

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

export default PageLayout;