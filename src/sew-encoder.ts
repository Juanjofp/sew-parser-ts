const FRAME_MIN_SIZE = 19;
const FRAME_MAC_SIZE = 8;
const FRAME_SIZE_SIZE = 2;
const FRAME_TYPE_SIZE = 2;
const FRAME_SIZE_INDEX = 4;
const FRAME_MAC_INDEX = 6;
const FRAME_TYPE_INDEX = 14;
const FRAME_PAYLOAD_INDEX = 16;
const VERSION = 0x01;
const H1 = 0x53;
const H2 = 0x45;
const H3 = 0x57;
const HEADER: [number, number, number] = [H1, H2, H3];
const TAIL: [number, number, number] = [H3, H2, H1];

export type UNKNOWN_KEY = 'UNKNOWN';
export type TEMPERATURE_KEY = 'TEMPERATURE';
export type HUMIDITY_KEY = 'HUMIDITY';
export type DISTANCE_KEY = 'DISTANCE';
export type GPS_KEY = 'GPS';
export type DCMOTOR_KEY = 'DCMOTOR';
export type SWITCH_KEY = 'SWITCH';
export type TOGGLE_KEY = 'TOGGLE';
export type SIGNAL_KEY = 'SIGNAL';
export type SensorKeys =
    | TEMPERATURE_KEY
    | HUMIDITY_KEY
    | DISTANCE_KEY
    | GPS_KEY
    | DCMOTOR_KEY
    | SWITCH_KEY
    | TOGGLE_KEY
    | SIGNAL_KEY;

export type SensorTypeCodes = {
    TYPE1: TEMPERATURE_KEY;
    TYPE2: HUMIDITY_KEY;
    TYPE3: DISTANCE_KEY;
    TYPE4: SIGNAL_KEY;
    TYPE10: GPS_KEY;
    TYPE16: DCMOTOR_KEY;
    TYPE17: SWITCH_KEY;
    TYPE18: TOGGLE_KEY;
};
export const SENSOR_UNKNOWN: UNKNOWN_KEY = 'UNKNOWN';
export const getTypeFromCode = (type: number) => `TYPE${type}`;
export const SENSOR_TYPE_CODE: SensorTypeCodes = {
    TYPE1: 'TEMPERATURE',
    TYPE2: 'HUMIDITY',
    TYPE3: 'DISTANCE',
    TYPE4: 'SIGNAL',
    TYPE10: 'GPS',
    TYPE16: 'DCMOTOR',
    TYPE17: 'SWITCH',
    TYPE18: 'TOGGLE'
};

export const SENSOR_TYPE: { [k in SensorKeys]: number } = {
    TEMPERATURE: 1,
    HUMIDITY: 2,
    DISTANCE: 3,
    SIGNAL: 4,
    GPS: 10,
    DCMOTOR: 16,
    SWITCH: 17,
    TOGGLE: 18
};
export const SENSOR_TYPE_SIZE: { [k in SensorKeys]: number } = {
    TEMPERATURE: 4,
    HUMIDITY: 4,
    DISTANCE: 4,
    SIGNAL: 2,
    GPS: 12,
    DCMOTOR: 3,
    SWITCH: 1,
    TOGGLE: 1
};
export const decodePayload = {
    TEMPERATURE(payload: ArrayBuffer) {
        // Temperature
        return new Float32Array(payload)[0];
    },
    HUMIDITY(payload: ArrayBuffer) {
        return this.TEMPERATURE(payload);
    }, // Humidity
    DISTANCE(payload: ArrayBuffer) {
        return this.TEMPERATURE(payload);
    }, // Distance
    SIGNAL(payload: ArrayBuffer) {
        return new Int16Array(payload)[0];
    }, // Distance
    GPS(payload: ArrayBuffer) {
        // GPS
        const gps = new Float32Array(payload);
        return {
            latitude: gps[0],
            longitude: gps[1],
            altitude: gps[2]
        };
    },
    DCMOTOR(payload: ArrayBuffer) {
        // DCMOTOR
        const dcmotor = new Uint8Array(payload);
        return {
            enabled: Boolean(dcmotor[0]),
            reverse: Boolean(dcmotor[1]),
            power: dcmotor[2]
        };
    },
    SWITCH(payload: ArrayBuffer) {
        // Switch
        return new Uint8Array(payload)[0];
    },
    TOGGLE(payload: ArrayBuffer) {
        // Toggle
        return Boolean(new Uint8Array(payload)[0]);
    }
};
export type TemperaturePayload = ReturnType<typeof decodePayload.TEMPERATURE>;
export type HumidityPayload = ReturnType<typeof decodePayload.HUMIDITY>;
export type DistancePayload = ReturnType<typeof decodePayload.DISTANCE>;
export type SignalPayload = ReturnType<typeof decodePayload.SIGNAL>;
export type GPSPayload = ReturnType<typeof decodePayload.GPS>;
export type DCMotorPayload = ReturnType<typeof decodePayload.DCMOTOR>;
export type SwitchPayload = ReturnType<typeof decodePayload.SWITCH>;
export type TogglePayload = ReturnType<typeof decodePayload.TOGGLE>;
export type Payloads =
    | TemperaturePayload
    | HumidityPayload
    | DistancePayload
    | SignalPayload
    | GPSPayload
    | DCMotorPayload
    | SwitchPayload
    | TogglePayload;

