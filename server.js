const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
const db = new Database(path.join(__dirname, 'junia_contacts.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS contact_submissions (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    language       TEXT    NOT NULL,
    prenom         TEXT,
    nom            TEXT,
    email          TEXT    NOT NULL,
    etudiant_fr    TEXT,
    pays           TEXT,
    diplome        TEXT,
    niveau         TEXT,
    niveau_detail  TEXT,
    campus         TEXT,
    programme      TEXT,
    message        TEXT,
    rgpd_accept    TEXT    NOT NULL,
    newsletter     TEXT,
    submitted_at   DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const insertContact = db.prepare(`
  INSERT INTO contact_submissions
    (language, prenom, nom, email, etudiant_fr, pays, diplome, niveau, niveau_detail, campus, programme, message, rgpd_accept, newsletter)
  VALUES
    (@language, @prenom, @nom, @email, @etudiant_fr, @pays, @diplome, @niveau, @niveau_detail, @campus, @programme, @message, @rgpd_accept, @newsletter)
`);

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/contact', (req, res) => {
  const data = req.body;

  if (!data.email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (data.rgpd_accept !== 'oui') {
    return res.status(400).json({ error: 'GDPR consent required' });
  }

  // Pick the filled-in sub-level detail (only one will be present at a time)
  const niveau_detail =
    data.niv_lycee || data.niv_bts || data.niv_cpge ||
    data.niv_but   || data.niv_licence || data.niv_master || null;

  // Pick the filled-in programme (only one campus section is visible at a time)
  const programme =
    data.programme_lille || data.programme_bordeaux ||
    data.programme_chateauroux || null;

  try {
    const result = insertContact.run({
      language:      data.language     || 'fr',
      prenom:        data.prenom       || null,
      nom:           data.nom          || null,
      email:         data.email,
      etudiant_fr:   data.etudiant_fr  || null,
      pays:          data.pays         || null,
      diplome:       data.diplome      || null,
      niveau:        data.niveau       || null,
      niveau_detail,
      campus:        data.campus       || null,
      programme,
      message:       data.message      || null,
      rgpd_accept:   data.rgpd_accept,
      newsletter:    data.newsletter   || 'non'
    });

    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`JUNIA server running at http://localhost:${PORT}`);
});
