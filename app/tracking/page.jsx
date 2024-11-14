import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import TrackingForm from '../../components/TrackingForm.jsx'; // Import the form component

function TrackingPage() {
    return (
        <div className="mx-4 sm:mx-6 md:mx-8 mt-6 sm:mt-8 md:mt-10 rounded-xl border-2 border-gray-800 bg-gray-950 p-4 sm:p-6 md:p-8">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold text-gray-100 text-center">
                    Track Your Package
                </h1>
                <TrackingForm />
            </div>
        </div>
    );
}

export default withPageAuthRequired(TrackingPage);
