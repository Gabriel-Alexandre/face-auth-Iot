import mqtt from 'mqtt';

export function createMQTTClient() {
    const host = 'mqtt-dashboard.com';
    const port = '1883';
    const clientId = 'd54c0888-7c6b-4e18-8056-fa0e3db29be7';
    const connectUrl = `mqtt://${host}:${port}`;
    const client = mqtt.connect(connectUrl, {
        clientId,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
    });

    return client;
}