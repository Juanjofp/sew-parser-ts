# SewParser

This module can decode messages created with arduino-sewparser

## Parser Sample

```js
import { createSewParser } from '@sensoreverywhere/sew-parser';

const parser = createSewParser(data => {
    console.log('SewData>', data.sensorId, data.type, data.payload);
});

socket.on('data', parser);
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

export const StopCommand = createSewFrames([
    createDCMotor('MotorLeftId'),
    createDCMotor('MotorRightId')
]);
```

```js
import { encode, DCMotor } from '@sensoreverywhere/sew-parser';

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

export const StopCommand: Buffer = encode(createDCMotor('MotorLeftId'));
```
