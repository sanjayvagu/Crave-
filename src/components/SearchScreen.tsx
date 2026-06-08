import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search } from "lucide-react";
import { RESTAURANTS } from "../data";
import { Restaurant } from "../types";

interface SearchScreenProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onSelectRestaurant,
}) => {
  const [query, setQuery] = useState("");

  const results = query
    ? RESTAURANTS.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
      )
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden"
    >
      <div className="px-5 pb-4 pt-[max(3rem,env(safe-area-inset-top))] bg-white dark:bg-slate-900 shadow-sm z-10 shrink-0">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for restaurants, items..."
            className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl py-3.5 pl-12 pr-4 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-500 font-medium border border-slate-200 dark:border-slate-700 focus:border-[#fc8019]/50 transition-colors shadow-inner"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-32">
        <AnimatePresence>
          {!query ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-lg tracking-tight">
                Trending Searches
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {["Biryani", "Pizza", "Burger", "Sushi", "Desserts"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-medium text-sm shadow-sm hover:border-[#fc8019] hover:text-[#fc8019] transition-colors"
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-lg tracking-tight">
                Results
              </h3>
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((r, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: idx * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      key={r.id}
                      onClick={() => onSelectRestaurant(r)}
                      className="bg-white dark:bg-slate-900 p-3 rounded-2xl flex items-center gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <img
                        src={r.image}
                        alt={r.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">
                          {r.name}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                          {r.tags.join(", ")}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                  <p>No results found for "{query}"</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
