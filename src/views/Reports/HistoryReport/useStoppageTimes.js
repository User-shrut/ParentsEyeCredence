import { useState, useEffect } from 'react';

// Function to calculate the duration between arrival and departure times in milliseconds
const calculateDuration = (arrivalTime, departureTime) => {
  const arrival = new Date(arrivalTime);
  const departure = new Date(departureTime);
  const duration = departure - arrival; // Duration in milliseconds
  return duration;
};

// Function to format milliseconds into days, hours, minutes, and seconds
const formatDuration = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

// Custom Hook to find the longest and shortest stoppage times
const useStoppageTimes = (finalDeviceDataByStopage) => {
  const [longestStop, setLongestStop] = useState(null);
  const [shortestStop, setShortestStop] = useState(null);
  const [longestDuration, setLongestDuration] = useState('');
  const [shortestDuration, setShortestDuration] = useState('');

  useEffect(() => {
    if (finalDeviceDataByStopage && finalDeviceDataByStopage.length > 0) {
      let longestStop = null;
      let shortestStop = null;
      let longestDurationMs = -Infinity;
      let shortestDurationMs = Infinity;

      finalDeviceDataByStopage.forEach(stop => {
        const duration = calculateDuration(stop.arrivalTime, stop.departureTime);

        if (duration > longestDurationMs) {
          longestDurationMs = duration;
          longestStop = stop;
        }
        if (duration < shortestDurationMs) {
          shortestDurationMs = duration;
          shortestStop = stop;
        }
      });

      setLongestStop(longestStop);
      setShortestStop(shortestStop);
      setLongestDuration(formatDuration(longestDurationMs));
      setShortestDuration(formatDuration(shortestDurationMs));
    }
  }, [finalDeviceDataByStopage]);

  return { longestStop, shortestStop, longestDuration, shortestDuration };
};

export default useStoppageTimes;
