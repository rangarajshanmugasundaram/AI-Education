import AuthLayout from '@/layouts/AuthLayout';
import LoginCard from '../components/LoginCard';

const Login = () => {
  return (
    <AuthLayout>
      <div className="flex items-center justify-center min-h-[80vh] w-full px-4">
        <LoginCard />
      </div>
    </AuthLayout>
  );
};

export default Login;