import { Sensor, decode } from '../src/sew-encoder';
import { createSewParser, createSewFrames } from '../src/sew-parser';

const mac = '02:04:0A:0F:AE:0E:04:06';
const CMDTEMP_JSON: Sensor = {
    type: 'TEMPERATURE',
    sensorId: mac,
    payload: undefined
};
const DCMOTOR_JSON: Sensor = {
    type: 'DCMOTOR',
    sensorId: mac,
    payload: {
        enabled: true,
        reverse: true,
        power: 255
    }
};
const DISTANCE_JSON: Sensor = {
    type: 'DISTANCE',
    sensorId: mac,
    payload: 23.5
};
const HUMIDITY_JSON: Sensor = {
    type: 'HUMIDITY',
    sensorId: mac,
    payload: 66.0
};
const TEMPERATURE_JSON: Sensor = {
    type: 'TEMPERATURE',
    sensorId: mac,
    payload: 32.5
};
const GPS_JSON: Sensor = {
    type: 'GPS',
    sensorId: mac,
    payload: {
        latitude: 37.12345504760742,
        longitude: -1.1234560012817383,
        altitude: 108.5
    }
};
const CMDTEMPANDDCMOTORANDDISTANCE_BUFFER = Buffer.from([
    0x53,
    0x45,
    0x57,
    0x01,
    0x13,
    0x00,
    0x02,
    0x04,
    0x0a,
    0x0f,
    0xae,
    0x0e,
    0x04,
    0x06,
    0x01,
    0x00,
    0x57,
    0x45,
    0x53,
    0x53,
    0x45,
    0x57,
    0x01,
    0x16,
    0x00,
    0x02,
    0x04,
    0x0a,
    0x0f,
    0xae,
    0x0e,
    0x04,
    0x06,
    0x10,
    0x00,
    0x01,
    0x01,
    0xff,
    0x57,
    0x45,
    0x53,
    0x53,
    0x45,
    0x57,
    0x01,
    0x17,
    0x00,
    0x02,
    0x04,
    0x0a,
    0x0f,
    0xae,
    0x0e,
    0x04,
    0x06,
    0x03,
    0x00,
    0x00,
    0x00,
    0xbc,
    0x41,
    0x57,
    0x45,
    0x53
]);
const GPS_BUFFER = Buffer.from([
    0x53,
    0x45,
    0x57,
    0x01,
    0x1f,
    0x00,
    0x02,
    0x04,
    0x0a,
    0x0f,
    0xae,
    0x0e,
    0x04,
    0x06,
    0x0a,
    0x00,
    0x6b,
    0x7e,
    0x14,
    0x42,
    0x68,
    0xcd,
    0x8f,
    0xbf,
    0x00,
    0x00,
    0xd9,
    0x42,
    0x57,
    0x45,
    0x53
]);

const HUMIDITYANDTEMPERATURE_BUFFER = Buffer.from([
    0x53,
    0x45,
    0x57,
    0x01,
    0x17,
    0x00,
    0x02,
    0x04,
    0x0a,
    0x0f,
    0xae,
    0x0e,
    0x04,
    0x06,
    0x02,
    0x00,
    0x00,
    0x00,
    0x84,
    0x42,
    0x57,
    0x45,
    0x53,
    0x53,
    0x45,
    0x57,
    0x01,
    0x17,
    0x00,
    0x02,
    0x04,
    0x0a,
    0x0f,
    0xae,
    0x0e,
    0x04,
    0x06,
    0x01,
    0x00,
    0x00,
    0x00,
    0x02,
    0x42,
    0x57,
    0x45,
    0x53
]);

const DISTANCEANDHALFGPS_BUFFER = Buffer.from([
    0x53,
    0x45,
    0x57,
    0x01,
    0x17,
    0x00,
    0x02,
    0x04,
    0x0a,
    0x0f,
    0xae,
    0x0e,
    0x04,
    0x06,
    0x03,
    0x00,
    0x00,
    0x00,
    0xbc,
    0x41,
    0x57,
    0x45,
    0x53,
    0x53,
    0x45,
    0x57,
    0x01,
    0x1f,
    0x00,
    0x02,
    0x04,
    0x0a,
    0x0f,
    0xae,
    0x0e,
    0x04,
    0x06,
    0x0a,
    0x00,
    0x6b,
    0x7e
]);

