import { trace, metrics } from '@opentelemetry/api';

export const tracer = trace.getTracer('halcyon-nextjs');
const meter = metrics.getMeter('halcyon-nextjs');

export const loginAttempts = meter.createCounter('halcyon.login_attempts', {
    description: 'Number of login attempts by outcome',
});

export const emailSendDuration = meter.createHistogram(
    'halcyon.email_send_duration',
    {
        description: 'Duration of email send operations',
        unit: 'ms',
    }
);
