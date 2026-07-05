import hiteshImage from '@/assets/hitesh.jpg';
import piyushImage from '@/assets/piyush.jpg';

export const personas = [
  {
    id: 'hitesh',
    name: 'Hitesh Choudhary',
    image: hiteshImage,
    role: 'Full Stack Mentor',
    description: 'Friendly teaching style, beginner focused, chai lover',
    tags: ['Friendly', 'Beginner Focused', 'JavaScript'],
    status: 'online',
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  {
    id: 'piyush',
    name: 'Piyush Garg',
    image: piyushImage,
    role: 'Backend Architect',
    description: 'Deep technical insights, system design, architecture patterns',
    tags: ['Deep Technical', 'Architecture', 'Node.js'],
    status: 'online',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
];
