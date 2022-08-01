
import styles from './App.module.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container';
import { Route, Routes, } from 'react-router-dom';
import './api/axiosDefault';
import SignUpForm from './pages/auth/SignUpForm';
import PostCreateForm from './pages/posts/PostCreateForm';
import SignInForm from './pages/auth/SignInForm';
import PostPage from './pages/posts/PostPage';
import PostsPage from './pages/posts/PostsPage';
import { useCurrentUser } from './contexts/CurrentUserContext';
import PostEditForm from './pages/posts/PostEditForm';
import ProfilePage from './pages/profiles/ProfilePage';
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Routes>
          <Route exact path="/"
            element={<PostsPage
              message="No results found. Adjust the search keyword" />} />

          <Route exact path="/feed"
            element={<PostsPage
              message="No results found. Adjust the search keyword or follow a user."
              filter={`owner__followed__owner__profile=${profile_id}&`} />} />

          <Route exact path="/liked"
            element={<PostsPage
              message="No results found. Adjust the search keyword or like a post."
              filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`} />} />

          <Route exact path="/signup" element={<SignUpForm />} />
          <Route exact path="/posts/create" element={<PostCreateForm />} />
          <Route exact path="/signin" element={<SignInForm />} />
          <Route exact path="/posts/:id" element={<PostPage />} />
          <Route exact path="/posts/:id/edit" element={<PostEditForm />} />
          <Route exact path="/profiles/:id" element={<ProfilePage />} />
          <Route exact path="/profiles/:id/edit/username" element={<UsernameForm />}/>
          <Route exact path="/profiles/:id/edit/password" element={<UserPasswordForm />}/>
          <Route exact path="/profiles/:id/edit" element={<ProfileEditForm />} />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
