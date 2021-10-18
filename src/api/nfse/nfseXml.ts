import ApiResponseHandler from "../apiResponseHandler";
import NfceServices from "../../services/NfceServices";
var convert = require('xml2json');

export default async (req, res, next) => {
    try {
      var result = convert.toJson(req.rawBody)
      result = JSON.parse(result)
      req.body.data = {xml: result}
      
      const payload = await new NfceServices(req.body.data).readXml();
      await ApiResponseHandler.success(req, res, payload);
    } catch (error) {
      await ApiResponseHandler.error(req, res, error);
    }
  };
  