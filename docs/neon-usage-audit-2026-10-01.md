# Neon-Verbrauch und Optimierungen, 1. Oktober 2026

## Konto und Reset

Alle 15 Datenbanken wurden in der Neon-Konsole einzeln geprüft. Sie zeigen
`Free plan`, jeweils einen Branch und einen Compute mit 0,25 bis 2 CU. Die
Vercel-Integration wird auf Installationsebene abgerechnet und ihre aktuellen
Tarifeinstellungen zeigen ebenfalls Free: 100 CU-Stunden und 0,5 GB Speicher
pro Projekt. Die Vercel-Produktliste zeigt bei einigen Ressourcen weiterhin
Launch. Das widerspricht den aktuellen Tarifseiten beider Anbieter; deshalb
wurde kein weiterer Tarifwechsel ausgeführt.

Die neue Nutzungsperiode beginnt am 1. Oktober 2026. Vercel zeigt für die
gesamte Integration 8,27 USD für den Zeitraum 24. September bis 1. Oktober.
Das ist keine gesicherte Kostenaufteilung auf einzelne Datenbanken.

## Einzelprüfung

Speicher stammt aus der Projektliste; Compute aus der jeweiligen Detailseite.
Die Messungen wurden nacheinander am Morgen des 1. Oktober erhoben. Neon weist
auf bis zu eine Stunde Verzögerung hin; bei inaktiven Projekten werden die
Nutzungsmetriken nicht aktualisiert. Insbesondere bedeutet eine Anzeige von
0 kB im neuen Zeitraum nicht, dass eine bestehende Datenbank leer ist.

| Datenbank | Tarif | Speicher laut Projektliste | CU-Stunden seit 1. Oktober, abgelesen |
| --- | --- | ---: | ---: |
| flamingo-db | Free | 71,21 MB | 1,42 |
| flamingo-estela-db | Free | 36,01 MB | 0,23 |
| flamingo-taoyin-db | Free | 51,16 MB | 0,58 |
| digitalmask-postgres | Free | 33,73 MB | 0,13 |
| wine-tour-database | Free | 42,99 MB | 0,03 |
| kfo-moosbrug-db | Free | 32,22 MB | 0 |
| mondwurzel-db | Free | 31,75 MB | 0 |
| grabsteinkonfigurator-db | Free | 31,11 MB | 0 |
| magdalena-frankfurt | Free | 36,11 MB | 0,25 |
| rentmetric-postgres | Free | 34,28 MB | 0 |
| geonerds | Free | 32,78 MB | 0,04 |
| neon-fuchsia-basket | Free | 30,98 MB | 0 |
| neon-aero-school | Free | 32,43 MB | 0 |
| Flamnigo_rebuild | Free | 31,79 MB | 0 |
| bth-studio-db | Free | 32,09 MB | 0 |

Alle Speicherwerte liegen deutlich unter der Grenze pro Projekt. Vercels
7-Tage-Compute-Bericht zeigte 34 Stunden für flamingo-db und 13 für Estela.
Diese historischen Werte umfassen den vorherigen Abrechnungszeitraum und sind
nicht das seit dem Reset verbrauchte Kontingent. Flamingos bisherige Nutzung
kann hochgerechnet erneut über 100 CU-Stunden pro Monat liegen.

## Umgesetzte Flamingo-Änderungen

- Öffentliche Domain- und Demo-Auflösung wird 60 Sekunden persistent gecacht.
  Reacts Request-Cache teilt identische Auflösungen zwischen Metadaten und
  Seitenrendering. Cache-Schlüssel unterscheiden Host, Slug und Demoidentität.
  Datenbankfehler werden nicht als erfolgreiche 404-Auflösung gespeichert.
- Tenant-Revalidierung invalidiert zusätzlich den Routing-Cache. Der bisherige
  Statuscheck für Standalone-Tenants bleibt bei 60 Sekunden; Admin- und
  Schreibberechtigungen werden nicht langfristig gecacht.
- Cron-Jobs cachen nur einen Arbeitsindex für sechs Stunden. Eine leere
  Instagram-Verbindungsliste und ein fehlender oder zukünftiger Rechnungslauf
  benötigen bei warmem Cache keinen Datenbankzugriff. Gespeicherte Zeitpunkte
  werden bei jedem Aufruf mit der aktuellen Zeit verglichen, sodass ein
  zukünftiger Rechnungslauf auch ohne Cache-Neuladen pünktlich fällig wird.
- Verbindungs- und Serienvorlagenänderungen invalidieren die Arbeitsindizes.
  Ausführung, Token, Rechnungen und Ergebnisse bleiben live. Standalone-Jobs
  filtern außerdem nach FIXED_TENANT_ID. Beide stündlichen Crons laufen zur
  selben Minute, um getrennte Aufwachzyklen zu vermeiden.
- Öffentliche Blogdaten werden eine Stunde gecacht und bei CRM-Änderungen
  invalidiert. Bloglisten laden keine Artikeltexte und verwenden SQL LIMIT.
  Datumswerte werden nach der Cache-Deserialisierung wieder als Date geliefert.

Der Renderer-Code gilt für Flamingo, Estela, Taoyin und weitere Standalone-
Deployments aus diesem Repository, sobald deren Deployment den Commit nutzt.
Ein Git-Push bestätigt noch nicht den Rollout auf jedes einzelne Vercel-Projekt.

## Andere Repositories

Zusätzlich wurden verfügbare Datenbank- und Cron-Einstiegspunkte gelesen:
DigitalMask hat begrenzte Pools mit 20 Sekunden Leerlaufzeit und persistente
Lesecaches; Wine Tour verwendet einen Pool mit 10 Sekunden Leerlaufzeit und
Vercels Pool-Lifecycle; KFO und Rentmetric haben tägliche statt stündliche
Crons. Magdalena und Geonerds initialisieren Schema-Strukturen bei kalten
Instanzen; eine spätere Migration dieser Initialisierung ist ein Ansatzpunkt.
In diesen Repositories wurden bei dieser Prüfung keine Änderungen vorgenommen.

## Grenzen und Betrieb

Die Optimierungen reduzieren Abfragen und unnötige Aufwachzyklen. Sie garantieren
kein bestimmtes Monatskontingent bei beliebiger Besucherzahl oder dauerhafter
Admin-/KI-Nutzung. Eine dauerhafte Auslastung selbst bei 0,25 CU kann das
100-CU-Stunden-Kontingent überschreiten. Aussagekräftig ist deshalb die nach
dem Deployment gemessene Compute-Nutzung, nicht allein die Anzahl SQL-Abfragen.
Direkte externe DB-Änderungen müssen die autorisierte Revalidierungs-API
aufrufen; andernfalls greifen die jeweiligen Cache-TTLs.

Die aktuellen offiziellen [Neon-Planbedingungen](https://neon.com/docs/introduction/plans)
bestätigen 100 CU-Stunden und 5 GB öffentlichen Datentransfer pro Projekt und
Monat sowie das automatische Suspendieren nach fünf Minuten Inaktivität im
Free-Tarif. Die Prüfungen ergaben keine Überschreitung des Speicherlimits.

## Verifikation

Renderer- und Marketing-Typecheck sowie beide Produktionsbuilds erfolgreich.
27 gezielte Tests für Cache-Datumswerte, SQL-Limits, Job-Fälligkeit,
Invalidierung, Mandantengrenzen, Berechtigungen und Abrechnung erfolgreich.

Quellen: angemeldete Vercel-Integrations-, Tarif- und Nutzungsseiten sowie
Neon-Projektlisten und die Branch-Detailseiten der oben genannten Projekte.