const HALFGPSANDDCMOTOR_BUFFER = Buffer.from([
    0x14,
    0x42,
    0x68,
    0xcd,
    0x8f,
    0xbf,
    0x00,
    0x00,
    0xd9,
    0x42,
    0x57,
    0x45,
    0x53,
    0x53,
    0x45,
    0x57,
    0x01,
    0x16,
    0x00,
    0x02,
    0x04,
    0x0a,
    0x0f,
    0xae,
    0x0e,
    0x04,
    0x06,
    0x10,
    0x00,
    0x01,
    0x01,
    0xff,
    0x57,
    0x45,
    0x53
]);
const DCMOTORANDDISTANCEANDHUMiDITYANDTEMPERATURE_BUFFER = Buffer.from([
    0x53,
    0x45,
    0x57,
    0x01,
    0x16,
    0x00,
    0x02,
    0x04,
    0x0a,
    0x0f,
    0xae,
    0x0e,
    0x04,
    0x06,
    0x10,
    0x00,
    0x01,
    0x01,
    0xff,
    0x57,
    0x45,
    0x53,
    0x53,
    0x45,
    0x57,
    0x01,
    0x17,
    0x00,
    0x02,
    0x04,
    0x0a,
    0x0f,
    0xae,
    0x0e,
    0x04,
    0x06,
    0x03,
    0x00,
    0x00,
    0x00,
    0xbc,
    0x41,
    0x57,
    0x45,
    0x53,
    0x53,
    0x45,
    0x57,
    0x01,
    0x17,
    0x00,
    0x02,
    0x04,
    0x0a,
    0x0f,
    0xae,
    0x0e,
    0x04,
    0x06,
    0x02,
    0x00,
    0x00,
    0x00,
    0x84,
    0x42,
    0x57,
    0x45,
    0x53,
    0x53,
    0x45,
    0x57,
    0x01,
    0x17,
    0x00,
    0x02,
    0x04,
    0x0a,
    0x0f,
    0xae,
    0x0e,
    0x04,
    0x06,
    0x01,
    0x00,
    0x00,
    0x00,
    0x02,
    0x42,
    0x57,
    0x45,
    0x53
]);
const DCMOTORANDDISTANCEINIT_BUFFER = Buffer.from([
    0x53,
    0x45,
    0x57,
    0x01,
    0x16,
    0x00,
    0x02,
    0x04,
    0x0a,
    0x0f,
    0xae,
    0x0e,
    0x04,
    0x06,
    0x10,
    0x00,
    0x01,
    0x01,
    0xff,
    0x57,
    0x45,
    0x53,
    0x53,
    0x45,
    0x57,
    0x01,
    0x17
]);
const MIDDLEDISTANCE_BUFFER = Buffer.from([
    0x00,
    0x02,
    0x04,
    0x0a,
    0x0f,
    0xae,
    0x0e,
    0x04,
    0x06
]);
const ENDDISTANCEANDHUMIDITY_BUFFER = Buffer.from([
    0x03,
    0x00,
    0x00,
    0x00,
    0xbc,
    0x41,
    0x57,
    0x45,
    0x53,
    0x53,
    0x45,
    0x57,
    0x01,
    0x17,
    0x00,
    0x02,
    0x04,
    0x0a,
    0x0f,
    0xae,
    0x0e,
    0x04,
    0x06,
    0x02,
    0x00,
    0x00,
    0x00,
    0x84,
    0x42,
    0x57,
    0x45,
    0x53
]);

const INVALID_BUFFER = Buffer.from([
    0x53,
    0x45,
    0x57,
    0x01,
    0x17,
    0x00,
    0x02,
    0x04,
    0x0a,
    0x0f,
    0xae,
    0x0e,
    0x04,
    0x06,
    0x02,
    0x00,
    0x00,
    0x00,
    0x84,
    0x42,
    0x42,
    0x42,
    0x42,
    0x57,
    0x42,
    0x45,
    0x53
]);

