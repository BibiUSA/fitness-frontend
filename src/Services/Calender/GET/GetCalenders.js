export const getCalenderData = async (dates, email) => {
  const response = await axios.get(`http://localhost:3001/calendar`, {
    params: {
      dates: dates,
      email: email,
    },
  });

  return response;
};
