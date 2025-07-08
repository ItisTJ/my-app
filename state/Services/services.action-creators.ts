import axios from "axios";
import { ActionTypes } from "./services.action-types";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../index"; // Adjust path if needed

// Define Service type
interface Service {
  title: string;
  description: string;
  image: string;
}

// Upload Services Action
export const uploadServices = (
  servicesData: Service[]
): ThunkAction<Promise<boolean>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.SERVICES_UPLOAD_REQUEST });

      const config = {
        headers: { "Content-Type": "application/json" },
      };

      for (const service of servicesData) {
        await axios.post("http://localhost:4000/api/services", service, config);
      }

      dispatch({
        type: ActionTypes.SERVICES_UPLOAD_SUCCESS,
        payload: "Services uploaded successfully",
      });

      return true;
    } catch (error: any) {
      dispatch({
        type: ActionTypes.SERVICES_UPLOAD_FAIL,
        payload: error.response?.data?.message
          ? `${error.response.data.message} Upload failed`
          : error.message,
      });

      return false;
    }
  };
};

// Fetch Services Action
export const fetchServices = (): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.SERVICES_FETCH_REQUEST });

      const { data } = await axios.get("http://localhost:4000/api/services");

      dispatch({
        type: ActionTypes.SERVICES_FETCH_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionTypes.SERVICES_FETCH_FAIL,
        payload: error.response?.data?.message
          ? `${error.response.data.message} Fetch failed`
          : error.message,
      });
    }
  };
};

export const deleteService = (
  id: string
): ThunkAction<Promise<boolean>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.SERVICES_DELETE_REQUEST });

      await axios.delete(`http://localhost:4000/api/services/${id}`);

      dispatch({
        type: ActionTypes.SERVICES_DELETE_SUCCESS,
        payload: id,
      });

      return true;
    } catch (error: any) {
      dispatch({
        type: ActionTypes.SERVICES_DELETE_FAIL,
        payload: error.response?.data?.message
          ? `${error.response.data.message} Delete failed`
          : error.message,
      });

      return false;
    }
  };
};
export const editService = (
  id: string,
  updatedServiceData: {
    title: string;
    description: string;
    image: string;
  }
): ThunkAction<Promise<boolean>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.SERVICES_EDIT_REQUEST });

      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axios.put(
        `http://localhost:4000/api/services/${id}`,
        updatedServiceData,
        config
      );

      dispatch({
        type: ActionTypes.SERVICES_EDIT_SUCCESS,
        payload: data,
      });

      return true;
    } catch (error: any) {
      dispatch({
        type: ActionTypes.SERVICES_EDIT_FAIL,
        payload: error.response?.data?.message
          ? `${error.response.data.message} Edit failed`
          : error.message,
      });

      return false;
    }
  };
};
