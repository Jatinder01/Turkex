// import React, {useState} from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Platform,
//   StyleProp,
//   TextStyle,
//   Alert,
//   ViewStyle,
// } from 'react-native';
// import Moment from 'moment';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import DateTimePickerLib from '@react-native-community/datetimepicker';
// import Modal from 'react-native-modal';

// import {Colors, Fonts} from '../theme';
// import ModalHeader from './modals/ModalHeader';

// interface IProps {
//   title?: string;
//   value: string;
//   onDateTimeChange: (date: Date) => void;
//   type?: 'datetime' | 'date' | 'time';
//   titleStyle?: StyleProp<TextStyle>;
//   containerStyle?: StyleProp<ViewStyle>;
//   boxContainerStyle?: StyleProp<ViewStyle>;
//   minimumDate?: Date;
//   maximumDate?: Date;
// }

// const getInitialMode = type => {
//   switch (type) {
//     case 'datetime':
//       return 'date';
//     case 'date':
//       return 'date';
//     case 'time':
//       return 'time';
//   }
// };

// const DateTimePicker = ({
//   type = 'datetime',
//   title = null,
//   value,
//   onDateTimeChange,
//   titleStyle = {},
//   containerStyle = {},
//   boxContainerStyle = {},
//   minimumDate = null,
//   maximumDate = null,
// }: IProps) => {
//   const [date, setDate] = useState < Date > new Date();
//   const [mode, setMode] = useState < string > getInitialMode(type);
//   const [show, setShow] = useState < boolean > false;

//   const informOnDateTimeChanged = (date: Date) => {
//     if (minimumDate && Moment(date).isBefore(minimumDate)) date = minimumDate;
//     if (maximumDate && Moment(date).isAfter(maximumDate)) date = maximumDate;

//     setShow(false);
//     onDateTimeChange(date);
//   };

//   const onChange = (event, selectedDate) => {
//     if (event.type === 'dismissed') {
//       setShow(false);
//       return;
//     }

//     const currentDate = selectedDate || date;
//     setShow(Platform.OS === 'ios');
//     setDate(currentDate);

//     if (Platform.OS === 'android') {
//       if (mode == 'date' && type == 'datetime') {
//         setMode('time');
//         setShow(true);
//       } else {
//         informOnDateTimeChanged(currentDate);
//       }
//     }
//   };

//   const handleOnPress = () => {
//     if (Platform.OS === 'ios') setMode(type);
//     else {
//       setMode(getInitialMode(type));
//     }

//     setShow(true);
//   };

//   return (
//     <View style={[styles.container, containerStyle]}>
//       {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
//       <TouchableOpacity
//         style={[styles.boxContainer, boxContainerStyle]}
//         onPress={handleOnPress}>
//         <Text style={styles.text}>{value}</Text>
//         <MaterialIcons name="arrow-drop-down" size={24} color={Colors.Gray} />
//       </TouchableOpacity>

//       {Platform.OS === 'android' && show && (
//         <DateTimePickerLib
//           testID="dateTimePicker"
//           value={date}
//           mode={mode}
//           is24Hour={false}
//           display={'default'}
//           onChange={onChange}
//           textColor={Colors.Black}
//           minimumDate={minimumDate}
//           maximumDate={maximumDate}
//         />
//       )}

//       {Platform.OS === 'ios' && (
//         <Modal isVisible={show} style={styles.modal}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalSubContainer}>
//               <ModalHeader
//                 title={title}
//                 onDonePressed={() => informOnDateTimeChanged(date)}
//               />
//               <DateTimePickerLib
//                 testID="dateTimePicker"
//                 value={date}
//                 mode={mode}
//                 is24Hour={false}
//                 display={'spinner'}
//                 onChange={onChange}
//                 textColor={Colors.Black}
//                 minimumDate={minimumDate}
//                 maximumDate={maximumDate}
//               />
//             </View>
//           </View>
//         </Modal>
//       )}
//     </View>
//   );
// };

// const MARGIN = 12;

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 5,
//   },
//   title: {
//     fontFamily: Fonts.gilroyMedium,
//     fontSize: 12,
//     color: Colors.Black,
//     marginBottom: MARGIN,
//   },
//   boxContainer: {
//     height: 48,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: Colors.SecondaryDark,
//     padding: MARGIN,
//   },
//   text: {
//     flex: 1,
//     color: Colors.Black,
//     fontFamily: Fonts.GilroySemiBold,
//     fontSize: 16,
//   },
//   icon: {
//     marginRight: MARGIN,
//   },
//   modal: {
//     margin: 0,
//   },
//   modalContainer: {
//     height: '100%',
//     width: '100%',
//     justifyContent: 'flex-end',
//   },
//   modalSubContainer: {
//     width: '100%',
//     height: 300,
//     backgroundColor: 'white',
//     borderTopStartRadius: 20,
//     borderTopEndRadius: 20,
//   },
// });

// export default DateTimePicker;
