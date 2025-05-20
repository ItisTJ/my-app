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
