// utils/mqttSingleton.ts
import { MqttClient } from 'mqtt';
import { createMQTTClient } from './clientMQTT';

class MQTTClientSingleton {
    private static instance: MqttClient | null = null;

    private constructor() {}

    public static getInstance(): MqttClient {
        if (!MQTTClientSingleton.instance) {
            MQTTClientSingleton.instance = createMQTTClient();

            MQTTClientSingleton.instance.on('connect', () => {
                console.log('Connected');
            });

            MQTTClientSingleton.instance.on('error', (erro) => {
                console.log(erro);
            });

            MQTTClientSingleton.instance.on('close', () => {
                console.log('Close');
            });

            MQTTClientSingleton.instance.on('disconnect', () => {
                console.log('Disconnect');
            });

            MQTTClientSingleton.instance.on('end', () => {
                console.log('End');
            });

            MQTTClientSingleton.instance.on('reconnect', () => {
                console.log('Reconnect');
            });
        }
        return MQTTClientSingleton.instance;
    }

    public static endInstance() {
        if (MQTTClientSingleton.instance) {
            MQTTClientSingleton.instance.end();
            MQTTClientSingleton.instance = null;
        }
    }
}

export default MQTTClientSingleton;
