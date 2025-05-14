// pages/index.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { products } from '../../src/data/products'; 
import type { User, Order, OrderStatus } from '../../src/types'; 

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userData, setUsers] = useState<{ total: number; users: User[] }>({ total: 0, users: [] });
  const [orderData, setOrderData] = useState<{ total: number; delivered: number; orders: Order[] }>({
    total: 0,
    delivered: 0,
    orders: [],
  });
  const [userSearch, setUserSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  useEffect(() => {
    const checkAdmin = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");

      // Local user check (just in case API cache is stale)
      if (!user || user.role !== "admin") {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/admin/check");
        if (res.ok) {
          setAuthorized(true);
        } else {
          router.push("/403");
        }
      } catch (err) {
        console.error("Admin check failed:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

  checkAdmin();
}, [router]);


  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      console.log(data);
      setUsers(data);
    };

    const fetchOrders = async () => {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrderData(data);
    };

    fetchUsers();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orderData?.orders?.length === 0) return;

    const storedStatuses: Record<string, OrderStatus> = {};

    orderData?.orders?.forEach((order) => {
      const stored = localStorage.getItem(`orderStatus-${order._id}`);
      if (stored === 'Pending' || stored === 'Shipped' || stored === 'Delivered') {
        storedStatuses[order._id] = stored;
      }
    });

    setOrderData((prev) => {
      const updatedOrders = prev.orders?.map((order) => ({
        ...order,
        status: storedStatuses[order._id] || order.status,
      }));

      const deliveredCount = updatedOrders?.filter((o) => o.status === 'Delivered').length;

      return {
        ...prev,
        orders: updatedOrders,
        delivered: deliveredCount,
      };
    });
  }, [orderData.orders]);

  const getProductDetails = (id: string) => {
    return products.find((product) => product.id === id);
  };

  const markOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      // Update the order status on the server
      const res = await fetch(`/api/admin/order/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const updatedOrderData = await res.json();

        // Update the orders array with the new status
        setOrderData((prev) => {
          const updatedOrders = prev.orders.map((order) =>
            order._id === orderId ? { ...order, status } : order
          );

          // Calculate the new delivered count
          const newDeliveredCount = updatedOrders.filter((order) => order.status === 'Delivered').length;

          return {
            ...prev,
            orders: updatedOrders,
            delivered: newDeliveredCount, // Update the delivered count
          };
        });

        // Persist the updated status in localStorage
        localStorage.setItem(`orderStatus-${orderId}`, status);
      } else {
        console.error('Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  // Filter Users
  const filteredUsers = userData?.users?.filter(
    (user) => user.fullName.toLowerCase().includes(userSearch.toLowerCase()) || 
              user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Filter Orders by Status
  const filteredOrders = orderData?.orders?.filter(
    (order) => orderStatusFilter === 'All' || order.status === orderStatusFilter
  );


  // Calculate total revenue
  const totalRevenue = orderData?.orders?.reduce((acc, order) => acc + order.totalAmount, 0);

  if (loading) return <div className="h-screen flex items-center justify-center text-xl font-semibold">Loading...</div>;
  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-medium text-gray-600 mb-2">Total Users</h2>
            <p className="text-3xl font-semibold text-indigo-600">{userData.total}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-medium text-gray-600 mb-2">Total Orders</h2>
            <p className="text-3xl font-semibold text-indigo-600">{orderData.total}</p>
            <h2 className="text-lg font-medium text-gray-600 mt-4">Delivered Orders</h2>
            <p className="text-3xl font-semibold text-green-500">{orderData.delivered}</p>
            <h2 className="text-lg font-medium text-gray-600 mt-4">Total Revenue</h2>
            <p className="text-3xl font-semibold text-emerald-500">₹{totalRevenue}</p>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Users</h2>
          <input
            type="text"
            placeholder="Search Users"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded"
          />
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Email</th>
                  <th className="px-6 py-3 text-left font-semibold">Role</th>
                  <th className="px-6 py-3 text-left font-semibold">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredUsers?.map((user) => (
                  <tr key={user._id} className={` ${user.role === 'admin' ? 'bg-indigo-50 font-semibold text-indigo-800' : ''}`}>
                    <td className="px-6 py-4">{user.fullName}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4 capitalize">
                      {user.role}
                      {user.role === 'admin' && (
                        <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded">
                          Admin
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">                 
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Orders</h2>
          <select
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded"
          >
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">User</th>
                  <th className="px-6 py-3 text-left font-semibold">Products</th>
                  <th className="px-6 py-3 text-left font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{userData.users.find((u) => u._id === order.user)?.fullName || 'Unknown User'}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {order?.products?.map((p) => {
                          const prod = getProductDetails(p.productId);
                          return (
                            <div key={p.productId} className="flex items-center gap-2">
                              {prod?.image && (
                                <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded" />
                              )}
                              <div>
                                <p className="text-sm font-medium">{prod?.name || 'Unknown Product'}</p>
                                <p className="text-xs text-gray-500">Qty: {p.quantity}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">₹{order.totalAmount}</td>
                    <td className={`px-6 py-4 font-semibold ${order.status === 'Delivered' ? 'text-green-600' : order.status === 'Shipped' ? 'text-blue-600' : 'text-yellow-600'}`}>
                      {order.status || 'Pending'}
                    </td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status || 'Pending'}
                        onChange={(e) => markOrderStatus(order._id, e.target.value as OrderStatus)}
                        className={`border border-gray-300 rounded px-2 py-1 ${order.status === 'Delivered' ? 'bg-gray-200' : 'bg-white'}`}
                        disabled={order.status === 'Delivered'}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
