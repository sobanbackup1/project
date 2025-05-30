import React from 'react';
import { GraduationCap, Calendar, Bell, BookOpen, User } from 'lucide-react';

interface HeaderProps {
  onNavigateToMain: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToMain }) => {
  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onNavigateToMain}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <GraduationCap size={32} />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">そばんさん、こんにちは😃</h1>
              <p className="text-sm md:text-base">私を押すとメインページに戻ります</p>
            </div>
          </button>
          <div className="hidden md:flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              <Bell size={20} />
              <span>通知</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              <User size={20} />
              <span>プロフィール</span>
            </button>
          </div>
        </div>
        
        <nav className="flex gap-4 overflow-x-auto pb-2">
          <button onClick={onNavigateToMain} className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-700 transition-colors whitespace-nowrap">
            <BookOpen size={20} />
            <span>ホーム</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-700 transition-colors whitespace-nowrap">
            <Calendar size={20} />
            <span>カレンダー</span>
            <link href="https://calendar.google.com/calendar/embed?src=sobanbackup1%40gmail.com&ctz=Asia%2FTokyo"></link>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;