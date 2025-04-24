export const tokenLogging = async () => {
  try {
    const token = localStorage.getItem("auth_token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    if (token != null) {
      const response = await axios.post(
        `https://fitness-backend-je4w.onrender.com/account/protect`,
        {},
        {
          headers: headers,
        }
      );
      console.log(response.data.email);
      //setEmail(response.data.email);

      // return response.data; //return value for fetchAPI
      return response.data.email;

      //window.location = "/plans";
    } else {
      window.location = "/account";
    }
  } catch (error) {
    console.log(error);
    return error;
    window.location = "/account";
  }
};
