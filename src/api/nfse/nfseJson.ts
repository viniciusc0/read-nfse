import ApiResponseHandler from "../apiResponseHandler";
import NfceServices from "../../services/NfceServices";
export default async (req, res, next) => {
    try {
      console.log(req.body)
      const payload = await new NfceServices(req.body.data).readXml();
      await ApiResponseHandler.success(req, res, payload);
    } catch (error) {
      await ApiResponseHandler.error(req, res, error);
    }
  };
  