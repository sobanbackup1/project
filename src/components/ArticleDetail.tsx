import React, { useState, useEffect } from 'react';
import { getArticleById } from '../data/newsData';
import { NewsArticle } from '../types';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

interface ArticleDetailProps {
  articleId: string;
  onBack: () => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(date);
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case '重要':
      return 'bg-red-100 text-red-800';
    case '講義':
      return 'bg-blue-100 text-blue-800';
    case 'イベント':
      return 'bg-purple-100 text-purple-800';
    case '一般':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ArticleDetail: React.FC<ArticleDetailProps> = ({ articleId, onBack }) => {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      try {
        const data = await getArticleById(articleId);
        if (data) {
          setArticle(data);
        }
      } catch (error) {
        console.error('Failed to load article:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <button 
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>一覧に戻る</span>
        </button>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <button 
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>一覧に戻る</span>
        </button>
        <div className="text-center py-16">
          <p className="text-gray-500">記事が見つかりませんでした</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft size={18} />
        <span>一覧に戻る</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">{article.title}</h1>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} />
            <span>{formatDate(article.date)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-gray-600" />
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {article.content || '記事の詳細情報は表示できません。'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;