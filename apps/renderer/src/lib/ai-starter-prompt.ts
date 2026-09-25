export function buildAiStarterPrompt(instructionsUrl: string): string {
  return `Bitte erstelle eine hochwertige, branchengerechte Website und befülle sie über die bereitgestellte API.

1. Rufe zuerst GET ${instructionsUrl} mit Authorization: Bearer [DEIN_API_KEY] auf und lies die vollständige Antwort. Sie ist die maßgebliche Quelle für Sitemap, vorhandene Seiten, Addons, Section-Typen, Datenfelder, Farbfelder und Endpoints.
2. Plane zuerst die passenden Seiten nach agentContract.sitemapPolicy. Wähle pro Seite Sections passend zur Branche, zum konkreten Seitenziel, zu den Besuchern und zu den wirklich verfügbaren Texten/Bildern. Verwende nur verfügbare Section-Typen und keine unnötigen oder branchenfremden Seiten. Jede Section braucht einen eigenen klaren Zweck.
3. Farben: Lege globale Markenfarben als Grundsystem fest. Entscheide zusätzlich für JEDE einzelne Section ihre passenden Farben in section.styleOverrides. Lies dafür ausschließlich sectionStyleContracts[section.type].colorFields und verwende exakt die dort aufgeführten .field- oder .cssVar-Schlüssel. Setze die Section-Hintergrund- und sichtbaren Textfarben ausdrücklich; ergänze Karten-, Button-, Badge-, Formular- oder Bild-Overlay-Farben samt passender Textfarbe, wenn diese Rolle vorhanden und sichtbar ist. Wenn ein sichtbares Farbfeld im Contract fehlt, erfinde keinen Schlüssel: Nutze für diese Rolle den globalen Standard oder wähle eine Section, die die gewünschte lokale Behandlung unterstützt. Renderer-Farbtokens gehören in styleOverrides; ein Datenfeld wie overlayColor gehört nur dann in data, wenn es im exakten sectionDataSchemas[section.type] steht. Verlasse dich nicht allein auf globale Farben. Sorge für gut lesbaren Kontrast (WCAG AA).
4. Fülle nur Felder aus sectionDataSchemas[section.type] und prüfe vor dem Schreiben den vollständigen Seitenplan über POST /api/v1/content/validate. Schreibe danach mit upsert=true, prüfe Antworten und korrigiere konkrete Fehler. GET /api/v1/content/validate liefert optionale Hinweise; behebe sinnvolle Kontrastprobleme.
5. Veröffentliche am Ende über den Publish-Endpoint, sofern der Plan gespeichert und geprüft ist.

Unternehmensdaten:
- Firmenname: [FIRMENNAME]
- Branche und Ort/Einzugsgebiet: [BRANCHE, STADT/REGION]
- Leistungen, Produkte oder Angebote: [ANGEBOTE]
- Adresse, Telefon, E-Mail, Öffnungszeiten: [VERIFIZIERTE KONTAKTDATEN]
- Zielgruppe und wichtigste Kundenbedürfnisse: [ZIELGRUPPE]
- Was das Unternehmen nachweislich auszeichnet: [BELEGTE MERKMALE]
- Vorhandene Website, Texte, Bilder und Referenzen: [LINKS ODER MATERIAL]
- Gewünschte Tonalität: [TONALITÄT]

Erfinde keine Unternehmensdaten, Preise, Öffnungszeiten, Auszeichnungen, Kundenstimmen, Personen oder Bild-Assets. Wenn etwas fehlt oder widersprüchlich ist, kennzeichne es als ungeklärt und verwende es nicht als öffentliche Tatsache.`;
}