describe('SewParser with', () => {
    const onDecodedBuffer = jest.fn();
    const sewParser = createSewParser(onDecodedBuffer);

    beforeEach(() => {
        onDecodedBuffer.mockClear();
    });

    it('parse NULL BUFFER ignore the buffer', () => {
        const parsedFrames = sewParser((null as unknown) as Buffer);
        expect(onDecodedBuffer).not.toBeCalled();
        expect(parsedFrames).toEqual([]);
    });

    it('parse HUMIDITYANDTEMPERATURE_BUFFER and resolve with a HUMIDITY_JSON and TEMPERATURE_JSON objects', () => {
        const parsedFrames = sewParser(HUMIDITYANDTEMPERATURE_BUFFER);
        expect(onDecodedBuffer).toBeCalledTimes(2);
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining(HUMIDITY_JSON)
        );
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining(TEMPERATURE_JSON)
        );
        expect(parsedFrames).toEqual([HUMIDITY_JSON, TEMPERATURE_JSON]);
    });

    it('parse CMDTEMPANDDCMOTORANDDISTANCE_BUFFER and resolve with a CMDTEMP_JSON, DCMOTOR_JSON and DISTANCE_JSON objects', () => {
        const parsedFrames = sewParser(CMDTEMPANDDCMOTORANDDISTANCE_BUFFER);
        expect(onDecodedBuffer).toBeCalledTimes(3);
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining(CMDTEMP_JSON)
        );
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining(DCMOTOR_JSON)
        );
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            3,
            expect.objectContaining(DISTANCE_JSON)
        );
        expect(parsedFrames).toEqual([
            { ...TEMPERATURE_JSON, payload: undefined },
            DCMOTOR_JSON,
            DISTANCE_JSON
        ]);
    });

    it('parse DCMOTORANDDISTANCEANDHUMiDITYANDTEMPERATURE_BUFFER and resolve with a DCMOTOR_JSON, DISTANCE_JSON, HUMIDITY_JSON and TEMPERATURE_JSON objects', () => {
        const parsedFrames = sewParser(
            DCMOTORANDDISTANCEANDHUMiDITYANDTEMPERATURE_BUFFER
        );
        expect(onDecodedBuffer).toBeCalledTimes(4);
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining(DCMOTOR_JSON)
        );
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining(DISTANCE_JSON)
        );
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            3,
            expect.objectContaining(HUMIDITY_JSON)
        );
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            4,
            expect.objectContaining(TEMPERATURE_JSON)
        );
        expect(parsedFrames).toEqual([
            DCMOTOR_JSON,
            DISTANCE_JSON,
            HUMIDITY_JSON,
            TEMPERATURE_JSON
        ]);
    });

    it('parse DISTANCEANDHALFGPS_BUFFER and resolve with a DISTANCE_JSON object and keep the rest of frame', () => {
        const parsedFrames = sewParser(DISTANCEANDHALFGPS_BUFFER);
        expect(onDecodedBuffer).toBeCalled();
        expect(onDecodedBuffer).toBeCalledWith(
            expect.objectContaining(DISTANCE_JSON)
        );
        expect(parsedFrames).toEqual([DISTANCE_JSON]);
    });

    it('parse HALFGPSANDDCMOTOR_BUFFER and resolve with a GPS_BUFFER_JSON and DCMOTOR_JSON object', () => {
        const parsedFrames = sewParser(HALFGPSANDDCMOTOR_BUFFER);
        expect(onDecodedBuffer).toBeCalledTimes(2);
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining(GPS_JSON)
        );
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining(DCMOTOR_JSON)
        );
        expect(parsedFrames).toEqual([GPS_JSON, DCMOTOR_JSON]);
    });

    it('parse DCMOTORANDDISTANCEINIT_BUFFER and resolve with a DCMOTOR_JSON object', () => {
        const parsedFrames = sewParser(DCMOTORANDDISTANCEINIT_BUFFER);
        expect(onDecodedBuffer).toBeCalled();
        expect(onDecodedBuffer).toBeCalledWith(
            expect.objectContaining(DCMOTOR_JSON)
        );
        expect(parsedFrames).toEqual([DCMOTOR_JSON]);
    });

    it('parse MIDDLEDISTANCE_BUFFER and then parse ENDDISTANCEANDHUMIDITY_BUFFER resolve with a DISTANCE_JSON and HUMIDITY_JSON objects', () => {
        const parsedFrames = sewParser(MIDDLEDISTANCE_BUFFER);
        const restOfFrames = sewParser(ENDDISTANCEANDHUMIDITY_BUFFER);
        expect(onDecodedBuffer).toBeCalledTimes(2);
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining(DISTANCE_JSON)
        );
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining(HUMIDITY_JSON)
        );
        expect(parsedFrames).toEqual([]);
        expect(restOfFrames).toEqual([DISTANCE_JSON, HUMIDITY_JSON]);
    });

    it('parse MIDDLEDISTANCE_BUFFER and then parse ENDDISTANCEANDHUMIDITY_BUFFER ignore incomplete distance buffer and resolve with only HUMIDITY_JSON objects', () => {
        const parsedFrames = sewParser(DCMOTORANDDISTANCEINIT_BUFFER);
        const middlesOfFrames = sewParser(MIDDLEDISTANCE_BUFFER);
        const restOfFrames = sewParser(ENDDISTANCEANDHUMIDITY_BUFFER);
        expect(onDecodedBuffer).toBeCalledTimes(3);
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining(DCMOTOR_JSON)
        );
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining(DISTANCE_JSON)
        );
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            3,
            expect.objectContaining(HUMIDITY_JSON)
        );
        expect(parsedFrames).toEqual([DCMOTOR_JSON]);
        expect(middlesOfFrames).toEqual([]);
        expect(restOfFrames).toEqual([DISTANCE_JSON, HUMIDITY_JSON]);
    });

    it('parse INVALID_BUFFER do not corrupt stream', () => {
        const parsedFrames = sewParser(INVALID_BUFFER);
        expect(onDecodedBuffer).not.toBeCalled();
        expect(parsedFrames).toEqual([]);
    });

    it('parse GPS_BUFFER and find only the last GPS frame after invalid frame, because invalid frame corrupts the first gps frame', () => {
        // Buffer contain invalid bytes from test before, so first GPS Buffer get lost
        const fakeErrorConsole = jest.spyOn(console, 'error');
        fakeErrorConsole.mockImplementation(() => {});
        const parsedFrames = sewParser(GPS_BUFFER);
        const restOfFrames = sewParser(GPS_BUFFER);
        expect(onDecodedBuffer).toBeCalledTimes(1);
        expect(onDecodedBuffer).toBeCalledWith(
            expect.objectContaining(GPS_JSON)
        );
        expect(fakeErrorConsole).toHaveBeenCalledTimes(1);
        expect(parsedFrames).toEqual([]);
        expect(restOfFrames).toEqual([GPS_JSON]);
    });

    it('parse MIDDLEDISTANCE_BUFFER and then parse ENDDISTANCEANDHUMIDITY_BUFFER ignore incomplete distance buffer and resolve with only HUMIDITY_JSON objects without callback', () => {
        const noCallbackParser = createSewParser();

        const parsedFrames = noCallbackParser(DCMOTORANDDISTANCEINIT_BUFFER);
        const middlesOfFrames = noCallbackParser(MIDDLEDISTANCE_BUFFER);
        const restOfFrames = noCallbackParser(ENDDISTANCEANDHUMIDITY_BUFFER);

        expect(parsedFrames).toEqual([DCMOTOR_JSON]);
        expect(middlesOfFrames).toEqual([]);
        expect(restOfFrames).toEqual([DISTANCE_JSON, HUMIDITY_JSON]);
    });
});

