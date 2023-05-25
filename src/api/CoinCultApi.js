import axios from "axios";
import END_POINT from "../EndPoints";
import { fetch } from "react-native-ssl-pinning";
const CoinCultApi = axios.create({
  baseURL: END_POINT.BASE_URL,
  // timeout: 100000,
});
CoinCultApi.defaults.timeout = 100000;
export { CoinCultApi };
