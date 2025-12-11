export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (timeString: string): string => {
  return timeString.slice(0, 5); // HH:MM format
};

export const getSeverityColor = (severity: number): string => {
  if (severity >= 8) return 'text-red-600 bg-red-50';
  if (severity >= 6) return 'text-orange-600 bg-orange-50';
  if (severity >= 4) return 'text-yellow-600 bg-yellow-50';
  return 'text-green-600 bg-green-50';
};

export const getSeverityLabel = (severity: number): string => {
  if (severity >= 8) return 'Severe';
  if (severity >= 6) return 'Moderate';
  if (severity >= 4) return 'Mild';
  return 'Low';
};