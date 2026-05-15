import type { SectionProps } from './restaurant';
import { HeroSection } from './handwerk/hero';
import { UspStripSection } from './handwerk/usp-strip';
import { ServicesGridSection } from './handwerk/services-grid';
import { ProcessStepsSection } from './handwerk/process-steps';
import { TestimonialsSection } from './handwerk/testimonials';
import { FaqSection } from './handwerk/faq';
import { CtaBandSection } from './handwerk/cta-band';
import { ContactSection } from './handwerk/contact';
import { MapSection } from './handwerk/map';
import { ServiceDetailSection } from './handwerk/service-detail';
import { PortfolioSection } from './handwerk/portfolio';
import { TeamSection } from './handwerk/team';
import { CtaLinksSection } from './handwerk/cta-links';
import { NewsPreviewSection } from './handwerk/news-preview';
import { StatsSection } from './handwerk/stats';
import { LogoCloudSection } from './handwerk/logo-cloud';
import { GalleryGridSection } from './handwerk/gallery-grid';
import { RichTextSection } from './handwerk/rich-text';
import { HeaderBannerSection } from './handwerk/header-banner';
import {
  AmbienceSection,
  EventsSection,
  MenuSection,
  OpeningHoursSection,
  RestaurantHeroSection,
  ReservationSection,
  SignatureDishesSection,
} from './restaurant';
import {
  AmenitiesSection,
  BookingStripSection,
  EventSpacesSection,
  HotelContactSection,
  HotelDiningSection,
  HotelFaqSection,
  HotelGallerySection,
  HotelHeroSection,
  HotelTestimonialsSection,
  LocationSection,
  OffersSection,
  RoomShowcaseSection,
  WellnessSection,
} from './hotel';
import {
  AccommodationGridSection,
  DestinationHighlightsSection,
  DownloadGuidesSection,
  EventsCalendarSection,
  ExperienceGridSection,
  PlacesMapSection,
  SeasonTeaserSection,
  SightseeingListSection,
  TourismContactSection,
  TourismFaqSection,
  TourismGallerySection,
  TourismHeroSection,
  TourRoutesSection,
  VisitorInfoSection,
} from './tourism';
import {
  BeforeAfterSection,
  BookingCtaSection,
  ExpertiseGridSection,
  LocationContactSection,
  PackagesSection,
  PriceListSection,
  SalonFaqSection,
  SalonGallerySection,
  SalonHeroSection,
  SalonOpeningHoursSection,
  SalonTestimonialsSection,
  ServiceMenuSection,
  TeamShowcaseSection,
  TreatmentDetailSection,
} from './salon';
import {
  AppointmentCtaSection,
  CertificationsSection,
  DiagnosticsSection,
  DoctorTeamSection,
  DownloadFormsSection,
  EmergencyInfoSection,
  EquipmentHighlightsSection,
  InsuranceInfoSection,
  MedicalFaqSection,
  MedicalHeroSection,
  MedicalLocationContactSection,
  MedicalOpeningHoursSection,
  PatientInfoSection,
  PracticeGallerySection,
  PracticeTeamSection,
  ServiceOverviewSection,
  TreatmentDetailSection as MedicalTreatmentDetailSection,
  ValuesGridSection,
} from './medical';

export type TemplateComponent = React.FC<SectionProps>;

export const TRADESMAN_TEMPLATES: Record<string, TemplateComponent> = {
  hero: HeroSection,
  uspStrip: UspStripSection,
  servicesGrid: ServicesGridSection,
  processSteps: ProcessStepsSection,
  testimonials: TestimonialsSection,
  faq: FaqSection,
  ctaBand: CtaBandSection,
  contact: ContactSection,
  map: MapSection,
  serviceDetail: ServiceDetailSection,
  portfolio: PortfolioSection,
  team: TeamSection,
  ctaLinks: CtaLinksSection,
  newsPreview: NewsPreviewSection,
  newsGrid: NewsPreviewSection,
  stats: StatsSection,
  logoCloud: LogoCloudSection,
  galleryGrid: GalleryGridSection,
  richText: RichTextSection,
  headerBanner: HeaderBannerSection,
};

export const RESTAURANT_TEMPLATES: Record<string, TemplateComponent> = {
  hero: RestaurantHeroSection,
  menu: MenuSection,
  reservation: ReservationSection,
  openingHours: OpeningHoursSection,
  signatureDishes: SignatureDishesSection,
  events: EventsSection,
  ambience: AmbienceSection,
  richText: RichTextSection,
};

export const INDUSTRY_TEMPLATES: Record<string, Record<string, TemplateComponent>> = {
  tradesman: TRADESMAN_TEMPLATES,
  restaurant: RESTAURANT_TEMPLATES,
  hotel: {
    hero: HotelHeroSection,
    bookingStrip: BookingStripSection,
    roomShowcase: RoomShowcaseSection,
    offers: OffersSection,
    amenities: AmenitiesSection,
    wellness: WellnessSection,
    location: LocationSection,
    hotelDining: HotelDiningSection,
    eventSpaces: EventSpacesSection,
    gallery: HotelGallerySection,
    testimonials: HotelTestimonialsSection,
    faq: HotelFaqSection,
    contact: HotelContactSection,
    richText: RichTextSection,
  },
  tourism: {
    hero: TourismHeroSection,
    destinationHighlights: DestinationHighlightsSection,
    experienceGrid: ExperienceGridSection,
    seasonTeaser: SeasonTeaserSection,
    eventsCalendar: EventsCalendarSection,
    placesMap: PlacesMapSection,
    sightseeingList: SightseeingListSection,
    tourRoutes: TourRoutesSection,
    accommodationGrid: AccommodationGridSection,
    visitorInfo: VisitorInfoSection,
    downloadGuides: DownloadGuidesSection,
    gallery: TourismGallerySection,
    faq: TourismFaqSection,
    tourismContact: TourismContactSection,
    richText: RichTextSection,
  },
  salon: {
    hero: SalonHeroSection,
    serviceMenu: ServiceMenuSection,
    priceList: PriceListSection,
    treatmentDetail: TreatmentDetailSection,
    packages: PackagesSection,
    teamShowcase: TeamShowcaseSection,
    expertiseGrid: ExpertiseGridSection,
    beforeAfter: BeforeAfterSection,
    gallery: SalonGallerySection,
    testimonials: SalonTestimonialsSection,
    openingHours: SalonOpeningHoursSection,
    bookingCta: BookingCtaSection,
    locationContact: LocationContactSection,
    faq: SalonFaqSection,
    richText: RichTextSection,
  },
  medical: {
    hero: MedicalHeroSection,
    serviceOverview: ServiceOverviewSection,
    treatmentDetail: MedicalTreatmentDetailSection,
    diagnostics: DiagnosticsSection,
    doctorTeam: DoctorTeamSection,
    practiceTeam: PracticeTeamSection,
    certifications: CertificationsSection,
    patientInfo: PatientInfoSection,
    insuranceInfo: InsuranceInfoSection,
    downloadForms: DownloadFormsSection,
    appointmentCta: AppointmentCtaSection,
    openingHours: MedicalOpeningHoursSection,
    emergencyInfo: EmergencyInfoSection,
    practiceGallery: PracticeGallerySection,
    equipmentHighlights: EquipmentHighlightsSection,
    valuesGrid: ValuesGridSection,
    locationContact: MedicalLocationContactSection,
    faq: MedicalFaqSection,
    richText: RichTextSection,
  },
};

export function getIndustryTemplates(industry: string): Record<string, TemplateComponent> {
  return INDUSTRY_TEMPLATES[industry] ?? TRADESMAN_TEMPLATES;
}
