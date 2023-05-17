import { handler, Handler } from '@/utils/handler';

const helloHandler: Handler = async (_, res) =>
    res.status(200).json({
        code: 'HELLO',
        message: 'Hello from Next.js!'
    });

export default handler({
    get: helloHandler
});
