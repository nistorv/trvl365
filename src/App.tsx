import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./lib/components/home/Navbar";
import { HomeView } from "./lib/views/HomeView";
import { BlogView } from "./lib/views/BlogView";
import { MyBlogsView } from "./lib/views/MyBlogsView";
import { ProfileView } from "./lib/views/ProfileView";
import { UserProfileView } from "./lib/views/UserProfileView";
import { AboutView } from "./lib/views/AboutView";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/blogs/:id" element={<BlogView />} />
        <Route path="/my-blogs" element={<MyBlogsView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/users/:slug" element={<UserProfileView />} />
        <Route path="/about" element={<AboutView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;