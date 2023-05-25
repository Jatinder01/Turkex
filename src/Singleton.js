/* eslint-disable handle-callback-err */
/* eslint-disable no-alert */
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as constants from "./Constants";
import { Alert, Platform, Share } from "react-native";
import END_POINT from "./EndPoints";
import { Actions } from "react-native-router-flux";
import { APIClient, CoinCultApi } from "./api";
import { showMessage, hideMessage } from "react-native-flash-message";
import { colors } from "./theme";
import { encryptData, DecryptDataSingle } from "./encryptionUtils";
import EncryptedStorage from "react-native-encrypted-storage";
import moment from "moment";
import { deleteUserDevice } from "./Redux/Actions";
import { request, PERMISSIONS, openSettings } from "react-native-permissions";
import Config from "react-native-config";
// import { Camera } from "react-native-vision-camera";
const CryptoJS = require("crypto-js");
const Buffer = require("buffer").Buffer;
const KEY_ENCRYPTION = "EVO_EUROPE_ENCRYPTION";
export default class Singleton {
  static myInstance = null;
  deviceToken = "";
  accessToken = "";
  kycId = "";
  hideZeroBalance = false;
  checkAuthBack = false;
  theme = "theme1";
  statusChange = null;
  showMaintenance = null;
  favArrayKey = "favArr";
  intervalTime = "";
  buySellTicketSocket = null;
  marketTicketSocket = null;
  marketTradeSocket = null;
  isLogin = false;
  isLoginSuccess = false;
  refreshingToken = false;
  tradeArr = [
    { txt: 25, isSelect: false },
    { txt: 50, isSelect: false },
    { txt: 75, isSelect: false },
    { txt: 100, isSelect: false },
  ];
  marketDataGlobal = null;
  static getInstance() {
    if (Singleton.myInstance == null) {
      Singleton.myInstance = new Singleton();
    }
    return this.myInstance;
  }

  async saveToken(token) {
    console.log("saveToken==-=-=>>>", token);
    Singleton.getInstance().accessToken = token;
    await this.saveDataSecure(constants.ACCESS_TOKEN, token);
  }
  async SaveHideZeroBalance(status) {
    Singleton.getInstance().hideZeroBalance = status;
    await this.saveData(constants.HIDE_ZERO_BALANCE, "0");
  }

