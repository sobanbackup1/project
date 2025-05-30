import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import Header from './components/Header';
import NewsList from './components/NewsList';
import ArticleDetail from './components/ArticleDetail';
import CancellationList from './components/CancellationList';
import MainPage from './components/MainPage';
import Calendar from './components/Calendar'; // Import the Calendar component

function App() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'main' | 'news' | 'calendar'>('main'); // Add 'calendar' to the page types
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('googleUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      });
      const userData = await response.json();
      localStorage.setItem('googleUser', JSON.stringify(userData));
      setUser(userData);
    },
    onError: () => {
      console.error('Login failed');
    },
  });

  const logout = () => {
    localStorage.removeItem('googleUser');
    setUser(null);
  };

  const handleSelectArticle = (id: string) => {
    setSelectedArticleId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedArticleId(null);
  };

  const navigateToNews = () => {
    setCurrentPage('news');
    setSelectedArticleId(null);
  };

  const navigateToMain = () => {
    setCurrentPage('main');
    setSelectedArticleId(null);
  };

  const navigateToCalendar = () => {
    setCurrentPage('calendar');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onNavigateToMain={navigateToMain}
        onNavigateToCalendar={navigateToCalendar}
      >
        {user ? (
          <div className="flex items-center">
            <img src={user.picture} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
            <span className="text-sm text-gray-700">{user.name}</span>
            <button
              onClick={logout}
              className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login with Google
          </button>
        )}
      </Header>

      <main className="flex-1 py-6">
        {currentPage === 'main' && (
          <MainPage onNavigateToNews={navigateToNews} />
        )}

        {currentPage === 'news' && (
          selectedArticleId ? (
            <ArticleDetail
              articleId={selectedArticleId}
              onBack={handleBackToList}
            />
          ) : (
            <div className="space-y-8">
              <NewsList onSelectArticle={handleSelectArticle} />
              <CancellationList />
            </div>
          )
        )}

        {currentPage === 'calendar' && <Calendar />}
      </main>

      <footer className="bg-gray-800 text-gray-300 p-4">
        <div className="container mx-auto text-center text-sm">
          <p>© 2025 北海道情報大学 (Hokkaido Information University)</p>
          <p className="text-xs mt-1 text-gray-400">This is a simulated university portal created for demonstration purposes.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
