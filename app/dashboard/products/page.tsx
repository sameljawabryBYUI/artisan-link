import type { Metadata } from 'next';
import ProductManagement from '@/components/dashboard/ProductManagement';

export const metadata: Metadata = {
  title: 'My products',
  description: 'View and manage your handmade product listings on ArtisanLink.',
};

export default function DashboardProductsPage() {
  return <ProductManagement />;
}
