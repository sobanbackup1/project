import React from 'react';
import { ArrowRight } from 'lucide-react';
import Calendar from './Calendar';

interface MainPageProps {
  onNavigateToNews: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onNavigateToNews }) => {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">メインページ</h2>
        <button
          onClick={onNavigateToNews}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-6"
        >
          <span>ニュースと休講情報を見る</span>
          <ArrowRight size={18} />
        </button>
        <Calendar />
      </div>
    </div>
  );
};

export default MainPage;