import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import RequestDeliveryForm from '../../components/RequestDeliveryForm';

function RequestDeliveryPage() {
    return (
        <div className=" mt-10 rounded-xl border-2 border-gray-800 bg-gray-950 p-6 text-gray-100">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-8 text-3xl font-bold text-gray-100 text-center">
                    Request a Delivery
                </h1>
                <RequestDeliveryForm />
            </div>
        </div>
    );
}

export default withPageAuthRequired(RequestDeliveryPage);