export type SensorBase = {
    sensorId: string;
};
export type Temperature = {
    type: TEMPERATURE_KEY;
    payload?: TemperaturePayload;
} & SensorBase;
export type Humidity = {
    type: HUMIDITY_KEY;
    payload?: HumidityPayload;
} & SensorBase;
export type Distance = {
    type: DISTANCE_KEY;
    payload?: DistancePayload;
} & SensorBase;
export type Signal = {
    type: SIGNAL_KEY;
    payload?: SignalPayload;
} & SensorBase;
export type GPS = {
    type: GPS_KEY;
    payload?: GPSPayload;
} & SensorBase;
export type DCMotor = {
    type: DCMOTOR_KEY;
    payload?: DCMotorPayload;
} & SensorBase;
export type Switch = {
    type: SWITCH_KEY;
    payload?: SwitchPayload;
} & SensorBase;
export type Toggle = {
    type: TOGGLE_KEY;
    payload?: TogglePayload;
} & SensorBase;

export type Sensor =
    | Temperature
    | Humidity
    | Distance
    | Signal
    | GPS
    | DCMotor
    | Switch
    | Toggle;

export const encodePayload = {
    encodeFloat(
        type: TEMPERATURE_KEY | HUMIDITY_KEY | DISTANCE_KEY,
        payload: number
    ) {
        // Temperature
        if (typeof payload !== 'number') {
            throw new Error(`Invalid payload for ${type}`);
        }

        const buffer = new ArrayBuffer(SENSOR_TYPE_SIZE[type]);
        const array = new Float32Array(buffer);
        array[0] = payload;
        return buffer;
    },
    encodeInteger16(type: SIGNAL_KEY, payload: number) {
        // Needs a number
        if (typeof payload !== 'number') {
            throw new Error(`Invalid payload for ${type}`);
        }

        const buffer = new ArrayBuffer(SENSOR_TYPE_SIZE[type]);
        const array = new Int16Array(buffer);
        array[0] = payload;
        return buffer;
    },
    TEMPERATURE(type: TEMPERATURE_KEY, payload: TemperaturePayload) {
        // Temperature
        return this.encodeFloat(type, payload);
    },
    HUMIDITY(type: HUMIDITY_KEY, payload: HumidityPayload) {
        return this.encodeFloat(type, payload);
    }, // Humidity
    DISTANCE(type: DISTANCE_KEY, payload: number) {
        return this.encodeFloat(type, payload);
    }, // Distance
    SIGNAL(type: SIGNAL_KEY, payload: number) {
        return this.encodeInteger16(type, payload);
    }, // Distance
    GPS(type: GPS_KEY, { latitude, longitude, altitude }: GPSPayload) {
        // GPS
        if (
            typeof latitude !== 'number' ||
            typeof longitude !== 'number' ||
            typeof altitude !== 'number'
        ) {
            throw new Error(`Invalid payload for ${type}`);
        }
        const buffer = new ArrayBuffer(SENSOR_TYPE_SIZE[type]);
        const array = new Float32Array(buffer);
        array[0] = latitude;
        array[1] = longitude;
        array[2] = altitude;
        return buffer;
    },
    DCMOTOR(type: DCMOTOR_KEY, { enabled, reverse, power }: DCMotorPayload) {
        // DCMOTOR
        if (
            typeof enabled !== 'boolean' ||
            typeof reverse !== 'boolean' ||
            !Number.isInteger(power)
        ) {
            throw new Error(`Invalid payload for ${type}`);
        }

        const buffer = new ArrayBuffer(SENSOR_TYPE_SIZE[type]);
        const array = new Uint8Array(buffer);
        array[0] = enabled ? 1 : 0;
        array[1] = reverse ? 1 : 0;
        array[2] = power;
        return buffer;
    },
    SWITCH(type: SWITCH_KEY, payload: SwitchPayload) {
        // Switch
        if (!Number.isInteger(payload)) {
            throw new Error(`Invalid payload for ${type}`);
        }

        const buffer = new ArrayBuffer(SENSOR_TYPE_SIZE[type]);
        const array = new Uint8Array(buffer);
        array[0] = payload;
        return buffer;
    },
    TOGGLE(type: TOGGLE_KEY, payload: TogglePayload) {
        // Toggle
        const buffer = new ArrayBuffer(SENSOR_TYPE_SIZE[type]);
        const array = new Uint8Array(buffer);
        array[0] = payload ? 1 : 0;
        return buffer;
    }
};

