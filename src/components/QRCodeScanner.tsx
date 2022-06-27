import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner';
import Button from './common/Button';

interface IQRCodeScannerProps {
  onScann: (data: string) => void;
  onError: () => void;
  onClose: () => void;
}

const QRCodeScanner = ({ onScann, onClose, onError }: IQRCodeScannerProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const onSuccess = (event: BarCodeEvent) => {
    if (!event || !event.data) {
      onError();
    } else {
      onScann(event.data);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner onBarCodeScanned={onSuccess} style={StyleSheet.absoluteFillObject} />
      <Button label="Close" style={styles.button} onPress={onClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    width: '100%',
    margin: 8,
  },
});

export default QRCodeScanner;
