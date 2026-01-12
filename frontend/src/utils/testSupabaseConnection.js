import supabase, { USE_MOCK_DATA } from '../lib/supabase';

/**
 * Test Supabase connection and return detailed results
 */
export const testSupabaseConnection = async () => {
  const results = {
    connected: false,
    url: import.meta.env.VITE_SUPABASE_URL || 'Not configured',
    hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    useMockData: USE_MOCK_DATA,
    tests: [],
    error: null,
  };

  // If using mock data, skip actual connection test
  if (USE_MOCK_DATA) {
    results.tests.push({
      name: 'Mock Data Mode',
      status: 'info',
      message: 'Using mock data - Supabase connection not required',
    });
    return results;
  }

  // Check if credentials are configured
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    results.error = 'Supabase credentials not configured';
    results.tests.push({
      name: 'Configuration Check',
      status: 'error',
      message: 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local',
    });
    return results;
  }

  results.tests.push({
    name: 'Configuration Check',
    status: 'success',
    message: 'Supabase credentials are configured',
  });

  // Test 1: Basic connection (try to access a table)
  try {
    const { data, error, count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (error) {
      // PGRST116 = no records found (table exists, just empty) - this is success!
      if (error.code === 'PGRST116') {
        results.tests.push({
          name: 'Orders Table',
          status: 'success',
          message: 'Connected! Table exists but is empty (no orders yet)',
        });
        results.connected = true;
      } else if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
        results.tests.push({
          name: 'Orders Table',
          status: 'error',
          message: 'Orders table not found. Please create the orders table in your Supabase database.',
        });
        results.error = 'Orders table not found';
        return results;
      } else {
        results.tests.push({
          name: 'Orders Table',
          status: 'error',
          message: `Connection error: ${error.message || error.code || 'Unknown error'}`,
        });
        results.error = error.message || 'Connection failed';
        return results;
      }
    } else {
      results.tests.push({
        name: 'Orders Table',
        status: 'success',
        message: `Connected! Found ${count || 0} orders`,
      });
      results.connected = true;
    }
  } catch (err) {
    results.tests.push({
      name: 'Orders Table',
      status: 'error',
      message: `Exception: ${err.message}`,
    });
    results.error = err.message;
    return results;
  }

  // Test 2: Test invoices table
  try {
    const { data, error, count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === 'PGRST116') {
        results.tests.push({
          name: 'Invoices Table',
          status: 'success',
          message: 'Table exists but is empty (no invoices yet)',
        });
      } else if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
        results.tests.push({
          name: 'Invoices Table',
          status: 'error',
          message: 'Invoices table not found. Please create it in your Supabase database.',
        });
      } else {
        results.tests.push({
          name: 'Invoices Table',
          status: 'error',
          message: `Error: ${error.message || error.code || 'Unknown error'}`,
        });
      }
    } else {
      results.tests.push({
        name: 'Invoices Table',
        status: 'success',
        message: `Connected! Found ${count || 0} invoices`,
      });
    }
  } catch (err) {
    results.tests.push({
      name: 'Invoices Table',
      status: 'warning',
      message: `Could not test: ${err.message}`,
    });
  }

  // Test 2b: Check for required columns in orders table
  try {
    const { error } = await supabase
      .from('orders')
      .select('id, supplier, status, order_date, total_amount')
      .limit(1);

    if (error) {
      if (error.status === 400 || error.statusCode === 400) {
        results.tests.push({
          name: 'Orders Schema',
          status: 'error',
          message: 'Missing required columns. Expected: id, supplier, status, order_date, total_amount. See DATABASE_SCHEMA.md',
        });
      } else if (error.code !== 'PGRST116') {
        results.tests.push({
          name: 'Orders Schema',
          status: 'warning',
          message: `Schema check failed: ${error.message || 'Unknown error'}`,
        });
      } else {
        results.tests.push({
          name: 'Orders Schema',
          status: 'success',
          message: 'All required columns exist',
        });
      }
    } else {
      results.tests.push({
        name: 'Orders Schema',
        status: 'success',
        message: 'All required columns exist',
      });
    }
  } catch (err) {
    results.tests.push({
      name: 'Orders Schema',
      status: 'warning',
      message: `Schema check error: ${err.message}`,
    });
  }

  // Test 2c: Check for required columns in invoices table
  try {
    const { error } = await supabase
      .from('invoices')
      .select('id, supplier, status, invoice_date, total_amount')
      .limit(1);

    if (error) {
      if (error.status === 400 || error.statusCode === 400) {
        results.tests.push({
          name: 'Invoices Schema',
          status: 'error',
          message: 'Missing required columns. Expected: id, supplier, status, invoice_date, total_amount. See DATABASE_SCHEMA.md',
        });
      } else if (error.code !== 'PGRST116') {
        results.tests.push({
          name: 'Invoices Schema',
          status: 'warning',
          message: `Schema check failed: ${error.message || 'Unknown error'}`,
        });
      } else {
        results.tests.push({
          name: 'Invoices Schema',
          status: 'success',
          message: 'All required columns exist',
        });
      }
    } else {
      results.tests.push({
        name: 'Invoices Schema',
        status: 'success',
        message: 'All required columns exist',
      });
    }
  } catch (err) {
    results.tests.push({
      name: 'Invoices Schema',
      status: 'warning',
      message: `Schema check error: ${err.message}`,
    });
  }

  // Test 3: Test optional tables (alerts, activity)
  const optionalTables = ['alerts', 'activity'];
  for (const table of optionalTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .limit(0);

      if (error) {
        if (error.code === 'PGRST116' || error.code === 'PGRST205' || error.status === 404) {
          results.tests.push({
            name: `${table.charAt(0).toUpperCase() + table.slice(1)} Table`,
            status: 'info',
            message: `Table doesn't exist (optional - app works without it)`,
          });
        } else {
          results.tests.push({
            name: `${table.charAt(0).toUpperCase() + table.slice(1)} Table`,
            status: 'warning',
            message: `Error: ${error.message || error.code || 'Unknown error'}`,
          });
        }
      } else {
        results.tests.push({
          name: `${table.charAt(0).toUpperCase() + table.slice(1)} Table`,
          status: 'success',
          message: 'Table exists',
        });
      }
    } catch (err) {
      results.tests.push({
        name: `${table.charAt(0).toUpperCase() + table.slice(1)} Table`,
        status: 'info',
        message: `Table doesn't exist (optional)`,
      });
    }
  }

  // Test 4: Test realtime (if enabled)
  const realtimeEnabled = import.meta.env.VITE_ENABLE_REALTIME === 'true';
  results.tests.push({
    name: 'Realtime Subscriptions',
    status: realtimeEnabled ? 'info' : 'info',
    message: realtimeEnabled 
      ? 'Realtime is enabled (will work if tables exist)' 
      : 'Realtime is disabled',
  });

  return results;
};
