import Singleton from "../Singleton";
import * as Constant from "../Constants";
import { Platform, NetInfo, Alert } from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import END_POINT from "../EndPoints";
import moment from "moment";
import { fetch } from "react-native-ssl-pinning";
const APIClient = class APIClient {
  static myInstance = null;

  static getInstance() {
    if (APIClient.myInstance == null) {
      APIClient.myInstance = new APIClient();
    }
    return this.myInstance;
  }
  getWithoutAuth(endpoint) {
    return new Promise((resolve, reject) => {
      // console.log("url=-=-=-=-=ooo-0", `${END_POINT.BASE_URL}${endpoint}`);
      fetch(`${END_POINT.BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeoutInterval: 100000,
        disableAllSecurity: true,
        // sslPinning: {
        //   certs: ["evoeurope"], // your certificates name (without extension), for example cert1.cer, cert2.cer
        // },
      })
        .then(async (res) => {
          // console.log("res-=-getWithoutAuth=-=-", res);
          // let response = await res?.json();
          if (res == 200 || res == 201) {
            return resolve(JSON.parse(res?.bodyString));
          }
          return reject(res);
        })
        .catch((err) => {
          console.log(
            "response getWithoutAuth--err-===--",
            JSON.stringify(err)
          );
          reject(JSON.parse(err?.bodyString));
        });
    });
  }
  getWithoutAuthFullResponse(endpoint) {
    return new Promise((resolve, reject) => {
      // console.log("url=-=-=-=-=ooo-0", `${END_POINT.BASE_URL}${endpoint}`);
      fetch(`${END_POINT.BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeoutInterval: 100000,
        disableAllSecurity: true,
        // sslPinning: {
        //   certs: ["evoeurope"], // your certificates name (without extension), for example cert1.cer, cert2.cer
        // },
      })
        .then(async (res) => {
          // console.log("res-=-getWithoutAuthFullResponse=-=-", res);
          // let response = await res?.json();
          resolve(res);
        })
        .catch((err) => {
          console.log(
            "response getWithoutAuthFullResponse--err---",
            JSON.stringify(err)
          );
          reject(err);
        });
    });
  }
  getWithoutAuthLogin(endpoint) {
    return new Promise((resolve, reject) => {
      // console.log("url=-=-=-=-=ooo-0", `${END_POINT.BASE_URL}${endpoint}`);
      fetch(`${END_POINT.BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeoutInterval: 100000,
        disableAllSecurity: true,

        // sslPinning: {
        //   certs: ["evoeurope"], // your certificates name (without extension), for example cert1.cer, cert2.cer
        // },
      })
        .then(async (res) => {
          // console.log("res-=-getWithoutAuth=-=-", res);
          // let response = await res?.json();
          if (res?.status == 200 || res?.status == 201) {
            return resolve(JSON.parse(res?.bodyString));
          }
          return reject(res);
        })
        .catch((err) => {
          console.log(
            "response getWithoutAuth=-=-=--err---",
            JSON.stringify(err)
          );
          reject(JSON.parse(err?.bodyString));
        });
    });
  }
  getListWithoutAuth(endpoint) {
    return new Promise((resolve, reject) => {
      // console.log("url=-=-=-=-=ooo-0", `${END_POINT.BASE_URL}${endpoint}`);
      fetch(`${END_POINT.BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeoutInterval: 100000,
        disableAllSecurity: true,

        // sslPinning: {
        //   certs: ["evoeurope"], // your certificates name (without extension), for example cert1.cer, cert2.cer
        // },
      })
        .then(async (res) => {
          // console.log("res-=-getWithoutAuth=-=-", res);
          // let response = await res?.json();
          if (res.status == 200 || res.status == 201) {
            return resolve(res);
          }
          return reject(res);
        })
        .catch((err) => {
          console.log(
            "response getWithoutAuth-----err---",
            JSON.stringify(err)
          );
          reject(err);
        });
    });
  }
  get(endpoint, UserToken) {
    if (!global.isConnected || !global.isInternetReachable) {
      if (!this.alertPresent) {
        this.alertPresent = true;
        Alert.alert(
          "",
          Constant.NO_NETWORK,
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      }
      return new Promise((resolve, reject) => {
        reject({ message: Constant.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        // console.log("UserToken------", UserToken);
        // console.log("url----", `${END_POINT.BASE_URL}${endpoint}`);
        fetch(`${END_POINT.BASE_URL}${endpoint}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: UserToken,
          },
          timeoutInterval: 100000,
          disableAllSecurity: true,

          // sslPinning: {
          //   certs: ["evoeurope"], // your certificates name (without extension), for example cert1.cer, cert2.cer
          // },
        })
          .then(async (res) => {
            // console.log("res=-=-=-=->>>>>", res);
            // let response = await res?.json();
            if (res.status == 200 || res.status == 201) {
              return resolve(JSON.parse(res?.bodyString));
            }
            return reject(res);
          })
          .catch((err) => {
            console.log("response get--err---", JSON.stringify(err));
            if (err?.bodyString != "") {
              reject(JSON.parse(err?.bodyString));
            } else {
              reject(err?.bodyString);
            }
          });
      });
    }
  }
  getList(endpoint, UserToken) {
    if (!global.isConnected || !global.isInternetReachable) {
      if (!this.alertPresent) {
        this.alertPresent = true;
        Alert.alert(
          "",
          Constant.NO_NETWORK,
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      }
      return new Promise((resolve, reject) => {
        reject({ message: Constant.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        // console.log("UserToken------", UserToken);
        // console.log("url----", `${END_POINT.BASE_URL}${endpoint}`);
        fetch(`${END_POINT.BASE_URL}${endpoint}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: UserToken,
          },
          timeoutInterval: 100000,
          disableAllSecurity: true,

          // sslPinning: {
          //   certs: ["evoeurope"], // your certificates name (without extension), for example cert1.cer, cert2.cer
          // },
        })
          .then(async (res) => {
            // console.log("res=-=-=getList-=->>>>>", res);
            // let response = await res?.json();
            if (res.status == 200 || res.status == 201) {
              return resolve(res);
            }
            return reject(res);
          })
          .catch((err) => {
            console.log("response getList---", JSON.stringify(err));
            reject(err);
          });
      });
    }
  }
  getDataSingleton(endpoint, UserToken) {
    if (!global.isConnected || !global.isInternetReachable) {
      if (!this.alertPresent) {
        this.alertPresent = true;
        Alert.alert(
          "",
          Constant.NO_NETWORK,
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      }
      return new Promise((resolve, reject) => {
        reject({ message: Constant.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        // console.log("UserToken----getData--", UserToken);
        // console.log("url---getData-", `${END_POINT.BASE_URL}${endpoint}`);
        fetch(`${END_POINT.BASE_URL}${endpoint}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: UserToken,
          },
          timeoutInterval: 120000,
          disableAllSecurity: true,
          // sslPinning: {
          //   certs: ["evoeurope"], // your certificates name (without extension), for example cert1.cer, cert2.cer
          // },
        })
          .then(async (res) => {
            // console.log("res=-=-=getData-=->>>>>", res);
            // let response = await res?.json();
            if (res?.status == 200 || res?.status == 201) {
              // console.log(
              //   "res=-=-=getData-=JSON.parse(res.bodyString)->>>>>",
              //   JSON.parse(res.bodyString)
              // );
              return resolve(JSON.parse(res?.bodyString));
            }
            return reject(res);
          })
          .catch((err) => {
            console.log("response getData---err===", JSON.stringify(err));
            reject(err);
          });
      });
    }
  }
  getData(endpoint, UserToken) {
    if (!global.isConnected || !global.isInternetReachable) {
      if (!this.alertPresent) {
        this.alertPresent = true;
        Alert.alert(
          "",
          Constant.NO_NETWORK,
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      }
      return new Promise((resolve, reject) => {
        reject({ message: Constant.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        // console.log("UserToken----getData--", UserToken);
        // console.log("url---getData-", `${END_POINT.BASE_URL}${endpoint}`);
        fetch(`${END_POINT.BASE_URL}${endpoint}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: JSON.parse(UserToken),
          },
          timeoutInterval: 120000,
          disableAllSecurity: true,
          // sslPinning: {
          //   certs: ["evoeurope"], // your certificates name (without extension), for example cert1.cer, cert2.cer
          // },
        })
          .then(async (res) => {
            // console.log("res=-=-=getData-=->>>>>", res);
            // let response = await res?.json();
            if (res?.status == 200 || res?.status == 201) {
              // console.log(
              //   "res=-=-=getData-=JSON.parse(res.bodyString)->>>>>",
              //   JSON.parse(res.bodyString)
              // );
              return resolve(JSON.parse(res?.bodyString));
            }
            return reject(res);
          })
          .catch((err) => {
            console.log("response getData---err===", JSON.stringify(err));
            reject(err);
          });
      });
    }
  }
  getDataTotal(endpoint, UserToken) {
    if (!global.isConnected || !global.isInternetReachable) {
      if (!this.alertPresent) {
        this.alertPresent = true;
        Alert.alert(
          "",
          Constant.NO_NETWORK,
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      }
      return new Promise((resolve, reject) => {
        reject({ message: Constant.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        // console.log("UserToken----getData--", UserToken);
        // console.log("url---getData-", `${END_POINT.BASE_URL}${endpoint}`);
        fetch(`${END_POINT.BASE_URL}${endpoint}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: JSON.parse(UserToken),
          },
          timeoutInterval: 100000,
          disableAllSecurity: true,
          // sslPinning: {
          //   certs: ["evoeurope"], // your certificates name (without extension), for example cert1.cer, cert2.cer
          // },
        })
          .then(async (res) => {
            // console.log("res=-=-=getData-=->>>>>", res);
            // let response = await res?.json();
            if (res?.status == 200 || res?.status == 201) {
              // console.log(
              //   "res=-=-=getData-=JSON.parse(res.bodyString)-====>>>>>",
              //   JSON.parse(res.bodyString)
              // );
              return resolve(res);
            }
            return reject(res);
          })
          .catch((err) => {
            console.log("response getData---err+===", JSON.stringify(err));
            reject(err);
          });
      });
    }
  }
  getDataCard(endpoint, UserToken) {
    if (!global.isConnected || !global.isInternetReachable) {
      if (!this.alertPresent) {
        this.alertPresent = true;
        Alert.alert(
          "",
          Constant.NO_NETWORK,
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      }
      return new Promise((resolve, reject) => {
        reject({ message: Constant.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        // console.log("UserToken----getDataCard--", UserToken);
        // console.log("url---getDataCard-", `${END_POINT.BASE_URL}${endpoint}`);
        fetch(`${END_POINT.BASE_URL}${endpoint}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: JSON.parse(UserToken),
          },
          timeoutInterval: 100000,
          disableAllSecurity: true,
          // sslPinning: {
          //   certs: ["evoeurope"], // your certificates name (without extension), for example cert1.cer, cert2.cer
          // },
        })
          .then(async (res) => {
            // console.log("res=-=-=getDataCard-=->>>>>", res);
            // let response = await res?.json();
            // if (res.status == 200 || res.status == 201) {
            //   console.log(
            //     "res=-=-=getData-=JSON.parse(res.bodyString)->>>>>",
            //     JSON.parse(res.bodyString)
            //   );
            //   return resolve(JSON.parse(res.bodyString));
            // }
            return resolve(res);
          })
          .catch((err) => {
            console.log("response getDataCard---err", JSON.stringify(err));
            reject(err);
          });
      });
    }
  }
  postWithoutToken(endpoint, data) {
    if (!global.isConnected || !global.isInternetReachable) {
      if (!this.alertPresent) {
        this.alertPresent = true;
        Alert.alert(
          "",
          Constant.NO_NETWORK,
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      }
      return new Promise((resolve, reject) => {
        reject({ message: Constant.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        // console.log("endpoint---", endpoint);
        // console.log("url---", `${END_POINT.BASE_URL}${endpoint}`);
        // console.log("data----", JSON.stringify(data));
        fetch(`${END_POINT.BASE_URL}${endpoint}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          timeoutInterval: 100000,
          body: data != null ? JSON.stringify(data) : null,
          disableAllSecurity: true,
          // sslPinning: {
          //   certs: ["evoeurope"], // your certificates name (without extension), for example cert1.cer, cert2.cer
          // },
        })
          .then(async (res) => {
            // console.log("res=-=-=-=postWithoutToken-=>>>>", res);
            // let response = await res?.json();
            // console.log("response++++>post>>>>>>>", response);
            if (res.status == 200 || res.status == 201) {
              return resolve(res);
            }
            return reject(res);
          })
          .catch((err) => {
            console.log(
              "response postWithoutToken--err---",
              JSON.stringify(err)
            );
            reject(JSON.parse(err?.bodyString));
          });
      });
    }
  }
  postWithoutTokenRegister(endpoint, data) {
    if (!global.isConnected || !global.isInternetReachable) {
      if (!this.alertPresent) {
        this.alertPresent = true;
        Alert.alert(
          "",
          Constant.NO_NETWORK,
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      }
      return new Promise((resolve, reject) => {
        reject({ message: Constant.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        // console.log("endpoint---", endpoint);
        // console.log("url---", `${END_POINT.BASE_URL}${endpoint}`);
        // console.log("data----", JSON.stringify(data));
        fetch(`${END_POINT.BASE_URL}${endpoint}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          timeoutInterval: 100000,
          body: data != null ? JSON.stringify(data) : null,
          disableAllSecurity: true,
          // sslPinning: {
          //   certs: ["evoeurope"], // your certificates name (without extension), for example cert1.cer, cert2.cer
          // },
        })
          .then(async (res) => {
            // console.log("res=-=-=-=postWithoutToken-=====>>>>", res);
            // let response = await res?.json();
            // console.log("response++++>post>>>>>>>", response);
            if (res.status == 200 || res.status == 201) {
              return resolve(res);
            }
            return reject(res);
          })
          .catch((err) => {
            console.log(
              "response postWithoutToken-===-err---",
              JSON.stringify(err)
            );
            reject(err);
          });
      });
    }
  }
  delete(endpoint, UserToken) {
    if (!global.isConnected || !global.isInternetReachable) {
      if (!this.alertPresent) {
        this.alertPresent = true;
        Alert.alert(
          "",
          Constant.NO_NETWORK,
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      }
      return new Promise((resolve, reject) => {
        reject({ message: Constant.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        // console.log("endpoint===", endpoint);
        // console.log("UserToken===", UserToken);
        // console.log("url===", `${END_POINT.BASE_URL}${endpoint}`);
        // console.log("data=====", JSON.stringify(data));
        fetch(`${END_POINT.BASE_URL}${endpoint}`, {
          method: "DELETE",
          headers: {
            // Accept: "application/json",
            "Content-Type": "application/json",
            "refresh-token": UserToken,
          },
          timeoutInterval: 100000,
          disableAllSecurity: true,
          // sslPinning: {
          //   certs: ["evoeurope"], // your certificates name (without extension), for example cert1.cer, cert2.cer
          // },
        })
          .then(async (res) => {
            console.log("res=-=-=-=delete-=>>>>", res);
            // let response = await res?.json();
            // console.log("response++++>post>>>>>>>", response);
            // if (res.status == 200 || res.status == 201) {
            //   return resolve(JSON.parse(res.bodyString));
            // }
            return reject(res);
          })
          .catch((err) => {
            console.log("response delete--err---", JSON.stringify(err));
            reject(err);
          });
      });
    }
  }
  post(endpoint, data, UserToken) {
    if (!global.isConnected || !global.isInternetReachable) {
      if (!this.alertPresent) {
        this.alertPresent = true;
        Alert.alert(
          "",
          Constant.NO_NETWORK,
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      }
      return new Promise((resolve, reject) => {
        reject({ message: Constant.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        // console.log("endpoint", endpoint);
        // console.log("UserToken", UserToken);
        // console.log("url", `${END_POINT.BASE_URL}${endpoint}`);
        // console.log("data", JSON.stringify(data));
        fetch(`${END_POINT.BASE_URL}${endpoint}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: UserToken,
          },
          timeoutInterval: 100000,
          body: data != null ? JSON.stringify(data) : null,
          disableAllSecurity: true,
          // sslPinning: {
          //   certs: ["evoeurope"], // your certificates name (without extension), for example cert1.cer, cert2.cer
          // },
        })
          .then(async (res) => {
            // console.log("res=-=-=-=post-=>>>>", res);
            // let response = await res?.json();
            // console.log("response++++>post>>>>>>>", response);
            if (res.status == 200 || res.status == 201) {
              return resolve(JSON.parse(res?.bodyString));
            }
            return reject(res);
          })
          .catch((err) => {
            console.log("response post--err---", JSON.stringify(err));
            reject(JSON.parse(err?.bodyString));
          });
      });
    }
  }
  postDataRefreshToken(endpoint, UserToken) {
    if (!global.isConnected || !global.isInternetReachable) {
      if (!this.alertPresent) {
        this.alertPresent = true;
        Alert.alert(
          "",
          Constant.NO_NETWORK,
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      }
      return new Promise((resolve, reject) => {
        reject({ message: Constant.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        // console.log("endpoint-postDataRefreshToken-", endpoint);
        // console.log("UserToken postDataRefreshToken===", UserToken);
        // console.log(
        //   "url --=postDataRefreshToken--",
        //   `${END_POINT.BASE_URL}${endpoint}`
        // );

        fetch(`${END_POINT.BASE_URL}${endpoint}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            refresh_token: UserToken,
          },
          timeoutInterval: 120000,
          body: null,
          disableAllSecurity: true,
          // sslPinning: {
          //   certs: ["evoeurope"], // your certificates name (without extension), for example cert1.cer, cert2.cer
          // },
        })
          .then(async (response) => {
            // console.log("res=-=-=-=postDataRefreshToken-=>>>>", response);
            // let response = await res?.json();
            // console.log("response++++>post>>>>>>>", response);
            resolve(response);
          })
          .catch((err) => {
            console.log("response post--err---", JSON.stringify(err));
            reject(err);
          });
      });
    }
  }
  postData(endpoint, data, UserToken) {
    if (!global.isConnected || !global.isInternetReachable) {
      if (!this.alertPresent) {
        this.alertPresent = true;
        Alert.alert(
          "",
          Constant.NO_NETWORK,
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      }
      return new Promise((resolve, reject) => {
        reject({ message: Constant.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        console.log("endpoint----", endpoint);
        console.log("UserToken----", UserToken);
        console.log("url=-----", `${END_POINT.BASE_URL}${endpoint}`);
        console.log("data=-=-", JSON.stringify(data));
        fetch(`${END_POINT.BASE_URL}${endpoint}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: UserToken,
          },
          timeoutInterval: 100000,
          body: data != null ? JSON.stringify(data) : null,
          disableAllSecurity: true,
          // sslPinning: {
          //   certs: ["evoeurope"], // your certificates name (without extension), for example cert1.cer, cert2.cer
          // },
        })
          .then(async (res) => {
            console.log("res=-=-=-=postData-=>>>>", res);
            // let response = await res?.json();
            // console.log("response++++>post>>>>>>>", response);
            if (res?.status == 200 || res?.status == 201) {
              return resolve(JSON.parse(res?.bodyString));
            }
            return reject(res);
          })
          .catch((err) => {
            console.log("response postData--err---", JSON.stringify(err));
            reject(err);
          });
      });
    }
  }
  convertUTCDateToLocalDate = function (date) {
    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    );
  };
  postNoHeaderFirst(endpoint, data) {
    if (!global.isConnected || !global.isInternetReachable) {
      if (!this.alertPresent) {
        this.alertPresent = true;
        Alert.alert(
          "",
          Constant.NO_NETWORK,
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      }
      return new Promise((resolve, reject) => {
        reject({ message: Constant.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        console.log("url", `${END_POINT.BASE_URL}${endpoint}`);
        console.log("data", JSON.stringify(data));
        fetch(`${END_POINT.BASE_URL}${endpoint}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          // body: data,
          // pkPinning: true,
          body: data != null ? JSON.stringify(data) : null,
          timeoutInterval: 100000,
          disableAllSecurity: true,
          // sslPinning: {
          //   // certs: ["mycert", "mycerttwo", "mycertthree", "mycertfour"], // your certificates name (without extension), for example cert1.cer, cert2.cer
          //   // certs: ["sha256/B2u+nF0KV+UEGxdxrYwDWzDbNKrnhoCC9Kv7UetXfRc="],
          //   certs: ["evoeurope"],
          // },
        })
          .then(async (res) => {
            // console.log("response postNoHeaderFirst res=-=-=-=->>", res);

            let response = await res?.json();
            // console.log("postNoHeaderFirst res----check-", response);
            // console.log("response postNoHeaderFirst", response);
            // if (!res?.ok) {
            if (!res == 201) {
              // console.log("response postNoHeaderFirst--ok---", response);
              return reject(response);
            } else {
              return resolve(response);
            }
          })
          .catch((err) => {
            // console.log(
            //   "response postNoHeaderFirst--err---",
            //   JSON.stringify(err)
            // );
            if (err?.bodyString) {
              reject(JSON.parse(err?.bodyString));
            } else {
              console.log(
                "response postNoHeaderFirst--err-22--",
                JSON.stringify(err)
              );
              reject(err);
            }
          });
      });
    }
  }
  postNoHeader(endpoint, data) {
    // console.log("postNoHeader ----=endpoint-=-=->>", endpoint);
    // console.log("postNoHeader ----=-=data-=->>", endpoint);

    if (!global.isConnected || !global.isInternetReachable) {
      if (!this.alertPresent) {
        this.alertPresent = true;
        Alert.alert(
          "",
          Constant.NO_NETWORK,
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      }
      return new Promise((resolve, reject) => {
        reject({ message: Constant.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        // console.log("url--postNoHeader-", `${END_POINT.BASE_URL}${endpoint}`);
        // console.log("data---postNoHeader---", JSON.stringify(data));
        fetch(`${END_POINT.BASE_URL}${endpoint}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          // body: data,
          timeoutInterval: 100000,
          body: data != null ? JSON.stringify(data) : null,
          disableAllSecurity: true,
          // sslPinning: {
          //   certs: ["evoeurope"],
          //   // certs: [
          //   //   "evoeurope",
          //   //   "mycert",
          //   //   "mycerttwo",
          //   //   "mycertthree",
          //   //   "mycertfour",
          //   // ], // your certificates name (without extension), for example cert1.cer, cert2.cer
          // },
        })
          .then(async (response) => {
            // console.log("response postNoHeader res=-=-=-=->>", response);

            // let response = await res?.json();
            // console.log("postNoHeader res----check-", response);
            // console.log("response postNoHeader", response);
            // if (!res?.ok) {
            if (!response == 200) {
              // console.log("response postNoHeader--ok---", response);
              return reject(response);
            } else {
              // console.log("response postNoHeader--mnmn--", response);
              // console.log('res----check-',.set-cookie);
              // var data = response?.headers.map;
              var data = response?.headers["access-token"];
              var expTime = response?.headers["access-expire"];
              // console.log("response postNoHeader-expTime--", expTime);

              var refreshToken = response?.headers["refresh-token"];
              // console.log("refreshToken postNoHeader-", refreshToken);

              // console.log("response postNoHeader--data--", data);
              // let expTime = data["access-expire"];
              // let expTime = data.access - expire;
              let b = expTime.split(" ");

              // expTime = b[0] + "T" + b[1];
              // console.log("---expTime==--", expTime);
              // let checExpTime = new Date(expTime).getTime();
              // console.log("re en-checExpTime", moment(checExpTime));
              expTime = b[0] + "T" + b[1] + "Z";
              // console.log("checkSessionTi-=-=expTime--", expTime);

              // let checExpTime = new Date(expTime).getTime();
              var myDate = new Date(expTime);
              // console.log("checkSessionTimeo-=myDate--", myDate);

              var checExpTime = new Date(myDate).getTime();

              console.log("checkSessionTimeo-=checExpTime--", checExpTime);
              // console.log(
              //   "res----cExpTime formate",
              //   moment(checExpTime).format("MMMM Do YYYY, h:mm:ss a")
              // );

              // console.log("res----refresh-token-checExpTime", checExpTime);
              // Singleton.getInstance().saveData(
              //   Constant.SAVED_COOKIES,
              //   data["set-cookie"]
              // );
              Singleton.getInstance().saveDataSecure(
                Constant.ACCESS_TOKEN,
                `${data}`
              );
              Singleton.getInstance().saveDataSecure(
                Constant.REFRESH_TOKEN,
                `${refreshToken}`
              );
              Singleton.getInstance().saveData(
                Constant.EXPIRE_TIME,
                `${checExpTime}`
              );
              // var data = response?.headers;
              // console.log("response postNoHeader--data--", data);
              // let expTime = data["access-expire"];
              // let b = expTime.split(" ");
              // expTime = b[0] + "T" + b[1];
              // console.log("-----", expTime);
              // let checExpTime = new Date(expTime).getTime();
              // console.log("res----refresh-token-checExpTime", checExpTime);
              // Singleton.getInstance().saveData(
              //   Constant.SAVED_COOKIES,
              //   data["set-cookie"]
              // );
              // Singleton.getInstance().saveData(
              //   Constant.REFRESH_TOKEN,
              //   `${data["refresh-token"]}`
              // );
              // Singleton.getInstance().saveData(
              //   Constant.EXPIRE_TIME,
              //   `${checExpTime}`
              // );
              // Singleton.getInstance().isLoginSuccess = true;
              return resolve(JSON.parse(response?.bodyString));
            }
          })
          .catch((err) => {
            console.log("check post header error-=-=-=>>", JSON.stringify(err));
            reject(JSON.parse(err?.bodyString));
          });
      });
    }
  }
  putData(endpoint, data, UserToken) {
    if (!global.isConnected || !global.isInternetReachable) {
      if (!this.alertPresent) {
        this.alertPresent = true;
        Alert.alert(
          "",
          Constant.NO_NETWORK,
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      }
      return new Promise((resolve, reject) => {
        reject({ message: Constant.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        // console.log("endpoint--putdata--", endpoint);
        // console.log("UserToken--putdata--", UserToken);
        // console.log("url--putdata--", `${END_POINT.BASE_URL}${endpoint}`);
        // console.log("data--putdata--", JSON.stringify(data));
        fetch(`${END_POINT.BASE_URL}${endpoint}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: UserToken,
          },
          timeoutInterval: 100000,
          body: data != null ? JSON.stringify(data) : null,
          disableAllSecurity: true,
          // sslPinning: {
          //   certs: ["evoeurope"], // your certificates name (without extension), for example cert1.cer, cert2.cer
          // },
        })
          .then(async (res) => {
            // console.log("res=-=-=-=putdata-=>>>>", res);
            // let response = await res?.json();
            // console.log("response++++>post>>>>>>>", response);
            if (res?.status == 200 || res?.status == 201) {
              return resolve(JSON.parse(res?.bodyString));
            }
            return reject(res);
          })
          .catch((err) => {
            console.log("response putdata--err---", JSON.stringify(err));
            reject(err);
          });
      });
    }
  }
  postFile(endpoint, data, UserToken) {
    if (!global.isConnected || !global.isInternetReachable) {
      if (!this.alertPresent) {
        this.alertPresent = true;
        Alert.alert(
          "",
          Constant.NO_NETWORK,
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      }
      return new Promise((resolve, reject) => {
        reject({ message: Constant.NO_NETWORK });
      });
    } else {
      return new Promise((resolve, reject) => {
        // console.log("UserToken postFile", UserToken);
        // console.log("url postFile", `${END_POINT.BASE_URL}${endpoint}`);
        // console.log("data postFile", JSON.stringify(data));
        RNFetchBlob.fetch(
          "POST",
          `${END_POINT.BASE_URL}${endpoint}`,
          {
            Authorization: JSON.parse(UserToken),
            "Content-Type": "multipart/form-data",
          },
          [data]
        )
          .then(async (res) => {
            // console.log("res=-=postFile=-=-=", res);
            let response = await res?.json();
            console.log("response", response);
            return resolve(response);
          })
          .catch((err) => {
            console.log("res=-=postFile=-=-=err", err);
            reject(err);
          });
      });
    }
  }
};
export { APIClient };
