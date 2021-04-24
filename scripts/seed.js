import { v4 as uuidv4 } from 'uuid';
import { dataSources } from '../api/dataSources';

const { dynamo } = dataSources();

(async () => {
    const id = uuidv4();

    let result = await dynamo.create({
        pk: 'TYPE#TEMPLATE',
        sk: id,
        gs1pk: 'TYPE#TEMPLATE#KEY',
        gs1sk: 'test-key',
        subject: 'testing 1234....',
        html: 'testing 56789....'
    });

    console.log('create', result);

    result = await dynamo.update({
        pk: 'TYPE#TEMPLATE',
        sk: id,
        gs1pk: 'TYPE#TEMPLATE#KEY',
        gs1sk: 'test-key',
        subject: 'testing 4321....',
        html: 'testing 98765....'
    });

    console.log('update', result);

    result = await dynamo.upsert({
        pk: 'TYPE#TEMPLATE',
        sk: id,
        gs1pk: 'TYPE#TEMPLATE#KEY',
        gs1sk: 'test-key',
        subject: 'testing 4321....',
        html: 'testing 98765....'
    });

    console.log('upsert', result);

    // result = await dynamo.remove(result);

    // console.log('remove', result);

    result = await dynamo.getByPk('TYPE#TEMPLATE', id);

    console.log('getByPk', result);

    result = await dynamo.getByGs1pk('TYPE#TEMPLATE#KEY', 'test-key');

    console.log('getByGs1pk', result);

    result = await dynamo.getAll('TYPE#TEMPLATE');

    console.log('getAll', result);

    process.exit(0);
})();
