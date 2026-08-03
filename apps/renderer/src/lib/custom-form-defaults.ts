import type { CustomFormConfig, CustomFormField } from './custom-form';

const yesNo = (id: string, label: string, detailsLabel = 'Welche Angaben sind für uns wichtig?'): CustomFormField => ({
  id,
  label,
  type: 'boolean-details',
  required: true,
  width: 'full',
  detailsLabel,
  detailsPlaceholder: 'Bitte kurz ergänzen',
  maxLength: 2_000,
});

export const DEFAULT_ANAMNESIS_CUSTOM_FORM: CustomFormConfig = {
  formKey: 'anamnesebogen',
  eyebrow: 'Sicher vorbereitet',
  title: 'Anamnesebogen für Neupatienten',
  description: 'Damit wir Ihre Behandlung sicher und individuell planen können, bitten wir Sie um einige Angaben zu Ihrer gesundheitlichen Vorgeschichte. Ihre Angaben behandeln wir selbstverständlich vertraulich.',
  submitLabel: 'Anamnesebogen sicher übermitteln',
  successTitle: 'Ihre Angaben sind bei uns eingegangen.',
  successMessage: 'Vielen Dank. Eine Kopie Ihrer Angaben erhalten Sie als PDF per E-Mail. Wenn wir vor Ihrem Termin noch etwas klären möchten, melden wir uns bei Ihnen.',
  privacyHref: '/datenschutz',
  privacyLabel: 'Datenschutzerklärung',
  helpText: 'Bei Rückfragen sind wir jederzeit gern für Sie da. Hinweise zur Verarbeitung Ihrer Angaben finden Sie in unserer Datenschutzerklärung.',
  deliveryPolicy: 'dry-run',
  pdfTitle: 'Anamnesebogen für Neupatienten',
  pdfFilename: 'anamnesebogen',
  practiceSubject: 'Neuer Anamnesebogen von {name}',
  confirmationSubject: 'Bestätigung: Ihr Anamnesebogen ist bei uns eingegangen',
  confirmationText: 'Vielen Dank für Ihre sorgfältigen Angaben. Wir bestätigen den Eingang Ihres Anamnesebogens. Ihre PDF-Kopie finden Sie im Anhang. Bei Rückfragen sind wir jederzeit gern für Sie da.',
  emailField: 'email',
  firstNameField: 'patient_first_name',
  lastNameField: 'patient_last_name',
  groups: [
    {
      id: 'personal', title: 'Persönliche Angaben', kind: 'default',
      fields: [
        { id: 'patient_last_name', label: 'Nachname', type: 'text', required: true, autocomplete: 'family-name', width: 'half', maxLength: 120 },
        { id: 'patient_first_name', label: 'Vorname', type: 'text', required: true, autocomplete: 'given-name', width: 'half', maxLength: 120 },
        { id: 'patient_birth_date', label: 'Geburtsdatum', type: 'date', required: true, autocomplete: 'bday', width: 'half' },
        { id: 'member_last_name', label: 'Versicherungsnehmer: Nachname', type: 'text', required: false, autocomplete: 'family-name', width: 'half', maxLength: 120, helpText: 'Nur ausfüllen, wenn Sie nicht selbst Versicherungsnehmerin oder Versicherungsnehmer sind.' },
        { id: 'member_first_name', label: 'Versicherungsnehmer: Vorname', type: 'text', required: false, autocomplete: 'given-name', width: 'half', maxLength: 120 },
        { id: 'member_birth_date', label: 'Versicherungsnehmer: Geburtsdatum', type: 'date', required: false, width: 'half' },
        { id: 'street', label: 'Straße und Hausnummer', type: 'text', required: true, autocomplete: 'street-address', width: 'full', maxLength: 180 },
        { id: 'postal_code', label: 'PLZ', type: 'text', required: true, autocomplete: 'postal-code', width: 'third', maxLength: 12 },
        { id: 'city', label: 'Ort', type: 'text', required: true, autocomplete: 'address-level2', width: 'half', maxLength: 120 },
        { id: 'phone', label: 'Telefon', type: 'tel', required: true, autocomplete: 'tel', width: 'half', maxLength: 80 },
        { id: 'email', label: 'E-Mail', type: 'email', required: true, autocomplete: 'email', width: 'half', maxLength: 320 },
      ],
    },
    {
      id: 'insurance', title: 'Versicherung und Beruf', kind: 'default',
      fields: [
        { id: 'health_insurance', label: 'Krankenkasse', type: 'text', required: true, width: 'half', maxLength: 180 },
        yesNo('dental_supplementary', 'Besteht eine Zahnzusatzversicherung?', 'Versicherung oder Tarif (optional)'),
        yesNo('private_insurance', 'Sind Sie privat versichert?', 'Versicherung oder Tarif (optional)'),
        yesNo('state_aid', 'Besteht ein Beihilfeanspruch?', 'Ergänzende Angabe (optional)'),
        { id: 'profession', label: 'Beruf', type: 'text', required: false, autocomplete: 'organization-title', width: 'half', maxLength: 180 },
        { id: 'employer_name', label: 'Arbeitgeber: Name oder Bezeichnung', type: 'text', required: false, autocomplete: 'organization', width: 'half', maxLength: 180 },
        { id: 'employer_phone', label: 'Arbeitgeber: Telefon', type: 'tel', required: false, width: 'half', maxLength: 80 },
        { id: 'employer_street', label: 'Arbeitgeber: Straße und Hausnummer', type: 'text', required: false, width: 'full', maxLength: 180 },
        { id: 'employer_postal_code', label: 'Arbeitgeber: PLZ', type: 'text', required: false, width: 'third', maxLength: 12 },
        { id: 'employer_city', label: 'Arbeitgeber: Ort', type: 'text', required: false, width: 'half', maxLength: 120 },
      ],
    },
    {
      id: 'contact_path', title: 'Behandelnde Praxen und Kontaktweg', kind: 'default',
      fields: [
        { id: 'general_practitioner', label: 'Hausarzt oder Praxisbezeichnung', type: 'text', required: false, width: 'full', maxLength: 240 },
        { id: 'referral_source', label: 'Wie sind Sie auf uns aufmerksam geworden?', type: 'select', required: false, width: 'half', options: [
          { value: 'recommendation', label: 'Persönliche Empfehlung' }, { value: 'search', label: 'Internetsuche' }, { value: 'social', label: 'Social Media' }, { value: 'doctor', label: 'Überweisung durch eine Praxis' }, { value: 'other', label: 'Sonstiges' },
        ] },
      ],
    },
    {
      id: 'health', title: 'Gesundheit und Behandlung', kind: 'default',
      fields: [
        { id: 'main_concern', label: 'Was ist Ihr Hauptanliegen?', type: 'textarea', required: true, width: 'full', maxLength: 3_000, placeholder: 'Beschwerden, Wünsche oder Behandlungsgrund' },
        { id: 'last_xray', label: 'Wann war Ihre letzte Röntgenuntersuchung im Kopf- oder Kieferbereich?', type: 'text', required: false, width: 'full', maxLength: 300 },
        { id: 'hypersensitivities', label: 'Bestehen Überempfindlichkeiten gegen Medikamente, Materialien oder Sonstiges?', type: 'textarea', required: false, width: 'full', maxLength: 2_000, placeholder: 'Bitte Wirkstoff, Material oder Reaktion nennen' },
        yesNo('smoking', 'Rauchen Sie?', 'Wie viele Zigaretten oder andere Tabakprodukte konsumieren Sie pro Tag?'),
        yesNo('pregnancy', 'Besteht eine Schwangerschaft?', 'In welcher Schwangerschaftswoche sind Sie?'),
      ],
    },
    {
      id: 'conditions', title: 'Vorerkrankungen', description: 'Bitte wählen Sie zu jeder Angabe Ja oder Nein. Wenn Sie Ja wählen, können Sie direkt ergänzen, was wir wissen sollten.', kind: 'matrix',
      fields: [
        yesNo('allergy', 'Allergien'), yesNo('epilepsy', 'Anfallsleiden (Epilepsie)'), yesNo('respiratory', 'Atemwegserkrankungen'),
        yesNo('coagulation', 'Blutgerinnungsstörung'), yesNo('diabetes', 'Diabetes'), yesNo('glaucoma', 'Glaukom (erhöhter Augendruck)'),
        yesNo('hematological', 'Hämatologische Erkrankungen'), yesNo('heart_failure', 'Herzinsuffizienz'), yesNo('coronary_disease', 'Koronare Herzkrankheit oder Angina pectoris'),
        yesNo('heart_attack', 'Herzinfarkt'), yesNo('arrhythmia', 'Herzrhythmusstörungen'), yesNo('pacemaker', 'Herzschrittmacher'),
        yesNo('heart_valve', 'Herzklappenfehler oder Herzklappenersatz'), yesNo('hypertension', 'Hypertonie (Bluthochdruck)'), yesNo('stroke', 'Mangeldurchblutung des ZNS oder Schlaganfall'),
        yesNo('hepatitis', 'Hepatitis'), yesNo('hiv', 'HIV-Infektion oder AIDS'), yesNo('liver', 'Lebererkrankungen'),
        yesNo('gastrointestinal', 'Magen-Darm-Erkrankungen'), yesNo('kidney', 'Nierenerkrankungen'), yesNo('osteoporosis', 'Osteoporose'),
        yesNo('thyroid', 'Schilddrüsenerkrankungen'), yesNo('tumor', 'Tumorerkrankungen'), yesNo('operations', 'Frühere Operationen', 'Welche Operationen und wann?'),
        yesNo('medications', 'Regelmäßige oder aktuelle Medikamente', 'Welche Medikamente, Wirkstoffe und Dosierungen nehmen Sie ein?'),
      ],
    },
    {
      id: 'consent', title: 'Bestätigung und Einwilligung', kind: 'consent',
      fields: [
        { id: 'accuracy_consent', label: 'Ich bestätige, dass meine Angaben richtig und vollständig sind. Änderungen teile ich der Praxis vor der Behandlung mit.', type: 'checkbox', required: true, width: 'full' },
        { id: 'health_data_consent', label: 'Ich willige in die Verarbeitung und sichere Übermittlung meiner Gesundheitsdaten zum Zweck der Behandlungsvorbereitung ein.', type: 'checkbox', required: true, width: 'full', helpText: 'Die Einwilligung kann jederzeit mit Wirkung für die Zukunft widerrufen werden.' },
      ],
    },
  ],
};
