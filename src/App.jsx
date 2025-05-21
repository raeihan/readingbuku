import React from "react";
import Home from "./pages/Home";
import Library from "./pages/Library";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Detail from "./pages/Detail";
import AuthorPages from "./pages/AuthorPages";
import AllAuthor from "./pages/AllAuthor";
import LoginPage from "./pages/LoginPage";
import MyBooks from "./pages/MyBooks";
import Contact from "./pages/Contact";
import UserRoute from "./auth/UserRoute";
import AuthRoute from "./auth/AuthRoute";
import ProfilePages from "./pages/ProfilePages";
import ProfileSyncManager from "./auth/ProfileSyncManager ";
import UpdateProfile from "./pages/UpdateProfile";

const App = () => {
  return (
    <div className="bg-colorback dark:bg-gray-900">
      <BrowserRouter>
        <ProfileSyncManager />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/author" element={<AllAuthor />} />
          <Route path="/mybooks" element={<MyBooks />} />
          <Route element={<UserRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route element={<AuthRoute />}>
            <Route path="/profile" element={<ProfilePages />} />
            <Route path="/updateprofile" element={<UpdateProfile />} />
          </Route>
          <Route path="/contact" element={<Contact />} />
          <Route path="/detail/:book_name" element={<Detail />} />
          <Route path="/authorpages/:name" element={<AuthorPages />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
