'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center space-x-4 mt-6 p-4 rounded-lg border border-slate-200 dark:border-slate-800 w-fit">
      <div className="font-medium mr-4">Counter:</div>
      <button 
        onClick={() => setCount(count - 1)}
        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        -
      </button>
      <span className="text-lg font-semibold w-8 text-center">{count}</span>
      <button 
        onClick={() => setCount(count + 1)}
        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        +
      </button>
    </div>
  );
}
