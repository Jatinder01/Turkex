import Singleton from "./Singleton";
// import Config from "react-native-config";
var CryptoJS = require("crypto-js");

export const encryptData = (params) => {
  let data = params;
  // Encrypt
  // console.log("encryptData==params=", data);

  // Singleton.getInstance().methodCatch((res) => {
  //   console.log("encryptData key=-=-=>>", res);
  // });
  let key = Singleton.getInstance().methodCatch();
  // .then((res) => {
  // console.log("encryptData=res==", key);

  let paramsciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    key
  ).toString();
  // console.log("paramsciphertext=res==", paramsciphertext);
  return paramsciphertext;
  // });
};

export const DecryptDataSingle = (ciphertext) => {
  // console.log("DecryptDataSingle==---=", ciphertext);
  // Singleton.getInstance()
  //   .methodCatch()
  //   .then((res) => {
  let key = Singleton.getInstance().methodCatch();
  // console.log(
  //   "DecryptDataSingle=key=++++=",
  //   key,
  //   "ciphertext=-=> ",
  //   ciphertext
  // );
  let bytes = CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
  // var ciphertext = CryptoJS.AES.decrypt(JSON.parse(ciphertext), res);
  // var decryptedData = JSON.parse(ciphertext.toString(CryptoJS.enc.Utf8));
  // console.log("DecryptDataSingle=res=++bytes++=", bytes);
  return bytes;
  // });
};
// import Singleton from './Singleton';
// import Config from "react-native-config";
// var CryptoJS = require('crypto-js');

// export const encryptData = params => {
//   let data = params;
//   // Encrypt
//   let ciphertext = CryptoJS.AES.encrypt(
//     JSON.stringify(data),
//     Singleton.getInstance().encryptionKey,
//   ).toString();
//   return ciphertext;
// };

// export const DecryptDataSingle = ciphertext => {
//   let bytes = CryptoJS.AES.decrypt(
//     ciphertext,
//     Singleton.getInstance().encryptionKey,
//   ).toString(CryptoJS.enc.Utf8);
//   return bytes;
// };
// import _ from 'lodash';
// export const b64Table =
//   'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

// export function encrypt(key, data) {
//   (xorEncrypt = (key, data) => {
//     return _.map(data, function (c, i) {
//       return c.charCodeAt(0) ^ key.charCodeAt(Math.floor(i % key.length));
//     });
//   }),
//     (b64Encode = data => {
//       var o1,
//         o2,
//         o3,
//         h1,
//         h2,
//         h3,
//         h4,
//         bits,
//         r,
//         i = 0,
//         enc = '';
//       if (!data) {
//         return data;
//       }

//       do {
//         o1 = data[i++];
//         o2 = data[i++];
//         o3 = data[i++];
//         bits = (o1 << 16) | (o2 << 8) | o3;
//         h1 = (bits >> 18) & 0x3f;
//         h2 = (bits >> 12) & 0x3f;
//         h3 = (bits >> 6) & 0x3f;
//         h4 = bits & 0x3f;
//         enc +=
//           b64Table.charAt(h1) +
//           b64Table.charAt(h2) +
//           b64Table.charAt(h3) +
//           b64Table.charAt(h4);
//       } while (i < data.length);
//       r = data.length % 3;
//       return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
//     }),
//     (data = this.xorEncrypt(key, data));
//   return this.b64Encode(data);
// }

// export function decrypt(key, data) {
//   (b64Decode = data => {
//     var o1,
//       o2,
//       o3,
//       h1,
//       h2,
//       h3,
//       h4,
//       bits,
//       i = 0,
//       result = [];
//     if (!data) {
//       return data;
//     }

//     data += '';
//     do {
//       h1 = b64Table.indexOf(data.charAt(i++));
//       h2 = b64Table.indexOf(data.charAt(i++));
//       h3 = b64Table.indexOf(data.charAt(i++));
//       h4 = b64Table.indexOf(data.charAt(i++));
//       bits = (h1 << 18) | (h2 << 12) | (h3 << 6) | h4;
//       o1 = (bits >> 16) & 0xff;
//       o2 = (bits >> 8) & 0xff;
//       o3 = bits & 0xff;
//       result.push(o1);
//       if (h3 !== 64) {
//         result.push(o2);
//         if (h4 !== 64) {
//           result.push(o3);
//         }
//       }
//     } while (i < data.length);
//     return result;
//   }),
//     (xorDecrypt = (key, data) => {
//       return _.map(data, function (c, i) {
//         return String.fromCharCode(
//           c ^ key.charCodeAt(Math.floor(i % key.length)),
//         );
//       }).join('');
//     }),
//     (data = this.b64Decode(data));
//   return this.xorDecrypt(key, data);
// }