const checkBufferSizeHeaderAndTail = (buffer: Buffer, bufferLength: number) => {
    if (bufferLength < FRAME_MIN_SIZE) return false;
    if (buffer[0] !== H1 || buffer[1] !== H2 || buffer[2] !== H3) return false;
    if (
        buffer[bufferLength - 1] !== H1 ||
        buffer[bufferLength - 2] !== H2 ||
        buffer[bufferLength - 3] !== H3
    )
        return false;
    return true;
};

const getFrameSize = (buffer: Buffer) => {
    const arrayBuffer = new ArrayBuffer(FRAME_SIZE_SIZE);
    const sizeArray = new Uint8Array(arrayBuffer);
    const sizeBuffer = buffer.slice(
        FRAME_SIZE_INDEX,
        FRAME_SIZE_INDEX + FRAME_SIZE_SIZE
    );
    sizeArray[0] = sizeBuffer[0];
    sizeArray[1] = sizeBuffer[1];
    return new Uint16Array(arrayBuffer)[0];
};

const getFrameType = (buffer: Buffer) => {
    const arrayBuffer = new ArrayBuffer(FRAME_TYPE_SIZE);
    const typeArray = new Uint8Array(arrayBuffer);
    const typeBuffer = buffer.slice(
        FRAME_TYPE_INDEX,
        FRAME_TYPE_INDEX + FRAME_TYPE_SIZE
    );
    typeArray[0] = typeBuffer[0];
    typeArray[1] = typeBuffer[1];
    return new Uint16Array(arrayBuffer)[0];
};

const getFrameMAC = (buffer: Buffer) => {
    const macBuffer = buffer.slice(
        FRAME_MAC_INDEX,
        FRAME_MAC_INDEX + FRAME_MAC_SIZE
    );
    const mac: string[] = [];
    for (let i = 0; i < FRAME_MAC_SIZE; i++) {
        mac.push(('00' + macBuffer[i].toString(16)).slice(-2).toUpperCase());
    }
    return mac.join(':');
};

const getPayload = (size: number, type: number, buffer: Buffer) => {
    if (size === FRAME_MIN_SIZE) return undefined;
    const payloadSize = size - FRAME_MIN_SIZE;
    const arrayBuffer = new ArrayBuffer(payloadSize);
    const payloadArray = new Uint8Array(arrayBuffer);
    const payloadBuffer = buffer.slice(
        FRAME_PAYLOAD_INDEX,
        FRAME_PAYLOAD_INDEX + payloadSize
    );
    for (let i = 0; i < payloadSize; i++) {
        payloadArray[i] = payloadBuffer[i];
    }
    if (decodePayload[SENSOR_TYPE_CODE[getTypeFromCode(type)]]) {
        return decodePayload[SENSOR_TYPE_CODE[getTypeFromCode(type)]](
            arrayBuffer
        );
    }
    return payloadArray.join(':');
};

