import React, { useState, useEffect } from 'react';
import { X, Search, BookOpen, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { searchCollegeData } from '../../services/api';

export const SearchModal = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, sendMessage } = useChat();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ courses: [], faculty: [], knowledge: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSearchModalOpen) {
      handleSearch('');
    }
  }, [isSearchModalOpen]);

  const handleSearch = async (searchTerm) => {
    setIsLoading(true);
    const res = await searchCollegeData(searchTerm);
    if (res.success && res.data) {
      setResults(res.data);
    }
    setIsLoading(false);
  };

  const onInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    handleSearch(val);
  };

  const handleSelectQuery = (questionText) => {
    setIsSearchModalOpen(false);
    sendMessage(questionText);
  };

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative flex flex-col w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 max-h-[80vh]">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={onInputChange}
            placeholder="Search MGMU IICT courses, faculty, fees, hostels, syllabus..."
            className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {isLoading ? (
            <div className="text-center py-8 text-xs text-slate-400">Searching MGMU IICT verified database...</div>
          ) : (
            <>
              {/* Courses Results */}
              {results.courses && results.courses.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    Courses & Programs ({results.courses.length})
                  </span>
                  <div className="space-y-1.5">
                    {results.courses.map((course, i) => (
                      <div
                        key={i}
                        onClick={() => handleSelectQuery(`Tell me about ${course.name} fees, duration, and eligibility.`)}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all cursor-pointer group"
                      >
                        <div>
                          <div className="font-semibold text-xs text-slate-800 dark:text-slate-100">{course.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Intake: {course.intake} • Duration: {course.duration}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Faculty Results */}
              {results.faculty && results.faculty.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-purple-500" />
                    Faculty Directory ({results.faculty.length})
                  </span>
                  <div className="space-y-1.5">
                    {results.faculty.map((fac, i) => (
                      <div
                        key={i}
                        onClick={() => handleSelectQuery(`Who is ${fac.name} and what department do they belong to?`)}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-all cursor-pointer group"
                      >
                        <div>
                          <div className="font-semibold text-xs text-slate-800 dark:text-slate-100">{fac.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{fac.designation} — {fac.department}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Knowledge Base Articles */}
              {results.knowledge && results.knowledge.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Verified Information Articles ({results.knowledge.length})
                  </span>
                  <div className="space-y-1.5">
                    {results.knowledge.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => handleSelectQuery(item.title)}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all cursor-pointer"
                      >
                        <div className="font-semibold text-xs text-slate-800 dark:text-slate-100">{item.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{item.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
