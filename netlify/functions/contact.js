const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (!data.email) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email is required' }) };
  }
  if (data.rgpd_accept !== 'oui') {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'GDPR consent required' }) };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Only one sub-level field will be filled at a time
  const niveau_detail =
    data.niv_lycee || data.niv_bts || data.niv_cpge ||
    data.niv_but   || data.niv_licence || data.niv_master || null;

  // Only one campus programme field will be filled at a time
  const programme =
    data.programme_lille || data.programme_bordeaux ||
    data.programme_chateauroux || null;

  const { data: result, error } = await supabase
    .from('contact_submissions')
    .insert([{
      language:      data.language    || 'fr',
      prenom:        data.prenom      || null,
      nom:           data.nom         || null,
      email:         data.email,
      etudiant_fr:   data.etudiant_fr || null,
      pays:          data.pays        || null,
      diplome:       data.diplome     || null,
      niveau:        data.niveau      || null,
      niveau_detail,
      campus:        data.campus      || null,
      programme,
      message:       data.message     || null,
      rgpd_accept:   data.rgpd_accept,
      newsletter:    data.newsletter  || 'non'
    }])
    .select();

  if (error) {
    console.error('Supabase error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Database error' }) };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true, id: result[0].id })
  };
};
