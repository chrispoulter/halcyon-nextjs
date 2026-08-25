import { registerOTel } from '@vercel/otel';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto';

export async function register() {
    registerOTel({
        serviceName: 'halcyon-nextjs',
        attributes: { 'service.version': process.env.APP_VERSION },
        instrumentations: [
            'fetch',
            new PgInstrumentation({ enhancedDatabaseReporting: false }),
        ],
        metricReaders: [
            new PeriodicExportingMetricReader({
                exporter: new OTLPMetricExporter(),
            }),
        ],
        logRecordProcessors: [
            new BatchLogRecordProcessor({ exporter: new OTLPLogExporter() }),
        ],
    });
}
