const formatISOTimestamp = (isoString) => { 
  const date = new Date(isoString);

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    };
  };

  const day = date.getDate();

  const month = date.toLocaleString('en-US', { month: 'long' }).slice(0, 3);

  const year = date.getFullYear();

  const timeString = date.toLocaleString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  }).toLowerCase();

  const formattedDate = `${day}${getOrdinalSuffix(day)} ${month}, ${year} at ${timeString}`;

  return formattedDate;
};

export default formatISOTimestamp;
