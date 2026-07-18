import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/Auth";
import { userAPI, imageAPI } from "../api";
import { EmailField } from "../components/profile/EmailField";
import { PasswordField } from "../components/profile/PasswordField";
import { ImagePicker } from "../components/ImagePicker";
import { Button } from "../components/Button";
import { Dropdown } from "../components/Dropdown";
import { validateName, validateEmail, validatePassword, type UserProfile } from "../utils";
import { NameFields } from "../components/profile/NameFields";
import { LoadingDisplay } from "../components/LoadingDisplay";

export function EditProfileView() {
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();
  const navigate = useNavigate();
  const userId = Number(id);

  if (!auth.token || auth.userId !== userId) {
    return (
      <Navigate to={`/users/${userId}`} replace />
    );
  }

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserProfile() {
      try {
        const profile = await axios.get<UserProfile>(userAPI(userId), {
          headers: { 'X-Authorization': auth.token }
        });

        setFirstName(profile.data.firstName);
        setLastName(profile.data.lastName);
        setEmail(profile.data.email!);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getUserProfile();
  }, [userId])

  function setAvatar(file: File) {
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setRemoveAvatar(false);
  }

  function deleteAvatar() {
    setAvatarFile(null);
    setAvatarPreview(null);
    setRemoveAvatar(true);
  }

  function validateProfileDetails() {
    const errors: Record<string, string> = {}
    if (validateName(firstName)) {
      errors.firstName = 'Required.';
    }
    if (validateName(lastName)) {
      errors.lastName = 'Required';
    }
    if (validateEmail(email)) {
      errors.email = 'Required.';
    }

    if (newPassword || currentPassword) {
      if (!currentPassword) {
        errors.currentPassword = 'Required to change password.';
      }
      const newPasswordErr = validatePassword(newPassword)
      if (newPasswordErr) {
        errors.newPassword = newPasswordErr;
      }
    }

    return errors;
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateProfileDetails();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const body: Record<string, string> = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email,
      }
      if (newPassword && currentPassword) {
        body.currentPassword = currentPassword
        body.password = newPassword
      }

      await axios.patch(userAPI(userId), body, {
        headers: { 'X-Authorization': auth.token },
      });

      if (removeAvatar && !avatarFile) {
        await axios.delete(imageAPI(userId, 'users'), {
          headers: { 'X-Authorization': auth.token },
        });
      } else if (avatarFile) {
        await axios.put(imageAPI(userId, 'users'), avatarFile, {
          headers: { 'Content-Type': avatarFile.type, 'X-Authorization': auth.token },
        });
      }

      navigate(`/users/${userId}`);
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : null;
      if (status === 403) {
        setErrors({ email: 'This email is used.' });
      } else if (status === 401) {
        setErrors({ currentPassword: 'Incorrect password.' });
      } else {
        setErrors({ form: 'Internal Server Error.' });
      }

      setNewPassword('');
      setCurrentPassword('');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingDisplay />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-[5%] py-8">
      <div className="w-full max-w-sm">
        <form onSubmit={updateProfile} className="flex flex-col gap-4">
          <ImagePicker
            imgPreview={avatarFile ? avatarPreview : (removeAvatar ? null : imageAPI(userId, 'users'))}
            setImage={setAvatar}
            imageRemovable={deleteAvatar}
            type="avatar"
            error={errors.avatar}
          />

          <NameFields
            firstName={firstName}
            lastName={lastName}
            setFirstName={setFirstName}
            setLastName={setLastName}
            errors={errors}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-(--text-h)">E-mail</label>
            <EmailField value={email} setEmail={setEmail} error={errors.email} />
          </div>

          <Dropdown title="Change password" className="border-t border-(--border) pt-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-(--text-h)">Current Password</label>
                <PasswordField
                  value={currentPassword}
                  setPassword={setCurrentPassword}
                  error={errors.currentPassword}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-(--text-h)">New Password</label>
                <PasswordField
                  value={newPassword}
                  setPassword={setNewPassword}
                  error={errors.newPassword}
                />
              </div>
            </div>
          </Dropdown>
          {errors.form && <p className="text-sm text-red-500 text-center">{errors.form}</p>}

          <Button
            buttonStyleType="submit"
            disabled={submitting}
            className="mt-1 w-full"
          >
            {submitting ? 'Saving...' : 'Save profile'}
          </Button>
        </form>
      </div>
    </div>
  );
}