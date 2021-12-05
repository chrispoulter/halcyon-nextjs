import { Router } from 'express';

export const tokenRouter = Router();

tokenRouter.post('/', (_, res) => {
    return res.json({
        data: {
            accessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDI3IiwiZW1haWwiOiJjcG91bHRlckBob3RtYWlsLmNvLnVrIiwiZ2l2ZW5fbmFtZSI6IkNocmlzIiwiZmFtaWx5X25hbWUiOiJQb3VsdGVyIiwiZXhwIjoxNjM4NzAwNDQ4LCJpc3MiOiJIYWxjeW9uQXBpIiwiYXVkIjoiSGFsY3lvbkNsaWVudCJ9.-b2CbZWtMyFzq9anJXpIC8-LAQSV0DMPZQGwSoRjNu0',
            expiresIn: 3600
        }
    });
});
