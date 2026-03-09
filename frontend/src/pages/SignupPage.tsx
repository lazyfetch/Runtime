import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const SignupPage: React.FC = () => {
  const { handleRegister, loading, error } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister(form);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl p-8 shadow-xl">
        <h1 className="text-white text-2xl font-bold mb-1">Create account</h1>
        <p className="text-zinc-400 text-sm mb-6">Start running code in the cloud</p>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <Input label="Name" placeholder="User" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" variant="primary" loading={loading} className="w-full mt-1">Create Account</Button>
        </form>
        <p className="text-zinc-500 text-sm text-center mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;