import { Comment } from './Comment';
import { Category } from './Category';

export interface Post {
  title: string;
  content: string;
  location: string;
  latitude: number;
  longitude: number;
  category: Category[];
  group: string;
  time : Date;
  id: number;
  comments: Comment[];
  user: string;
  email: string;
}