export const decode = (buffer: Buffer): Sensor => {
    if (!buffer) {
        throw new Error('Invalid frame no buffer');
    }
    const bufferLength = Buffer.byteLength(buffer);
    if (!checkBufferSizeHeaderAndTail(buffer, bufferLength)) {
        throw new Error('Invalid frame structure');
    }
    const frameSize = getFrameSize(buffer);
    if (bufferLength !== frameSize) {
        throw new Error(
            `Invalid frame size:  Frame size ${frameSize}, Buffer size ${bufferLength}`
        );
    }
    const frameType = getFrameType(buffer);
    const mac = getFrameMAC(buffer);
    const payload = getPayload(frameSize, frameType, buffer);
    return {
        type: SENSOR_TYPE_CODE[getTypeFromCode(frameType)] || SENSOR_UNKNOWN,
        sensorId: mac,
        payload: payload
    };
};

const generateMacFromSensorId = (sensorId: string) => {
    // Shape: aa:aa:aa:aa:aa:aa:aa:aa
    const re = /^[0-9A-Fa-f]+$/;
    if (
        typeof sensorId !== 'string' ||
        sensorId.length !== FRAME_MAC_SIZE * 3 - 1
    ) {
        return null;
    }
    const bytes = sensorId.split(':');
    if (bytes.length != FRAME_MAC_SIZE) {
        return null;
    }
    try {
        return bytes.map(byte => {
            if (!re.test(byte)) {
                throw new Error('Invalid hex number: ' + byte);
            }
            return parseInt(byte, 16);
        });
    } catch (error) {
        return null;
    }
};
const calculateFrameSize = (type: SensorKeys, payload?: Payloads) => {
    if (payload === null || payload === undefined) {
        return FRAME_MIN_SIZE;
    } else {
        return FRAME_MIN_SIZE + SENSOR_TYPE_SIZE[type];
    }
};

function encodeFrameSize(type: SensorKeys, payload?: Payloads) {
    const sizeBuffer = new ArrayBuffer(2);
    const sizeArray = new Uint16Array(sizeBuffer);
    sizeArray[0] = calculateFrameSize(type, payload);
    return sizeBuffer;
}
const encodeFrameType = (typeCode: number) => {
    const typeBuffer = new ArrayBuffer(2);
    const typeArray = new Uint16Array(typeBuffer);
    typeArray[0] = typeCode;
    return typeBuffer;
};
export const encodePayloadByType = (
    type: SensorKeys | string,
    payload?: Payloads
) => {
    if (payload === null || payload === undefined) return new ArrayBuffer(0);
    if (!encodePayload[type]) return new ArrayBuffer(0);
    return encodePayload[type](type, payload);
};
export const encode = ({ type, sensorId, payload }: Sensor) => {
    if (!type) {
        throw new Error('type is required');
    }
    const typeCode = SENSOR_TYPE[type];
    if (!typeCode || !Number.isInteger(typeCode)) {
        throw new Error(`type ${type} is not a valid type`);
    }
    if (!sensorId) {
        throw new Error('sensorId is required');
    }
    const mac = generateMacFromSensorId(sensorId);
    if (!mac) {
        throw new Error(`sensorId ${sensorId} is not a valid sensorId`);
    }
    // TODO: Check a valid payload
    const encodedPayload = encodePayloadByType(type, payload);
    const sizeBuffer = encodeFrameSize(type, payload);
    const typeBuffer = encodeFrameType(typeCode);
    const frame = [
        ...HEADER,
        VERSION,
        ...new Uint8Array(sizeBuffer),
        ...mac,
        ...new Uint8Array(typeBuffer),
        ...new Uint8Array(encodedPayload),
        ...TAIL
    ];
    return Buffer.from(frame);
};
