import React from 'react';
import { ArrowRight } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
  onClick: (id: string) => void;
}

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

const NewsCard: React.FC<NewsCardProps> = ({ article, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => onClick(article.id)}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
        <span className="text-sm text-gray-600">{formatDate(article.date)}</span>
        <span className={`text-xs px-3 py-1 rounded-full inline-block font-medium ${getCategoryColor(article.category)}`}>
          {article.category}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <h3 className="text-base md:text-lg font-medium text-gray-800 flex-1">{article.title}</h3>
        <ArrowRight size={18} className="text-blue-600 ml-2 opacity-70" />
      </div>
    </div>
  );
};

export default NewsCard;