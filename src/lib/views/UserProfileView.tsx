import { useParams } from "react-router-dom";
import { getUserBySlug } from "../blogs";
import { ProfileDisplay } from "../components/profile/ProfileDisplay";

export function UserProfileView() {
  const { slug } = useParams<{ slug: string }>();

  const user = getUserBySlug(slug ?? '');

  if (!user) {
    return (
      <div className="px-[5%] py-8">
        <p className="text-red-500">User not found.</p>
      </div>
    );
  }

  return <ProfileDisplay firstName={user.firstName} lastName={user.lastName} />;
}