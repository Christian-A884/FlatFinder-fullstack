import axios from "axios";

export const addNewFlat = async (flat: any) => {
  try {
    await axios.post("http://localhost:4000/api/flats/addFlat", flat, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: any) {
    throw error.response.message.data;
  }
};

export const updateFlat = async (flatId: string, flatData: any) => {
  try {
    const result = await axios.put(`http://localhost:4000/api/flats/updateFlat/${flatId}`, flatData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message;
  }
};

export const getAllFlats = async () => {
  try {
    const result = await axios.get("http://localhost:4000/api/guestUser/flats", { withCredentials: true });
    return result.data.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};

export const getFlatById = async (id: string) => {
  try {
    const result = await axios.get(`http://localhost:4000/api/guestUser/flat/${id}`, { withCredentials: true });
    return result.data.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};

export const getFlatsbyOwnerId = async () => {
  try {
    const result = await axios.get("http://localhost:4000/api/flats/userFlats", { withCredentials: true });
    return result.data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFlat = async (id: string) => {
  try {
    const result = await axios.delete(`http://localhost:4000/api/flats/deleteFlat/${id}`, { withCredentials: true });
    return result.data.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};
