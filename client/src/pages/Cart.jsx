import React, { useEffect, useMemo, useState } from 'react';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyProductId, setBusyProductId] = useState(null);

  const cartItems = cart?.items || [];

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setCart(response.data.cart);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      setBusyProductId(productId);
      const response = await api.put('/cart/update', { productId, quantity });
      setCart(response.data.cart);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update cart');
    } finally {
      setBusyProductId(null);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setBusyProductId(productId);
      const response = await api.delete(`/cart/remove/${productId}`);
      setCart(response.data.cart);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove item');
    } finally {
      setBusyProductId(null);
    }
  };

  const handleClearCart = async () => {
    try {
      setLoading(true);
      const response = await api.delete('/cart/clear');
      setCart(response.data.cart);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Cart</h1>
          {cartItems.length > 0 && (
            <Button variant="secondary" onClick={handleClearCart}>
              Clear Cart
            </Button>
          )}
        </div>

        {loading ? (
          <Card>
            <div className="text-center py-10">Loading cart...</div>
          </Card>
        ) : error ? (
          <Card>
            <div className="text-center py-10 text-red-600">{error}</div>
          </Card>
        ) : cartItems.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🧺</div>
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600">Add items from the shop to see them here.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.product?._id || item._id}>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="w-full md:w-24 md:h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product?.name || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">📦</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {item.product?.name || 'Product unavailable'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      ₹{item.product?.price || 0}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(item.product?._id, Number(e.target.value))
                      }
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={!item.product?._id || busyProductId === item.product?._id}
                    />
                    <Button
                      variant="secondary"
                      onClick={() => handleRemoveItem(item.product?._id)}
                      disabled={!item.product?._id || busyProductId === item.product?._id}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            <Card>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-blue-600">₹{total}</span>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
