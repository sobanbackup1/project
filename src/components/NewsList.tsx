import React, { useState, useEffect } from 'react';
import { getNewsArticles } from '../data/newsData';
import { NewsArticle } from '../types';
import NewsCard from './NewsCard';
import { RefreshCw } from 'lucide-react';

interface NewsListProps {
  onSelectArticle: (id: string) => void;
}

const NewsList: React.FC<NewsListProps> = ({ onSelectArticle }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getNewsArticles();
      setArticles(data);
    } catch (error) {
      console.error('Failed to load news articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadArticles();
    } finally {
      setTimeout(() => setRefreshing(false), 800);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const categories = ['すべて', '重要', '講義', 'イベント', '一般'];
  
  const filteredArticles = categoryFilter 
    ? articles.filter(article => article.category === categoryFilter)
    : articles;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">ニュース記事一覧</h2>
        <button 
          onClick={handleRefresh} 
          disabled={refreshing || loading}
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded transition-all duration-200"
        >
          <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm">更新</span>
        </button>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {categories.map(category => (
          <button 
            key={category}
            onClick={() => setCategoryFilter(category === 'すべて' ? null : category)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
              (category === 'すべて' && categoryFilter === null) || category === categoryFilter 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="animate-pulse flex flex-col gap-4 w-full">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredArticles.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-2">全{filteredArticles.length}件</p>
              {filteredArticles.map(article => (
                <NewsCard 
                  key={article.id} 
                  article={article} 
                  onClick={onSelectArticle} 
                />
              ))}
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              該当する記事がありません
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsList;