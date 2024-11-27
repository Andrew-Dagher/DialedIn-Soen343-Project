'use client';

import UserDashboard from '../../components/ProfileDashboard';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

function DashboardPage() {
  return <UserDashboard />;
}

export default withPageAuthRequired(DashboardPage, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});
