import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useOrderStore } from '../stores/useOrderStore';
import { useToastStore } from '../stores/useToastStore';
import { Button } from '../components/ui/Button';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { orderHistory } = useOrderStore();
  const { addToast } = useToastStore();

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center pb-24 md:pb-12 animate-fade-in">
        <div className="text-6xl mb-6">👤</div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">My Profile</h1>
        <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8">
          Please log in to view your profile details, edit addresses, and track your past order history.
        </p>
        <div className="space-y-3">
          <Button onClick={() => navigate('/login')} fullWidth variant="primary">
            Log In
          </Button>
          <Button onClick={() => navigate('/signup')} fullWidth variant="outline">
            Create an Account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 pb-24 md:pb-12">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Profile info card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            {/* Avatar */}
            <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-emerald-500 bg-emerald-50 flex items-center justify-center">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-emerald-600 font-bold">{user.name.charAt(0)}</span>
              )}
            </div>

            <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">{user.phone}</p>

            <div className="border-t border-gray-100 mt-6 pt-6 text-left">
              <h3 className="text-xs text-gray-400 font-semibold uppercase mb-3">Saved Address</h3>
              {user.address ? (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-md uppercase">
                      {user.address.label || 'Home'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {user.address.street}, {user.address.city}, {user.address.state} - {user.address.pincode}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No saved address yet.</p>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Order history */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order History</h2>

            {orderHistory.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl block mb-3">📦</span>
                <p className="text-sm text-gray-400 font-semibold">No orders placed yet</p>
                <p className="text-xs text-gray-400 mt-1">Once you order, your details will appear here!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orderHistory.map((order) => (
                  <div key={order.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="bg-gray-50/50 px-4 py-3 flex flex-wrap justify-between items-center gap-2 border-b border-gray-100 text-xs">
                      <div>
                        <span className="text-gray-400 font-semibold mr-1">ORDER ID:</span>
                        <span className="font-extrabold text-gray-800">{order.id}</span>
                      </div>
                      <div className="text-gray-400 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      {/* Items */}
                      <div className="space-y-2 border-b border-gray-50 pb-3">
                        {order.items.map((item) => (
                          <div key={item.product.id} className="flex justify-between text-xs text-gray-600 gap-4">
                            <span className="truncate flex-1">
                              {item.product.name} <b className="text-gray-800 font-bold ml-1">x{item.quantity}</b>
                            </span>
                            <span className="font-semibold text-gray-800">
                              ₹{item.product.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <span className="text-gray-400 font-medium">Payment:</span>
                          <span className="font-bold text-gray-700 ml-1 uppercase">{order.paymentMethod}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-medium mr-2">Paid:</span>
                          <span className="text-sm font-black text-emerald-600">₹{order.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
