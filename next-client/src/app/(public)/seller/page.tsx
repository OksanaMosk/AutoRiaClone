import SellerDashboardComponent from "@/components/seller-dashboard-component/SellerDashboardComponent";
import Link from 'next/link';

const SellerPage = () => {

  return (
    <div>
      <SellerDashboardComponent />
      <Link href="/create-car" className="create-car-link">
        Create New Car Listing
      </Link>
    </div>
  );
};

export default SellerPage;

