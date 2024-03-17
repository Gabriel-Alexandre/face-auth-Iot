'use server'

import { createMQTTClient } from "@/utils/clientMQTT";
import { SUBTOPIC, PUBTOPIC, TAKE_PICTURE } from "@/utils/consts";
import { createClient } from "@/utils/supabase/server";

const client = createMQTTClient();

export async function connectMQTT() {
    console.log(client.connected)
    if(!client.connected) {
        client.on('connect', () => {
            console.log('Connected')
            client.subscribe([SUBTOPIC], () => {
              console.log(`Subscribe to topic '${SUBTOPIC}'`);
            })
        });
    }
}

export async function publishMQTT(message: string) {
    console.log('aquiii', client.connected)

    let messageToSend = '1';

    // Dexei nessa estrutura caso seja adicionado mais 
    if(message === TAKE_PICTURE) {
        messageToSend = '1';
    } else {
        return 'ERRO: Ocorreu um erro no sistema.';
    }

    await listeningAndSaveImage();

    await client.publish(PUBTOPIC, messageToSend, { qos: 0, retain: false }, (error) => {
        if (error) {
            console.error(error);
        }
    });

    // verificar se tem como parar de escutar as mensagens

    return "Foto enviada com sucesso!";
}

export async function listeningAndSaveImage() {
    const supabase = createClient();
    let imgBase64 = "";

    client.on('message', async (subTopic, payload) => {
    
        // console.log('Received Message:', subTopic, payload.toString())
        const response = payload.toString().trim();

        if(response==="123START123") {
            imgBase64 = "";
        } else if(response==="123END123") {
            const fileName = `${generateUid()}.jpg`;
            // console.log(imgBase64)
            const file = base64toBlob(imgBase64);

            if(file) {
                const { error } = await supabase.storage
                .from('images')
                .upload('public/'+fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

                if(error) {
                    console.log(error);
                }
            }
        } else {
            imgBase64 += response;
        }
    });
}

function deconnectMQTT() {
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

function generateUid() {
    // Gera e retorna um UID aleatório
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
