# SewParser

This module can decode messages created with arduino-sewparser and create a Buffer from a SEW json object in order to send it to a device with arduino-sewparser.

## Decode Sample

```js
import { createSewParser } from '@sensoreverywhere/sew-parser';

const parser = createSewParser(data => {
    console.log('SewData>', data.sensorId, data.type, data.payload);
});

socket.on('data', parser);
```

```js
import { createSewParser } from '@sensoreverywhere/sew-parser';

const parser = createSewParser();

socket.on('data', (data: Buffer) => {
    const parsedFrames = parser(data);
    parsedFrames.map(frame => console.log('SewData>', frame.sensorId, frame.type, frame.payload);)
});
```

```js
import { decode } from '@sensoreverywhere/sew-parser';

socket.on('data', (error: Error, buffer: Buffer) => {
    const data = decode(buffer);
    console.log('SewData>', data.sensorId, data.type, data.payload);
});
```

## Encode Sample

```js
import { createSewFrames } from '@sensoreverywhere/sew-parser';

export const temperatureBuffer: Buffer = createSewFrames([
    {
        sensorId: 'sensorId1',
        type: 'TEMPERATURE',
        payload: 12
    },
    {
        sensorId: 'sensorId2',
        type: 'TEMPERATURE',
        payload: 18
    }
]);
```

```js
import { createSewFrames, DCMotor } from '@sensoreverywhere/sew-parser';

export const createDCMotor = (
    motorId: string,
    enabled: boolean = false,
    reverse: boolean = false,
    power: number = 0
): DCMotor => ({
    sensorId: motorId,
    type: 'DCMOTOR',
    payload: { enabled, reverse, power }
});

export const stopBuffer: Buffer = createSewFrames([
    createDCMotor('MotorLeftId'),
    createDCMotor('MotorRightId')
]);
```

```js
import { encode } from '@sensoreverywhere/sew-parser';

export const temperatureBuffer: Buffer = encode({
    sensorId: 'sensorId',
    type: 'TEMPERATURE',
    payload: 12
});
```

```js
import { encode } from '@sensoreverywhere/sew-parser';

export const gpsBuffer: Buffer = encode({
    sensorId: 'sensorId',
    type: 'GPS',
    payload: { latitude: 37.123, longitude: -1.567, altitude: 110 }
});
```
