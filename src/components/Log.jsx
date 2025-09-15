import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Log() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      // This requires you to have enabled auditing on your tables in Supabase.
      // e.g., ALTER TABLE todos ENABLE ROW LEVEL SECURITY; CREATE POLICY "Public access" ON todos FOR SELECT USING (true);
      // and then enable auditing on the table in the Supabase UI.
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('audit.log')
          .select('*')
          .order('created_at', { ascending: false });

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
            <p><strong>Action:</strong> {log.payload.action}</p>
            <p><strong>Table:</strong> {log.payload.table}</p>
            <p><strong>Record ID:</strong> {log.payload.record_id}</p>
            <p><strong>Timestamp:</strong> {new Date(log.created_at).toLocaleString()}</p>
            <pre>{JSON.stringify(log.payload, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}