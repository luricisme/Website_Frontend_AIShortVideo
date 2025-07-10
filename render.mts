import {getCompositionsOnLambda, getFunctions} from "@remotion/lambda";
import dotenv from "dotenv";
import {renderMediaOnLambda} from "@remotion/lambda/client";

dotenv.config();

const functions = await getFunctions({
    region: 'us-east-1',
    compatibleOnly: true
})

console.log(functions);

// const compositions = await getCompositionsOnLambda({
//     functionName: 'remotion-render-4-0-321-mem2048mb-disk2048mb-120sec',
//     inputProps: {},
//     region: 'us-east-1',
//     serveUrl: 'http://localhost:3000',
//     envVariables: {},
// })
//
// console.log(compositions)

const render = await renderMediaOnLambda({
    functionName: 'remotion-render-4-0-321-mem2048mb-disk2048mb-120sec',
    inputProps: {},
    region: 'us-east-1',
    serveUrl: 'http://localhost:3000',
    codec: 'h264',
    composition: 'Promo'
})

console.log(render)
