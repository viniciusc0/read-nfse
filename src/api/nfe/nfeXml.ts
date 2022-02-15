import ApiResponseHandler from "../apiResponseHandler";
import NfeServices from "../../services/NfeServices";
var convert = require("xml2json");
import formidable from "formidable";
import fs from 'fs'
export default async (req, res, next) => {
  try {
    const form = formidable({});

    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }

      // console.log(files['files.xml'].filepath)
      // return
      const content = fs.readFile(files['files.xml'].filepath, (error, data) => {
        if (error) {
          next(error);
          return;
        }
        const content = data;
        // console.log(content.toString())
        readContent(content.toString())
        return content.toString()
      });



     async  function readContent(content){

          let obj = convert.toJson(content)
          obj = JSON.parse(obj)
          // console.log(obj)

        const payload = await new NfeServices(obj).readXml();
        await ApiResponseHandler.success(req, res, payload);
      }

      
    });


  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
