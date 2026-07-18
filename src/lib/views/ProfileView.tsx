import { liveUser } from "../liveSession";
import { ProfileDisplay } from "../components/profile/ProfileDisplay";

export function ProfileView() {
  return <ProfileDisplay firstName={liveUser.firstName} lastName={liveUser.lastName} />;
}