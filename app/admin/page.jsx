import prisma from '@/lib/prisma';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, ClockIcon, TruckIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default async function AdminDashboard() {
  // Fetch real statistics from database
  const [
    totalRevenueData,
    totalOrders,
    totalCustomers,
    totalProducts,
    recentOrdersData
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: {
        totalAmount: true
      }
    }),
    prisma.order.count(),
    prisma.user.count({
      where: {
        role: 'user'
      }
    }),
    prisma.product.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })
  ]);

  const stats = [
    {
      name: 'Total Revenue',
      value: `$${(totalRevenueData._sum.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+12.5%', // Placeholder for now or calculate from last month
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: '+8.2%',
      icon: ShoppingCartIcon,
    },
    {
      name: 'Total Customers',
      value: totalCustomers.toLocaleString(),
      change: '+5.1%',
      icon: UsersIcon,
    },
    {
      name: 'Total Products',
      value: totalProducts.toLocaleString(),
      change: '+2',
      icon: CubeIcon,
    },
  ];

  const recentOrders = recentOrdersData.map(order => ({
    id: order.id,
    customer: order.user?.name || 'Guest',
    date: order.createdAt.toLocaleDateString(),
    amount: `$${order.totalAmount.toLocaleString()}`,
    status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Real-time performance metrics for Tekron.</p>
      </div>

      {/* Stats Rows */}
      <div className="glass-panel rounded-[2rem] shadow-xl shadow-teal-500/10 border border-amber-200/60 overflow-hidden">
        <div className="divide-y divide-amber-200/60">
          {stats.map((stat) => (
            <div key={stat.name} className="flex items-center justify-between px-8 py-5">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${stat.name.includes('Revenue') ? 'bg-emerald-50 text-emerald-600' :
                  stat.name.includes('Orders') ? 'bg-teal-50 text-teal-600' :
                    stat.name.includes('Customers') ? 'bg-amber-50 text-amber-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                  <stat.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Total</span>
                  <span className="text-sm font-bold uppercase tracking-[0.16em] text-slate-600">{stat.name.replace('Total ', '')}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-black text-slate-900">{stat.value}</span>
                <span className={`label flex-shrink-0 ${stat.change.startsWith('+') ? 'label-emerald' : 'label-rose'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="glass-panel rounded-[2.5rem] shadow-xl shadow-teal-500/10 border border-amber-200/60 overflow-hidden">
        <div className="px-8 py-6 border-b border-amber-200/60 flex items-center justify-between bg-amber-100/40">
          <h2 className="text-xl font-bold text-slate-900">Recent Transactions</h2>
          <button className="text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors uppercase tracking-widest">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-amber-200/60">
            <thead className="bg-amber-100/40">
              <tr>
                <th scope="col" className="px-8 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Order ID</th>
                <th scope="col" className="px-8 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Customer</th>
                <th scope="col" className="px-8 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Date</th>
                <th scope="col" className="px-8 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Amount</th>
                <th scope="col" className="px-8 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-200/60">
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="whitespace-nowrap px-8 py-5 text-sm font-bold text-slate-900">#{order.id.slice(-6).toUpperCase()}</td>
                  <td className="whitespace-nowrap px-8 py-5 text-sm font-medium text-slate-600 group-hover:text-slate-900">{order.customer}</td>
                  <td className="whitespace-nowrap px-8 py-5 text-sm text-slate-500">{order.date}</td>
                  <td className="whitespace-nowrap px-8 py-5 text-sm font-black text-slate-900">{order.amount}</td>
                  <td className="whitespace-nowrap px-8 py-5 text-sm">
                    <span className={`label flex items-center gap-1 ${order.status === 'Completed' || order.status === 'Delivered'
                        ? 'label-emerald'
                        : order.status === 'Processing' || order.status === 'Shipped'
                          ? 'label-teal'
                          : order.status === 'Pending'
                            ? 'label-amber'
                            : 'label-rose'
                      }`}>
                      {order.status === 'Completed' || order.status === 'Delivered' ? <CheckCircleIcon className="h-3.5 w-3.5" /> : null}
                      {order.status === 'Processing' || order.status === 'Shipped' ? <TruckIcon className="h-3.5 w-3.5" /> : null}
                      {order.status === 'Pending' ? <ClockIcon className="h-3.5 w-3.5" /> : null}
                      {order.status === 'Cancelled' ? <XCircleIcon className="h-3.5 w-3.5" /> : null}
                      {order.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-gray-400 font-medium">No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
