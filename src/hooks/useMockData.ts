import { useState, useEffect } from 'react';

export const useMockData = (initialData: any[], customInterval?: number) => {
  const [timeRange, setTimeRange] = useState('1H');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const interval = customInterval || 2; 
      const totalMinutes = timeRange === '1H' ? 60 : timeRange === '2H' ? 120 : timeRange === '7H' ? 420 : 1440;
      const points = Math.floor(totalMinutes / interval);
      const now = new Date();
      const newData = Array.from({ length: points }).map((_, i) => {
        const minutesAgo = (points - 1 - i) * interval;
        const date = new Date(now.getTime() - minutesAgo * 60000);
        const timeStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        const item: any = { time: timeStr };
        Object.keys(initialData[0]).forEach(key => {
          if (key !== 'time') {
            // Stabilize data between 30-60
            item[key] = Math.floor(Math.random() * 31) + 30;
          }
        });
        return item;
      });
      setData(newData);
      setIsLoading(false);
    }, 800 + Math.random() * 400);
    return () => clearTimeout(timer);
  }, [timeRange]);

  return { timeRange, setTimeRange, isLoading, data };
};
