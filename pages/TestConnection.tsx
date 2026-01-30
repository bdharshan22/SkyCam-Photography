import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const TestConnection = () => {
    const [status, setStatus] = useState<string>('Testing...');
    const [error, setError] = useState<any>(null);
    const [envCheck, setEnvCheck] = useState<any>(null);

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        try {
            // 1. Check Env Vars
            const url = import.meta.env.VITE_SUPABASE_URL;
            const key = import.meta.env.VITE_SUPABASE_KEY;

            setEnvCheck({
                urlExists: !!url,
                keyExists: !!key,
                urlValue: url ? url.substring(0, 15) + '...' : 'MISSING',
            });

            if (!url || !key) {
                throw new Error('Missing Environment Variables (VITE_SUPABASE_URL or VITE_SUPABASE_KEY)');
            }

            // 2. Try simple Select (Read Public)
            const { data, error: selectError } = await supabase
                .from('user_details')
                .select('count', { count: 'exact', head: true });

            if (selectError) {
                throw new Error(`Read Error: ${selectError.message} (Code: ${selectError.code})`);
            }

            // 3. Try Insert (Write Public)
            const testPhone = 'TEST-' + Math.floor(Math.random() * 10000);
            const { error: insertError } = await supabase
                .from('user_details')
                .insert([{
                    name: 'Connection Test',
                    whatsapp_number: testPhone,
                    created_at: new Date().toISOString(),
                    status: 'New'
                }]);

            if (insertError) {
                // Check if error is about "status" column
                if (insertError.message?.includes('status')) {
                    throw new Error(`Database Error: The "status" column is missing. (Code: ${insertError.code})`);
                }
                throw new Error(`Insert Error: ${insertError.message} (Code: ${insertError.code}) - Hint: Check RLS Policies`);
            }

            // 4. Clean up (Delete Test)
            const { error: deleteError } = await supabase
                .from('user_details')
                .delete()
                .eq('whatsapp_number', testPhone);

            if (deleteError) {
                setStatus('Partial Success: Read/Write OK, but Delete failed (RLS blocking Delete?)');
            } else {
                setStatus('SUCCESS: Database Connected, Read & Write Permissions are OK!');
            }

        } catch (err: any) {
            console.error(err);
            setStatus('FAILED');
            setError(err);
        }
    };

    return (
        <div className="p-10 max-w-2xl mx-auto bg-white shadow-xl rounded-xl mt-10 font-sans">
            <h1 className="text-2xl font-bold mb-6 border-b pb-4">Supabase Connection Debugger</h1>

            <div className={`p-4 rounded-lg mb-6 text-center font-bold text-lg ${status.includes('SUCCESS') ? 'bg-cyan-100 text-cyan-800' : 'bg-red-100 text-red-800'}`}>
                {status}
            </div>

            {error && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6 text-left">
                    <h3 className="font-bold text-red-700 mb-2">Error Details:</h3>
                    <pre className="text-xs bg-white p-3 border rounded overflow-x-auto text-red-600">
                        {JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}
                    </pre>
                    <p className="mt-2 text-sm text-red-600 italic">{error.message}</p>
                </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg border text-sm text-left">
                <h3 className="font-bold mb-2">Environment Check:</h3>
                <ul className="space-y-1">
                    <li>URL Found: {envCheck?.urlExists ? '✅' : '❌'}</li>
                    <li>Key Found: {envCheck?.keyExists ? '✅' : '❌'}</li>
                    <li className="text-xs text-gray-500 mt-1">URL: {envCheck?.urlValue}</li>
                </ul>
            </div>

            <button
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Retry Test
            </button>
        </div>
    );
};

export default TestConnection;
