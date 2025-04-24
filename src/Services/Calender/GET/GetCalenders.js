export const getCalenderData = async (dates, email) => {
  const response = await axios.get(
    `https://fitness-backend-je4w.onrender.com/calendar`,
    {
      params: {
        dates: dates,
        email: email,
      },
    }
  );

  return response;
};
