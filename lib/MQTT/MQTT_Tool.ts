'use server'

import { createMQTTClient } from "@/utils/clientMQTT";
import { SUBTOPIC, PUBTOPIC, TAKE_PICTURE } from "@/utils/consts";
import { createClient } from "@/utils/supabase/server";

const client = createMQTTClient();

export async function connectMQTT() {
    if (!client.connected) {
        client.on('connect', () => {
            console.log('Connected');
        });
    }
}

export async function isConnected() {
    return client.connected; 
}


export async function publishMQTT(message: string) {
    if (!client.connected) {
        await connectMQTT(); // Conectar novamente se necessário
    }

    client.subscribe([SUBTOPIC], () => {
        console.log(`Subscribe to topic '${SUBTOPIC}'`);
    });

    let messageToSend = '1';

    if(message === TAKE_PICTURE) {
        messageToSend = '1';
    } else {
        return 'ERRO: Ocorreu um erro no sistema.';
    }

    await listeningAndSaveImage();
    
    client.publish(PUBTOPIC, messageToSend, { qos: 0, retain: false }, (error) => {
        if (error) {
            console.error(error);
        }
    });

    return "Foto enviada com sucesso!";
}

export async function listeningAndSaveImage() {
    const supabase = createClient();
    let imgBase64 = "";

     // Define o callback do listener
     async function messageHandler(subTopic: string, payload: Buffer) {
        const response = payload.toString().trim();
        
        if (response === "123START123") {
            imgBase64 = "";
        } else if (response === "123END123") {
            const fileName = `${generateRandomName()}.jpg`;
            const file = base64toBlob(imgBase64);

            if (file) {
                supabase.storage
                    .from('images')
                    .upload('public/' + fileName, file, {
                        cacheControl: '3600',
                        upsert: true,
                    })
                    .then(({ error }) => {
                        if (error) {
                            console.log(error);
                        }
                    });
            }

            // Remove o listener após processar a imagem
            client.removeListener('message', messageHandler);
            console.log('Listener para mensagens foi removido.');
            client.unsubscribe(SUBTOPIC, (error) => {
                if (error) {
                    console.error(`Erro ao se desinscrever do tópico '${SUBTOPIC}':`, error);
                } else {
                    console.log(`Desinscrito do tópico '${SUBTOPIC}'`);
                }
            });
        } else {
            imgBase64 += response;
        }
    }

    // Registra o listener para mensagens
    client.on('message', messageHandler);
}

export async function deconnectMQTT() {
    client.end();
    client.on('close', () => {
        console.log('Conexão MQTT fechada');
    });
}

function base64toBlob(base64Data: string): Blob | null {
    // Verifica se a string Base64 é válida
    const validBase64Regex = /^[a-zA-Z0-9+/]*={0,2}$/;
    if (!validBase64Regex.test(base64Data)) {
        console.error("String Base64 inválida");
        deconnectMQTT();
        connectMQTT();
        return null;
    }

    // Decodifica a string Base64
    const byteCharacters = atob(base64Data);
    const byteNumbers: number[] = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    // Cria e retorna o blob
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    return blob;
}

function generateRandomName() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}