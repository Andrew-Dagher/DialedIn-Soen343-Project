import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import RequestDeliveryForm from '../../components/RequestDeliveryForm';

function RequestDeliveryPage() {
    return (
        <div>
            <h1>Request a Delivery</h1>
            <RequestDeliveryForm />
        </div>
    );
}

export default withPageAuthRequired(RequestDeliveryPage);