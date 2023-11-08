import { errHandler, responseHandler } from "../helper/response.js";
import { Storage } from "../Config/firebase.config.js";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";


const imageUpload = async (req, res) => {
    console.log(req.body, "ff");
    console.log(req.file ? req.file : null);
    const metadata = {
      contentType: req.file.type,
    };
    const storageRef = ref(
      Storage,
      `boat/${req.file.fieldname + "_" + Date.now()}`
    );
    console.log(storageRef);
    //     const bytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
    await uploadBytesResumable(storageRef, req.file.uri, metadata).then(
      (snap) => {
        console.log("success");
        getDownloadURL(storageRef).then((url) => {
          responseHandler(res, { image: url });
        });
      }
    );
  };

  export{imageUpload}