describe('createSewFrames should', () => {
    it('create a Buffer from one Sensor data', () => {
        expect(createSewFrames(GPS_JSON).equals(GPS_BUFFER)).toBe(true);
    });

    it('create a Buffer from an Array of Sensor data', () => {
        expect(
            createSewFrames([HUMIDITY_JSON, TEMPERATURE_JSON]).equals(
                HUMIDITYANDTEMPERATURE_BUFFER
            )
        );
    });
});

describe('SewParser and CreateFrame should', () => {
    const onDecodedBuffer = jest.fn();
    const sewParser = createSewParser(onDecodedBuffer);

    beforeEach(() => {
        onDecodedBuffer.mockClear();
    });

    it('create a Buffer from one Sensor data and decode it again', () => {
        sewParser(createSewFrames(GPS_JSON));

        expect(onDecodedBuffer).toBeCalledTimes(1);
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining(GPS_JSON)
        );
    });

    it('create a Buffer from an Array of Sensor data and decode it again', () => {
        sewParser(createSewFrames([GPS_JSON, DCMOTOR_JSON, DISTANCE_JSON]));

        expect(onDecodedBuffer).toBeCalledTimes(3);
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining(GPS_JSON)
        );
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining(DCMOTOR_JSON)
        );
        expect(onDecodedBuffer).toHaveBeenNthCalledWith(
            3,
            expect.objectContaining(DISTANCE_JSON)
        );
    });
});

describe('decode should', () => {
    it('decode a Buffer with one action', () => {
        expect(decode(GPS_BUFFER)).toEqual(GPS_JSON);
    });

    it('fails when it receive a invalid Buffer', () => {
        expect(() => decode(HUMIDITYANDTEMPERATURE_BUFFER)).toThrow(
            new Error('Invalid frame size:  Frame size 23, Buffer size 46')
        );
    });
});
