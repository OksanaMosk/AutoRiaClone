import SellerDashboardComponent from "@/components/seller-dashboard-component/SellerDashboardComponent";
import Link from 'next/link';
import {GoBackButtonComponent} from "@/components/goBack-button-component/GoBackButtonComponent";

const SellerPage = () => {

  return (
    <div>
        <GoBackButtonComponent/>
      <SellerDashboardComponent />
      <Link href="/create-car" className="create-car-link">
        Create New Car Listing
      </Link>
    </div>
  );
};

export default SellerPage;

