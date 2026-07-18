import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/Auth";
import { loginAPI } from "../api";
import { validateEmail } from "../utils";
import { EmailField } from "../components/profile/EmailField";
import { PasswordField } from "../components/profile/PasswordField";
import { Button } from "../components/Button";

export function LoginView() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (auth.token) {
    return (
      <Navigate to="/" replace />
    );
  }

  function validateLoginDetails(email: string, password: string) {
    const validationErrors: Record<string, string> = {};
    if (validateEmail(email)) {
      validationErrors.email = 'Required.';
    }
    if (!password) {
      validationErrors.password = 'Required.';
    }
    return validationErrors;
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateLoginDetails(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await axios.post<{ userId: number; token: string }>(loginAPI, {
        email,
        password,
      });
      auth.login(response.data.userId, response.data.token);
      navigate('/');
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : null;
      if (status === 401) {
        setErrors({ form: 'Incorrect email or password.' });
      } else if (status === 400) {
        setErrors({ form: 'Check your details and try again.' });
      } else {
        setErrors({ form: 'Something went wrong.' });
      }
      setPassword('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-[5%] py-8">
      <div className="w-full max-w-sm">
        <form onSubmit={login} className="flex flex-col gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-sm font-medium text-(--text-h)">Email</label>
            <EmailField value={email} setEmail={setEmail} error={errors.email} />
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <label className="text-sm font-medium text-(--text-h)">Password</label>
            <PasswordField
              value={password}
              setPassword={setPassword}
              error={errors.password}
            />
          </div>

          {errors.form && (
            <p className="text-sm text-red-500 text-center">{errors.form}</p>
          )}

          <Button
            buttonStyleType="submit"
            disabled={submitting}
            className="mt-1 w-full"
          >
            {submitting ? 'Logging in...' : 'Log in'}
          </Button>
        </form>

        <p className="text-sm text-center text-(--text-low-visbility) mt-4">
          {'Need an account? '}
          <Link to="/register" className="text-(--accent)">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}