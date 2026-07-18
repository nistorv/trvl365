import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthState } from "./lib/context/Auth";
import { Navbar } from "./lib/components/home/Navbar";
import { HomeView } from "./lib/views/HomeView";
import { BlogView } from "./lib/views/BlogView";
import { LoginView } from "./lib/views/LoginView";
import { RegisterView } from "./lib/views/RegisterView";
import { CreateView } from "./lib/views/CreateView";
import { EditBlogView } from "./lib/views/EditBlogView";
import { InteractedView } from "./lib/views/InteractedView";
import { ProfileView } from "./lib/views/ProfileView";
import { EditProfileView } from "./lib/views/EditProfileView";

function App() {
  return (
    <BrowserRouter>
      <AuthState>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/blogs/new" element={<CreateView />} />
          <Route path="/blogs/:id" element={<BlogView />} />
          <Route path="/blogs/:id/edit" element={<EditBlogView />} />
          <Route path="/my-blogs" element={<InteractedView />} />
          <Route path="/users/:id" element={<ProfileView />} />
          <Route path="/users/:id/edit" element={<EditProfileView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
        </Routes>
      </AuthState>
    </BrowserRouter>
  )
}

export default App;