import { decode, Sensor, encode } from './sew-encoder';

type Frames = {
    partial: Buffer;
    frame: undefined | Buffer;
};
const findFrameInBuffer = (buffer: Buffer) => {
    const indexIn = buffer.indexOf('534557', 0, 'hex');
    const indexOut = buffer.indexOf(
        '574553',
        indexIn != -1 ? indexIn : 0,
        'hex'
    );
    if (indexIn != -1 && indexOut != -1) {
        return {
            frame: buffer.slice(indexIn, indexOut + 3),
            partial: buffer.slice(indexOut + 3)
        };
    } else {
        return {
            frame: undefined,
            partial: buffer
        };
    }
};

export const createSewParser = (
    onDataDecoded: (data: Sensor) => void = () => {}
) => {
    // init Buffer to store partial frames
    let partialBuffer = Buffer.from([]);
    return (data: Buffer): Sensor[] => {
        // Check data is a Buffer or ignore data
        if (!Buffer.isBuffer(data)) return [];
        // Join partial data  and the new Buffer
        const bufferToDecode = Buffer.concat([partialBuffer, data]);
        let frames: Frames = { partial: bufferToDecode, frame: undefined };
        const parsedFrames: Sensor[] = [];
        do {
            frames = findFrameInBuffer(frames.partial);
            try {
                const json = frames.frame && decode(frames.frame);
                if (json) {
                    onDataDecoded(json);
                    parsedFrames.push(json);
                }
            } catch (error) {
                // TODO: Maybe and error callback?
                console.error(
                    'Error Frame',
                    error.message,
                    frames.frame,
                    frames.partial
                );
            }
        } while (frames.frame);
        partialBuffer = Buffer.from(frames.partial);
        return parsedFrames;
    };
};

export const createSewFrames = (data: Sensor | Sensor[]) => {
    const dataToEncode = Array.isArray(data) ? data : [data];
    return Buffer.concat(dataToEncode.map(sensor => encode(sensor)));
};
