import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/Auth"
import { registerAPI, loginAPI, imageAPI } from "../api"
import { EmailField } from "../components/profile/EmailField"
import { PasswordField } from "../components/profile/PasswordField"
import { ImagePicker } from "../components/ImagePicker"
import { Button } from "../components/Button"
import { validateName, validateEmail, validatePassword } from "../utils"
import { NameFields } from "../components/profile/NameFields"

export function RegisterView() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (auth.token) {
    return (
      <Navigate to="/" replace />
    );
  }

  function saveAvatar(file: File) {
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function validateProfileInfo() {
    const validationErrors: Record<string, string> = {};
    if (validateName(firstName)) {
      validationErrors.firstName = 'Required.';
    }
    if (validateName(lastName)) {
      validationErrors.lastName = 'Required.';
    }

    if (validateEmail(email)) {
      validationErrors.email = 'Required.';
    }

    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      validationErrors.password = passwordValidation
    }
    return validationErrors;
  }

  async function registerProfile(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateProfileInfo();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const registerRes = await axios.post<{ userId: number }>(registerAPI, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email,
        password,
      })
      const userId = registerRes.data.userId;

      const loginRes = await axios.post<{ userId: number; token: string }>(loginAPI, {
        email,
        password,
      })
      const token = loginRes.data.token;

      if (avatarFile) {
        await axios.put(imageAPI(userId, 'users'), avatarFile, {
          headers: { 'Content-Type': avatarFile.type, 'X-Authorization': token },
        });
      }

      auth.login(userId, token);
      navigate('/');
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : null;
      if (status === 403) {
        setErrors({ email: 'This email is used.' });
      } else if (status === 400) {
        setErrors({ form: 'Check your details and try again.' });
      } else {
        setErrors({ form: 'Internal Server Error.' });
      }
      setPassword('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-[5%] py-8">
      <div className="w-full max-w-sm">
        <form onSubmit={registerProfile} className="flex flex-col gap-4">
          <ImagePicker
            imgPreview={avatarPreview}
            setImage={saveAvatar}
            type="avatar"
          />

          <NameFields
            firstName={firstName}
            lastName={lastName}
            setFirstName={setFirstName}
            setLastName={setLastName}
            errors={errors}
          />

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
            {submitting ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        <p className="text-sm text-center text-(--text-low-visibility) mt-4">
          {'Already have an account? '}
          <Link to="/login" className="text-(--accent)">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}