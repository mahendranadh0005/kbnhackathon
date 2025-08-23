import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import { ShoppingCart, MessageCircle, Map, Heart, Search, User, Navigation } from 'lucide-react';
import ChatBot from './components/ChatBot';
import ProductSearch from './components/ProductSearch';
import StoreMap from './components/StoreMap';
import WishlistComparison from './components/WishlistComparison';
import { Product } from './types';

// 🆕 Import Owner Components
import OwnerLogin from './components/OwnerLogin';
import OwnerDashboard from './components/OwnerDashboard';

// 🟢 Customer Portal Component
const CustomerPortal: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDirections, setShowDirections] = useState(false);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setShowDirections(true);
  };

  const storeInfo = {
    name: "SEM Supercenter",
    address: "123 Main Street, Anytown, USA",
    hours: "6:00 AM - 11:00 PM",
    phone: "(555) 123-4567"
  };

  // 🎨 Custom tab colors
  const tabColors: Record<string, string> = {
    chat: "text-indigo-600 border-indigo-600 hover:text-indigo-700",
    search: "text-teal-600 border-teal-600 hover:text-teal-700",
    map: "text-fuchsia-600 border-fuchsia-600 hover:text-fuchsia-700",
    wishlist: "text-rose-600 border-rose-600 hover:text-rose-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-sky-500 rounded-lg flex items-center justify-center shadow-md">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SEM Store Assistant</h1>
                <p className="text-sm text-gray-600">Smart Shopping Experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                  onClick={onBack}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-2xl hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:-translate-y-1"
                >
                  ← Back
                </button>

              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{storeInfo.name}</p>
                <p className="text-xs text-gray-600">{storeInfo.hours}</p>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'chat', label: 'Smart Assistant', icon: MessageCircle },
              { id: 'search', label: 'Search Products', icon: Search },
              { id: 'map', label: 'Store Map', icon: Map },
              { id: 'wishlist', label: 'Wishlist Compare', icon: Heart }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === id 
                    ? tabColors[id] 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'chat' && <ChatBot onProductSelect={handleProductSelect} />}
        {activeTab === 'search' && <ProductSearch onProductSelect={handleProductSelect} />}
        {activeTab === 'map' && <StoreMap selectedProduct={selectedProduct} />}
        {activeTab === 'wishlist' && <WishlistComparison />}
      </main>

      {/* Directions Modal */}
      {showDirections && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Navigate to Product</h3>
              <button
                onClick={() => setShowDirections(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                  <p className="text-sm text-gray-600">${selectedProduct.price}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-sky-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-indigo-700 mb-2">
                  <Navigation className="w-4 h-4" />
                  <span className="font-medium">Location: {selectedProduct.location}</span>
                </div>
                <p className="text-sm text-indigo-600">{selectedProduct.directions}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setActiveTab('map')}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-sky-500 text-white py-2 px-4 rounded-lg shadow-md hover:scale-105 transition"
                >
                  View on Map
                </button>
                <button
                  onClick={() => setShowDirections(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 🟢 Main App with Landing Page + Owner Flow
function App() {
  const [view, setView] = useState<'landing' | 'customer' | 'owner'>('landing');
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);

  if (view === 'customer')
    return <CustomerPortal onBack={() => setView('landing')} />;

  if (view === 'owner') {
    if (!isOwnerLoggedIn) {
      return (
        <OwnerLogin
          onLoginSuccess={() => setIsOwnerLoggedIn(true)}
          onBack={() => setView('landing')}
        />
      );
    }
    return <OwnerDashboard onBack={() => setView('landing')} />;
  }

  return <LandingPage onViewChange={setView} />;
}

export default App;