  async saveToFav(item) {
    return new Promise((resolve, reject) => {
      this.getData("favArr").then((res) => {
        if (res == null || res == "[]") {
          let arry = [item];
          this.saveData("favArr", JSON.stringify(arry)).then((res) => {
            return resolve();
          });
        } else {
          let arr = JSON.parse(res);
          let added = false;

          for (let i = 0; i < arr?.length; i++) {
            if (
              arr[i].base_unit == item.base_unit &&
              arr[i].quote_unit == item.quote_unit
            ) {
              arr.splice(i, 1);
              added = true;
            }
          }
          if (added == false) {
            arr.push(item);
          }
          console.log("arr=-=-fav=-=-=0", arr);
          this.saveData("favArr", JSON.stringify(arr)).then((res) => {
            return resolve();
          });
        }
      });
    });
  }
  clearStorage() {
    return new Promise((resolve, reject) => {
      AsyncStorage.clear()
        .then(async (response) => {
          try {
            await EncryptedStorage.clear();
            resolve(response);
            // Congrats! You've just cleared the device storage!
          } catch (error) {
            reject(error);
            // There was an error on the native side
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  async saveKycId(id) {
    Singleton.getInstance().kycId = id;
    await this.saveData(constants.KYC_ID, id);
  }

  async saveEmptyDefault() {
    Singleton.getInstance().kycId = "";
    await this.saveData(constants.KYC_ID, "");
    Singleton.getInstance().accessToken = "";
    await this.saveDataSecure(constants.ACCESS_TOKEN, "");
    await this.saveDataSecure(constants.REFRESH_TOKEN, "");
    await this.saveData(constants.IS_LOGIN, "false");
  }
  exponentialToDecimalConvert(exponential) {
    let decimal = exponential.toString().toLowerCase();
    if (decimal.includes("e+")) {
      const exponentialSplitted = decimal.split("e+");
      let postfix = "";
      for (
        let i = 0;
        i <
        +exponentialSplitted[1] -
          (exponentialSplitted[0].includes(".")
            ? exponentialSplitted[0].split(".")[1]?.length
            : 0);
        i++
      ) {
        postfix += "0";
      }
      const addCommas = (text) => {
        let j = 3;
        let textLength = text?.length;
        while (j < textLength) {
          text = `${text.slice(0, textLength - j)}${text.slice(
            textLength - j,
            textLength
          )}`;
          textLength++;
          j += 3 + 1;
        }
        return text;
      };
      decimal = addCommas(exponentialSplitted[0].replace(".", "") + postfix);
    }
    if (decimal.toLowerCase().includes("e-")) {
      const exponentialSplitted = decimal.split("e-");
      let prefix = "0.";
      for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
        prefix += "0";
      }
      decimal = prefix + exponentialSplitted[0].replace(".", "");
    }
    return decimal.toString();
  }
  deleteOfflineStepsData() {
    return new Promise((resolve, reject) => {
      this.saveData(constants.VERIFY_INFO_STEP, "").then((r) => {
        this.saveData(constants.PHONE_VERIFY_STEP, "").then((r) => {
          this.saveData(constants.SELECT_DOC_STEP, "").then((r) => {
            this.saveData(constants.DOC_DETAILS_STEP, "").then((r) => {
              this.saveData(constants.SELFIE_STEP, "").then((r) => {
                this.saveData(constants.FILE_DOC_STEP, "").then((r) => {
                  AsyncStorage.removeItem(constants.USER_DATA).then((r) => {
                    resolve(true);
                  });
                });
              });
            });
          });
        });
      });
    });
  }
  //   formatBytes(bytes) {
  //     var marker = 1024; // Change to 1000 if required
  //     var decimal = 3; // Change as required
  //     var kiloBytes = marker; // One Kilobyte is 1024 bytes
  //     var megaBytes = marker * marker; // One MB is 1024 KB
  //     var gigaBytes = marker  marker  marker; // One GB is 1024 MB
  //     var teraBytes = marker  marker  marker * marker; // One TB is 1024 GB

  //     // return bytes if less than a KB
  //     if(bytes < kiloBytes) return bytes + " Bytes";
  //     // return KB if less than a MB
  //     else if(bytes < megaBytes) return(bytes / kiloBytes).toFixed(decimal) + " KB";
  //     // return MB if less than a GB
  //     else if(bytes < gigaBytes) return(bytes / megaBytes).toFixed(decimal) + " MB";
  //     // return GB if less than a TB
  //     else return(bytes / gigaBytes).toFixed(decimal) + " GB";
  // }
  methodCatch() {
    // return new Promise((resolve, reject) => {
    let a = Buffer.from(Config.a, Config.abc).toString(Config.xyz);
    let z = Buffer.from(Config.c, Config.abc).toString(Config.xyz);
    let b = Buffer.from(Config.e, Config.abc).toString(Config.xyz);
    let y = Buffer.from(Config.g, Config.abc).toString(Config.xyz);
    let c = Buffer.from(Config.i, Config.abc).toString(Config.xyz);
    let x = Buffer.from(Config.k, Config.abc).toString(Config.xyz);
    let d = Buffer.from(Config.m, Config.abc).toString(Config.xyz);
    // console.log(
    //   "a + z + b + y + c + x + d + w=-=->>",
    //   a + z + b + y + c + x + d
    // );
    return a + z + b + y + c + x + d;
    // });
    let abc =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    return abc;
  }
  methodAddress() {
    let a = Buffer.from(Config.x, Config.abc).toString(Config.hf);
    let z = Buffer.from(Config.y, Config.abc).toString(Config.hf);
    let b = Buffer.from(Config.z, Config.abc).toString(Config.hf);
    let y = Buffer.from(Config.zz, Config.abc).toString(Config.hf);
    let val = a + z + b + y;
    return val;
  }
  methodImageAddress() {
    let aa = Buffer.from(Config.aa, Config.abc).toString(Config.hf);
    let zz = Buffer.from(Config.bb, Config.abc).toString(Config.hf);
    let bb = Buffer.from(Config.cc, Config.abc).toString(Config.hf);
    let yy = Buffer.from(Config.dd, Config.abc).toString(Config.hf);
    let nn = Buffer.from(Config.ee, Config.abc).toString(Config.hf);
    let val = aa + zz + bb + yy + nn;
    return val;
  }
  ParseFloatNumber(str, val) {
    // console.log('str typeof--', typeof str);
    // if (str.toString()?.includes('.')) {
    //   console.log('chcek string=-=-=', str);
    // } else {
    //   console.log('chcek string=-=-=else', str);
    // }
    // console.log('check str---', str, val);
    str = str?.toString();
    str = str?.slice(0, str?.indexOf(".") + val + 1);
    let a = str?.split(".");

    if (a[1] == undefined) {
      a = a[0];
      return a;
    } else {
      a = a[0] + "." + a[1].toString().padEnd(val, 0);
      return a;
    }
  }
  ParseFloatNumberOnly(str, val) {
    var re = new RegExp("^-?\\d+(?:.\\d{0," + (val || -1) + "})?");
    return str?.toString().match(re)[0];
  }
  numbersToBillion(labelValue) {
    return Math.abs(Number(labelValue)) >= 1.0e9
      ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
      : // Six Zeroes for Millions
      Math.abs(Number(labelValue)) >= 1.0e6
      ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
      : // : // Three Zeroes for Thousands
        // Math.abs(Number(labelValue)) >= 1.0e3
        // ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
        Math.abs(Number(labelValue));
  }
  isNewerVersion(oldVer, newVer) {
    const oldParts = oldVer.split(".");
    const newParts = newVer.split(".");
    for (var i = 0; i < newParts?.length; i++) {
      const a = ~~newParts[i]; // parse int
      const b = ~~oldParts[i]; // parse int
      if (a > b) return true;
      if (a < b) return false;
    }
    return false;
  }
  saveData(key, value) {
    return new Promise(async (resolve, reject) => {
      // if (!value || value == '[]') value = value;
      // else value = encryptData(value);
      // console.log('saveData #### ------' + value);
      AsyncStorage.setItem(key, value)
        .then((response) => {
          resolve(value);
        })
        .catch((error) => {
          // console.log('error #### ' + key);
          reject(error);
        });
      // try {
      //   await EncryptedStorage.setItem(key, value);
      //   console.log("saveData response#### -value-----" + value);
      //   resolve(value);
      //   // Congrats! You've just stored your first value!
      // } catch (error) {
      //   reject(error);
      //   // There was an error on the native side
      // }
    });
  }
  saveDataSecure(key, value) {
    // console.log("key #### value", key, "====val=>", value);
    let data;
    return new Promise(async (resolve, reject) => {
      //   if (!value || value == "[]") value = value;
      //   else value = encryptData(value);
      //   console.log("saveDataSecure #### ------" + value);
      //   AsyncStorage.setItem(key, value)
      //     .then((response) => {
      //       console.log("saveDataSecure #### --response----" + value);
      //       resolve(value);
      //     })
      //     .catch((error) => {
      //       // console.log('error #### ' + key);
      //       reject(error);
      //     });
      //===
      // try {
      //   await EncryptedStorage.setItem(key, value);
      //   console.log("saveData response#### -value-----" + value);
      //   resolve(value);
      //   // Congrats! You've just stored your first value!
      // } catch (error) {
      //   reject(error);
      //   // There was an error on the native side
      // }
      //===
      if (!value || value == "[]") {
        // console.log("saveDataSecure ####  value------" + value);
        data = value;
      } else {
        data = encryptData(value);
      }
      // console.log("saveDataSecure #### ---data---" + data);

      try {
        await EncryptedStorage.setItem(key, data);
        // console.log("saveDataSecure response#### -value-----" + value);
        resolve(value);
        // Congrats! You've just stored your first value!
      } catch (error) {
        console.log("saveDataSecure response#### -error-----" + error);
        reject(error);
        // There was an error on the native side
      }
    });
  }

  getMarketData() {
    return new Promise((resolve, reject) => {
      fetch(`${END_POINT.COMMON_URL}/api/v2/peatio/public/markets`)
        .then((response) => response.json())
        .then((json) => {
          return resolve(json);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
  getData(key) {
    return new Promise(async (resolve, reject) => {
      AsyncStorage.getItem(key)
        .then((response) => {
          // if (!response || response == '[]') return resolve(response);
          // response = DecryptDataSingle(response);
          // console.log('saveData response#### ------' + response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
      // try {
      //   const keyValue = await EncryptedStorage.getItem(key);

      //   if (keyValue !== undefined) {
      //     console.log("getData response#### -keyValue-----" + keyValue);
      //     resolve(keyValue);
      //     // Congrats! You've just retrieved your first value!
      //   }
      // } catch (error) {
      //   reject(error);
      //   // There was an error on the native side
      // }
    });
  }
  // saveDataSecure(key, value) {
  //   console.log("key##saveDataSecure###key", key);
  //   console.log("key##saveDataSecure###value", value);

  //   return new Promise((resolve, reject) => {
  //     const alpha = this.methodCatch();
  //     console.log("key##saveDataSecure###alpha", JSON.stringify(alpha));
  //     if (value != null && value != []) {
  //       var ciphertext = CryptoJS.AES.encrypt(
  //         JSON.stringify(value),
  //         alpha
  //       ).toString();
  //       console.log("key##saveDataSecure###ciphertext" + ciphertext);
  //       AsyncStorage.setItem(key, ciphertext)
  //         .then((response) => {
  //           resolve(ciphertext);
  //         })
  //         .catch((error) => {
  //           console.log("error #### " + key);
  //           reject(error);
  //         });
  //     }
  //   });
  // }
  // saveData(key, value) {
  //   console.log("key#####saveData" + key);
  //   console.log("key#####value ####saveData- ", value);

  //   return new Promise((resolve, reject) => {
  //     const alpha = this.methodCatch();
  //     console.log("key#####value alpha- ", alpha);
  //     var ciphertext = CryptoJS.AES.encrypt(
  //       JSON.stringify(value),
  //       alpha
  //     ).toString();
  //     AsyncStorage.setItem(key, ciphertext)
  //       .then((response) => {
  //         resolve(ciphertext);
  //       })
  //       .catch((error) => {
  //         console.log("error #### " + key);
  //         reject(error);
  //       });
  //   });
  // }
  // getDataSecure(key) {
  //   console.log("getDataSecuree###key" + key);
  //   return new Promise((resolve, reject) => {
  //     AsyncStorage.getItem(key)
  //       .then((response) => {
  //         console.log("getDataSecuree###response" + response);

  //         if (response != null) {
  //           const alpha = this.methodCatch();
  //           console.log("alpha=-=-=-=>>>", JSON.stringify(alpha));
  //           var ciphertext = CryptoJS.AES.decrypt(response, alpha);
  //           var decryptedData = JSON.parse(
  //             ciphertext.toString(CryptoJS.enc.Utf8)
  //           );
  //           console.log("getDataSecuree###ciphertext" + decryptedData);

  //           resolve(decryptedData);
  //         } else {
  //           resolve(response);
  //         }
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // }
  //=============secure key===========//
  getDataSecure(key) {
    // console.log("getDataSecure key----- " + key);
    return new Promise(async (resolve, reject) => {
      // AsyncStorage.getItem(key)
      //   .then((response) => {
      //     console.log("getDataSecure key---response--" + response);
      //     if (!response || response == "[]") return resolve(response);
      //     response = DecryptDataSingle(response);
      //     console.log("getDataSecure response#### ------" + response);
      //     resolve(response);
      //   })
      //   .catch((error) => {
      //     reject(error);
      //   });
      try {
        const keyValue = await EncryptedStorage.getItem(key);
        // console.log("getDataSecure response#### -keyValue-----" + keyValue);
        if (keyValue !== undefined) {
          if (!keyValue || keyValue == "[]") {
            // console.log("getDataSecure response#### ife-----" + keyValue);
            return resolve(keyValue);
          } else {
            let response = DecryptDataSingle(keyValue);
            // console.log("getDataSecure response#### -response-----" + response);
            resolve(response);
          }
          // Congrats! You've just retrieved your first value!
        }
      } catch (error) {
        console.log("getDataSecure response#### -error-----" + error);

        reject(error);
        // There was an error on the native side
      }
    });
  }
  funComma(num) {
    var str = num?.split(".");
    // console.log()

    if (str[0]?.length >= 4) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    }

    return str.join(".");
  }
  funCommaWith(num) {
    // console.log("num==-=kkkkk-=-", num.includes("."));
    var str = num?.split(".");
    // console.log()

    if (str[0]?.length >= 4) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    }

    return str.join(".");
  }
  refreshToken(type) {
    console.log("getDataSecure constants");
    return new Promise((resolve, reject) => {
      global.loaderVisible = true;
      if (this.refreshingToken) {
        resolve();
        return;
      } else {
        this.refreshingToken = true;
        this.getDataSecure(constants.REFRESH_TOKEN).then((res) => {
          if (res) {
            // console.log("getDataSecure constants.REFRESH_TOKEN--- ", res);
            // console.log(
            //   "Bearer ${JSON.parse(res)}N--- ",
            //   `Bearer ${JSON.parse(res)}`
            // );
            this.getDataSecure(constants.ACCESS_TOKEN).then((resp) => {
              // console.log("getDataSecure constants.ACCESS_TOKEN--- ", resp);
              // reject("ERROR");

              if (type == 0) {
                fetch(`${END_POINT.BASE_URL}${END_POINT.REFRESH_SESSION}`, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    // "refresh-token": "Bearer " + res,
                    "refresh-token": JSON.parse(res),
                    // Authorization: resp,
                  },
                })
                  // APIClient.getInstance()
                  //   .getData(END_POINT.REFRESH_SESSION, res)
                  .then(async (res) => {
                    console.log("access=-=bearer res=-=-=>>>", res);
                    if (res?.ok) {
                      var data = res?.headers.map;
                      let access = "Bearer " + data["access-token"];
                      if (!access) {
                        reject("error");
                        return;
                      }
                      console.log("access=-=bearer savedata=-=-=>>>", access);
                      this.saveToken(access);
                      this.accessToken = access;
                      // console.log("access=-=accessToken>>>", accessToken);

                      // CoinCultApi.get(END_POINT.GET_USER_ME, {
                      //   headers: {
                      //     contentType: "application/json",
                      //     Authorization: access,
                      //   },
                      // })
                      APIClient.getInstance()
                        .getDataSingleton(END_POINT.GET_USER_ME, access)
                        .then((userData) => {
                          console.log(
                            "access=-=bearer userData=-=-=>>>",
                            userData
                          );
                          resolve(userData);
                          type === 1 && Actions.reset("Main");
                          global.loaderVisible = false;
                          this.refreshingToken = false;
                        })
                        .catch((error) => {
                          console.log("access=-=bearer error=-=-=>>>", error);

                          reject(error);
                          // type === 1 && this.refreshToken(1);
                          global.loaderVisible = false;
                          this.refreshingToken = false;
                        });
                    } else {
                      deleteUserDevice()
                        .then((res) => {
                          console.log("=deleteUserDevice====ee=res=", res);
                          // Actions.currentScene != "Main" &&
                          //   Actions.replace("Main");
                          // checkSessionMaintaining();
                          // Singleton.getInstance().saveEmptyDefault();
                          Actions.currentScene != "Login" &&
                            Actions.reset("Login");
                        })
                        .catch((err) => {
                          console.log("=deleteUserDevice===ee=err==", err);
                          // Singleton.getInstance().saveEmptyDefault();
                          // Actions.currentScene != "Main" &&
                          //   Actions.replace("Main");
                          Actions.currentScene != "Login" &&
                            Actions.reset("Login");
                        });
                      reject("ERROR");
                    }
                  })
                  .catch((error) => {
                    console.log("access=-=bearer savedata=-=-error=>>>", error);
                    this.refreshingToken = false;
                    // AsyncStorage.clear(res => {

                    if (error?.response?.status == "401") {
                      Actions.currentScene != "Login" && Actions.reset("Login");
                      Alert.alert(constants.APP_NAME_CAPS, "Session expired");

                      deleteUserDevice()
                        .then((res) => {
                          console.log("=deleteUserDevice====ee=res=", res);
                          // Actions.currentScene != "Main" &&
                          //   Actions.replace("Main");
                          // checkSessionMaintaining();
                          // Singleton.getInstance().saveEmptyDefault();
                          Actions.currentScene != "Login" &&
                            Actions.reset("Login");
                        })
                        .catch((err) => {
                          console.log("=deleteUserDevice===ee=err==", err);
                          // Singleton.getInstance().saveEmptyDefault();
                          // Actions.currentScene != "Main" &&
                          //   Actions.replace("Main");
                          Actions.currentScene != "Login" &&
                            Actions.reset("Login");
                        });
                      reject(error);
                    }
                    //   this.accessToken = '';
                    //   Actions.reset('Login');
                    // });
                    // saveEmptyDefault
                  });
              }
            });
          }
        });
      }
    });
  }

  async checkSessionTimeout() {
    let sessionOutTime = await this.getData(constants.EXPIRE_TIME);
    sessionOutTime = 1 * sessionOutTime;
    // console.log("checkSessionTimeout=-=sessionOutTime--", sessionOutTime);
    let currentTime = new Date().getTime();

    let diff = sessionOutTime - currentTime;

    // console.log(
    //   "checkSessionTimeout=current time diff-3594000-",
    //   diff <= 3594000
    // );
    if (diff <= 1500000 && global.fetchRefreshToken == "yes") {
      global.fetchRefreshToken = "no";
      // let refreshToken = await this.getDataSecure(constants.REFRESH_TOKEN);
      // let accessToken = await this.getDataSecure(constants.ACCESS_TOKEN);
      // console.log("checkSessionTimeout=-+++=refreshToken--", refreshToken);
      // console.log("checkSessionTimeout=-+++=accessToken--", accessToken);
      this.getDataSecure(constants.REFRESH_TOKEN).then(async (refreshToken) => {
        this.getDataSecure(constants.ACCESS_TOKEN).then(async (accessToken) => {
          // console.log("checkSessionTimeout=-+++=refreshToken--", refreshToken);
          // console.log("checkSessionTimeout=-+++=accessToken--", accessToken);
          let res = await fetch(
            `${END_POINT.BASE_URL}${END_POINT.REFRESH_SESSION}`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "refresh-token": JSON.parse(refreshToken),
                // Authorization: accessToken,
              },
              // body: JSON.stringify(data),
            }
          );
          console.log("checkSessionTimeout=-=res--", res);

          if (!res?.ok) {
            console.log("checkSessionTimeout=-=res--inside---");
            // this.saveEmptyDefault();
            // this.deleteOfflineStepsData().then((res) => {
            deleteUserDevice();
            // .then((res) => {
            //   console.log("=deleteUserDevice====ee=res=", res);
            //   Actions.currentScene != "Main" && Actions.replace("Main");
            //   // checkSessionMaintaining();
            // })
            // .catch((err) => {
            //   console.log("=deleteUserDevice===ee=err=----=", err);
            //   Actions.currentScene != "Main" && Actions.replace("Main");
            // });
            // Actions.currentScene != "Login" && Actions.reset("Login");
            // });
            return false;
          } else {
            // var data = res?.headers;
            var data1 = res?.headers.map;
            var data = data1["access-token"];
            var expTime = data1["access-expire"];
            var refreshTokenCheck = data1["refresh-token"];
            // let expTime = data.access - expire;
            // console.log("checkSess=-=-=data--", data);
            // console.log("checkS=-=-=expTime--", expTime);
            // console.log("checkSess=-=-=refreshTokenCheck--", refreshTokenCheck);

            let b = expTime.split(" ");
            // console.log("checkSession-=-=bccc--", b);

            // expTime = b[0] + "T" + b[1] + b[2];
            // console.log("checkSessionTi-=-=expTime--", expTime);

            // // let checExpTime = new Date(expTime).getTime();
            // var myDate = new Date(expTime);
            // var checExpTime = myDate.getTime();
            // console.log(checExpTime);
            // console.log("checkSessionTimeo-=checExpTime--", checExpTime);
            expTime = b[0] + "T" + b[1] + "Z";
            // console.log("checkSessionTi-=-=expTime-====-", expTime);

            // let checExpTime = new Date(expTime).getTime();
            var myDate = new Date(expTime);
            // console.log("checkSessionTimeo-=myDate--====", myDate);

            var checExpTime = new Date(myDate).getTime();
            this.saveData(constants.EXPIRE_TIME, `${checExpTime}`);

            this.accessToken = "Bearer " + data;
            this.saveDataSecure(constants.ACCESS_TOKEN, this.accessToken);

            this.saveDataSecure(
              constants.REFRESH_TOKEN,
              `${refreshTokenCheck}`
            );

            // var data = res?.headers.map;

            // let expTime = data["access-expire"];

            // let b = expTime.split(" ");
            // expTime = b[0] + "T" + b[1];
            // let checExpTime = new Date(expTime).getTime();

            // this.saveData(constants.EXPIRE_TIME, `${checExpTime}`);

            // this.accessToken = "Bearer " + data["access-token"];
            // this.saveDataSecure(constants.ACCESS_TOKEN, this.accessToken);

            // this.saveDataSecure(
            //   constants.REFRESH_TOKEN,
            //   `${data["refresh-token"]}`
            // );

            setTimeout(() => {
              global.fetchRefreshToken = "yes";
            }, 20000);

            return true;
          }
        });
      });
    } else {
      return true;
    }
  }

  showError(errMsg) {
    showMessage({
      message: errMsg,
      backgroundColor: colors.appRed,
      autoHide: true,
      duration: 3000,
      type: "danger",
      icon: "warning",
      position: "right",
      style: {
        marginHorizontal: 10,
        borderRadius: 10,
        marginTop: Platform.OS == "android" ? 10 : 40,
      },
      onPress: () => {
        hideMessage();
      },
    });
  }
  showErrorMsg(errMsg) {
    if (errMsg != "") {
      showMessage({
        message: errMsg,
        backgroundColor: colors.appRed,
        autoHide: true,
        duration: 3000,
        type: "error",
        icon: "danger",
        position: "right",
        style: {
          marginHorizontal: 10,
          borderRadius: 10,
          marginTop: Platform.OS == "android" ? 10 : 40,
        },
        onPress: () => {
          hideMessage();
        },
      });
    }
  }
  showMsg(msg) {
    if (msg != "") {
      showMessage({
        message: msg,
        backgroundColor: colors.appGreen,
        autoHide: true,
        duration: 3000,
        type: "success",
        icon: "success",
        position: "right",
        style: {
          marginHorizontal: 10,
          borderRadius: 10,
          marginTop: Platform.OS == "android" ? 10 : 40,
        },
        onPress: () => {},
      });
    }
  }
  showWarn(msg) {
    if (msg != "") {
      showMessage({
        message: msg,
        backgroundColor: colors.warnClr,
        autoHide: true,
        duration: 3000,
        type: "danger",
        icon: "warning",
        position: "right",
        style: {
          marginHorizontal: 10,
          borderRadius: 10,
          marginTop: Platform.OS == "android" ? 10 : 40,
        },
        onPress: () => {
          hideMessage();
        },
      });
    }
  }
  validateTexts(arrOfTexts, arrOfPlaceholders) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < arrOfTexts?.length; i++) {
        if (arrOfTexts[i]?.length == 0) {
          return reject("Please enter " + arrOfPlaceholders[i]);
        }
        if (i == arrOfTexts?.length - 1) {
          return resolve("Validations passed");
        }
      }
    });
  }
  async cameraPermission() {
    var response = "";
    if (Platform.OS == "android") {
      response = await request(PERMISSIONS.ANDROID.CAMERA);
    } else {
      response = await request(PERMISSIONS.IOS.CAMERA);
    }
    if (response != "granted") {
      Alert.alert("Camera Permission", "Please allow from setting manually.", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "Ok", onPress: () => openSettings() },
      ]);
    }
    return response;
  }
}
