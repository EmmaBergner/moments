
import styles from './App.module.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container';
import { Route, Routes, } from 'react-router-dom';
import './api/axiosDefault'; 
import SignUpForm from './pages/auth/SignUpForm';
import PostCreateForm from './pages/posts/PostCreateForm';
import SignInForm from './pages/auth/SignInForm';
import PostPage from './pages/posts/PostPage';


function App() {
  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Routes>
          <Route exact path="/" element={<h1>Home page</h1>} />
          <Route exact path="/signup" element={<SignUpForm />} />
          <Route exact path="/posts/create" element={<PostCreateForm />} />
          <Route exact path="/signin" element={<SignInForm />} />
          <Route exact path="/posts/:id" element={<PostPage />} />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
