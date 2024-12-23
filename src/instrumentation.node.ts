import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';

export const spanProcessors = [new BatchSpanProcessor(new OTLPTraceExporter())];
