import { strings } from "./Localization";
export var testVariable = 0;
export const getMultiLingualData = (str) => {
  console.log("str*****", str);
  console.log("str======>>>>>>>", str);
  if (typeof str != "string") {
    console.log("str======>>>>>>>-----", str);
    str = str[0];
  }
  let arr = str?.split(".");
  var oldArr = undefined;
  console.log("str======>>>>>>>---11--", str);
  try {
    for (var i = 0; i < arr.length; i++) {
      console.log("localllll=-=-=-=->>>>", [arr[i]]);
      oldArr = i == 0 ? strings[arr[i]] : oldArr[arr[i]];
    }
  } catch (error) {
    return str;
  }
  return oldArr;
};
