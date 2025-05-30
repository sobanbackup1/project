import React, { useState, useEffect } from 'react';
import { getCancellations } from '../data/newsData';
import { Cancellation } from '../types';
import { RefreshCw } from 'lucide-react';

const CancellationList: React.FC = () => {
  const [cancellations, setCancellations] = useState<Cancellation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCancellations = async () => {
    setLoading(true);
    try {
      const data = await getCancellations();
      setCancellations(data);
    } catch (error) {
      console.error('Failed to load cancellations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadCancellations();
    } finally {
      setTimeout(() => setRefreshing(false), 800);
    }
  };

  useEffect(() => {
    loadCancellations();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">休講情報</h2>
        <button 
          onClick={handleRefresh} 
          disabled={refreshing || loading}
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded transition-all duration-200"
        >
          <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm">更新</span>
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日付</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">時限</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">科目</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">担当教員</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">備考</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cancellations.length > 0 ? (
                  cancellations.map((cancellation, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cancellation.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cancellation.period}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cancellation.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cancellation.instructor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cancellation.remarks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      休講情報はありません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancellationList;