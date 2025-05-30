export interface NewsArticle {
  id: string;
  date: string;
  category: string;
  title: string;
  content?: string;
}

export interface Cancellation {
  date: string;
  period: string;
  subject: string;
  instructor: string;
  remarks: string;
}