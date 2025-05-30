import { NewsArticle, Cancellation } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

export const getNewsArticles = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/news`);
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export const getArticleById = async (id: string): Promise<NewsArticle | undefined> => {
  try {
    const articles = await getNewsArticles();
    return articles.find(article => article.id === id);
  } catch (error) {
    console.error('Error fetching article:', error);
    return undefined;
  }
};

export const getCancellations = async (): Promise<Cancellation[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cancellations`);
    if (!response.ok) {
      throw new Error('Failed to fetch cancellations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching cancellations:', error);
    return [];
  }
};