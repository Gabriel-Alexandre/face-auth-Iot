'use server'

import MQTTClientSingleton from "@/utils/mqttSingleton";
import { SUBTOPIC, PUBTOPIC, TAKE_PICTURE } from "@/utils/consts";
import { createClient } from "@/utils/supabase/server";

export async function publishMQTT(message: string) {
    const client = MQTTClientSingleton.getInstance();

    if(client.disconnecting) {
        return 'ERRO: Cliente reconectando...';
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
    const client = MQTTClientSingleton.getInstance();
    const supabase = createClient();
    let imgBase64 = "";

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
                        contentType: 'image/jpeg',
                        cacheControl: '3600',
                        upsert: true,
                    })
                    .then(({ error }) => {
                        if (error) {
                            console.log(error);
                        }
                    });
            }

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

    client.on('message', messageHandler);
}

function base64toBlob(base64Data: string): Blob | null {
    const validBase64Regex = /^[a-zA-Z0-9+/]*={0,2}$/;
    if (!validBase64Regex.test(base64Data)) {
        console.error("String Base64 inválida");
        return null;
    }

    const byteCharacters = atob(base64Data);
    const byteNumbers: number[] = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

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
