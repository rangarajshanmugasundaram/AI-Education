import React from 'react';
import AuthLayout from '@/layouts/AuthLayout'; 
import RegisterCard from '../components/RegisterCard';

const Register = () => {
  return (
    <AuthLayout>
      <div className="flex items-center justify-center w-full px-4">
        <RegisterCard />
      </div>
    </AuthLayout>
  );
};

export default Register;