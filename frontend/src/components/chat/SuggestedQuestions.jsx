import React from 'react';
import {
  GraduationCap,
  BookOpen,
  IndianRupee,
  Users,
  BarChart2,
  Home,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const CARDS = [
  {
    title: 'Admissions',
    query: 'What is the B.Tech admission process at MGMU IICT?',
    icon: GraduationCap,
  },
  {
    title: 'Courses & Programs',
    query: 'What programs and degrees are offered at IICT?',
    icon: BookOpen,
  },
  {
    title: 'Fee Structure',
    query: 'What is the fee structure for B.Tech CSE and MCA?',
    icon: IndianRupee,
  },
  {
    title: 'Faculty Directory',
    query: 'Who is the HOD of Computer Science and Engineering?',
    icon: Users,
  },
  {
    title: 'Placements',
    query: 'What are the placement statistics and top recruiting companies?',
    icon: BarChart2,
  },
  {
    title: 'Campus & Facilities',
    query: 'Does IICT provide hostel facilities and what is the fee?',
    icon: Home,
  },
];

export const SuggestedQuestions = () => {
  const { sendMessage } = useChat();

  return (
    <div className="w-full max-w-[850px] mx-auto my-3 px-2">
      <div className="flex items-center justify-center gap-2.5 flex-wrap">
        {CARDS.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <button
              key={idx}
              onClick={() => sendMessage(card.query)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-[#3B82F6] text-[#1E293B] hover:text-white border border-[#E2E8F0] shadow-sm transition-all duration-200 cursor-pointer group text-xs font-semibold backdrop-blur-md"
            >
              <IconComp className="w-4 h-4 text-[#3B82F6] group-hover:text-white transition-colors" />
              <span>{card.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedQuestions;




