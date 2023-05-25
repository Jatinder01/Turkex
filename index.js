/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import App from './src/App';
import {AppRegistry, LogBox} from 'react-native';
import {name as appName} from './app.json';
import './global';
if (!__DEV__) {
  console = {};
  console.log = () => {};
  console.error = () => {};
}
LogBox.ignoreAllLogs(true);

AppRegistry.registerComponent(appName, () => App);
