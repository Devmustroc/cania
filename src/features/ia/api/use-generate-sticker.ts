import {InferRequestType, InferResponseType} from "hono";
import {useMutation} from "@tanstack/react-query";
import {client} from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.ai['sticker']['$post']>;
type RequestType = InferRequestType<typeof client.api.ai['sticker']['$post']>['json'];

export const useGenerateSticker =  () => {
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.ai['sticker'].$post({json});
            return await response.json();
        }
    });
}