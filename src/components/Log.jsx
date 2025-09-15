import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Log() {
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchLogs() {
			try {
				setLoading(true);
				const { data, error } = await supabase
					.from('detailed_audit_log')
					.select('*')
					.order('action_timestamp', { ascending: false });

				if (error) {
					throw error;
				}

				setLogs(data);
			} catch (error) {
				console.error('Error fetching audit logs:', error.message);
			} finally {
				setLoading(false);
			}
		}

		fetchLogs();
	}, []);

	if (loading) {
		return <div>Loading logs...</div>;
	}

	return (
		<div>
			<h2>Audit Log</h2>
			<div className="log-container">
				{logs.map((log) => (
					<div key={log.id} className="log-entry">
						<p>
							<strong>User:</strong> {log.user_email || 'Unknown'}
						</p>
						<p>
							<strong>Action:</strong> {log.action}
						</p>
						<p>
							<strong>Table:</strong> {log.table_name}
						</p>
						<p>
							<strong>Timestamp:</strong>{' '}
							{new Date(log.action_timestamp).toLocaleString()}
						</p>
						{log.new_record_data && (
							<div>
								<strong>New Data:</strong>{' '}
								<pre>{JSON.stringify(log.new_record_data, null, 2)}</pre>
							</div>
						)}
						{log.old_record_data && (
							<div>
								<strong>Old Data:</strong>{' '}
								<pre>{JSON.stringify(log.old_record_data, null, 2)}</pre>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
