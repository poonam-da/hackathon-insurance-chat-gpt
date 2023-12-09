import { env, NEW_RELIC } from './src/config'

exports.config = {
	agent_enabled: NEW_RELIC.AGENT_ENABLED,
	app_name: NEW_RELIC.APP_NAME,
	license_key: NEW_RELIC.LICENSE_KEY,
	ignore_server_configuration: NEW_RELIC.IGNORE_SERVER_CONFIGURATION,
	capture_params: true,
	environment: env,
	logging: {
		enabled: true,
		level: 'info',
		filepath: 'stdout'
	},
	error_collector: {
		enabled: true,
		ignore_status_codes: [401, 403],
		capture_events: true,
		max_event_samples_stored: 50
	},
	debug: {
		internal_metrics: true
	},
	browser_monitoring: {
		enable: false,
		debug: false
	},
	enforce_backstop: false,
	allow_all_headers: true,
	transaction_events: {
		enabled: true,
		max_samples_per_minute: 1000,
		max_samples_stored: 2000
	},
	distributed_tracing: {
		enabled: true,
		exclude_newrelic_header: true
	},
	transaction_tracer: {
		enabled: true,
		transaction_threshold: 'apdex_f',
		top_n: 20,
		record_sql: 'raw',
		explain_threshold: 500
	},
	custom_insights_events: {
		enabled: true,
		max_samples_stored: 500
	},
	process_host: {
		display_name: NEW_RELIC.PROCESS_HOST.DISPLAY_NAME
	},
	slow_sql: {
		enabled: true
	},
	application_logging: {
		enabled: true,
		metrics: {
			enabled: true
		},
		forwarding: {
			enabled: true,
			max_samples_stored: 10000
		}
	}
}
